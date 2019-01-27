import { JetView } from "webix-jet";
import { contacts } from "models/contacts";
import { statuses } from "models/statuses";
import ImageUploaderPopupView from "./imageUploaderPopup";

export default class ContactFormView extends JetView {
	config() {
		const header = {
			view: "template",
			localId: "header",
			template: "",
			css: "form-header",
			height: 40
		};
		const addOrEditForm = {
			view: "form",
			localId: "contactForm",
			elements: [
				{
					cols: [
						{
							rows: [
								{
									view: "text",
									label: "First name",
									name: "FirstName",
									required: true
								},
								{
									view: "text",
									label: "Last name",
									name: "LastName",
									required: true
								},
								{
									view: "datepicker",
									name: "StartDate",
									label: "Joining date",
									//width: 250,
									required: true,
									format: "%d-%m-%Y"
								},
								{
									view: "combo",
									localId: "status",
									label: "Status",
									name: "StatusID",
									options: [],
									required: true
								},
								{
									view: "text",
									label: "Job",
									name: "Job",
									required: true
								},
								{
									view: "text",
									label: "Company",
									name: "Company",
									required: true
								},
								{
									view: "text",
									label: "Website",
									name: "Website",
									required: true
								},
								{
									view: "text",
									label: "Address",
									name: "Address",
									required: true
								}
							]
						},
						{ view: "template", gravity: 0.2, type: "clean" },
						{
							rows: [
								{
									view: "text",
									label: "Email",
									name: "Email",
									required: true
								},
								{
									view: "text",
									label: "Skype",
									name: "Skype",
									required: true
								},
								{
									view: "text",
									label: "Phone",
									name: "Phone",
									required: true
								},
								{
									view: "datepicker",
									name: "Birthday",
									label: "Birthday",
									//width: 250,
									required: true,
									format: "%d-%m-%Y"
								},
								{
									cols: [
										{
											view: "template",
											template: function(obj) {
												return `<div id='user-icon-detailed'>
                        <img id='user-image'
                        src='${obj.Photo ||
													"https://www.uic.mx/posgrados/files/2018/05/default-user.png"}'
                        width='100%'>
                        </div>`;
											},
											name: "Photo",
											localId: "image",
											type: "clean",
											height: 180
										},
										{
											rows: [
												{
													view: "template",
													type: "clean"
												},
												{
													view: "button",
													label: "Change photo",
													click: () => {
														this.imageUploader.getRoot().show();
													}
												},
												{
													view: "button",
													label: "Delete photo",
													click: () => {
														this.$$("image").setValues({
															Photo:
																"https://www.uic.mx/posgrados/files/2018/05/default-user.png"
														});
													}
												}
											]
										}
									]
								}
							]
						}
					]
				},
				{ view: "template", type: "clean" },
				{
					view: "toolbar",
					css: "btn-border",
					cols: [
						{ view: "template", gravity: 3, borderless: true },
						{
							view: "button",
							label: "Cancel",
							height: 50,
							borderless: false,
							click: () => {
								this.app.callEvent("onClickCancel_contactForm", [
									this.getParam("way", true)
								]);
							}
						},
						{
							view: "button",
							label: "",
							localId: "savebutton",
							height: 50,
							borderless: false,
							click: () => {
								const values = this.$$("contactForm").getValues();
								values.Photo = this.$$("image").getValues().Photo;
								if (!contacts.getItem(values.id)) {
									contacts.add(values);
								} else {
									contacts.updateItem(values.id, values);
								}
								this.setParam("id", values.id, true);
								this.app.callEvent("onClickSave_contactForm", [values.id]);
								this.$$("contactForm").clear();
							}
						}
					]
				}
			],
			elementsConfig: {
				labelWidth: 150
			}
		};
		return { rows: [header, addOrEditForm] };
	}
	init() {
		webix.promise.all([contacts.waitData, statuses.waitData]).then(() => {
			this.$$("status").define("options", statuses.data);
			const id = this.getParentView().getParam("id", true);
			this.$$("image").setValues({ Photo: contacts.getItem(id).Photo });
		});
		this.imageUploader = this.ui(ImageUploaderPopupView);
		this.on(this.app, "onImageUpload_imageUploaderPopup", values => {
			this.$$("image").setValues(values);
		});
	}
	urlChange(view, url) {
		webix.promise.all([contacts.waitData, statuses.waitData]).then(() => {
			if (url[0].params.way === "edit") {
				const values = contacts.getItem(
					this.getParentView().getParam("id", true)
				);
				this.setHeaderAndButtonName(values);
				this.$$("contactForm").setValues(values);
			} else if (url[0].params.way === "add") {
				this.setHeaderAndButtonName();
			}
		});
	}
	setHeaderAndButtonName(value) {
		if (value) {
			this.$$("header").define("template", "Edit contact");
			this.$$("savebutton").define("label", "Save");
		} else {
			this.$$("header").define("template", "Add new contact");
			this.$$("savebutton").define("label", "Add");
		}
		this.$$("header").refresh();
		this.$$("savebutton").refresh();
	}
}
