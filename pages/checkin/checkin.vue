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
					//TODO
				}
			},
			afresh: function(){
				let that = this;
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
