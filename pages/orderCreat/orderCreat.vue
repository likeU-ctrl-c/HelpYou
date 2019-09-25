<template>
	<view class="content">
		<view class="input-group">
			<view class="input-row border">
				<text class="title">标题：</text>
				<m-input type="text" v-model="title"></m-input>
			</view>
			<view class="input-row border">
				<text class="title">地区：</text>
				<input type="text" disabled=true v-model="area"></m-input>
			</view>
			<view class="input-row border">
				<text class="title">电话：</text>
				<input type="number" v-model="tel"></input>
			</view>
			<view class="input-row border">
				<text class="title">报酬：</text>
				<input type="digit" v-model="money"></input>元
			</view>
			<view class="input-row border">
				<text class="title">内容：</text>
				<textarea type="text" maxlength="-1" v-model="context"></textarea>
			</view>

		</view>
		<view class="btn-row">
			<button type="primary" style="margin-bottom: 20rpx;" @tap="clear">重置订单</button>
			<button type="primary" class="primary" @tap="addOrder">新建订单</button>
		</view>
	</view>
</template>
<!-- https://webapi.amap.com/maps?v=1.4.15&key=5909a9d0d0ea2dd9b407462c8b11ec61 -->
<script>
	import mInput from '../../components/m-input.vue';
	import service from '../../service.js';
	import log from '../../Global.js';
	// import amap from "../../amap-wx.js";
	export default {
		components: {
			mInput
		},
		data() {
			return {
				title:' ', //创建的标题
				creater: '', //创建者
				state: '',
				context: '',
				area: '',
				money: 0,
				tel: 0,
				location:{
					"country": '',
					"province": '',
					"city": '',
					"district": '',
					"street": '',
					"streetNum": '',
					"poiName": '',
					"cityCode": ''
				},
				country:'',//国家
				province:'',//省份
				city:'',//城市
				district:'',//区县名称
				street:'',//街道信息
				streetNum:'',//获取街道门牌号
				poiName:'',
				cityCode:'',
			}
		},
		methods: {
			//获取位置信息
		getLoacation(){
				var that=this;
				uni.getLocation({
				    type: 'wgs84 ',
					altitude:true,//是否启用高精度
					geocode:true,//是否解析地址
				    success: function (res) {
				        console.log('当前位置的经度：' + res.longitude);
				        console.log('当前位置的纬度：' + res.latitude);
						console.log("调用接口成功返回："+res);
						console.log(res.address);
							var curryLocation={
										"country": res.address.country,
										"province": res.address.province,
										"city": res.address.city,
										"district": res.address.district,
										"street": res.address.street,
										"streetNum": res.address.streetNum,
										"poiName": res.address.poiName,
										"cityCode": res.address.cityCode
									}
									that.location=curryLocation;
							// //写入文本框中
							that.area=curryLocation.province+curryLocation.city+curryLocation.district+curryLocation.street+curryLocation.streetNum+
							curryLocation.poiName;
						
				    },
					fail:function(res) {
						console.log("调用接口失败：+",res);
						that.area+=res;
					},
					complete:function(res){
						console.log("调用接口结束",res);
							
					}
				});
			}
,
//添加订单；
			addOrder() {
				if (!log.state.hasLogin) {
					uni.showToast({
						title: '你还未登录！'
					});
					uni.navigateTo({
						url: '../login/login',
					});
				};
				if (this.tel.length < 11) {
					uni.showToast({
						title: '电话长度不够'
					});
					return;
				}
				if (this.title.length < 1) {
					uni.showToast({
						title: '标题不能为空'
					});
					return;
				}

				if (this.area.length < 1) {
					uni.showToast({
						title: '地区不能为空'
					});
					return;
				}
				if (this.money <= 0) {
					uni.showToast({
						title: '钱不能为空'
					});
					return;
				}
				if (this.context.length < 3) {
					uni.showToast({
						title: '内容不能为空'
					});
					return;
				}
				if (log.state.money - this.money < 0) {
					uni.showToast({
						title: '你的钱包里没有那么多钱了-_-!'
					});
					return;
				}
				
				
	
				const data = {
					orderCreatID: '',
					area: this.area,
					orderTitle: this.title,
					orderState: '创建',
					orderContext: this.context,
					createNickName: '',
					money: this.money + '',
					tel: this.tel + '',
				};
				//读取本地用户的登录状态
				let current = service.Bmob.User.current()
				console.log('用户的登录状态');
				console.log(current);
				if (current === null) {
					service.showMessage('请登录');
					uni.navigateTo({
						url: '../login/login',
					});
					return;
				} else {
					data.orderCreatID = current.objectId;
					data.createNickName = current.nickName;
					var id = service.getId();
					console.log("id==", id);
					var curryLocation=this.location;
					//写入数据库
					const query = service.Bmob.Query('rlfp_order');
					query.set("orderid", id);
					query.set("orderCreatID", data.orderCreatID);
					query.set("area", data.area);
					query.set("orderTitle", data.orderTitle);
					query.set("orderState", data.orderState);
					query.set("orderContext", data.orderContext);
					query.set("TEL", data.tel);
					query.set("Money", data.money);
					query.set("createNickName", data.createNickName);
					query.set("country", curryLocation.country);
					query.set("province", curryLocation.province);
					query.set("city", curryLocation.city);
					query.set("district", curryLocation.district);
					query.set("street", curryLocation.street);
					query.set("streetNum", curryLocation.streetNum);
					query.set("poiName", curryLocation.poiName);
					query.set("cityCode", curryLocation.cityCode);
					query.save().then(res => {
						console.log(res)
					}).catch(err => {
						console.log(err)
					});
					var money = Number(log.state.money) - Number(this.money);
					console.log("data.orderCreatID", data.orderCreatID)
					const query3 = service.Bmob.Query('money');
					query3.find().then(res2 => {
						for (var i = 0; i < res2.length; i++) {
							console.log('res2[i].userId=', res2[i].userId)
							if (res2[i].userId == data.orderCreatID) {
								const query2 = service.Bmob.Query('money');
								query2.get(res2[i].objectId).then(res => {
									res.set('Money', money)
									res.save()
									log.state.money = money;
									console.log("log.state.money=", log.state.money);
								}).catch(err => {
									console.log(err)
								})
							}
						}

					}).catch(err => {

					})


					uni.showToast({
						title: '添加成功！'
					});

					// //app的支付功能
					// uni.requestPayment({
					// 	provider: 'alipay',
					// 	    orderInfo: '3', //微信、支付宝订单数据
					// 	    success: function (res) {
					// 	        console.log('success:' + JSON.stringify(res));
					// 	    },
					// 	    fail: function (err) {
					// 	        console.log('fail:' + JSON.stringify(err));
					// 	    }
					// })


				}

			},
			clear() {
				this.title = '';
				this.creater = '';
				this.state = '';
				this.context = '';
				this.area = '';
				this.tel = '';
				this.money = 0;
			}
		},
		onShow() {
		this.getLoacation();
		
		},
		// onLoad() {
		// 	this.getLoacation();
		// }
	}
</script>

<style>
	input {
		margin-top: 10upx;
	}
</style>
