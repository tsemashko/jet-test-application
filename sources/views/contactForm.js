import { JetView } from "webix-jet";
import { contacts } from "models/contacts";
import { statuses } from "models/statuses";
import ImageUploaderPopupView from "./imageUploaderPopup";

export default class ContactFormView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
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
			rules: {
				Email: webix.rules.isEmail
			},
			elements: [
				{
					cols: [
						{
							rows: [
								{
									view: "text",
									label: _("First name"),
									name: "FirstName",
									required: true
								},
								{
									view: "text",
									label: _("Last name"),
									name: "LastName",
									required: true
								},
								{
									view: "datepicker",
									name: "StartDate",
									label: _("Joining date"),
									required: true,
									format: "%d-%m-%Y"
								},
								{
									view: "combo",
									localId: "status",
									label: _("Status"),
									name: "StatusID",
									options: [],
									required: true
								},
								{
									view: "text",
									label: _("Job"),
									name: "Job",
									required: true
								},
								{
									view: "text",
									label: _("Company"),
									name: "Company",
									required: true
								},
								{
									view: "text",
									label: _("Website"),
									name: "Website",
									required: true
								},
								{
									view: "text",
									label: _("Address"),
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
									label: _("Email"),
									name: "Email",
									required: true
								},
								{
									view: "text",
									label: _("Skype"),
									name: "Skype",
									required: true
								},
								{
									view: "text",
									label: _("Phone"),
									name: "Phone",
									required: true
								},
								{
									view: "datepicker",
									name: "Birthday",
									label: _("Birthday"),
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
													label: _("Change photo"),
													click: () => {
														this.imageUploader.getRoot().show();
													}
												},
												{
													view: "button",
													label: _("Delete photo"),
													click: () => {
														this.$$("image").setValues({
															Photo: ""
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
							label: _("Cancel"),
							height: 50,
							borderless: false,
							click: () => {
								this.app.callEvent("onClickCancel_contactForm");
							}
						},
						{
							view: "button",
							label: "",
							localId: "savebutton",
							height: 50,
							borderless: false,
							click: () => {
								const form = this.$$("contactForm");
								const values = form.getValues();
								values.Photo = this.$$("image").getValues().Photo;
								if (form.validate()) {
									if (!contacts.getItem(values.id)) {
										contacts.add(values);
									} else {
										contacts.updateItem(values.id, values);
									}
									this.app.callEvent("onClickSave_contactForm");
								}
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
				this.$$("image").setValues({ Photo: "" });
			}
		});
	}
	setHeaderAndButtonName(value) {
		const _ = this.app.getService("locale")._;
		const header = this.$$("header");
		const button = this.$$("savebutton");
		if (value) {
			header.define("template", _("Edit contact"));
			button.define("label", _("Save"));
		} else {
			header.define("template", _("Add new contact"));
			button.define("label", _("Add"));
		}
		header.refresh();
		button.refresh();
	}
}
