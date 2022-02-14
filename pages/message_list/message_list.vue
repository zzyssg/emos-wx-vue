<template>
	<view class="page">
		<image src="../../static/logo-3.jpg" mode="widthFix" class="logo"></image>
		<view class="add" v-if="checkPermission(['ROOT', 'MEETING:INSERT'])" 
		@tap="toMeetingPage(null,'insert')">
			<image src="../../static/icon-17.png" mode="widthFix" class="icon"></image>
			<text>创建会议</text>
		</view>
		<view v-for="one in list" :key="one.date">
			<view class="list-title">{{one.date}}</view>
			<view class="item" v-for="meeting in one.list" :key="meeting.id"
			@longpress="deleteById(meeting.id, meeting.date, meeting.start)">
				<view class="header">
					<view class="left">
						<image v-if="meeting.type=='线上会议'" src="../../static/icon-11.png" mode="widthFix" class="icon"></image>
						<image v-if="meeting.type=='线下会议'" src="../../static/icon-11.png" mode="widthFix" class="icon"></image>
						<text>{{meeting.type}}</text>
						<text :class="meeting.status=='未开始'?'blue':'red'">（{{meeting.status}}）</text>
					</view>
					<view class="right" @tap="toMeetingPage(meeting.id, 'edit')"
					v-if="checkPermission(['ROOT', 'MEETING:UPDATE']) && meeting.status == '未开始'">
						<text>编辑</text>
					</view>
				</view>
				<view class="content">
					<view class="title">{{meeting.title}}</view>
					<view class="attr">
						<view class="timer">
							<image src="../../static/icon-14.png" mode="widthFix" class="icon"></image>
							<text>{{meeting.start}} ~ {{meeting.end}}</text>
						</view>
						<view class="creator">
							<image src="../../static/icon-15.png" mode="widthFix" class="icon"></image>
							<text>{{meeting.name}}</text>
						</view>
						<view class="place" v-if="meeting.type!='线上会议'">
							<image src="../../static/icon-16.png" mode="widthFix" class="icon"></image>
							<text>{{meeting.place}}</text>
						</view>
					</view>
					<view class="desc">{{meeting.desc}}</view>
					<button class="btn" v-if="meeting.type=='线上会议'"
					@tap="enter(meeting.id,meeting.uuid,meeting.date,meeting.start)">进入</button>
				</view>
			</view>
		</view>
	</view>

</template>

<script>
import uniList from '@/components/uni-list/uni-list.vue';
import uniListItem from '@/components/uni-list-item/uni-list-item.vue';
export default {
	components: {
		uniList,
		uniListItem
	},
	data() {
		return {
			page: 1,
			length: 20,
			list: [
				{
					id:"601027486863f742e88b1b22",
					refId:"6010274d6863f742e88b1b23",
					senderName:"系统消息",
					senderPhoto:"https://static-1258386385.cos.ap-beijing.myqcloud.com/img/System.jpg",
					msg:"HelloWorld",
					readFlag:false,
					sendTime:"2021-01-26 22:29:28"
				}
			],
			isLastPage: false
		};
	},
	onShow: function() {
		let that = this;
		that.page = 1;
		that.isLastPage = false;
		uni.pageScrollTo({
			scrollTop: '0'
		});
		this.loadMessageList(this);
	},
	onReachBottom: function() {
		if (this.isLastPage) {
			return;
		}
		this.page = this.page + 1;
		this.loadMessageList(this);
	},
	methods:{
		loadMessageList: function(ref) {
			let data = {
				page: ref.page,
				length: ref.length
			};
			ref.ajax(ref.url.searchMessageByPage, 'POST', data, function(resp) {
				let result = resp.data.result;
				if (result == null || result.length == 0) {
					ref.isLastPage = true;
					ref.page = ref.page - 1;
					uni.showToast({
						icon: 'none',
						title: '已经到底了'
					});
				} 
				else {
					if (ref.page == 1) {
						ref.list = [];
					}
					ref.list = ref.list.concat(result);
					if (ref.page > 1) {
						uni.showToast({
							icon: 'none',
							title: '又加载了' + result.length + '条消息'
						});
					}
				}
			});
		}
	}
}

</script>

<style lang="less">
	@import url("message_list.less");
</style>
