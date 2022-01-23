<template>
	<view>
		<image src="../../static/logo-1.png" mode="widthFix"  class="logo"></image>
		<view class="logo-title">EMOS企业办公系统</view>
		<view class="logo-subtitle">Ver 2050.2</view>
		<button open-type="getUserInfo" @tap="login()" class="login-btn">登录系统</button>
		<view class="register-container">
			没有账号？
			<text @tap="toRegister()" class="register">立即注册</text>
		</view>
		
	</view>
</template>

<script>
	export default {
		data() {
			return {
				
			}
		},
		methods: {
			toRegister: function(){
				uni.navigateTo({
					url:'../register/register'
				})
			},
			login: function(){
				let that = this;
				uni.login({
					provider: "weixin",
					success:function(resp){
						//得到code
						let code = resp.code
						that.ajax(that.url.login,"POST",{"code":code},function(resp){
							let premissions = resp.data.premissions
							uni.setStorageSync("premissions",premissions)
							//TODO 跳转到登录页面
						})
					},
					fail: function(e){
						console.log(e)
						uni.showToast({
							icon: 'none',
							title: '执行异常'
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
	@import url('login.less');
</style>
