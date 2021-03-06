import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()

// let baseUrl = "http://192.168.0.100:8080/emos-wx";
let baseUrl = "http://127.0.0.1:8080/emos-wx";
let workflow = "http://47.103.71.33:9090/emos-workflow";
Vue.prototype.code = "66F153F9E9A85DA9";

Vue.prototype.url = {
	register: baseUrl + "/user/register",
	login: baseUrl + "/user/login",
	checkin: baseUrl + "/checkin/checkin",
	createFaceModel: baseUrl + "/checkin/createFaceModel",
	validCanCheckIn: baseUrl + "/checkin/validCanCheckin",
	searchTodayCheckin: baseUrl +"/checkin/searchTodayCheckin",
	searchUserSummary: baseUrl + "/user/searchUserSummary",
	searchMonthChekcin: baseUrl + "/checkin/searchMonthCheckin",
	refreshMessage: baseUrl + "/message/refreshMessage",
	searchMessageByPage: baseUrl + "/message/searchMessageByPage",
	searchMessageById: baseUrl +"/message/searchMessageById",
	updateUnreadMessage: baseUrl + "/message/updateUnreadMessage",
	deleteMessageRefById: baseUrl + "/message/deleteMessageRefById",
	searchMyMeetingListByPage: baseUrl + "/meeting/searchMyMeetingListByPage",
	searchUserGroupByDept: baseUrl +"/user/searchUserGroupByDept",
	searchMembers:baseUrl + "/user/searchMembers",
	insertMeeting: baseUrl + "/meeting/insertMeeting",
	updateMeetingInfo : baseUrl + "/meeting/updateMeetingInfo",
	searchMeetingById: baseUrl + "/meeting/searchMeetingById",
	deleteMeetingById: baseUrl + "/meeting/deleteMeetingById",
	searchUserTaskListByPage: workflow + "/workflow/searchUserTaskListByPage",
	approvalMeeting:workflow + "/workflow/approvalMeeting",
	selectUserPhotoAndName : baseUrl + "/workflow/selectUserPhotoAndName"
	
	
	
}

Vue.prototype.ajax = function(url,method,data,fun){
	uni.request({
		"url": url,
		"method": method,
		"header": {
			token: uni.getStorageSync("token")
		},
		"data":data,
		success: function(resp){
			if(resp.statusCode == 401){
				uni.redirectTo({
					url: '../login/login'
				})
			}else if(resp.statusCode == 200 && resp.data.code == 200){
				// ??????token???storage
				let data = resp.data
				if(data.hasOwnProperty("token")){
					console.log(data)
					let token = data.token
					uni.setStorageSync("token",token)
				}
				fun(resp)
			}else{
				uni.showToast({
					icon: 'none',
					title: resp.data
				})
			}	
		}
	});	
	
}

Vue.prototype.checkPermission = function(perms){
	// ??????storage?????????????????????perms???
	let permission = uni.getStorage("permission")
	for(let pm of perms){
		if(pm.indexOf(permission) > -1){
			return true;
		}
	}
	return false	
}

Date.prototype.format = function(fmt) {
	var o = {
		"M+": this.getMonth() + 1, //?????? 
		"d+": this.getDate(), //??? 
		"h+": this.getHours(), //?????? 
		"m+": this.getMinutes(), //??? 
		"s+": this.getSeconds(), //??? 
		"q+": Math.floor((this.getMonth() + 3) / 3), //?????? 
		"S": this.getMilliseconds() //?????? 
	};
	if (/(y+)/.test(fmt)) {
		fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
	}
	for (var k in o) {
		if (new RegExp("(" + k + ")").test(fmt)) {
			fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
		}
	}
	return fmt;
}

/* ???????????? */
Vue.prototype.checkNull = function(date,name){
	if(date == null){
		uni.showToast({
			icon:"none",
			title:name + "????????????"
		})
		return false
	}
	return true
}

Vue.prototype.checkBlank = function(data, name) {
	if (data == null || data == "") {
		uni.showToast({
			icon: "none",
			title: name + "????????????"
		})
		return true
	}
	return false
}

Vue.prototype.checkValidName = function(data, name) {
	if (data == null || data == "") {
		uni.showToast({
			icon: "none",
			title: name + "????????????"
		})
		return true
	} else if (!/^[\u4e00-\u9fa5]{2,15}$/.test(data)) {
		uni.showToast({
			icon: "none",
			title: name + "???????????????"
		})
		return true
	}
	return false
}

Vue.prototype.checkValidTel = function(data, name) {
	if (data == null || data == "") {
		uni.showToast({
			icon: "none",
			title: name + "????????????"
		})
		return true
	} else if (!/^1[0-9]{10}$/.test(data)) {
		uni.showToast({
			icon: "none",
			title: name + "???????????????"
		})
		return true
	}
	return false
}

Vue.prototype.checkValidEmail = function(data, name) {
	if (data == null || data == "") {
		uni.showToast({
			icon: "none",
			title: name + "????????????"
		})
		return true
	} else if (!/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(data)) {
		uni.showToast({
			icon: "none",
			title: name + "???????????????"
		})
		return true
	}
	return false
}

Vue.prototype.checkValidStartAndEnd = function(start, end) {
	let d1 = new Date("2000/01/01 " + start + ":00");
	let d2 = new Date("2000/01/01 " + end + ":00");
	if (d2.getTime() <= d1.getTime()) {
		uni.showToast({
			icon: "none",
			title: "????????????????????????????????????"
		})
		return true
	}
	return false
}

