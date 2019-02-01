import { JetView } from "webix-jet";
import { contacts } from "models/contacts";
import { activitytypes } from "models/activitytypes";
import { activities } from "models/activities";

export default class ActivityFormView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		const addOrEditForm = {
			view: "window",
			localId: "window",
			position: "center",
			width: 500,
			height: 500,
			modal: true,
			head: {
				view: "label",
				localId: "head",
				label: "",
				align: "center",
				css: { "font-size": "large" }
			},
			body: {
				view: "form",
				localId: "activityForm",
				elements: [
					{
						view: "textarea",
						label: _("Details"),
						name: "Details",
						height: 80,
						required: true
					},
					{
						view: "combo",
						label: _("Type"),
						name: "TypeID",
						options: activitytypes,
						required: true
					},
					{
						view: "combo",
						localId: "contact",
						label: _("Contact"),
						name: "ContactID",
						options: [],
						required: true
					},
					{
						cols: [
							{
								view: "datepicker",
								name: "Date",
								label: _("Date"),
								width: 250,
								required: true,
								format: "%d-%m-%Y"
							},
							{
								view: "datepicker",
								name: "Time",
								label: _("Time"),
								type: "time",
								fillspace: 1,
								labelAlign: "right",
								required: true,
								format: "%H:%i"
							}
						]
					},
					{
						view: "checkbox",
						label: _("Completed"),
						name: "State",
						checkValue: "Completed",
						uncheckValue: "Open"
					},
					{
						cols: [
							{
								view: "button",
								localId: "savebutton",
								label: "",
								type: "form",
								click: () => {
									const values = this.$$("activityForm").getValues();
									const formatDate = webix.Date.dateToStr("%d-%m-%Y");
									const formatTime = webix.Date.dateToStr("%H:%i");
									values.DueDate = `${formatDate(values.Date)} ${formatTime(
										values.Time
									)}`;
									if (this.$$("activityForm").validate()) {
										if (!activities.getItem(values.id)) {
											activities.add(values);
											this.app.callEvent("onClickSave_activityForm", [values]);
										} else {
											activities.updateItem(values.id, values);
											this.app.callEvent("onClickSave_activityForm");
										}
										this.$$("activityForm").clear();
										this.getRoot().hide();
									}
								}
							},
							{
								view: "button",
								label: _("Cancel"),
								click: () => {
									this.$$("activityForm").clear();
									this.getRoot().hide();
								}
							}
						]
					}
				]
			}
		};
		return addOrEditForm;
	}
	init() {
		contacts.waitData.then(() => {
			this.$$("contact").define("options", contacts.data);
		});
	}
	setHeaderAndButtonName(value) {
		const _ = this.app.getService("locale")._;
		if (value) {
			this.$$("head").define("label", _("Edit activity"));
			this.$$("savebutton").define("label", _("Save"));
		} else {
			this.$$("head").define("label", _("Add activity"));
			this.$$("savebutton").define("label", _("Add"));
		}
		this.$$("head").refresh();
		this.$$("savebutton").refresh();
	}
}
