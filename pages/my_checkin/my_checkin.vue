<template>
	<view>
		<view class="statistics">
			<image src="../../static/big-icon-1.png" mode="widthFix" class="big-icon"></image>
			<view class="report-title">
				<text class="days">{{sum_normal}}</text>
				<text class="unit">天</text>
			</view>
			<view class="sub-title">
				<text>本月签到</text>
			</view>
			<view class="report">
				<view class="column green">
					<text class="column-title">正常签到</text>
					<text class="number">{{sum_normal}}</text>
				</view>
				<view class="colum orange">
					<text class="column-title">迟到签到</text>
					<text class="number">{{sum_late}}</text>
				</view>
				<view class="colum red">
					<text class="column-title">缺勤签到</text>
					<text class="number">{{sum_absent}}</text>
				</view>
			</view>
		</view>
		<view class="calendar-container">
			<uni-calendar :insert="true" :lunar="false" :selected="list" @monthSwitch="changeMonth" @confirm="changeMonth" />
		</view>
	</view>
</template>

<script>
	import uniCalendar  from "@/components/uni-calendar/uni-calendar.vue"
	export default {
		components:{
			uniCalendar
		},
		data() {
			return {
				list:[],
				sum_normal : 0,
				sum_late : 0,
				sum_absent:0
			}
		},
		onShow:function(){
			let that = this;
			let now = new Date();
			let year = now.getFullYear();
			let month = now.getMonth() +1;
			that.searchCheckin(that,year,month);
		},
		methods: {
			searchCheckin: function(ref,year,month){
				let that = ref;
				that.sumNormal = 0;
				that.sumLate = 0;
				that.sumAbsent = 0;
				that.list.length = 0;
				that.ajax(that.url.searchMonthChekcin,"POST",{year:year,month:month},function(resp){
					console.log(resp)
					for(let one of resp.data.list){
						if(one.status != null && one.status != ""){
							let color = ""
							if("正常" == one.status){
								color = "green";
							}else if("迟到" == one.status){
								color = "yellow";
							}else if("缺勤" == one.status){
								color = "red";
							}
							that.list.push(
							{
								color : color,
								info : one.status,
								date : one.date
							})
						}
						
					}
					that.sumNormal = that.sumNormal;
					that.sumLate = that.sumLate;
					that.sumAbsent = that.sum_absent;
					
				})
			},
			changeMonth: function(e){
				console.log(e)
				let that =this
				that.searchCheckin(that,e.year,e.month)
			}
		}
	}
</script>

<style lang="less">
	@import url("my_checkin.less");
</style>
