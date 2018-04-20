//公用方法调用
yx.public.navFn();
yx.public.lazyLoadFn();
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
