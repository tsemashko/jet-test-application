import { JetView } from "webix-jet";

export default class SettingsView extends JetView {
	config() {
		const lang = this.app.getService("locale").getLang();
		const toolbar = {
			view: "toolbar",
			css: "webix_dark",
			cols: [
				{
					view: "label",
					label: "Settings"
        },
        {
          view:"label",
          label:"Language:",
          width:100
        },
				{
					view: "segmented",
          id: "lang",
          width:130,
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
		return toolbar;
	}
}
