import { JetView } from "webix-jet";
import { contacts } from "models/contacts";
import { activities } from "models/activities";
import { activitytypes } from "models/activitytypes";
import { statuses } from "models/statuses";
import ActivityFormView from "./activityForm";

export default class ActivitiesTabbarView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		const activitiesTable = {
			view: "datatable",
			localId: "activitiesTable",
			scrollX: false,
			select: true,
			columns: [
				{
					id: "State",
					header: "",
					width: 40,
					template: "{common.checkbox()}",
					checkValue: "Completed",
					uncheckValue: "Open"
				},
				{
					id: "TypeID",
					header: [{ content: "selectFilter" }],
					sort: "string",
					width: 150,
					collection: activitytypes
				},
				{
					id: "Details",
					header: [{ content: "textFilter" }],
					sort: "string",
					fillspace: 1
				},
				{
					id: "DueDate",
					header: [{ content: "dateRangeFilter" }],
					sort: "date",
					format: webix.Date.dateToStr("%d-%m-%Y %H:%i"),
					width: 200
				},
				{
					id: "edit",
					header: "",
					width: 40,
					template: "<i class='webix_icon wxi-pencil editActivity'></i>"
				},
				{
					id: "delete",
					header: "",
					width: 40,
					template: "<i class='webix_icon wxi-trash removeActivity'></i>"
				}
			],
			onClick: {
				removeActivity: (e, id) => {
					webix.confirm({
						title: _("Deleting activity"),
						ok: _("Yes"),
						cancel: _("No"),
						text: _(
							"Are you sure you want to delete this activity? Deleting cannot be undone."
						),
						callback: result => {
							if (result) {
								const table = this.$$("activitiesTable");
								if (activities.exists(id)) {
									activities.remove(id);
									table.remove(id);
								} else {
									activities.remove(activities.getLastId());
									table.remove(id);
								}
							}
						}
					});
					return false;
				},
				editActivity: (e, id) => {
					const item = this.$$("activitiesTable").getItem(id);
					item.Date = item.DueDate;
					item.Time = item.DueDate;
					this.window.$$("activityForm").setValues(item);
					this.window.setHeaderAndButtonName(item);
					this.window.$$("contact").disable();
					this.window.getRoot().show();
				}
			}
		};
		const button = {
			view: "button",
			label: _("Add activity"),
			type: "icon",
			icon: "wxi-plus-square",
			click: () => {
				this.window.setHeaderAndButtonName(null);
				this.window.getRoot().show();
				this.window
					.$$("contact")
					.setValue(this.getParentView().getParam("id", true));
				this.window.$$("contact").disable();
			}
		};
		return { rows: [activitiesTable, button] };
	}
	filterActivities(id) {
		const table = this.$$("activitiesTable");
		table.clearAll();
		table.parse(
			activities.find(function(obj) {
				return obj.ContactID == id;
			})
		);
	}
	init() {
		this.window = this.ui(ActivityFormView);
		webix.promise
			.all([contacts.waitData, statuses.waitData, activities.waitData])
			.then(() => {
				const id = this.getParam("id", true);
				if (id) {
					this.filterActivities(id);
				}
			});
		this.on(this.app, "onClickSave_activityForm", values => {
			const table = this.$$("activitiesTable");
			if (values) {
				table.parse(values);
			}
			table.refresh();
		});
	}
	urlChange() {
		webix.promise
			.all([contacts.waitData, statuses.waitData, activities.waitData])
			.then(() => {
				const id = this.getParam("id", true);
				if (id) {
					this.filterActivities(id);
				}
			});
	}
}
