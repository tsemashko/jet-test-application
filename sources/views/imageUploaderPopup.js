import { JetView } from "webix-jet";

export default class ImageUploaderPopupView extends JetView {
	config() {
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
								label: "Image URL",
								name: "Photo"
							}
						]
					},
					{
						cols: [
							{
								view: "button",
								label: "Upload",
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
								label: "Cancel",
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
