<template>
	<view class="content">
		<view class="input-group">
			<view class="input-row border">
				<text class="title">账号：</text>
				<m-input type="text" focus clearable v-model="account" placeholder="请输入账号"></m-input>
			</view>
			<view class="input-row border">
				<text class="title">电话：</text>
				<m-input type="number" displayable v-model="telphone" placeholder="请输入电话号码"></m-input>
			</view>
			<view class="input-row border">
				<text class="title">密码：</text>
				<m-input type="password" displayable v-model="password" placeholder="请输入密码"></m-input>
			</view>

			<view class="input-row border">
				<text class="title">邮箱：</text>
				<m-input type="text" clearable v-model="email" placeholder="请输入邮箱"></m-input>
			</view>

			<view class="input-row border">
				<text class="title" style=";">身份证号码：</text>
				<m-input type="text" clearable v-model="idcard" placeholder="请输入身份证号码"></m-input>
			</view>
		</view>

		<view class="btn-row">
			<button type="primary" class="primary" @tap="register">注册</button>
		</view>
	</view>
</template>

<script>
	import service from '../../service.js';
	import mInput from '../../components/m-input.vue';

	export default {
		components: {
			mInput
		},
		data() {
			return {
				account: '',
				password: '',
				email: '',
				telphone: '',
				idcard: '',
				objectId: '',
			}
		},
		methods: {
			register() {
				/**
				 * 客户端对账号信息进行一些必要的校验。
				 * 实际开发中，根据业务需要进行处理。
				 */
				if (this.account.length < 5) {
					uni.showToast({
						icon: 'none',
						title: '账号最短为 5 个字符'
					});
					return;
				}
				if (this.telphone.length < 11) {
					uni.showToast({
						icon: 'none',
						title: '电话号码最短11个字符'
					})
				}
				if (this.password.length < 6) {
					uni.showToast({
						icon: 'none',
						title: '密码最短为 6 个字符'
					});
					return;
				}
				if (this.email.length < 3 || !~this.email.indexOf('@')) {
					uni.showToast({
						icon: 'none',
						title: '邮箱地址不合法'
					});
					return;
				}
				if (this.idcard.length < 18) {
					uni.showToast({
						icon: 'none',
						title: '请输入正确的身份证号码'
					});
					return;
				}

				const data = {
					password: this.password,
					username: this.telphone,
					email: this.email,
					phone: this.telphone,
					nickName: this.account,
				}


				service.Bmob.User.register(data).then(res => {

					uni.showToast({
						title: '注册成功'
					});
					this.objectId = res.objectId;
					this.money();
					//  uni.navigateBack({
					// delta: 1
					//  });	

				}).catch(err => {
					console.log(err)
					uni.showToast({
						title: '注册失败' + err.error
					});
				});
			},
			money() {
				const query = service.Bmob.Query('money');
				query.set("userId", this.objectId)
				query.set("Money", 10)
				query.save().then(res2 => {
					console.log("钱注册成功", res2)
				}).catch(err2 => {
					console.log("钱注册失败", err2)
				})
			}
		}
	}
</script>

<style>

</style>
