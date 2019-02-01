import { JetView } from "webix-jet";
import { contacts } from "../models/contacts";
import { statuses } from "models/statuses";

export default class ContactsView extends JetView {
	config() {
		const header = {
			view: "toolbar",
			css: "webix_dark",
			rows: [
				{
					view: "label",
					label: "Contacts"
        },
        {
          view:"text",
          localId:"list_input"
        }
			]
		};
		const list = {
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
		const addButton = {
			view: "button",
			label: "Add contact",
			type: "icon",
			icon: "wxi-plus",
			width: 300,
			click: () => {
				this.$$("list").unselectAll();
				this.app.callEvent("onCallContactForm", ["add"]);
			}
		};
		const ui = {
			cols: [
				{ rows: [header, list, addButton], width: 300 },
				{ $subview: true }
			]
		};
		return ui;
	}
	init() {
		this.$$("list").sync(contacts);
		const formatDate = webix.Date.dateToStr("%d-%m-%Y");

		this.on(this.$$("list").data, "onIdChange", (oldId, newId)=>{
      this.setParam("id", newId, true);
			this.$$("list").select(newId);
    });

		this.on(this.app, "onCallContactForm", way => {
			this.show(`contactForm?way=${way}`);
			this.$$("list").disable();
		});
		this.on(this.app, "onAfterDelete_contactDetailed", () => {
			this.$$("list").select(contacts.getFirstId());
		});
		this.on(this.app, "onClickCancel_contactForm", () => {
			this.$$("list").enable();
			this.show("contactDetailed");
			this.$$("list").select(this.getParam("id", true));
		});
		this.on(this.app, "onClickSave_contactForm", () => {
			this.$$("list").enable();
			this.show("contactDetailed");
		});
		contacts.waitData.then(() => {
			const id = contacts.getFirstId();
			if (id) {
				this.$$("list").select(id);
			}
    });
    this.$$("list_input").attachEvent("onTimedKeyPress",function(){
      const value = this.getValue().toLowerCase();
      this.$scope.$$("list").filter(function(obj){
        return obj.FirstName.toLowerCase().includes(value) ||
        obj.LastName.toLowerCase().includes(value) ||
        obj.FirstName.toLowerCase().includes(value) ||
        statuses.getItem(obj.StatusID).Value.toLowerCase().includes(value) ||
        obj.Company.toLowerCase().includes(value) ||
        obj.Address.toLowerCase().includes(value) ||
        obj.Job.toLowerCase().includes(value) ||
        obj.Website.toLowerCase().includes(value) ||
        obj.Skype.toLowerCase().includes(value) ||
        obj.Phone.toLowerCase().includes(value) ||
        obj.Email.toLowerCase().includes(value) ||
        formatDate(obj.Birthday).includes(value) ||
        formatDate(obj.StartDate).includes(value)
      });
    });
	}
}
