<template>
<view class="page" v-if="checkPermission(['ROOT','MEETING:INSERT','MEETING:UPDATE'])">
	<view class="header">
		<input type="text" class="title" v-model="title" placeholder="输入会议标题" placeholder-class="title-placeholder" />
		<image src="../../static/icon-18.png" mode="widthFix" class="edit-icon"></image>
	</view>
	<view class="attr">
		<view class="list">
			<view class="item">
				<view class="key">日期</view>
				<picker v-if="canEdit" mode="date" :value="date" @change="dateChange">
					<view class="uni-input">{{ date }}</view>
				</picker>
				<text v-if="!canEdit" class="value">{{ date }}</text>
			</view>
			<view class="item">
				<view class="key">开始时间</view>
				<picker v-if="canEdit" mode="time" :value="start" @change="startChange">
					<view class="uni-input">{{ start }}</view>
				</picker>
				<text v-if="!canEdit" class="value">{{ start }}</text>
			</view>
			<view class="item">
				<view class="key">结束时间</view>
				<picker v-if="canEdit" mode="time" :value="end" @change="endChange">
					<view class="uni-input">{{ end }}</view>
				</picker>
				<text v-if="!canEdit" class="value">{{ end }}</text>
			</view>
			<view class="item">
				<view class="key">会议类型</view>
				<picker v-if="canEdit" :value="typeIndex" :range="typeArray" @change="typeChange">{{ typeArray[typeIndex] }}</picker>
				<text v-if="!canEdit" class="value">{{ typeArray[typeIndex] }}</text>
			</view>
			<view class="item" v-if="typeArray[typeIndex] == '线下会议'" @tap="editPlace">
				<view class="key">地点</view>
				<view class="value">{{ place }}</view>
			</view>
		</view>
		<view @tap="editDesc">
			<text class="desc">{{ desc }}</text>
		</view>
	</view>
	<view class="members">
		<view class="number">参会者（{{ members.length }}人）</view>
		<view class="member">
			<view class="user" v-for="one in members" :key="one.id" @longpress="deleteMember(one.id)">
				<image :src="one.photo" mode="widthFix" class="photo"></image>
				<text class="name">{{ one.name }}</text>
			</view>
			<view class="add">
				<image src="../../static/icon-19.png" mode="widthFix" class="add-btn" @tap="toMembersPage()"/>
			</view>
		</view>
	</view>
	<button class="btn" @tap="save()">保存</button>
	<uni-popup ref="popupPlace" type="dialog">
		<uni-popup-dialog mode="input" title="编辑文字内容" :value="place" placeholder="输入会议地点"/>
	</uni-popup>
	<uni-popup ref="popupDesc" type="dialog">
		<uni-popup-dialog mode="input" title="编辑文字内容" :value="desc" placeholder="输入会议内容"/>
	</uni-popup>
	<uni-popup ref="popupPlace" type="dialog">
		<uni-popup-dialog    placeholder="输入会议地点" @confirm="finishPlace" />
	</uni-popup>
	<uni-popup ref="popupDesc" type="dialog">
		<uni-popup-dialog   placeholder="输入会议内容" @confirm="finishDesc" />
	</uni-popup>

</view>

</template>

