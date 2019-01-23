var parserdmY = webix.Date.strToDate("%d-%m-%Y %H:%i");
var formatDate = webix.Date.dateToStr("%Y-%m-%d");
var formatTime = webix.Date.dateToStr("%H:%i");

export const activities = new webix.DataCollection({
	url: "http://localhost:8096/api/v1/activities/",
	save: "rest->http://localhost:8096/api/v1/activities/",
	scheme: {
		$change: obj => {
			obj.FormatDate = parserdmY(obj.DueDate);
		},
		$save: obj => {
			var Date_ = formatDate(webix.i18n.longDateFormatDate(obj.Date));
			var Time_ = formatTime(webix.i18n.longDateFormatDate(obj.Time));
			obj.DueDate = `${Date_} ${Time_}`;
		}
	}
});
