import { JetView } from "webix-jet";
import { contacts } from "models/contacts";
import { statuses } from "models/statuses";

export default class ContactDetailedView extends JetView {
	config() {
		const area = {
			type: "clean",
			id: "detailedView",
			rows: [
				{
					type: "clean",
					cols: [
						{
							view: "template",
							gravity: 1,
							template:
								"<div id='user-icon-detailed'><img id='user-image' " +
								"src='https://www.uic.mx/posgrados/files/2018/05/default-user.png'" +
								" width='100%'></div>"
						},
						{
							rows: [
								{
									view: "template",
									id: "userName",
									template: function(obj) {
										return `<p class='user-name-detailed'>${obj.name}</p>`;
									},
									gravity: 0.3,
									css: "center",
									data: {
										name: "Name Surname"
									}
								},
								{
									view: "template",
									id: "userStatus",
									template: function(obj) {
										return (
											"<p class='user-status-detailed'>" +
											`<i class='webix_icon wxi-${obj.icon}'></i> ${
												obj.status
											}</p>`
										);
									},
									gravity: 0.7,
									css: "center",
									data: {
										status: "Status",
										icon: ""
									}
								}
							],
							type: "clean",
							gravity: 2
						},
						{
							view: "toolbar",
							width: 250,
							css: "btn-padding",
							rows: [
								{
									view: "button",
									label: "Delete",
									type: "icon",
									icon: "wxi-trash",
									width: 250,
									height: 70,
									borderless: false
								},
								{
									view: "button",
									label: "Edit",
									type: "icon",
									icon: "wxi-pencil",
									width: 250,
									height: 70,
									borderless: false
								}
							]
						}
					],
					gravity: 0.4
				},
				{
					css: {
						"padding-left": "1px"
					},
					cols: [
						{
							id: "infoList1",
							view: "list",
							borderless: true,
							data: [
								{ id: "email", title: "email", icon: "fas fa-envelope" },
								{ id: "skype", title: "skype", icon: "fab fa-skype" },
								{ id: "job", title: "job", icon: "fas fa-tag" }
							],
							template: `<i class='${"#icon#"}'></i> #title#`,
							scroll: false,
							css: {
								"padding-left": "20px"
							}
						},
						{
							id: "infoList2",
							view: "list",
							data: [
								{ id: "company", title: "company", icon: "fas fa-briefcase" },
								{
									id: "birth",
									title: "date of birth",
									icon: "far fa-calendar-alt"
								},
								{
									id: "location",
									title: "location",
									icon: "fas fa-map-marker-alt"
								}
							],
							template: `<i class='${"#icon#"}'></i> #title#`,
							scroll: false,
							borderless: true
						},
						{
							view: "template",
							borderless: true
						}
					],
					gravity: 0.18
				},
				{
					view: "template",
					gravity: 0.42
				}
			]
		};
		return area;
	}
	urlChange(view, url) {
		webix.promise.all([contacts.waitData, statuses.waitData]).then(() => {
			const id = url[0].params.id;
			if (id) {
				const user = contacts.getItem(id);
				this.$$("userName").setValues({
					name: user.FirstName + " " + user.LastName
				});
				const status = statuses.getItem(user.StatusID);
				this.$$("userStatus").setValues({
					status: status.Value,
					icon: status.Icon
				});
				const infolist1 = this.$$("infoList1");
				infolist1.getItem("email").title = user.Email;
				infolist1.getItem("skype").title = user.Skype;
				infolist1.getItem("job").title = user.Job;
				infolist1.refresh();
				const infolist2 = this.$$("infoList2");
				infolist2.getItem("company").title = user.Company;
				infolist2.getItem("birth").title = user.Birthday;
				infolist2.getItem("location").title = user.Address;
				infolist2.refresh();
			}
		});
	}
}
