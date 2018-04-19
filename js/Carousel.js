/*
 * 组件api
 * 1、依赖move.js,要先引入move.js
 * 2、轮播图要有父级，父级需要id
 * 
 */

;(function(window,undefined){
	var Carousel=function(){
		this.settings={
			id:'pic',
			autoPlay:false,
			intervalTime:1000,
			loop:true,
			totalNum:8,
			moveNum:1,
			circle:false,
			moveWay:'opacity'		//运动方式，还有position可选
		};
	};
	
	Carousel.prototype={
		constructor:Carousel,
		init:function(opt){
			var opt=opt || this.settings;
			for(var attr in opt){
				this.settings[attr]=opt[attr];
			}
		},
	};
	
	window.Carousel=Carousel;
})(window,undefined);
