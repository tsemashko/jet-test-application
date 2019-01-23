import { JetView } from "webix-jet";
import { contacts } from "models/contacts";
import { activities } from "models/activities";
import { activitytypes } from "models/activitytypes";
import FormView from "./form";

export default class ContactDetailedView extends JetView {
	config() {
		const toolbar = {
			view: "toolbar",
			css: "webix_dark",
			cols: [
				{
					view: "label",
					label: "Activities"
				},
				{
					view: "button",
					id: "addbtn",
					label: "Add activity",
					type: "icon",
					icon: "wxi-plus-square",
					width: 200,
					click: () => {
						this.window.getRoot().show();
					}
				}
			]
		};
		const table = {
			view: "datatable",
			id: "table",
			columns: [
				{
					id: "State",
					header: "",
					width: 50,
					template: "{common.checkbox()}",
					checkValue: "Completed",
					uncheckValue: "Open"
				},
				{
					id: "TypeID",
					header: ["Activity type", { content: "selectFilter" }],
					sort: "string",
					width: 200,
					collection: activitytypes
				},
				{
					id: "FormatDate",
					header: ["Due date", { content: "dateRangeFilter" }],
					sort: "date",
					format: webix.Date.dateToStr("%d-%m-%Y %H:%i"),
					width: 150
				},
				{
					id: "Details",
					header: ["Details", { content: "textFilter" }],
					sort: "string",
					fillspace: 1
				},
				{
					id: "ContactID",
					header: ["Contact", { content: "selectFilter" }],
					sort: "string",
					width: 200,
					collection: contacts
				},
				{
					id: "edit",
					header: "",
					width: 50,
					template: "<i class='webix_icon wxi-pencil editActivity'></i>"
				},
				{
					id: "delete",
					header: "",
					width: 50,
					template: "<i class='webix_icon wxi-trash removeActivity'></i>"
				}
			],
			onClick: {
				removeActivity: (e, id) => {
					activities.remove(id);
				},
				editActivity: (e, id) => {
					this.window.getRoot().show();
					const item = this.$$("table").getItem(id);
					item.Date = item.FormatDate;
					item.Time = item.FormatDate;
					this.window.$$("form").setValues(item);
				}
			}
		};
		return { rows: [toolbar, table] };
	}
	init() {
		this.$$("table").sync(activities);
		this.window = this.ui(FormView);
	}
}
