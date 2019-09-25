<template>
	<view class="content">
		<view class="input-group">
			<view class="input-row border">
				<text class="title">标题：</text>
				<m-input type="text" :disabled=input_false v-model="title"></m-input>
			</view>
			<view class="input-row border">
				<text class="title">地区：</text>
				<input type="text" :disabled=input_false v-model="area"></m-input>
			</view>
			<view class="input-row border">
				<text class="title">电话：</text>
				<input type="number" :disabled=input_false v-model="tel"></input>
			</view>
			<view class="input-row border">
				<text class="title">报酬：</text>
				<input type="digit" style="color:red;" :disabled=input_false v-model="money"></input>元
			</view>
			<view class="input-row border">
				<text class="title">内容：</text>
				<textarea type="text" :disabled=input_false maxlength="-1" v-model="context"></textarea>
			</view>

		</view>
		<view class="btn-row">
			<button type="default" v-if='state=="接单"' style="margin-bottom: 20rpx;" @click="clearOrder">放弃订单</button>
			<button type="primary" v-if="state=='创建'" :disabled=btn_false class="primary" @click="addOrder">{{btn_value}}</button>
			<button type="warn" :disabled=btn_finished_false v-if='state=="完成"' style="margin-bottom: 20rpx;" @click="FinishOrder">{{btn_finished}}</button>
		</view>
	</view>
</template>

<script>
	import mInput from '../../components/m-input.vue';
	import service from '../../service.js';
	export default {
		components: {
			mInput
		},
		data() {
			return {
				objectId: '',
				title: '订单1', //创建的标题
				creater: '', //创建者
				state: '',
				context: '内容-----这是第一个订单',
				area: '这是一个自定义的地区',
				money: 0.125,
				tel: 1234465465,
				idCreate: false,
				input_false: true, // true input标签 表示不可编辑
				btn_false: false, // true 按钮 表示不可编辑
				btn_value: '接收订单',
				btn_finished_false: false,
				btn_finished: '完成订单',
			}
		},
		methods: {
			clearOrder() {
				if (this.state == '创建') return;
				service.updateOrder(this.objectId, 'orderState', '创建');
				service.updateOrder(this.objectId, 'orderDoID', '');
				service.updateOrder(this.objectId, 'DoerNickName', '');
				this.btn_false = false;
				this.btn_value = "接收订单";
				this.state = '创建';
				uni.navigateBack({
					delta: 1
				});
			},
			addOrder() {
				var userInfo = service.getUsers();
				console.log(userInfo);
				const query = service.Bmob.Query('rlfp_order');
				console.log("要修改的objectid", this.objectId)
				query.get(this.objectId).then(res => {
					res.set('orderState', '接单');
					res.set('orderDoID', userInfo.objectId);
					res.set('DoerNickName', userInfo.nickName);
					res.save()
				}).catch(err => {
					console.log(err)
				})
				this.btn_false = true;
				this.btn_value = "已接收订单";
				this.state = '接单';
			}
		},
		onShow(e) {
			console.log("这是onshow里的：" + e);
		},
		onLoad(e) {
			console.log("这是onloade里的：" + e);
			//数据库查询
			const query = service.Bmob.Query("rlfp_order");
			query.get(e.objectid).then(res => {
				this.objectId = res.objectId;
				this.title = res.orderTitle;
				this.context = res.orderContext;
				this.area = res.area;
				this.tel = res.TEL;
				this.money = res.Money;
				this.creater = res.orderCreatID;
				this.state = res.orderState;

				console.log("这是在明细中")
				console.log(this.state)
				if (this.state == '接单') {
					this.btn_false = true;
					this.btn_value = "已接收订单";
				}
				if (this.state == '完成') {
					this.btn_finished = '已完成订单';
					this.btn_finished_false = true;
				}
			}).catch(err => {
				console.log(err)
			})


		},
	}
</script>

<style>

</style>
