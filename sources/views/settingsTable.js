import { JetView } from "webix-jet";
import { icons } from "models/icons";

export default class SettingsTableView extends JetView {
	constructor(app, name, data) {
		super(app, name);
		this._tdata = data;
	}
	config() {
		const _ = this.app.getService("locale")._;
		const settingsTable = {
			view: "datatable",
			localId: "settingsTable",
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
								this._tdata.remove(id);
							}
						}
					});
					return false;
				},
				editActivity: (e, id) => {
					const values = this._tdata.getItem(id);
					values.Icon = icons.find(function(obj) {
						return obj.value == values.Icon;
					}, true).id;
					this.$$("settingsForm").setValues(values);
					const button = this.$$("settingsFormButton");
					button.define("label", _("Save"));
					button.refresh();
				}
			}
		};
		const settingsForm = {
			view: "form",
			localId: "settingsForm",
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
							localId: "settingsFormButton",
							width: 100,
							type: "form",
							click: () => {
								const form = this.$$("settingsForm");
								const values = form.getValues();
								values.Icon = icons.getItem(values.Icon).value;
								if (!values.id) {
									this._tdata.add(values);
								} else {
									this._tdata.updateItem(values.id, values);
								}
								form.clear();
								const button = this.$$("settingsFormButton");
								button.define("label", _("Add"));
								button.refresh();
							}
						}
					]
				}
			]
		};
		return { rows: [settingsTable, settingsForm] };
	}
	init() {
		this.$$("settingsTable").sync(this._tdata);
	}
}
