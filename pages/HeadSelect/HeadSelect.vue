<template>
	<view >
		<radio-group @change="radioChange">
	          <view class="uni-list">
	              <view  v-for="(value,key) in listData" :key="key" >
	                  <view class="ra">
						  <radio :value="value.id"> <image :src="value.imgPath"></image></radio>
	                  </view>
	              </view>
	          </view>
		</radio-group>
		<button type="primary" style=" margin-left: 20%; margin-bottom: 20rpx;" @click="FinishSelcet">选择完成</button>
	</view>
</template>

<script>
	 var dateUtils = require('../../common/util.js').dateUtils;
	 import log from '../../Global.js'
	 import service from '../../service.js';
	export default {
		data() {
			return {
				listData:[],
				selectid:'',
			}
		},
		methods: {
			radioChange(e){
				console.log(e);
				this.selectid=e.target.value;
				console.log(this.selectid);
				
			},
			FinishSelcet(){
				const query = service.Bmob.Query("userImage");
				query.find().then(res => {
					console.log('res==',res)
					console.log('hskdafjhlks=',log.state.id);
				   for(var i=0;i<res.length;i++){
					   if(res[i].userid==log.state.id){
						   //更新数据库
						   const query2 = service.Bmob.Query('userImage');
						   query2.get(res[i].objectId).then(res2 => {
							var sid=this.selectid+'';
						     res2.set('imageId',sid)
						     res2.save()
							 uni.showToast({
							 	title: '修改图片成功'
							 });
							  uni.navigateBack({
							 	delta: 1
							  });	
						   }).catch(err => {
						     console.log(err)
						   })
						 return;
					   }	   
				   }

				   
				   
				   //添加数据库
				   //写入数据库
				   const query = service.Bmob.Query('userImage');
				   query.set("userid", log.state.id);
				   var imgid=this.selectid+'';
				   query.set("imageId",imgid );
				   query.save().then(res => {
				   uni.showToast({
				   	title: '修改图片成功'
				   });
				    uni.navigateBack({
				   	delta: 1
				    });	
				   }).catch(err => {
				   	console.log(err)
				   });
				});
				
			},
		},
		
		onLoad() {
			for(var i=0;i<21;i++){
				var path="../../static/headImag/"+i+".jpg";
				var img={
					id:i,
					imgPath:path
				}
				this.listData.push(img);
			}

		}
	}
</script>

<style>
	image{

	},
	.ra{
		margin: 20upx;
		width: 80%;
	}

</style>
