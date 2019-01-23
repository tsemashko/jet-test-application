import { JetView } from "webix-jet";
import { contacts } from "models/contacts";
import { activitytypes } from "models/activitytypes";
import { activities } from "models/activities";

export default class FormView extends JetView {
	config() {
		var addOrEditForm = {
			view: "window",
			id: "window",
			position: "center",
			width: 500,
			height: 500,
			modal: true,
			head: "Add/Edit activity",
			body: {
				view: "form",
				id: "form",
				rules: {
					Details: webix.rules.isNotEmpty,
					TypeID: webix.rules.isNotEmpty,
					ContactID: webix.rules.isNotEmpty,
					Date: webix.rules.isNotEmpty,
					Time: webix.rules.isNotEmpty
				},
				elements: [
					{
						view: "textarea",
						label: "Details",
						name: "Details",
						height: 80,
						required: true
					},
					{
						view: "combo",
						label: "Type",
						name: "TypeID",
						options: activitytypes,
						required: true
					},
					{
						view: "combo",
						id: "contact",
						label: "Contact",
						name: "ContactID",
						options: [],
						required: true
					},
					{
						cols: [
							{
								view: "datepicker",
								name: "Date",
								label: "Date",
								width: 250,
								required: true
							},
							{
								view: "datepicker",
								name: "Time",
								label: "Time",
								type: "time",
								fillspace: 1,
								labelAlign: "right",
								required: true
							}
						]
					},
					{
						view: "checkbox",
						label: "Completed",
						name: "mark"
					},
					{
						cols: [
							{
								view: "button",
								label: "Add/Save",
								type: "form",
								click: () => {
									/*similar pieces of code (like in scheme in activities datacollection)
                      Here it necessary for correct displaying date before refreshing the page,
                      in scheme for correct parcing date on server*/
									const values = this.$$("form").getValues();
									const formatDate = webix.Date.dateToStr("%d-%m-%Y");
									const formatTime = webix.Date.dateToStr("%H:%i");
									const Date_ = formatDate(
										webix.i18n.longDateFormatDate(values.Date)
									);
									const Time_ = formatTime(
										webix.i18n.longDateFormatDate(values.Time)
									);
									values.DueDate = `${Date_} ${Time_}`;
									if (this.$$("form").validate()) {
										if (!activities.getItem(values.id)) {
											activities.add(values);
										} else {
											activities.updateItem(values.id, values);
										}
										this.$$("form").clear();
										this.getRoot().hide();
									}
								}
							},
							{
								view: "button",
								label: "Cancel",
								click: () => {
									this.$$("form").clear();
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
			let contactNames = [];
			contacts.data.each((item, i) => {
				let newItem = {
					id: item.id,
					value: item.value
				};
				contactNames[i] = newItem;
			});
			this.$$("contact").define("options", contactNames);
		});
	}
}
