import { JetView } from "webix-jet";
import { icons } from "models/icons";
import { activitytypes } from "models/activitytypes";
import { statuses } from "models/statuses";

export default class SettingsView extends JetView {
	config() {
		const lang = this.app.getService("locale").getLang();
		const _ = this.app.getService("locale")._;
		const toolbar = {
			view: "toolbar",
			css: "webix_dark",
			cols: [
				{
					view: "label",
					label: _("Settings")
				},
				{
					view: "label",
					label: _("Language"),
					width: 100
				},
				{
					view: "segmented",
					id: "lang",
					width: 130,
					value: lang,
					options: [
						{ id: "ru", value: "RU", width: 50, height: 50 },
						{ id: "en", value: "EN", width: 50, height: 50 }
					],
					click: () => {
						this.app.getService("locale").setLang(this.$$("lang").getValue());
					}
				}
			]
		};
		const activityTypesTable = {
			view: "datatable",
			localId: "activityTypesTable",
			scrollX: false,
			editable: true,
			columns: [
				{
					id: "Icon",
					header: _("Icon"),
					width: 200,
					template: "<i class='webix_icon wxi-#Icon#'></i>"
				},
				{
					id: "Value",
					header: _("Activity type"),
					fillspace: 1
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
					webix.confirm({
						title: _("Deleting activity type"),
						ok: _("Yes"),
						cancel: _("No"),
						text: _(
							"Are you sure you want to delete this activity type? Deleting cannot be undone."
						),
						callback: result => {
							if (result) {
								activitytypes.remove(id);
							}
						}
					});
					return false;
				},
				editActivity: (e, id) => {
					const values = activitytypes.getItem(id);
					values.Icon = icons.find(function(obj) {
						return obj.value == values.Icon;
					}, true).id;
					this.$$("activityTypesForm").setValues(values);
				}
			}
		};
		const statusesTable = {
			view: "datatable",
			localId: "statusesTable",
			scrollX: false,
			columns: [
				{
					id: "Icon",
					header: _("Icon"),
					width: 150,
					template: "<i class='webix_icon wxi-#Icon#'></i>"
				},
				{
					id: "Value",
					header: _("Status"),
					fillspace: 1
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
					webix.confirm({
						title: _("Deleting status"),
						ok: _("Yes"),
						cancel: _("No"),
						text: _(
							"Are you sure you want to delete this status? Deleting cannot be undone."
						),
						callback: result => {
							if (result) {
								statuses.remove(id);
							}
						}
					});
					return false;
				},
				editActivity: (e, id) => {
					const values = statuses.getItem(id);
					values.Icon = icons.find(function(obj) {
						return obj.value == values.Icon;
					}, true).id;
					this.$$("statusesForm").setValues(values);
				}
			}
		};
		const activityTypesForm = {
			view: "form",
			localId: "activityTypesForm",
			elements: [
				{
					cols: [
						{
							view: "richselect",
							width: 70,
							name: "Icon",
							options: {
								view: "datasuggest",
								template: "<i class='webix_icon wxi-#value#'></i>",
								data: icons,
								body: {
									template: "<i class='webix_icon wxi-#value#'></i>",
									type: {
										width: 40,
										height: 40
									},
									data: icons
								}
							}
						},
						{
							view: "textarea",
							name: "Value"
						},
						{
							view: "button",
							label: _("Add"),
							width: 100,
							type: "form",
							click: () => {
								const values = this.$$("activityTypesForm").getValues();
								values.Icon = icons.getItem(values.Icon).value;
								if (!values.id) activitytypes.add(values);
								else {
									activitytypes.updateItem(values.id, values);
								}
								this.$$("activityTypesForm").clear();
							}
						}
					]
				}
			]
		};
		const statusesForm = {
			view: "form",
			localId: "statusesForm",
			elements: [
				{
					cols: [
						{
							view: "richselect",
							width: 70,
							name: "Icon",
							options: {
								view: "datasuggest",
								template: "<i class='webix_icon wxi-#value#'></i>",
								data: icons,
								body: {
									template: "<i class='webix_icon wxi-#value#'></i>",
									type: {
										width: 40,
										height: 40
									},
									data: icons
								}
							}
						},
						{
							view: "textarea",
							name: "Value"
						},
						{
							view: "button",
							label: _("Add"),
							width: 100,
							type: "form",
							click: () => {
								const values = this.$$("statusesForm").getValues();
								values.Icon = icons.getItem(values.Icon).value;
								if (!values.id) statuses.add(values);
								else {
									statuses.updateItem(values.id, values);
								}
								this.$$("statusesForm").clear();
							}
						}
					]
				}
			]
		};

		return {
			rows: [
				toolbar,
				{
					cols: [
						{ rows: [activityTypesTable, activityTypesForm] },
						{ rows: [statusesTable, statusesForm] }
					]
				}
			]
		};
	}
	init() {
		this.$$("activityTypesTable").sync(activitytypes);
		this.$$("statusesTable").sync(statuses);
		webix.promise
			.all([activitytypes.waitData, statuses.waitData])
			.then(() => {});
	}
}
