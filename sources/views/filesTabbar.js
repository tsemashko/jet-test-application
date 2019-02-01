import { JetView } from "webix-jet";
import { contacts } from "models/contacts";
import { activities } from "models/activities";
import { statuses } from "models/statuses";
import { files } from "models/files";

export default class FilesTabbarView extends JetView {
	config() {
		const filesTable = {
			view: "datatable",
			localId: "filesTable",
			scrollX: false,
			columns: [
				{
					id: "name",
					header: "Name",
					fillspace: 1,
					sort: "string"
				},
				{
					id: "lastModifiedDate",
					header: "Change date",
					format: webix.Date.dateToStr("%d-%m-%Y"),
					width: 200,
					sort: "date"
				},
				{
					id: "sizetext",
					header: "Size",
					width: 100,
					sort: "string"
				},
				{
					id: "delete",
					header: "",
					width: 40,
					template: "<i class='webix_icon wxi-trash removeFile'></i>"
				}
			],
			onClick: {
				removeFile: (e, id) => {
					webix.confirm({
						title: "Deleting file",
						ok: "Yes",
						cancel: "No",
						text:
							"Are you sure you want to delete this file? Deleting cannot be undone.",
						callback: result => {
							if (result) {
								files.remove(id);
								this.filterFiles(this.getParam("id", true));
							}
						}
					});
					return false;
				}
			}
		};
		const button = {
			view: "uploader",
			value: "Upload file",
			autosend: false,
			on: {
				onBeforeFileAdd: file => {
					files.add({
						ContactID: this.getParam("id", true),
						id: file.id,
						name: file.name,
						lastModifiedDate: file.file.lastModifiedDate,
						sizetext: file.sizetext
					});
					this.filterFiles(this.getParam("id", true));
				}
			}
		};
		return { rows: [filesTable, button] };
	}
	filterFiles(id) {
		this.$$("filesTable").clearAll();
		this.$$("filesTable").parse(
			files.find(function(obj) {
				return obj.ContactID == id;
			})
		);
	}
	urlChange() {
		webix.promise
			.all([contacts.waitData, statuses.waitData, activities.waitData])
			.then(() => {
				const id = this.getParam("id", true);
				if (id) {
					this.filterFiles(id);
				}
			});
	}
}
