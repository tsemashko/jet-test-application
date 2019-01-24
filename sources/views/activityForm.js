import { JetView } from "webix-jet";
import { contacts } from "models/contacts";
import { activitytypes } from "models/activitytypes";
import { activities } from "models/activities";

export default class ActivityFormView extends JetView {
	config() {
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
						localId: "contact",
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
								required: true,
								format: "%d-%m-%Y"
							},
							{
								view: "datepicker",
								name: "Time",
								label: "Time",
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
						label: "Completed",
						name: "mark"
					},
					{
						cols: [
							{
								view: "button",
								localId: "savebutton",
								label: "",
								type: "form",
								click: () => {
									/*Здесь сложно обойтись одним-двумя полями для дат, т.к. у формы уже
                  как минимум два поля (для даты и для времени), а еще DueDate, которая
                  хранит дату в формате строки.
                  Получилось только из 4-х полей сделать 3.
                  */
									const values = this.$$("activityForm").getValues();
									const formatDate = webix.Date.dateToStr("%d-%m-%Y");
									const formatTime = webix.Date.dateToStr("%H:%i");
									values.DueDate = `${formatDate(values.Date)} ${formatTime(
										values.Time
									)}`;
									if (this.$$("activityForm").validate()) {
										if (!activities.getItem(values.id)) {
											activities.add(values);
										} else {
											activities.updateItem(values.id, values);
										}
										this.$$("activityForm").clear();
										this.getRoot().hide();
									}
								}
							},
							{
								view: "button",
								label: "Cancel",
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
		if (value) {
			this.$$("head").define("label", "Edit Activity");
			this.$$("savebutton").define("label", "Save");
		} else {
			this.$$("head").define("label", "Add Activity");
			this.$$("savebutton").define("label", "Add");
		}
		this.$$("head").refresh();
		this.$$("savebutton").refresh();
	}
}
