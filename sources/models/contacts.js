const parserdmY = webix.Date.strToDate("%d-%m-%Y");
const parserYmd = webix.Date.dateToStr("%Y-%m-%d %H:%i");

export const contacts = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/contacts/",
	save: "rest->http://localhost:8096/api/v1/contacts/",
	scheme: {
		$change: obj => {
			obj.Birthday = parserdmY(obj.Birthday);
			obj.StartDate = parserdmY(obj.StartDate);
			obj.value = `${obj.FirstName} ${obj.LastName}`;
		},
		$save: obj => {
			obj.Birthday = parserYmd(obj.Birthday);
			obj.StartDate = parserYmd(obj.StartDate);
		}
	}
});
