import { JetView } from "webix-jet";
import { activitytypes } from "models/activitytypes";
import { statuses } from "models/statuses";
import SettingsTableView from "./settingsTable";

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
		return {
			rows: [
				toolbar,
				{
					cols: [
						new SettingsTableView(this.app, "", activitytypes),
						new SettingsTableView(this.app, "", statuses)
					]
				}
			]
		};
	}
}
