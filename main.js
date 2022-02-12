import Vue from 'vue'
import App from './App'

Vue.config.productionTip = false

App.mpType = 'app'

const app = new Vue({
    ...App
})
app.$mount()

let baseUrl = "http://192.168.0.100:8080/emos-wx";

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
	deleteMessageRefById: baseUrl + "/message/deleteMessageRefById"
	
	
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
				// 存储token到storage
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
	// 检查storage里存储的是否在perms里
	let permission = uni.getStorage("permission")
	for(let pm of perms){
		if(pm.indexOf(permission) > -1){
			return true;
		}
	}
	return false	
}
