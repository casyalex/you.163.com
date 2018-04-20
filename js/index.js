//公用方法调用
yx.public.navFn();
//懒加载最好放到最后
yx.public.backUp();

//大banner轮播
var bannerPic=new Carousel();
bannerPic.init({
	id:'bannerPic',
	autoPlay:true,
	intervalTime:1500,
	loop:true,
	totalNum:5,
	moveNum:1,
	circle:true,
	moveWay:'opacity'
});

//新品轮播
var newProduct=new Carousel();
newProduct.init({
	id:'newProduct',
	autoPlay:true,
	intervalTime:2000,
	loop:true,
	totalNum:8,
	moveNum:4,
	circle:true,
	moveWay:'position'
});

//直接操作DOM添加行内样式会直接覆盖CSS，导致hover不起作用。
//解决办法：改为通过操作className的方式，通过css去改变。

newProduct.on('rightEnd',function(){
	this.nextBtn.style.background='#E7E2D7';
});
newProduct.on('leftEnd',function(){
	this.prevBtn.style.background='#E7E2D7';
});
newProduct.on('rightClick',function(){
	this.prevBtn.style.background='#D0C4AF';
});
newProduct.on('leftClick',function(){
	this.nextBtn.style.background='#D0C4AF';
});

//人气推荐选项卡
;(function(window,undefined){
	var titles=yx.ga("#recommend header li");
	var contents=yx.ga("#recommend .content");
	
	for (var i=0;i<titles.length;i++) {
		titles[i].index=i;
		titles[i].onclick=function(){
			for (var i=0;i<titles.length;i++) {
				titles[i].className='';
				contents[i].style.display='none';
			}
			titles[this.index].className='active';
			contents[this.index].style.display='block';
		}
	}
})(window,undefined);


//x限时购
;(function(window,undefined){
	var timeBox=yx.g('#limit .timeBox');
	var spans=yx.ga('#limit .timeBox span');
	var timer=setInterval(countDown,1000);
	var curTime=json_promotion.currentTime;
	var endTime=json_promotion.startTime;
	//倒计时
	function countDown(){
		if(curTime<endTime){		//如果当前地事件没有超过结束地时间才倒数
			var overTime=yx.cutTime(endTime,curTime);
			spans[0].innerHTML=yx.format(overTime.h);
			spans[1].innerHTML=yx.format(overTime.m);
			spans[2].innerHTML=yx.format(overTime.s);
			curTime=curTime+1000;
		}else{
			clearInterval(timer);
		}
	}
	
	//商品数据
	var boxWrap=yx.g('#limit .boxWrap');
	var str='';
	var item=json_promotion.itemList;
	
	for (var i=0;i<item.length;i++) {
		str+='<div class="limitBox clearfix">'+
						'<a href="#" class="left scaleImg"><img class="original" src="images/empty.gif" data-original="'+item[i].primaryPicUrl+'"/></a>'+
						'<div class="right">'+
							'<a href="#" class="title">'+item[i].itemName+'</a>'+
							'<p>'+item[i].simpleDesc+'</p>'+
							'<div class="numBar clearfix">'+
								'<div class="numCon"><span style="width:'+Number(item[i].currentSellVolume)/Number(item[i].totalSellVolume)*100+'%'+'"></span></div>'+
								'<span class="numTips">'+item[i].currentSellVolume+'</span>'+
							'</div>'+
							'<div>'+
								'<span class="xianshi">限时价</span><span class="fuhao">￥</span><strong>'+item[i].actualPrice+'</strong><span class="yuanjia">原价￥'+item[i].retailPrice+'</span>'+
							'</div>'+
							'<a href="#" class="qianggou">立即抢购</a>'+
						'</div>'+
					'</div>';
	}
	boxWrap.innerHTML=str;
	
})(window,undefined)


//大家都在说轮播图
var say=new Carousel();
say.init({
	id:'sayPic',
	autoPlay:true,
	intervalTime:1700,
	loop:true,
	totalNum:4,
	moveNum:1,
	circle:true,
	moveWay:'position'
});


yx.public.lazyLoadFn();