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
			var self=this;
			this.box=document.getElementById(this.settings.id);
			//创建上下按钮
			this.prevBtn=document.createElement('div');
			this.prevBtn.className='prev';
			this.prevBtn.innerHTML='<';
			this.prevBtn.onclick=function(){
				self.prev();
				self.trigger('leftClick');
			};
			this.box.appendChild(this.prevBtn);
			
			this.nextBtn=document.createElement('div');
			this.nextBtn.className='next';
			this.nextBtn.innerHTML='>';
			this.nextBtn.onclick=function(){
				self.next();
				self.trigger('rightClick');
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
						self.cn=this.index;
						self[self.settings.moveWay+'Fn']();
					};
					
					this.circleWrap.appendChild(span);
					this.circles.push(span);
				}
				
				this.circles[0].className='active';
				
				this.box.appendChild(this.circleWrap);
			}
			
			this.moveInit();
		},
		moveInit:function(){
			this.cn=0;			//当前的索引
			this.ln=0;			//上一个索引
			
			this.canClick=true;		//是否可以点击
			this.endNum=this.settings.totalNum/this.settings.moveNum;		//停止条件
			this.opacityItem=this.box.children[0].children;				//运动透明度的元素
			this.positionItemWrap=this.box.children[0].children[0];					//运动位置的元素的父级
			this.positionItem=this.positionItemWrap.children;
			
			switch(this.settings.moveWay){
				case 'opacity':			//透明度变化
					for(var i=0;i<this.opacityItem.length;i++){
						this.opacityItem[i].style.opacity=0;
						this.opacityItem[i].style.transition='.2s opacity';
					}
					
					this.opacityItem[0].style.opacity=1;
					break;
				
				case 'position':		//位置变化
					var leftMargin=parseInt(getComputedStyle(this.positionItem[0]).marginLeft);
					var rightMargin=parseInt(getComputedStyle(this.positionItem[0]).marginRight);
					
					//元素的单独宽度
					this.singleWidth=leftMargin+this.positionItem[0].offsetWidth+rightMargin;
					
					//运动循环与否
					if(this.settings.loop){
						this.positionItemWrap.innerHTML+=this.positionItemWrap.innerHTML;
					}
					
					//设置足够宽
					this.positionItemWrap.style.width=this.singleWidth*this.positionItem.length+'px';
			}
			
			if(this.settings.autoPlay){
				this.autoPlay();
			}
		},
		opacityFn:function(){		//透明度运动
			//边界判断
			if(this.cn<0){
				if(this.settings.loop){
					this.cn=this.endNum-1;
				}else{
					this.cn=0;
					this.canClick=true;
				}
			}
			if(this.cn>this.endNum-1){
				if(this.settings.loop){
					this.cn=0;
				}else{
					this.cn=this.endNum-1;
					this.canClick=true;
				}
			}
			
			
			this.opacityItem[this.ln].style.opacity='0';
			this.circles[this.ln].className='';
			
			this.opacityItem[this.cn].style.opacity='1';
			this.circles[this.cn].className='active';
			
			var self=this;
			
			var en=0;
			this.opacityItem[this.cn].addEventListener('transitionend',function(){		//transitionEnd会多次触发
				en++;
				if(en==1){
					self.canClick=true;
					self.ln=self.cn;
				}
				
				self.endFn();
			})
		},
		positionFn:function(){
			if(this.settings.circle){
				this.circles[this.ln].className='';
				this.circles[this.cn].className='active';
			}
			
			//边界判断
			if(this.cn<0){
				if(this.settings.loop){
					//循环
					this.positionItemWrap.style.left=-(this.positionItemWrap.offsetWidth/2)+'px';
					this.cn=this.endNum-1;
				}else{
					this.cn=0;
					this.canClick=true;
				}
			}
			if(this.cn>this.endNum-1 && !this.settings.loop){
				this.cn=this.endNum-1;
			}
			//边界判断over
			
			var self=this;
			//运动
			move(this.positionItemWrap,{left:-this.cn*this.singleWidth*this.settings.moveNum},300,'linear',function(){
				if(self.cn==self.endNum){
					//这个条件成立，说明现在已经到了第二份的第一屏了
					this.style.left=0;
					self.cn=0;
				}
				
				self.endFn();
				
				self.canClick=true;
				self.ln=self.cn;
			})
		},
		prev:function(){		//上一个 点击
			if(!this.canClick){
				return;
			}
			this.canClick=false;
			
			this.cn--;
			this[this.settings.moveWay+'Fn']();
		},
		next:function(){		//下一个 点击
			if(!this.canClick){
				return;
			}
			this.canClick=false;
			
			this.cn++;
			this[this.settings.moveWay+'Fn']();
		},
		autoPlay:function(){
			var self=this;
			this.timer=setInterval(function(){
				self.next();
			},this.settings.intervalTime);
			
			//鼠标放上去的时候停止
			this.box.onmouseenter=function(){
				clearInterval(self.timer);
				self.timer=null;
			};
			this.box.onmouseleave=function(){
				self.autoPlay();
			}
		},
		on:function(type,listener){		//添加自定义事件
			this.events=this.events||{};
			this.events[type]=this.events[type]||[];
			this.events[type].push(listener);
		},
		trigger:function(type){
			if(this.events && this.events[type]){
				for (var i=0;i<this.events[type].length;i++) {
					this.events[type][i].call(this);
				}
			}
		},
		endFn:function(){
			if(!this.settings.loop){
				if(this.cn==0){
					this.trigger('leftEnd');
				}
				if(this.cn==this.endNum-1){
					this.trigger('rightEnd');
				}
			}
		}
	};
	
	window.Carousel=Carousel;
})(window,undefined);
