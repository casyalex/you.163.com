//公用方法调用
yx.public.navFn();
yx.public.lazyLoadFn();
yx.public.backUp();


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

var newProduct=new Carousel();
newProduct.init({
	id:'newProduct',
	autoPlay:true,
	intervalTime:2000,
	loop:true,
	totalNum:8,
	moveNum:4,
	circle:false,
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
