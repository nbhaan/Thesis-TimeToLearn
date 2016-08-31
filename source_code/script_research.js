var USER_CODE = 73140814;
var ENDPOINT = "https://zeeguu.unibe.ch/get_smartwatch_events";
var events;
var numberOfOccurrences;

function length(obj) {
	return Object.keys(obj).length;
}

function getEvents() {
	var xhr = new XMLHttpRequest();
	xhr.open('GET', ENDPOINT + "?session=" + USER_CODE, false);
	xhr.onload = function () {
		events = JSON.parse(this.responseText);
	};
	xhr.send();
}

function removeDuplicates() {
	var count = 0;
	for (var i=0; i+1 < length(events); i++) {
		if (events[i].event === events[i+1].event && events[i].time === events[i+1].time && events[i].bookmark_id === events[i+1].bookmark_id) {
			events.splice(i, 1);
			i--;
			count++;
		}
	}
	console.log("number of duplicates: " + count);
}

function removeScreenOnFollowedByScreenOff() {
	var count = 0;
	for (var i=0; i+1 < length(events); i++) {
		if (events[i].event === "screenOn" && events[i+1].event === "screenOff") {
			events.splice(i, 2);
			i--;
			count++;
		}
	}
	console.log("number of screenOn followed immediately by screenOff removed: " + count);
}

function getDateObject(timeString) {
	year = timeString.substr(0, 4);
	month = timeString.substr(5, 2);
	day = timeString.substr(8, 2);
	hours = timeString.substr(11, 2);
	minutes = timeString.substr(14, 2);
	seconds = timeString.substr(17, 2);

	return new Date(year, month, day, hours, minutes, seconds, 0);
}

function countDifferentSessionLengths() {
	var count = 0;
	var screenOn = -1, screenOff = -1;
	var timeScreenOn, timeScreenOff, difference;
	var t5 = 0, t15 = 0, t60 = 0, t_other = 0;


	for (var i=0; i+1 < length(events); i++) {
		if (events[i].event === "screenOn") {
			screenOn = i;
		} else if (events[i].event === "screenOff" && screenOn !== -1) {
			screenOff = i;

			timeScreenOn = getDateObject(events[screenOn].time);
			timeScreenOff = getDateObject(events[screenOff].time);
			difference = (timeScreenOff - timeScreenOn)/1000;

			if (difference <= 5) {
				t5++;
			} else if (difference <= 15) {
				t15++;
			} else if (difference <= 60) {
				t60++;
			} else {
				// > 60
				t_other++;
			}

			//reset
			screenOn = -1;
			screenOff = -1;
		}
	}
	console.log("t <= 5: " + t5);
	console.log("5 < t <= 15: " + t15);
	console.log("15 < t <= 60: " + t60);
	console.log("t > 60: " + t_other);
}

getEvents();
console.log("total number of events: " + length(events));
removeDuplicates();
console.log("total number of events after removing duplicates: " + length(events));
removeScreenOnFollowedByScreenOff();
countDifferentSessionLengths();