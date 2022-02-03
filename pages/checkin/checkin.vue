<template>
	<view>
		<camera class="camera" v-if="showCamera" device-position="front" flash="off" @error="error"></camera>
		<image class="image" v-if="showImage" :src="photoPath" mode="widthFix"></image>
		<view class="operater-container">
			<button class="btn" type="primary" @tap="clickBtn" :disabled="!canCheckin">{{btnText}}</button>
			<button class="btn" type="warn" @tap="afresh" :disabled="!canCheckin">重拍</button>
		</view>
		<view class="notice-container">
			<text class="notcie">注意事项</text>
			<text class="desc">拍照签到的时候，必须要拍摄自己的正面照片，侧面照片会导致无法识别。另外，拍照的时候不要戴墨镜或者帽子，避免影响拍照签到的准确度</text>
		</view>
	</view>
</template>

<script>
	var QQMapWX = require("../../lib/qqmap-wx-jssdk.min.js");
	var qqmapsdk;
	export default {
		data() {
			return {
				canCheckin: true,
				photoPath: '',
				btnText: '拍照',
				showCamera: true,
				showImage: false
			}
		},
		onLoad:function(){
			qqmapsdk = new QQMapWX({
				key: "5WLBZ-TZWKW-KYDRU-OTCF7-7HYO3-LGFGF"
			})
		},
		onShow:function(){
			let that = this
			if(msg != '可以考勤'){
				setTimeout(function(){
					uni.showToast({
						title: msg,
						icon: 'none'
					})
				},1000);
				that.canCheckin = false;
			}
		}
		methods: {
			clickBtn: function(){
				let that = this
				if(that.btnText=="拍照"){
					let take = uni.createCameraContext()
					take.takePhoto({
							quality:"high",
							success:function(resp) {
								that.btnText= "签到";
								that.photoPath= resp.tempImagePath;
								that.showCamera=false;
								that.showImage=true;
							}
					})
				}else{
					//签到
					uni.showLoading({
						title:"签到中，请稍等..."
					})
					//TODO 这里不能等签到成功再显示吗？
					setTimeout(function() {
						uni.hideLoading()
					}, 3000)
					//获取地理位置
					uni.getLocation({
						success: function(resp){
							let latitude = resp.latitude
							let longitude = resp.longitude
							console.log(latitude)
							console.log(longitude)
							qqmapsdk.reverseGeocoder({
								location: {
									latitude: latitude,
									longitude: longitude
								},
								success: function(resp){
									console.log(resp);
									let address = resp.result.address;
									let addressComponent = resp.result.address_component;
									let nation = addressComponent.national;
									let province = addressComponent.province;
									let city = addressComponent.city;
									let district = addressComponent.district;
									//上传文件
									uni.uploadFile({
										url: that.url.checkin,
										filePath: that.photoPath,
										name: "photo",
										header: {
											token: uni.getStorageSync("token")
										},
										formData:{
											address: address,
											country: nation,
											province: province,
											city: city,
											distict: district
										},
										success:function(resp){
											if(resp.statusCode == 500 && resp.data == "不存在人脸模型"){
												uni.hideLoading()
												uni.showModal({
													title:"提示信息",
													content: "emos系统中不存在您的人脸模型，是否用当前这张照片作为人脸识别的模型？",
													//TODO 这里的res是哪里来的？？？
													success: function(res) {
														if(res.confirm){
															//上传头像图片
															uni.uploadFile({
																url: that.url.checkin,
																filePath: that.photoPath,
																name: "photo",
																header: {
																	token: uni.getStorageSync("token")
																},
																success:function(resp){
																	if(resp.statusCode == 500){
																		uni.showToast({
																			title:resp.data,
																			icon:'none'
																		});
																	}else if(resp.statusCode == 200){
																		uni.showToast({
																			title:"人脸建模成功",
																			icon:'none'
																		});
																	}
																}
															})
															
														}
													}
												})
											}else if(resp.statusCode == 200){
												let data = JSON.parse(resp.data)
												let code = data.code
												let msg = data.msg
												if(code == 200){
													uni.hideLoading()
													//签到成功
													uni.showToast({
														title: "签到成功",
														complete:function(){
															//TODO 跳转到签到结果统计页面
														}
													});
												}
										
											}else if(resp.statusCode == 500){
												uni.showToast({
													title: resp.data,
													icon: 'none'
												});	
											}
										}	
									})
								},
								fail: function(resp){
									uni.showToast({
										title: "定位失败",
										icon: "none"
									})
									console.log(resp)
								}
							})

						}
					})
					
				}
				that.btnText='拍照';
				that.showCamera= true;
				that.showImage= false;
			}
		}
	}
</script>

<style lang="less">
	@import url("checkin.less");
</style>
