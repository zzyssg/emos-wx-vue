<template>
	<view>
		<image src="../../static/logo-2.png" mode="widthFix" class="logo"></image>
		<view class="register-container" >
			<input class="register-code" placeholder="输入你的邀请码" maxlength="6" v-model="registerCode" />
			<view class="register-desc">管理员创建员工账号以后，你可以从你的个人邮箱中获取注册邀请码</view>
			<button class="register-btn" open-type="getUserInfo" @tap="register()">执行注册</button>
		</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				registerCode: null
			};
		},
		methods: {
			register:function(){
				//前端验证的语句
				let that = this
				if(that.registerCode == null || that.registerCode.length == 0){
					uni.showToast({
						icon: 'none',
						title: "邀请码不能为空"
					})
					return
				}else if(/^[0-9]{6}$/.test(that.registerCode) == false){
					uni.showToast({
						icon: 'none',
						title: "邀请码必须是6个数字"
					})
					return
				}
				
				uni.login({
					provider:"weixin",
					success:function(resp){
						let code = resp.code
						uni.getUserInfo({
							provider:"weixin",
							success:function(resp){
								let nickName = resp.userInfo.nickName
								let avatarUrl = resp.userInfo.avatarUrl
								console.log(nickName)
								console.log(avatarUrl)
								let data = {
									code: code,
									nickname: nickName,
									photo: avatarUrl,
									registerCode: that.registerCode
								};
								that.ajax(that.url.register,'POST',data,function(resp){
									let permissions = resp.data.permissions;
									uni.setStorageSync("permissions",permissions)
									//TODO 跳转到inex
								})
							}
						})
						
					}
				})
				uni.switchTab({
					url:"../index/index"
				})
			}
		}
	}
</script>

<style lang="less">
	@import url('register.less');
</style>

