//公用方法调用
yx.public.navFn();
yx.public.lazyLoadFn();
yx.public.backUp();


var bannerPic=new Carousel();
bannerPic.init({
	id:'bannerPic',
	autoPlay:true,
	intervalTime:1000,
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
	intervalTime:1000,
	loop:false,
	totalNum:8,
	moveNum:4,
	circle:false,
	moveWay:'position'
});