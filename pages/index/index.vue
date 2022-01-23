<template>
	<view class="page">
		<swiper class="swiper" circular="true" duration="1000" interval="8000">
			<swiper-item>
				<image mode="widthFix" src="https://emos-wx-vue.oss-cn-beijing.aliyuncs.com/img/banner/swiper-1.jpg"></image>
			</swiper-item>
			<swiper-item>
				<image mode="widthFix" src="https://emos-wx-vue.oss-cn-beijing.aliyuncs.com/img/banner/swiper-2.jpg"></image>
			</swiper-item>
			<swiper-item>
				<image mode="widthFix" src="https://emos-wx-vue.oss-cn-beijing.aliyuncs.com/img/banner/swiper-3.jpg"></image>
			</swiper-item>
			<swiper-item>
				<image mode="widthFix" src="https://emos-wx-vue.oss-cn-beijing.aliyuncs.com/img/banner/swiper-4.jpg"></image>
			</swiper-item>
			<swiper-item>
				<image mode="widthFix" src="https://emos-wx-vue.oss-cn-beijing.aliyuncs.com/img/banner/swiper-5.jpg"></image>
			</swiper-item>
		</swiper>
		<view class="notify-container">
			<view class="notify-title">
				<image class="notify-icon" mode="widthFix" src="../../static/icon-1.png"></image>
				消息提醒
			</view>
			<view class="notify-content">您有{{unreadMessages}}条消息未读</view>
			<image class="more-icon" mode="widthFix" src="../../static/icon-2.png"></image>
		</view>
		<view class="nav-container">
			<view class="nav-row">
				<view class="nav">
					<image class="icon" mode="widthFix" src="../../static/nav-1.png"></image>
					<text class="name">在线签到</text>
				</view>
				<view class="nav">
					<image class="icon" mode="widthFix" src="../../static/nav-2.png"></image>
					<text class="name">员工健康</text>
				</view>
				<view class="nav">
					<image class="icon" mode="widthFix" src="../../static/nav-3.png"></image>
					<text class="name">在线请假</text>
				</view>
				<view class="nav">
					<image class="icon" mode="widthFix" src="../../static/nav-4.png"></image>
					<text class="name">公务出差</text>
				</view>
			</view>
			<view class="nav-row">
				<view class="nav">
					<image class="icon" mode="widthFix" src="../../static/nav-5.png"></image>
					<text class="name">员工日报</text>
				</view>
				<view class="nav">
					<image class="icon" mode="widthFix" src="../../static/nav-6.png"></image>
					<text class="name">我的加班</text>
				</view>
				<view class="nav">
					<image class="icon" mode="widthFix" src="../../static/nav-7.png"></image>
					<text class="name">付款申请</text>
				</view>
				<view class="nav">
					<image class="icon" mode="widthFix" src="../../static/nav-8.png"></image>
					<text class="name">费用报销</text>
				</view>
			</view>
			<view class="nav-row">
				<view class="nav">
					<image class="icon" mode="widthFix" src="../../static/nav-9.png"></image>
					<text class="name">公告通知</text>
				</view>
				<view class="nav">
					<image class="icon" mode="widthFix" src="../../static/nav-10.png"></image>
					<text class="name">在线审批</text>
				</view>
				<view class="nav">
					<image class="icon" mode="widthFix" src="../../static/nav-11.png"></image>
					<text class="name">物品领用</text>
				</view>
				<view class="nav">
					<image class="icon" mode="widthFix" src="../../static/nav-12.png"></image>
					<text class="name">采购申请</text>
				</view>
			</view>
		</view>
	</view>
	
</template>

<script>
	export default {
		data() {
			return {
				title: 'Hello'
			}
		},
		onLoad() {

		},
		methods: {

		}
	}
</script>

<style lang="less">
	@import url("index.less");
</style>