<script>
import uniPopup from '@/components/uni-popup/uni-popup.vue';
import uniPopupMessage from '@/components/uni-popup/uni-popup-message.vue';
import uniPopupDialog from '@/components/uni-popup/uni-popup-dialog.vue';
export default {
	components: {
		uniPopup,
		uniPopupMessage,
		uniPopupDialog
	},
	data() {
		return {
			opt: null,
			id: null,
			uuid: null,
			canEdit: true,
			title: '',
			date: '',
			start: '',
			end: '',
			typeArray: ['线上会议', '线下会议'],
			typeIndex: 0,
			place: '',
			desc: '会议内容',
			members: [],
			instanceId: null
		};
	},
	onLoad: function(options){
		this.id = options.id
		this.opt = options.opt
		if(options.hasOwnProperty("members")){
			let members = options.members
			this.members = members.split(",")
		}
	},
	onShow: function(){
		let that = this;
		let pages = that.getCurrentPages();
		let curPage = pages[pages.length - 1];
		//判断是否从会议列表进入
		if(!curPage.hasOwnProperty("finishMembers") || !curPage.finishMembers){
			//从会议列表进入
			if(this.opt == 'insert'){
				let now = new Date();
				//向后偏移30min
				now.setTime(now.getTime() + 30*60*1000);
				that.date = now.format("yyyy-MM-dd");
				that.start = now.format("hh:mm")
				//结束时间向后推移60min
				now.setTime(now.getTime() + 60*60*1000);
				that.end = now.format("hh:mm");
			}else if (that.opt == 'edit') {
					//获取数据
					that.ajax(that.url.searchMeetingById, 'POST', { id: that.id }, function(resp) {
						let result = resp.data.result;
						that.uuid = result.uuid;
						that.title = result.title;
						that.date = result.date;
						that.start = result.start;
						that.end = result.end;
						that.typeIndex = result.type - 1;
						that.place = result.place;
						let desc = result.desc;
						if (desc != null && desc != '') {
							that.desc = desc;
						}
						that.members = result.members;
						that.instanceId = result.instanceId;
					});
				
			}	
		}else{
			//member页面回退
			//数组中的字符串转为数字
			let members = [];
			for(let one of curPage.members){
				members.push(Number(one))
			}
			//查询数据
			that.ajax(that.url.searchMembers,"POST",{members:JSON.stringify(members)},function(resp){
				let result = resp.data.result;
				that.members = result;
			});
			
		}
	},
	methods: {
		toMembers:function(){
			let array = []
			for(let one of this.members){
				array.push(one.id);
			}
			uni.navigateTo({
				url:"../members/members?members=" + array.join(",") 
			})
		},
		dateChange: function(e) {
			this.date = e.detail.value;
		},
		startChange: function(e) {
			this.start = e.detail.value;
		},
		endChange: function(e) {
			this.end = e.detail.value;
		},
		typeChange: function(e) {
			this.typeIndex = e.detail.value;
		},
		editPlace: function() {
			if (!this.canEdit) {
				return;
			}
			this.$refs.popupPlace.open();
		},
		
		finishPlace: function(done, value) {
			if (value != null && value != '') {
				this.place = value;
				done();
			} else {
				uni.showToast({
					icon: 'none',
					title: '地点不能为空'
				});
			}
		},
		
		editDesc: function() {
			if (!this.canEdit) {
				return;
			}
			this.$refs.popupDesc.open();
		},
		
		finishDesc: function(done, value) {
			if (value != null && value != '') {
				this.desc = value;
				done();
			} else {
				uni.showToast({
					icon: 'none',
					title: '内容不能为空'
				});
			}
		},
		save: function(){
			let that = this
			let array = []
			for(let one of that.members){
				array.push(one.id)
			}
			//验证数据
			if(that.checkBlank(that.tile,"会议题目")||
				that.checkValidStartAndEnd(that.start,that.end) ||
				(that.typeIndex == '1' && that.checkBlank(that.place),"会议地点") ||
				that.checkBlank(that.desc,"会议描述") ||
				array.length == 0){
				return;
			}
			let data = {
				title : that.title,
				start : that.start,
				end : that.end,
				typeIndex : that.typeIndex,
				place : that.place,
				desc : that.desc,
				members : json.stringify(array),
				id : that.id,
				instanceId : that.instanceId
				
				
			}
			if(that.typeIndex == '1'){
				data.place = place;
			}
			//发送ajax请求
			let url;
			if(that.opt == 'insert'){
				url = that.url.insertMeeting
			}else if(that.opt == 'update'){
				url = that.url.updateMeetingInfo
			}
			that.ajax({
				url,
				'POST',
				data,
				function(resp){
					uni.showToast(
					{
						icon:"success",
						title:"会议保存成功",
						complete: function(){
							setTimeOut(
								funtion(){
									uni.navigateBack()
								},2000
							)
						}
					}
					)
				}
				
			})
		},
		deleteMember: function(id){
			let that= this
			uni.vibrateShort({})
			uni.showModal({
				title:"提示信息",
				content:"删除参会人员？",
				success: function(resp){
					if(resp.confirm){
						let pos;
						for(let i = 0;i < that.members.length;i++){
							if(members[i].id ==  id){
								pos = i;
								break;
							}
						}
					}
					that.members.splice(pos,1);
					
				}
				
				
			})
		}


	}
};

</script>

<style lang="less">
	@import url('meeting.less');
</style>

