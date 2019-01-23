import { JetView } from "webix-jet";
import { contacts } from "../models/contacts";
import ContactDetailed from "./contactDetailed";

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
			template:
				"<div id='user-icon'><img id='user-image'" +
				"src='https://www.uic.mx/posgrados/files/2018/05/default-user.png' width='100%'></div>" +
				"<div>#FirstName# #LastName#<br>#Company#<span class='remove webix_icon wxi-close'></span></div>",
			scroll: false,
			select: true,
			type: {
				height: 60
			},
			on: {
				onAfterSelect: id => {
					this.setParam("id", id, true);
				}
			}
		};
		var ui = {
			cols: [
				{ rows: [header, { rows: [list] }], width: 300 },
				{ rows: [{ $subview: ContactDetailed }] }
			]
		};
		return ui;
	}
	init() {
		this.$$("list").sync(contacts);
		contacts.waitData.then(() => {
			const id = this.getParam("id") || contacts.getFirstId();
			if (id) {
				this.$$("list").select(id);
			}
		});
	}
	urlChange() {
		contacts.waitData.then(() => {
			const id = this.getParam("id") || contacts.getFirstId();
			this.$$("list").select(id);
		});
	}
}
