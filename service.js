// 管理账号信息
const USERS_KEY = 'USERS_KEY';
const STATE_KEY = 'STATE_KEY';
const Bmob = require('./static/bmob/Bmob-2.2.0.min.js');
Bmob.initialize("151cdf494bd41eb2","123456");
Bmob.debug(true);
const getUsers = function () {
	//获取用户当前信息
	let current = Bmob.User.current();
    if (current===null) {
		current='[]';
      uni.navigateTo({
          url: '../login/login',
      });
    }
    // return JSON.parse(current);
	return current;
}
const updateOrder=function(objectId,key,value){
	 const query = Bmob.Query('rlfp_order');
	 query.get(objectId).then(res => {
	   console.log('修改数据库成功：',res)
	   res.set(key,value)
	   res.save()
	 }).catch(err => {
	   console.log('修改数据库失败：',err)
	 })
}

const updateUser=function(objectId,key,value){
	 const query = Bmob.Query('_User');
	 query.get(objectId).then(res => {
	   console.log('修改数据库成功：',res)
	   res.set(key,value)
	   res.save()
	 }).catch(err => {
	   console.log('修改数据库失败：',err)
	 })
}



const showMessage=function(mess){
	uni.showToast({
		title:mess
		});
}

const getId=function(){
	//生成id
	//获得系统信息 得到手机型号
	var sys=uni.getSystemInfoSync();
	var brand =sys.brand+'';//手机品牌
	var model=sys.model+'';//手机型号
	var SDKVersion=sys.SDKVersion+'';//客户端基础库版本
	var now=new Date();
	console.log("now==",now);
	var year=now.getFullYear()+'';
	var month=now.getMonth()+'';
	var date=now.getDate()+'';
	var week=now.getDay()+'';//星期
	var hh=now.getHours()+'';
	var mm=now.getMinutes()+'';
	var ss=now.getSeconds()+'';
	var rand=Math.random()*(99999999-1000)+1000;
	var id=SDKVersion+year+ss+model+mm+hh+month+week+date+brand+rand;
	return id;
}





const updateImageId=function(userid){
var imgid=[];
const query = Bmob.Query("userImage");
	query.find().then(res => {
		for(var i=0;i<res.length;i++){
			imgid.push(res);
		}
		this.a.imgid=imgid;
	});
};

const getImagePath=function(userid){
	const query = Bmob.Query("userImage");
		query.find().then(res => {
			for(var i=0;i<res.length;i++){
				if(res[i].userid==userid){
					return "../../static/headImag/"+res[i].imageId+".jpg"
				}
			}
			
		});
}


export default {
	Bmob,
    getUsers,
	showMessage,
	updateOrder,
	getId,
	getImagePath
}
