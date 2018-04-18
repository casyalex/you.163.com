window.yx={
	g:function(name){
		return document.querySelector(name);
	},
	ga:function(name){
		return document.querySelectorAll(name);
	},
	addEvent:function(obj,ev,fn){
		if(obj.addEventListener){
			obj.addEventListener(ev,fn);
		}else{
			obj.attachEvent('on'+ev,fn);
		}
	},
	removeEvent:function(obj,ev,fn){
		if(obj.removeEventListener){
			obj.removeEventListener(ev,fn);
		}else{
			obj.detachEvent('on'+ev,fn);
		}
	},
	getTopValue:function(obj){		//获取元素离html距离
		var top=0;
		while(obj.offsetParent){
			top+=obj.offsetTop;
			obj=obj.offsetParent;
		}
		
		return top;
	},
	public:{
		navFn:function(){		//吸顶导航
			var nav=yx.g('.nav');
			var lis=yx.ga(".navbar>li");
			var subnav=yx.g('.subnav');
			var uls=yx.ga('.subnav ul');
			
			var newLis=[];			//存储实际有用的li
			
			//首页与后3个li不需要
			for (var i=1;i<lis.length-3;i++) {
				newLis.push(lis[i]);
			}
			for (var i=0;i<newLis.length;i++) {
				newLis[i].index=uls[i].index=i;
				newLis[i].onmouseenter=uls[i].onmouseenter=function(){
					newLis[this.index].className="active";
					subnav.style.opacity='1';
					uls[this.index].style.display="block";
				};
				newLis[i].onmouseleave=uls[i].onmouseleave=function(){
					newLis[this.index].className="";
					subnav.style.opacity='0';
					uls[this.index].style.display="none";
				}
				
			}
			
			yx.addEvent(window,'scroll',setNavPos);
			setNavPos();
			function setNavPos(){
				nav.id=window.pageYOffset>nav.offsetTop?"navFix":"";
			}
		},
		lazyLoadFn:function(){		//图片懒加载
			yx.addEvent(window,'scroll',delayImg);
			delayImg();
			function delayImg(){
				var originals=yx.ga(".original");	//获取所有懒加载图片
				var scrollTop=window.innerHeight+window.pageYOffset;
				
				for (var i=0;i<originals.length;i++) {
					if(yx.getTopValue(originals[i])<scrollTop){
						originals[i].src=originals[i].getAttribute("data-original");
						originals[i].removeAttribute("class");
					}
				}
				
				if(originals[originals.length-1].getAttribute("src")!="images/empty.gif"){
					yx.removeEvent(window,"scroll",delayImg);
				}
			}
		},
		backUp:function(){		//回到顶部
			var back=yx.g('.back');
			var timer;
			back.onclick=function(){
				var top=window.pageYOffset;
				timer=setInterval(function(){
					top-=100;
					if(top<=0){
						top=0;
						clearInterval(timer);
					}
					window.scrollTo(0,top);
				},16);
			}
		}
	}
}
