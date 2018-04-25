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
	cutTime:function(target,begin){
		var v=Math.abs(target - begin);
		
		return {
			d:parseInt(v/(24*3600000)),
			h:parseInt(v%(24*3600000)/3600000),
			m:parseInt(v%(24*3600000)%3600000/60000),
			s:parseInt(v%(24*3600000)%3600000%60000/1000)
		};
	},
	format:function(v){
		return v<10?'0'+v:v;
	},
	formatDate:function(obj){
		var d=new Date(obj);
		return d.getFullYear()+'-'+yx.format(d.getMonth()+1)+'-'+yx.format(d.getDate())+' '+yx.format(d.getHours())+':'+yx.format(d.getMinutes())+':'+yx.format(d.getSeconds());
	},
	parseUrl:function(url){			//解析url
		var reg=/(\w+)=(\w+)/ig;
		var result={};
		url.replace(reg,function(a,b,c){
			result[b]=c;
		});
		
		return result;
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
		shopFn:function(){
			//购物车添加商品展示
			var productNum=0;		//小红点的数量
			(function(local){
				var totalPrice=0;		//所有商品总价
				var ul=yx.g('.cart ul');
				var li='';
				ul.innerHTML='';
				
				for (var i = 0; i < local.length; i++) {
					var attr=local.key(i);
					var value=JSON.parse(local[attr]);
					
					if(value && value.sign=='productLocal'){
						li+='<li data-id="'+value.id+'">'+
								'<a href="#" class="img"><img src="'+value.img+'"/></a>'+
								'<div class="message">'+
									'<p><a href="#">'+value.name+'</a></p>'+
									'<span>'+value.spec.join(' ')+' x '+value.num+'</span>'+
								'</div>'+
								'<div class="price">￥'+value.price+'.00</div>'+
								'<div class="close">×</div>'+
							'</li>';
							
							totalPrice+=value.num*parseFloat(value.price);
					}
				}
				ul.innerHTML=li;
				
				productNum=ul.children.length;
				yx.g('.cartWrap i').innerHTML=productNum;
				yx.g('.cartWrap .total span').innerHTML='￥'+totalPrice+'.00';
				
				//删除功能
				var closeBtns=yx.ga('.cart .list .close');
				for (var i = 0; i < closeBtns.length; i++) {
					closeBtns[i].onclick=function(){
						local.removeItem(this.parentNode.getAttribute('data-id'));
						
						yx.public.shopFn();
						if(ul.children.length==0){
							yx.g('.cart').style.display='none';
						}
					}
				}
				
				//小红点移入移出显示购物车
				var cartWrap=yx.g('.cartWrap');
				var timer;		//给弹出层一个延迟，改善体现
				
					//购物车为0不弹出
				cartWrap.onmouseenter=function(){
					if(ul.children.length>0){
						yx.g('.cart').style.display='block';
						clearTimeout(timer);
						scrollFn();
					}
				};
				cartWrap.onmouseleave=function(){
					timer=setTimeout(function(){
						yx.g('.cart').style.display='none';
					},200)
				};
			
				
			})(localStorage);
			
			
			//购物车功能
			function scrollFn(){
				var contentWarp=yx.g('.cart .list');
				var content=yx.g('.cart .list ul');
				var scrollBar=yx.g('.cart .scrollBar');
				var slide=yx.g('.cart .slide');
				var slideWrap=yx.g('.cart .slideWrap');
				var btns=yx.ga('.scrollBar span');
				var timer;
				
				//设置倍数
				var beishu=content.offsetHeight/contentWarp.offsetHeight;
				//撑不满不显示滚动条
				scrollBar.style.display=beishu<=1?'none':'block';
				if(beishu>20){
					beishu=20;
				}
				slide.style.height=slideWrap.offsetHeight/beishu+'px';
				
				var scrollTop=0;
				var maxHeight=slideWrap.offsetHeight-slide.offsetHeight;
				
				slide.onmousedown=function(ev){
					var disY=ev.clientY-slide.offsetTop;
					
					document.onmousemove=function(ev){
						scrollTop=ev.clientY-disY;
						scroll();
					};
					document.onmouseup=function(){
						this.onmousemove=null;
						ev.cancelBubble=true;
						return false;
					}
				};
				
				function scroll(){
					if(scrollTop<0){
						scrollTop=0;
					}else if(scrollTop>maxHeight){
						scrollTop=maxHeight;
					}
					
					var scaleY=scrollTop/maxHeight;
					
					slide.style.top=scrollTop+'px';
					content.style.top=-scaleY*(content.offsetHeight-contentWarp.offsetHeight)+'px';
				};
				
				//滚轮滚动功能
				myScroll(contentWarp,function(){
					scrollTop-=10;
					scroll();
					
					clearInterval(timer);
				},function(){
					scrollTop+=10;
					scroll();
					
					clearInterval(timer);
				});
				
				//滚轮事件
				function myScroll(obj,fnUp,fnDown){
					obj.onmousewheel=fn;
					obj.addEventListener('DOMMouseScroll',fn);
					function fn(ev){
						if(ev.wheelDelta>0 || ev.detail<0){
							fnUp.call(obj);
						}else{
							fnDown.call(obj);
						}
						
						ev.preventDefault();
						return false;
					}
				}
				
				//上下按钮
				for (var i = 0; i < btns.length; i++) {
					btns[i].index=i;
					btns[i].onmousedown=function(){
						var n=this.index;
						
						timer=setInterval(function(){
							scrollTop=n?scrollTop+5:scrollTop-5;
							scroll();
						},16)
					}
					btns[i].onmouseup=function(){
						clearInterval(timer);
					}
				}
				
				//上下区域点击功能
				slideWrap.onmousedown=function(ev){
					timer=setInterval(function(){
						var slideTop=slide.getBoundingClientRect().top+slide.offsetHeight/2;
						
						if(ev.clientY<slideTop){
							scrollTop-=5;
						}else{
							scrollTop+=5;
						}
						
						if(Math.abs(ev.clientY-slideTop)<=5){
							clearInterval(timer);
						}
						
						scroll();
					},16)
				}
				slideWrap.onmouseup=function(){
					clearInterval(timer);
				}
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
