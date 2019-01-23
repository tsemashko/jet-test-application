export const statuses = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/statuses/",
	save: "rest->http://localhost:8096/api/v1/statuses/",
	scheme: {
		$change: obj => {
			obj.value = obj.Value;
		}
	}
});
