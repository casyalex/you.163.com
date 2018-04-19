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
			
			this.creatDom();
		},
		creatDom:function(){
			this.box=document.getElementById(this.settings.id);
			//创建上下按钮
			this.prevBtn=document.createElement('div');
			this.prevBtn.className='prev';
			this.prevBtn.innerHTML='<';
			this.prevBtn.onclick=function(){
				
			};
			this.box.appendChild(this.prevBtn);
			
			this.nextBtn=document.createElement('div');
			this.nextBtn.className='next';
			this.nextBtn.innerHTML='>';
			this.nextBtn.onclick=function(){
				
			};
			this.box.appendChild(this.nextBtn);
			
			//创建圆点
			
			if(this.settings.circle){
				this.circleWrap=document.createElement('div');
				this.circleWrap.className='circle';
				this.circles=[];		//后面需要修改远点的class
				
				for(var i=0;i<this.settings.totalNum/this.settings.moveNum;i++){
					var span=document.createElement("span");
					span.index=i;
					span.onclick=function(){
						
					};
					
					this.circleWrap.appendChild(span);
					this.circles.push(span);
				}
				
				this.circles[0].className='active';
				
				this.box.appendChild(this.circleWrap);
			}
		}
	};
	
	window.Carousel=Carousel;
})(window,undefined);
