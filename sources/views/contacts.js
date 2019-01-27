import { JetView } from "webix-jet";
import { contacts } from "../models/contacts";
import ContactFormView from "./contactForm";

export default class ContactsView extends JetView {
	config() {
		var header = {
			view: "toolbar",
			css: "webix_dark",
			cols: [
				{
					view: "label",
					label: "Contacts"
				}
			]
		};
		var list = {
			view: "list",
			localId: "list",
			template: function(obj) {
				return `<div id='user-icon'><img id='user-image'
				src='${obj.Photo ||
					"https://www.uic.mx/posgrados/files/2018/05/default-user.png"}' width='100%'></div>
      <div>${obj.FirstName} ${obj.LastName}<br>${obj.Company}</div>`;
			},
			scroll: false,
			select: true,
			type: {
				height: 60
			},
			on: {
				onAfterSelect: id => {
					this.setParam("id", id, true);
					contacts.waitData.then(() => {
						this.show("contactDetailed");
					});
				}
			}
		};
		var addButton = {
			view: "button",
			label: "Add contact",
			type: "icon",
			icon: "wxi-plus",
			width: 300,
			click: () => {
				this.$$("list").unselectAll();
				this.app.callEvent("onCallContactForm", ["add"]);
				//this.contactForm.setHeaderAndButtonName(null);
			}
		};
		var ui = {
			cols: [
				{ rows: [header, list, addButton], width: 300 },
				{ $subview: true }
			]
		};
		return ui;
	}
	init() {
		this.$$("list").sync(contacts);
		this.contactForm = this.ui(ContactFormView);

		this.on(this.app, "onCallContactForm", way => {
			this.show(`contactForm?way=${way}`);
			this.$$("list").disable();
		});
		this.on(this.app, "onAfterDelete_contactDetailed", () => {
			this.$$("list").select(contacts.getFirstId());
		});
		this.on(this.app, "onClickCancel_contactForm", way => {
			this.$$("list").enable();
			this.show("contactDetailed");
			if (way == "edit") {
				this.$$("list").select(this.getParam("id", true));
			} else if (way == "add") {
				this.setParam("id", contacts.getFirstId(), true);
				this.$$("list").select(contacts.getFirstId());
			}
		});
		this.on(this.app, "onClickSave_contactForm", id => {
			this.$$("list").enable();
			const _id = this.getParam("id", true);
			this.$$("list").select(_id);
			if (id == _id) {
				this.show("contactDetailed");
			}
		});
		contacts.waitData.then(() => {
			const id = contacts.getFirstId();
			if (id) {
				this.$$("list").select(id);
			}
		});
	}
}
