<template>
    <view class="content">
        <view class="input-group">
            <view class="input-row border">
                <text class="title" style="color: red;">标题：</text>
                <m-input type="text"  v-model="title"></m-input>
            </view>
			 <view class="input-row border">
			    <text class="title">微信：</text>
			    <input type="text"  v-model="wx"></m-input>
			</view>
			<view class="input-row border">
			    <text class="title">电话：</text>
			    <input type="text"  v-model="tel"></input>
			</view>
			<view class="input-row border">
			    <text class="title">QQ：</text>
			    <input type="text"  v-model="qq"></input>
			</view>
            <view class="input-row border">
                <text class="title" style="color: red;">内容：</text>
                <textarea type="text" maxlength="-1" v-model="context"></textarea>
            </view>
			
        </view>
        <view class="btn-row">
			 <button type="primary" style="margin-bottom: 20rpx;" @tap="clear">重置反馈</button>
            <button type="primary" class="primary" @tap="addOrder">发送反馈</button>
        </view>
    </view>
</template>

<script>
	  import mInput from '../../components/m-input.vue';
	  import service from '../../service.js';
	  import log from'../../Global.js'
	export default {
		components: {
		    mInput
		},
		data() {
			return {
				title:'',  //创建的标题
				context:'',
				qq:'',
				wx:'',
				tel:''
			}
		},
		methods: {

			addOrder(){
			
			const data={
					qq:this.qq,
					Title:this.title,
					Context:this.context,
					wx:this.wx+'',
					tel:this.tel+'',
				};
					//写入数据库
					const query = service.Bmob.Query('help');
					query.set("wx",data.wx);
					query.set("qq",data.qq);
					query.set("title",data.Title);
					query.set("context",data.Context);
					query.set("tel",data.tel);
					query.save().then(res => {
						uni.showToast({
							title: '我们收到你的反馈！'
						});
					  console.log(res)
					}).catch(err => {
					  console.log(err)
					})

			},
			clear(){
				this.title=''; //创建的标题
				this.context='';
				this.qq='';
				this.wx='';
				this.tel='';
			}
		}
	}
</script>

<style>
	input{
		margin-top:10upx;
	}

</style>
