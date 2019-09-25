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
			<button type="default" v-if='state=="创建"' style="margin-bottom: 20rpx;" @click="clearOrder">放弃订单</button>
			<!--  <button type="primary"   v-if="state=='创建'"  :disabled=btn_false   class="primary" @click="addOrder">{{btn_value}}</button> -->
			<button type="warn" :disabled=btn_finished_false v-if='state!="创建"' style="margin-bottom: 20rpx;" @click="FinishOrder">{{btn_finished}}</button>
		</view>
	</view>
</template>

<script>
	import mInput from '../../components/m-input.vue';
	import service from '../../service.js';
	import log from '../../Global.js'
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
				doner: '',
			}
		},
		methods: {
			FinishOrder() {
				if (this.state == '创建') return;
				service.updateOrder(this.objectId, 'orderState', '完成');
				this.btn_false = false;
				this.btn_value = "接收订单";
				this.btn_finished = '已完成订单';
				this.btn_finished_false = true;
				this.state = '完成';
				const query = service.Bmob.Query('money');
				query.find().then(res2 => {
					for (var i = 0; i < res2.length; i++) {
						if (res2[i].userId == this.doner) {
							var currymoney = Number(res2[i].Money) + Number(this.money);
							const query2 = service.Bmob.Query('money');
							query2.get(res2[i].objectId).then(res => {
								res.set('Money', currymoney)
								res.save()
							}).catch(err => {
								console.log(err)
							})
						}
					}
				}).catch(err => {})
			},
			clearOrder() {
				const query = service.Bmob.Query('rlfp_order');
				query.destroy(this.objectId).then(res => {
					console.log("已经删除", res);
					const query3 = service.Bmob.Query('money');
					query3.find().then(res2 => {
						for (var i = 0; i < res2.length; i++) {
							console.log('res2[i].userId=', res2[i].userId)
							if (res2[i].userId == log.state.id) {
								var money = Number(this.money) + Number(res2[i].Money);
								const query2 = service.Bmob.Query('money');
								query2.get(res2[i].objectId).then(res => {
									res.set('Money', money)
									res.save()
									log.state.money = money;
									uni.navigateBack({
										delta: 1
									});
								}).catch(err => {
									console.log(err)
								})
							}
						}
					}).catch(err => {})
				}).catch(err => {
					console.log("删除失败", err)
				})
			},
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
				this.doner = res.orderDoID;

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
