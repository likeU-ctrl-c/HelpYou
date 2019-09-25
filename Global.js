const state = {
	/**
	 * 是否需要强制登录
	 */
	forcedLogin: true,
	hasLogin: false,
	userName: "",
	id: '',
	money: 0,
	img:[],
	location:{
		"country": 'aa',
		"province": 'aa',
		"city": 'aa',
		"district":'aa',
		"street": 'aa',
		"streetNum": 'aa',
		"poiName": 'aa',
		"cityCode": 'aa'
	},
};

const getLocation=function(){
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
						// return curryLocation;
		},
		fail:function(res) {
			console.log("调用接口失败：+",res);
		},
		complete:function(res){
			console.log("调用接口结束",res);
			// return this.location;
		},
		
	});
	
};



const login = function(state, userName, id, money) {
	state.userName = userName || '新用户';
	state.id = id;
	state.hasLogin = true;
	state.money = money
};
const logout = function(state) {
	state.userName = "";
	state.hasLogin = false;
	state.id = ''
	state.money = 0;
};


export default {
	state,
	login,
	logout,
	getLocation,
}
