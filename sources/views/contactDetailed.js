import { JetView } from "webix-jet";
import { contacts } from "models/contacts";
import { statuses } from "models/statuses";

export default class ContactDetailedView extends JetView {
	config() {
		const area = {
			view: "template",
			localId: "detailedView",
			template: obj => {
				return `
        <div class="contact-main-info">
          <div id='user-icon-detailed'>
            <img id='user-image' src='${obj.Photo ||
							"https://www.uic.mx/posgrados/files/2018/05/default-user.png"}'width='100%'>
          </div>
          <div class='contact-name'>
            <p class='user-name-detailed'>${obj.FirstName +
							" " +
							obj.LastName}</p>
            <p class='user-status-detailed'><i class='webix_icon wxi-${
	obj.Icon
}'></i>${obj.Status}</p>
          </div>
        </div>
        <div class="contact-detailed-info">
          <div class="info-column">
            <div class='item'><i class='fas fa-envelope'></i> ${obj.Email}</div>
            <div class='item'><i class='fab fa-skype'></i> ${obj.Skype}</div>
            <div class='item'><i class='fas fa-tag'></i> ${obj.Job}</div>
          </div>
          <div class="info-column">
            <div class='item'><i class='fas fa-briefcase'></i> ${
	obj.Company
}</div>
            <div class='item'><i class='far fa-calendar-alt'></i> ${
	obj.Birthday
}</div>
            <div class='item'><i class='fas fa-map-marker-alt'></i> ${
	obj.Address
}</div>
          </div>
        </div>`;
			}
		};
		const buttons = {
			view: "toolbar",
			css: "btn-border",
			cols: [
				{ view: "template", gravity: 3, borderless: true },
				{
					view: "button",
					label: "Delete",
					type: "icon",
					icon: "wxi-trash",
					height: 50,
					borderless: false
				},
				{
					view: "button",
					label: "Edit",
					type: "icon",
					icon: "wxi-pencil",
					height: 50,
					borderless: false
				}
			]
		};
		return {
			rows: [
				area,
				buttons,
				{ view: "template", gravity: 1.8, css: { "border-top": "none" } }
			]
		};
	}
	urlChange(view, url) {
		webix.promise.all([contacts.waitData, statuses.waitData]).then(() => {
			const id = this.getParam("id", true);
			if (id) {
				let user = contacts.getItem(id);
				const status = statuses.getItem(user.StatusID);
				user.Status = status.Value;
				user.Icon = status.Icon;
				this.$$("detailedView").setValues(user);
			}
		});
	}
}
