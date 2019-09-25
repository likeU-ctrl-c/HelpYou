<template>
	<view class="content">
		<view class="hello">
			<view>
				<view class="uni-list">
					<view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(value,key) in listData" :key="key" @click="goDetail(value)">
						<view class="uni-media-list">
							<image class="uni-media-list-logo" :src="value.imgId"></image>
							<view class="uni-media-list-body">
								<view class="uni-media-list-text-top">{{value.orderTitle}}</view>
								<view class="uni-media-list-text-bottom">
									<text>{{value.createNickName}}</text>
									<text>{{value.updatedAt}}</text>
								</view>
							</view>
						</view>
					</view>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	import service from '../../service.js';
	import log from '../../Global.js'
	var dateUtils = require('../../common/util.js').dateUtils;


	export default {

		data() {
			return {
				userName: '',
				hasLogin: false,
				banner: {},
				listData: [],
				last_id: "",
				reload: false
			}
		},
		methods: {
			push() {
				this.getList();

			},
			getList() {
				
				//数据库查询
				const query = service.Bmob.Query("rlfp_order");
				query.find().then(res => {
					let list = res;
					let list2 = []; //排除其他的数据。
					list.forEach(item => {
						if (item.orderDoID == log.state.id) {
							
									const query5 = service.Bmob.Query("userImage");
										query5.find().then(res5 => {
											for(var i=0;i<res5.length;i++){
												if(res5[i].userid==item.orderCreatID){
													item.imgId= "../../static/headImag/"+res5[i].imageId+".jpg"
												}
											}
											list2.push(item)
											this.listData=list2;
							});
						}
					});
					this.last_id = list[list.length - 1].id;
					this.reload = false;
				}).catch(err => {
					console.log('数据库错误=', err)
				});
			},
			goDetail: function(e) {
				uni.navigateTo({
					url: "../orderDetail/orderDetail?objectid=" + e.objectId,
				})
			},
			setTime: function(items) {
				var newItems = [];
				items.forEach((e) => {
					newItems.push({
						author_name: e.author_name,
						cover: e.cover,
						id: e.id,
						post_id: e.post_id,
						published_at: dateUtils.format(e.published_at),
						title: e.title
					});
				});
				return newItems;
			}
		},
		onShow() {
			this.getList();
		},
		onPullDownRefresh() {
			// this.getList();
		},
		onReachBottom() {
			// this.getList();
		},
		onBackPress() {
			// this.getList();
		},
		onLoad() {
			this.push();
		},
	}
</script>

<style>
	.hello {
		display: flex;
		flex: 1;
		flex-direction: column;
	}

	.title {
		color: #8f8f94;
		margin-top: 50upx;
	}

	.ul {
		font-size: 30upx;
		color: #8f8f94;
		margin-top: 50upx;
	}

	.ul>view {
		line-height: 50upx;
	}

	/* ******************** */
	.banner {
		height: 360upx;
		overflow: hidden;
		position: relative;
		background-color: #ccc;
	}

	.banner-img {
		width: 100%;
	}

	.banner-title {
		max-height: 84upx;
		overflow: hidden;
		position: absolute;
		left: 30upx;
		bottom: 30upx;
		width: 90%;
		font-size: 32upx;
		font-weight: 400;
		line-height: 42upx;
		color: white;
		z-index: 11;
	}

	.uni-list {
		background-color: #FFFFFF;
		position: relative;
		width: 100%;
		display: flex;
		flex-direction: column;
	}

	.uni-list:after {
		position: absolute;
		z-index: 10;
		right: 0;
		bottom: 0;
		left: 0;
		height: 1px;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}

	.uni-list::before {
		position: absolute;
		z-index: 10;
		right: 0;
		top: 0;
		left: 0;
		height: 1px;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}

	.uni-list-cell {
		position: relative;
		display: flex;
		flex-direction: row;
		justify-content: space-between;
		align-items: center;
	}

	.uni-list-cell-hover {
		background-color: #eee;
	}

	.uni-list-cell::after {
		position: absolute;
		z-index: 3;
		right: 0;
		bottom: 0;
		left: 30upx;
		height: 1px;
		content: '';
		-webkit-transform: scaleY(.5);
		transform: scaleY(.5);
		background-color: #c8c7cc;
	}

	.uni-list .uni-list-cell:last-child::after {
		height: 0upx;
	}

	/* 图文列表 */
	.uni-media-list {
		padding: 22upx 30upx;
		box-sizing: border-box;
		display: flex;
		width: 100%;
		flex-direction: row;
	}

	.uni-navigate-right.uni-media-list {
		padding-right: 74upx;
	}

	.uni-pull-right {
		flex-direction: row-reverse;
	}

	.uni-pull-right>.uni-media-list-logo {
		margin-right: 0upx;
		margin-left: 20upx;
	}

	.uni-media-list-logo image {
		height: 100%;
		width: 100%;
	}


	.uni-media-list-text-bottom {
		width: 100%;
		line-height: 30upx;
		font-size: 26upx;
		color: #8f8f94;
	}

	.uni-media-list-logo {
		width: 180upx;
		height: 140upx;
		margin-right: 20upx;
	}

	.uni-media-list-body {
		display: flex;
		flex: 1;
		flex-direction: column;
		justify-content: space-between;
		align-items: flex-start;
		overflow: hidden;
		height: auto;
	}

	.uni-media-list-text-top {
		width: 100%;
		line-height: 36upx;
		font-size: 30upx;
		height: 74upx;
		font-size: 28upx;
		overflow: hidden;
	}

	.uni-media-list-text-bottom {
		display: flex;
		flex-direction: row;
		justify-content: space-between;
	}
</style>
