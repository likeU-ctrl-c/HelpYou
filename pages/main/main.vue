<template>
	<!-- <uni-nav-bar lift-icon="back" left-text="返回" right-text="菜单" title="导航栏组件"> -->

    <view class="content">	
	  <!-- 显示区域范围  默认全部显示-->
	<view>
		
		<view class="uni-list-cell-db">
		<picker mode="selector" @change="bindPickChange" :value="index" :range="array">
			<view class="uni-input">当前选择:{{array[index]}}</view>
		</picker>
		 </view>
	</view>
		<!-- <view >
			<button @click="push">刷新</button>
		</view> -->
        <view v-if="hasLogin" class="hello">
            <view style='color:#4CD964;'>
                您好 {{userName}}，您已成功登录。
            </view>
			
          <view>
             <!-- <view class="banner" @click="goDetail(banner)">
                  <image class="banner-img" :src="banner.cover"></image>
                  <view class="banner-title">{{banner.title}}</view>
              </view> -->
              <view class="uni-list">
                  <view class="uni-list-cell" hover-class="uni-list-cell-hover" v-for="(value,key) in listData" :key="key"
                      @click="goDetail(value)">
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
        <view v-if="!hasLogin" class="hello">
            <view class="title">
                您好 游客。
            </view>
            <view class="ul">
                <view>在 “我的” 中点击 “登录” 可以 “登录您的账户”</view>
            </view>
        </view>
    </view>
</template>

<script>
	 import service from '../../service.js';
	 import log from'../../Global.js'
	 var dateUtils = require('../../common/util.js').dateUtils;
    // import {
    //     mapState
    // } from 'vuex'

    export default {
        // computed: mapState(['forcedLogin', 'hasLogin', 'userName']),
		data(){
			return{
				array:['全部','全城','全县/区','附近'],
				index:0,
				userName:'',
				hasLogin:false,
				banner: {},
				listData: [],
				allList:[],
				last_id: "",
				reload: false
			}
		},
		methods:{
			push( ){
				this.hasLogin=log.state.hasLogin;
					this.userName=log.state.userName;
					console.log(log.state.hasLogin);
				    if (!this.hasLogin) {
				        uni.showModal({
				            title: '未登录',
				            content: '您未登录，需要登录后才能继续',
				            /**
				             * 如果需要强制登录，不显示取消按钮
				             */
				            showCancel: this.forcedLogin,
				            success: (res) => {
				                if (res.confirm) {
									/**
									 * 如果需要强制登录，使用reLaunch方式
									 */
				                    if (this.forcedLogin) {
				                        uni.reLaunch({
				                            url: '../login/login'
				                        });
				                    } else {
				                        uni.navigateTo({
				                            url: '../login/login'
				                        });
				                    }
				                }
				            }
				        });
				    }
					else{
						this.getBanner();
						this.getList();
					}
			},
			bindPickChange(e){		
				this.index=e.detail.value;
				var list = this.allList;
				var location=log.location();
				//全部
				if(this.index==0){this.listData=this.allList;
				return;
				}
				//全城
				if(this.index==1){
					var currylist=[];
					for(var i=0;i<list.length;i++){
						if(list[i].city==location.city){
							currylist.push(list[i]);
						}
					}
					this.listData=currylist;
					return;
				}
				//全区
				if(this.index==2){
					var currylist=[];
					for(var i=0;i<list.length;i++){
						if(list[i].district==location.district){
							currylist.push(list[i]);
						}
					}
					this.listData=currylist;
					return;
				}
				//附近
				if(this.index==3){
					var currylist=[];
					for(var i=0;i<list.length;i++){
						if(list[i].street==location.street){
							currylist.push(list[i]);
						}
					}
					this.listData=currylist;
					return;
				}
			},
			getBanner() {
			    let data = {
			        column: "id,post_id,title,author_name,cover,published_at" //需要的字段名
			    };
			    // uni.request({
			    //     url: 'https://unidemo.dcloud.net.cn/api/banner/36kr',
			    //     data: data,
			    //     success: (data) => {
			    //         uni.stopPullDownRefresh();
			    //         if (data.statusCode == 200) {
			    //             this.banner = data.data;
							// console.log('this.banner==',this.banner);
			    //         }
			    //     },
			    //     fail: (data, code) => {
			    //         console.log('fail' + JSON.stringify(data));
			    //     }
			    // })
			},
			getList() {
			    var data = {
			        column: "id,post_id,title,author_name,cover,published_at" //需要的字段名
			    };
			    if (this.last_id) { //说明已有数据，目前处于上拉加载
			        data.minId = this.last_id;
			        data.time = new Date().getTime() + "";
			        data.pageSize = 10;
			    }
				//数据库查询
				const query = service.Bmob.Query("rlfp_order");
				// query.equalTo("TEL", "!=", "1234465465");
				// query.equalTo('orderState','==','创建');
				query.find().then(res => {
				    console.log('首页数据库的数据：=',res)
					let list=res;
					// this.listData = this.reload ? list : this.listData.concat(list);
					let list2=[];//排除其他的数据。
					list.forEach(item=>{
						if(item.orderState=='创建'){
							const query5 = service.Bmob.Query("userImage");
								query5.find().then(res5 => {
									for(var i=0;i<res5.length;i++){
										if(res5[i].userid==item.orderCreatID){
											item.imgId= "../../static/headImag/"+res5[i].imageId+".jpg"
										}
									}
									list2.push(item);
									this.listData=list2;
									this.allList=list2;
								});
							
							}
					});
					
					
					
					this.last_id = list[list.length - 1].id;
					this.reload = false;
				}).catch(err=>{
					console.log('数据库错误=',err)
				});
				//新闻的列表
			    // uni.request({
			    //     url: 'https://unidemo.dcloud.net.cn/api/news',
			    //     data: data,
			    //     success: (data) => {
			    //         if (data.statusCode == 200) {
			    //             let list = this.setTime(data.data);
			    //         }
			    //     },
			    //     fail: (data, code) => {
			    //         console.log('fail' + JSON.stringify(data));
			    //     }
			    // })
			},
			goDetail: function(e) {
				// console.log(e);
			  //   let detail = {
					// Money: e.Money,
					// area: e.area,
					// createNickName: e.createNickName,
					// objectId: e.objectId,
					// orderContext: e.orderContext,
					// orderCreatID: e.orderCreatID,
					// orderDoID: e.orderDoID,
					// orderState: e.orderState,
					// orderTitle: e.orderTitle,
					// updatedAt: e.updatedAt,
			  //   }
			    uni.navigateTo({
			        url: "../orderDetail/orderDetail?objectid=" + e.objectId,
					// encodeURIComponent(JSON.stringify( detail)),
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
			log.getLocation();
			this.push();
		},
		onPullDownRefresh() {
			// this.getList();
		    // this.reload = true;
		    // this.last_id = "";
		    // this.getBanner();
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
	.uni-input{
		color: #8f8f94;
		margin-top: 10upx;
	}
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
