import { JetView } from "webix-jet";
import { contacts } from "models/contacts";
import { statuses } from "models/statuses";
import { activitytypes } from "models/activitytypes";
import { activities } from "models/activities";
import ActivityFormView from "./activityForm";

export default class ContactDetailedView extends JetView {
	config() {
		const formatDate = webix.Date.dateToStr("%d-%m-%Y");
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
            <div class='item'><i class='far fa-calendar-alt'></i> ${formatDate(
		obj.Birthday
	)}</div>
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
					borderless: false,
					click: () => {
						webix.confirm({
							title: "Deleting contact",
							ok: "Yes",
							cancel: "No",
							text:
								"Are you sure you want to delete this contact? Deleting cannot be undone.",
							callback: result => {
								if (result) {
									const id = this.getParentView().getParam("id", true);
									contacts.remove(id);
									this.app.callEvent("onAfterDelete_contactDetailed");
									return false;
								}
							}
						});
					}
				},
				{
					view: "button",
					label: "Edit",
					type: "icon",
					icon: "wxi-pencil",
					height: 50,
					borderless: false,
					click: () => {
						this.app.callEvent("onCallContactForm", ["edit"]);
					}
				}
			]
		};
		const tabbar = {
			type: "clean",
			height: 320,
			rows: [
				{
					view: "tabbar",
					id: "contactTabbar",
					value: "",
					multiview: true,
					options: [
						{ value: "Activities", id: "activities" },
						{ value: "Files", id: "files" }
					]
				},
				{
					cells: [
						{
							id: "activities",
							rows: [
								{
									view: "datatable",
									localId: "table",
									scrollX: false,
									select: true,
									columns: [
										{
											id: "State",
											header: "",
											width: 40,
											template: "{common.checkbox()}",
											checkValue: "Completed",
											uncheckValue: "Open"
										},
										{
											id: "TypeID",
											header: [{ content: "selectFilter" }],
											sort: "string",
											width: 150,
											collection: activitytypes
										},
										{
											id: "Details",
											header: [{ content: "textFilter" }],
											sort: "string",
											fillspace: 1
										},
										{
											id: "DueDate",
											header: [{ content: "dateRangeFilter" }],
											sort: "date",
											format: webix.Date.dateToStr("%d-%m-%Y %H:%i"),
											width: 200
										},
										{
											id: "edit",
											header: "",
											width: 40,
											template:
												"<i class='webix_icon wxi-pencil editActivity'></i>"
										},
										{
											id: "delete",
											header: "",
											width: 40,
											template:
												"<i class='webix_icon wxi-trash removeActivity'></i>"
										}
									],
									onClick: {
										removeActivity: (e, id) => {
											webix.confirm({
												title: "Deleting activity",
												ok: "Yes",
												cancel: "No",
												text:
													"Are you sure you want to delete this activity? Deleting cannot be undone.",
												callback: result => {
													if (result) {
														activities.remove(id);
														this.$$("table").remove(id);
														return false;
													}
												}
											});
										},
										editActivity: (e, id) => {
											const item = this.$$("table").getItem(id);
											item.Date = item.DueDate;
											item.Time = item.DueDate;
											this.window.$$("activityForm").setValues(item);
											this.window.setHeaderAndButtonName(item);
											this.window.$$("contact").disable();
											this.window.getRoot().show();
										}
									}
								},
								{
									view: "button",
									label: "Add activity",
									type: "icon",
									icon: "wxi-plus-square",
									click: () => {
										this.window.setHeaderAndButtonName(null);
										this.window.getRoot().show();
										this.window
											.$$("contact")
											.setValue(this.getParentView().getParam("id", true));
										this.window.$$("contact").disable();
									}
								}
							]
						},
						{
							view: "template",
							template: "Files",
							id: "files"
						}
					]
				}
			]
		};
		return {
			rows: [area, buttons, tabbar]
		};
	}
	urlChange() {
		webix.promise
			.all([contacts.waitData, statuses.waitData, activities.waitData])
			.then(() => {
				const id = this.getParam("id", true);
				if (id) {
					this.filterActivities(id);
					let user = contacts.getItem(id);
					const status = statuses.getItem(user.StatusID);
					if (status) {
						user.Status = status.Value;
						user.Icon = status.Icon;
					}
					this.$$("detailedView").setValues(user);
				}
			});
	}
	init() {
		webix.promise
			.all([contacts.waitData, statuses.waitData, activities.waitData])
			.then(() => {
				const id = this.getParam("id", true);
				if (id) this.filterActivities(id);
			});
		this.window = this.ui(ActivityFormView);
		this.on(this.app, "onClickSave_activityForm", values => {
			if (values) {
				this.$$("table").parse(values);
			}
			this.$$("table").refresh();
		});
	}
	filterActivities(id) {
		this.$$("table").clearAll();
		this.$$("table").parse(
			activities.find(function(obj) {
				return obj.ContactID == id;
			})
		);
	}
}
