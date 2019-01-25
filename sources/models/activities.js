const parserdmY = webix.Date.strToDate("%d-%m-%Y %H:%i");
const formatDate = webix.Date.dateToStr("%Y-%m-%d");
const formatTime = webix.Date.dateToStr("%H:%i");

export const activities = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activities/",
	save: "rest->http://localhost:8096/api/v1/activities/",
	scheme: {
		$change: obj => {
			obj.DueDate = parserdmY(obj.DueDate);
		},
		$save: obj => {
			obj.DueDate = `${formatDate(obj.Date)} ${formatTime(obj.Time)}`;
		}
	}
});
