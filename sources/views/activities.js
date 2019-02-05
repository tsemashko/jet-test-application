import { JetView } from "webix-jet";
import { contacts } from "models/contacts";
import { activities } from "models/activities";
import { activitytypes } from "models/activitytypes";
import ActivityFormView from "./activityForm";

export default class ActivityView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		const toolbar = {
			view: "toolbar",
			css: "webix_dark",
			cols: [
				{
					view: "label",
					label: _("Activities")
				},
				{
					view: "button",
					label: _("Add activity"),
					type: "icon",
					icon: "wxi-plus-square",
					width: 200,
					click: () => {
						this.window.setHeaderAndButtonName(null);
						this.window.getRoot().show();
					}
				}
			]
		};
		const filterToolbar = {
			view: "segmented",
			localId: "selector",
			options: [
				{ id: 1, value: _("Completed") },
				{ id: 2, value: _("Overdue") },
				{ id: 3, value: _("Today") },
				{ id: 4, value: _("Tomorrow") },
				{ id: 5, value: _("This week") },
				{ id: 6, value: _("This month") },
				{ id: 7, value: _("All") }
			],
			value: 7,
			on: {
				onChange: () => {
					this.$$("table").filterByAll();
				}
			}
		};
		const table = {
			view: "datatable",
			localId: "table",
			scrollX: false,
			columns: [
				{
					id: "State",
					header: "",
					width: 50,
					template: "{common.checkbox()}",
					checkValue: "Completed",
					uncheckValue: "Open"
				},
				{
					id: "TypeID",
					header: [_("Activity type"), { content: "selectFilter" }],
					sort: "string",
					width: 200,
					collection: activitytypes
				},
				{
					id: "DueDate",
					header: [_("Due date"), { content: "dateRangeFilter" }],
					sort: "date",
					format: webix.Date.dateToStr("%d-%m-%Y %H:%i"),
					width: 150
				},
				{
					id: "Details",
					header: [_("Details"), { content: "textFilter" }],
					sort: "string",
					fillspace: 1
				},
				{
					id: "ContactID",
					header: [_("Contact"), { content: "selectFilter" }],
					sort: "string",
					width: 200,
					collection: contacts
				},
				{
					id: "edit",
					header: "",
					width: 50,
					template: "<i class='webix_icon wxi-pencil editActivity'></i>"
				},
				{
					id: "delete",
					header: "",
					width: 50,
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
								activities.remove(id);
							}
						}
					});
					return false;
				},
				editActivity: (e, id) => {
					const item = this.$$("table").getItem(id);
					item.Date = item.DueDate;
					item.Time = item.DueDate;
					this.window.$$("activityForm").setValues(item);
					this.window.setHeaderAndButtonName(item);
					this.window.getRoot().show();
				}
			}
		};
		return { rows: [toolbar, filterToolbar, table] };
	}
	init() {
		this.$$("table").sync(activities);
		this.window = this.ui(ActivityFormView);

		this.on(activities, "onAfterAdd", () => {
			this.$$("table").filterByAll();
		});
		this.on(activities, "onAfterDelete", () => {
			this.$$("table").filterByAll();
		});

		this.$$("table").registerFilter(
			this.$$("selector"),
			{
				compare: function(value, filter, item) {
					if (filter == 1) {
						return item.State == "Completed";
					}
					if (filter == 2) {
						return item.DueDate < new Date();
					}
					if (filter == 3) {
						const today = new Date();
						return (
							item.DueDate.getFullYear() == today.getFullYear() &&
							item.DueDate.getMonth() == today.getMonth() &&
							item.DueDate.getDate() == today.getDate()
						);
					}
					if (filter == 4) {
						const today = new Date();
						return (
							item.DueDate.getFullYear() == today.getFullYear() &&
							item.DueDate.getMonth() == today.getMonth() &&
							item.DueDate.getDate() == today.getDate() + 1
						);
					}
					if (filter == 5) {
						const todayWithTime = new Date();
						const today = new Date(
							todayWithTime.getFullYear(),
							todayWithTime.getMonth(),
							todayWithTime.getDate()
						);
						const lastDate = new Date().setDate(
							today.getDate() + 7 - today.getDay()
						);
						const firstDate = new Date().setDate(
							today.getDate() - today.getDay()
						);
						return item.DueDate <= lastDate && item.DueDate >= firstDate;
					}
					if (filter == 6) {
						const today = new Date();
						return (
							item.DueDate.getFullYear() == today.getFullYear() &&
							item.DueDate.getMonth() == today.getMonth()
						);
					} else return true;
				}
			},
			{
				getValue: function(node) {
					return node.getValue();
				},
				setValue: function(node, value) {
					node.setValue(value);
				}
			}
		);
	}
}
