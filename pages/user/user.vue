<template>
	<!--    <view class="content">
        <view class="btn-row">
            <button v-if="!hasLogin" type="primary" class="primary" @tap="bindLogin">登录</button>
            <button v-if="hasLogin" type="default" @tap="bindLogout">退出登录</button>
        </view>
    </view> -->
	<!-- ************************************************************************ -->
	<view class="center">
		<view class="logo" @click="bindLogin" :hover-class="!hasLogin ? 'logo-hover' : ''">
			<image class="logo-img" :src="hasLogin ? avatarUrl :DeavatarUrl"></image>
			<view class="logo-title">
				<text class="uer-name">Hi，{{hasLogin ? uerInfo.name : '您未登录'}}</text>
				<text class="go-login navigat-arrow" v-if="!hasLogin">&#xe65e;</text>
			</view>
		</view>

		<view class="center-list">
			<view class="center-list-item border-bottom">
				<text class="list-icon">&#xe60f;</text>
				<text class="list-text">我的钱包</text>
				<text class="list-text" style="color: red;">{{money}}</text>
				<text class="list-text">元</text>
			</view>
		</view>
		<view class="center-list">
			<view class="center-list-item border-bottom" @click="myOderManager">
				<text class="list-icon">&#xe60f;</text>
				<text class="list-text">我的订单管理</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
			<view class="center-list-item" @click="Do">
				<text class="list-icon">&#xe639;</text>
				<text class="list-text">接收订单任务</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
		</view>
		<view class="center-list">
			<view class="center-list-item border-bottom" @click="help">
				<text class="list-icon">&#xe60b;</text>
				<text class="list-text">帮助与反馈</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
			<view class="center-list-item" @click="server">
				<text class="list-icon">&#xe65f;</text>
				<text class="list-text">服务条款及隐私</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
		</view>
		<view class="center-list">
			<view class="center-list-item" @click="about">
				<text class="list-icon">&#xe614;</text>
				<text class="list-text">关于应用</text>
				<text class="navigat-arrow">&#xe65e;</text>
			</view>
		</view>
		<view class="center-list">
			<view class="center-list-item" @click="bindLogout">
				<text class="list-text" style="color:red">退出登录</text>
			</view>
		</view>
	</view>
</template>

<script>
	import service from '../../service.js';
	import log from '../../Global.js'
	export default {
		data() {
			return {
				hasLogin: false,
				login: false,
				avatarUrl: "../../static/uni-center/logo.png",
				DeavatarUrl:"../../static/uni-center/logo.png",
				uerInfo: {},
				money: 10,
			}
		},
		methods: {
			//------------菜单跳转------------------------------------
			myOderManager() {
				console.log(this.uerInfo)
				if (this.uerInfo == null) return;
				uni.navigateTo({
					url: '../myOrderManager/myOrderManager?id=' + this.uerInfo.id,
				});
			},

			Do() {
				if (this.uerInfo == null) return;
				uni.navigateTo({
					url: '../DoOrderManager/DoOrderManager',
				});
			},
			help() {
				if (this.uerInfo == null) return;
				uni.navigateTo({
					url: '../HelpAndSpend/HelpAndSpend',
				});
			},
			server() {
				if (this.uerInfo == null) return;
				uni.navigateTo({
					url: '../ServiceTitleAndScrite/ServiceTitleAndScrite',
				});
			},
			about() {
				if (this.uerInfo == null) return;
				uni.navigateTo({
					url: '../AboutApp/AboutApp',
				});
			},
			push() {
				this.updatemoney();
				
				const query = service.Bmob.Query("userImage");
					query.find().then(res => {
						console.log(res);
						for(var i=0;i<res.length;i++){
							console.log(res[i].userid)
							console.log(log.state.id);
							if(res[i].userid==log.state.id){
								var path="../../static/headImag/"+res[i].imageId+".jpg";
								this.avatarUrl=path;
								break;
							}
						}
					});
				
				
				
				
				
				
				
				this.hasLogin = log.state.hasLogin;
				this.money = log.state.money;
				if (this.hasLogin) {
					var userInfo = {
						name: '',
						avatarUrl: this.avatarUrl,
						id: '',
					}
					//获取用户当前信息
					let current = service.Bmob.User.current();

					userInfo.name = current.nickName;
					userInfo.id = current.objectId;
					this.uerInfo = userInfo;
				}

			},
			//----------------------------------------------------------
			// ...mapMutations(['logout']),
			bindLogin() {
				if (log.state.hasLogin){
					
					this.changeImg();
					
				}else{
					uni.navigateTo({
						url: '../login/login',
					});
				}

			},
			bindLogout() {
				console.log("退出登录");
				var state = log.state;
				log.logout(state);
				this.push();
			},
			updatemoney() {
				const query3 = service.Bmob.Query('money');
				query3.find().then(res2 => {
					for (var i = 0; i < res2.length; i++) {
						if (res2[i].userId == log.state.id) {
							log.state.money = res2[i].Money;

						}
					}
				}).catch(err => {})
			},
			changeImg(){
				uni.navigateTo({
					url: '../HeadSelect/HeadSelect',
				});
			},
		},
		onPullDownRefresh() {
			this.onLoad();

		},
		onShow() {
			this.push();
		},
		onLoad() {
			this.push();
		},


	}
</script>

<style>
	@font-face {
		font-family: texticons;
		font-weight: normal;
		font-style: normal;
		src: url('https://at.alicdn.com/t/font_984210_5cs13ndgqsn.ttf') format('truetype');
	}

	page,
	view {
		display: flex;
	}

	page {
		background-color: #f8f8f8;
	}

	.center {
		flex-direction: column;
	}

	.logo {
		width: 750upx;
		height: 240upx;
		padding: 20upx;
		box-sizing: border-box;
		background-color: #0F7EFF;
		flex-direction: row;
		align-items: center;
	}

	.logo-hover {
		opacity: 0.8;
	}

	.logo-img {
		width: 150upx;
		height: 150upx;
		border-radius: 150upx;
	}

	.logo-title {
		height: 150upx;
		flex: 1;
		align-items: center;
		justify-content: space-between;
		flex-direction: row;
		margin-left: 20upx;
	}

	.uer-name {
		height: 60upx;
		line-height: 60upx;
		font-size: 38upx;
		color: #FFFFFF;
	}

	.go-login.navigat-arrow {
		font-size: 38upx;
		color: #FFFFFF;
	}

	.login-title {
		height: 150upx;
		align-items: self-start;
		justify-content: center;
		flex-direction: column;
		margin-left: 20upx;
	}

	.center-list {
		background-color: #FFFFFF;
		margin-top: 20upx;
		width: 750upx;
		flex-direction: column;
	}

	.center-list-item {
		height: 90upx;
		width: 750upx;
		box-sizing: border-box;
		flex-direction: row;
		padding: 0upx 20upx;
	}

	.border-bottom {
		border-bottom-width: 1upx;
		border-color: #c8c7cc;
		border-bottom-style: solid;
	}

	.list-icon {
		width: 40upx;
		height: 90upx;
		line-height: 90upx;
		font-size: 34upx;
		/* color: #4cd964; */
		color:#0FAEFF;
		text-align: center;
		font-family: texticons;
		margin-right: 20upx;
	}

	.list-text {
		height: 90upx;
		line-height: 90upx;
		font-size: 34upx;
		color: #555;
		flex: 1;
		text-align: left;
	}

	.navigat-arrow {
		height: 90upx;
		width: 40upx;
		line-height: 90upx;
		font-size: 34upx;
		color: #555;
		text-align: right;
		font-family: texticons;
	}
</style>
