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
	public:{
		navFn:function(){
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
			
			
		}
	}
}