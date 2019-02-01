import { JetView } from "webix-jet";

export default class ImageUploaderPopupView extends JetView {
	config() {
		const _ = this.app.getService("locale")._;
		const imageUploader = {
			view: "popup",
			localId: "imageUploader",
			width: 500,
			height: 500,
			position: "center",
			body: {
				rows: [
					{
						view: "form",
						localId: "popupForm",
						elements: [
							{
								view: "text",
								label: _("Image URL"),
								name: "Photo"
							}
						]
					},
					{
						cols: [
							{
								view: "button",
								label: _("Upload"),
								click: () => {
									const values = this.$$("popupForm").getValues();
									this.app.callEvent("onImageUpload_imageUploaderPopup", [
										values
									]);
									this.$$("imageUploader").hide();
								}
							},
							{
								view: "button",
								label: _("Cancel"),
								click: () => {
									this.$$("imageUploader").hide();
								}
							}
						]
					}
				]
			}
		};
		return imageUploader;
	}
}
