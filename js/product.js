//公用方法调用
yx.public.navFn();
yx.public.backUp();


//解析url
var params=yx.parseUrl(window.location.href);
var pageId=params.id;			//产品对应的ID
var curData=productList[pageId];		//产品对应的数据
if(!pageId || !curData){
	//404页面
	window.location.href='404.html';
}

//面包屑的功能
;(function(){
	var positionFn=yx.g('#position .center');
	positionFn.innerHTML='<a href="#">首页</a> > ';
	for (var i=0;i<curData.categoryList.length;i++) {
		positionFn.innerHTML+='<a href="#"> '+curData.categoryList[i].name+'</a> >';
	}
	positionFn.innerHTML+=' '+curData.name;
})();

//产品图功能
(function(){
	var bigImg=yx.g('#productImg .left>img');
	var smallImg=yx.ga('#productImg .smallImg img');
	
	bigImg.src=smallImg[0].src=curData.primaryPicUrl;
	
	for (var i=0;i<smallImg.length;i++) {
		if(i){
			smallImg[i].src=curData.itemDetail['picUrl'+i];
		}
		smallImg[i].onmouseover=function(){
			for (var i=0;i<smallImg.length;i++){
				smallImg[i].className='';
			}
			bigImg.src=this.src;
			this.className='active';
		}
	}
	
	//产品信息导入
	yx.g('#productImg .info h2').innerHTML=curData.name;
	yx.g('#productImg .info p').innerHTML=curData.simpleDesc;
	yx.g('#productImg .info .price').innerHTML='<div><span>售价</span><strong>￥'+curData.retailPrice+'.00'+'</strong></div>'+
					'<div><span>促销</span><a href="'+curData.hdrkDetailVOList[0].huodongUrlPc+'" class="tag">'+curData.hdrkDetailVOList[0].activityType+'</a><a href="'+curData.hdrkDetailVOList[0].huodongUrlPc+'" class="discount">'+curData.hdrkDetailVOList[0].name+'</a></div>'+
					'<div><span>服务</span><a href="#" class="service"><i></i>30天无忧退货<i></i>48小时快速退款<i></i>满88元免邮费<i></i>网易自营品牌</a></div>';
	
	//产品型号导入
	var format=yx.g('#productImg .info .format');
	var dds=[];
	for (var i = 0; i < curData.skuSpecList.length; i++) {
		var dl=document.createElement("dl");
		var dt=document.createElement('dt');
		dt.innerHTML=curData.skuSpecList[i].name;
		dl.appendChild(dt);
		dl.className='clearfix';
		
		for (var j = 0; j < curData.skuSpecList[i].skuSpecValueList.length; j++) {
			var dd=document.createElement("dd");
			dd.innerHTML=curData.skuSpecList[i].skuSpecValueList[j].value;
			dd.setAttribute('data-id',curData.skuSpecList[i].skuSpecValueList[j].id);
			dd.onclick=function(){
				changeProduct.call(this);
			};
			
			dds.push(dd);
			dl.appendChild(dd);
		}
		
		format.appendChild(dl);
	}
	
	function changeProduct(){
		//如果不能点击的话就返回
		if(this.className.indexOf('noClick')!=-1){
			return;
		}
		var curId=this.getAttribute('data-id');
		var othersDd=[];		//对方所有的dd
		var mergeId=[];			//与点击的id组合 查询库存
		
		for(var attr in curData.skuMap){
			if(attr.indexOf(curId)!=-1){
				var otherId=attr.replace(curId,'').replace(';','');
				
				for (var i = 0; i < dds.length; i++) {
					if(dds[i].getAttribute('data-id')==otherId){
						othersDd.push(dds[i]);
					}
				}
				
				mergeId.push(attr);
			}
		}
		var brothers=this.parentNode.querySelectorAll('dd');
		if(this.className.indexOf('active')!=-1){
			this.className='';
			
			for (var i = 0; i < othersDd.length; i++) {
				if(othersDd[i].className=='noClick'){
					othersDd[i].className='';
				}
			}
		}else{
			for (var i = 0; i < brothers.length; i++) {
				if(brothers[i].className.indexOf('active')!=-1){
					brothers[i].className='';
				}
			}
			
			this.className='active';
				
			for (var i = 0; i < othersDd.length; i++) {
				if(othersDd[i].className.indexOf('noClick')!=-1){
					othersDd[i].className='';
				}
				if(curData.skuMap[mergeId[i]].sellVolume==0){
					othersDd[i].className='noClick';
				}
			}
			
		}
		addNum();
	}
	
	//加减功能
	addNum();
	function addNum(){
		var actives=yx.ga('#productImg .info .format .active');
		var btnParent=yx.g('#productImg .info .number div');
		var btns=btnParent.children;
		var ln=curData.skuSpecList.length;
		
		if(actives.length==ln){
			btnParent.className="";
		}else{
			btnParent.className="noClick";
		}
		
		//减
		btns[0].onclick=function(){
			if(btnParent.className){
				return;
			}
			btns[1].value--;
			if(btns[1].value<0){
				btns[1].value=0;
			}
		}
		
		//input
		btns[1].onfocus=function(){
			if(btnParent.className){
				
				//让他失去焦点
				this.blur();
			}
		}
		
		//加
		btns[2].onclick=function(){
			if(btnParent.className){
				return;
			}
			btns[1].value++;
			if(btns[1].value>99){
				btns[1].value=99;
			}
		}
	};
	
})();


//大家都在看
;(function(){
	var ul=yx.g('#look ul')
	var str='';
	for (var i = 0; i < recommendData.length; i++) {
		str+='<li>'+
				'<a href="#"><img src="'+recommendData[i].listPicUrl+'"/></a>'+
				'<a href="#">'+recommendData[i].name+'</a>'+
				'<span>￥'+recommendData[i].retailPrice+'.00</span>'+
			'</li>';
	}
	ul.innerHTML=str;
	
	var alllook=new Carousel();
	alllook.init({
		id:'lookPic',
		autoPlay:false,
		intervalTime:1500,
		loop:true,
		totalNum:8,
		moveNum:4,
		circle:false,
		moveWay:'position'
	});
})();

//详情评价选项卡
(function(){
	var as=yx.ga("#bottom .title a");
	var tabs=yx.ga('#bottom .content>div');
	var ln=0;
	
	for (var i = 0; i < as.length; i++) {
		as[i].index=i;
		as[i].onclick=function(){
			as[ln].className='';
			tabs[ln].style.display='none';
			
			this.className='active';
			tabs[this.index].style.display='block';
			
			ln=this.index;
		}
	}
	
	//详情参数表格
	var table=yx.g('#bottom .content table');
	for(var i=0; i<curData.attrList.length;i++){
		if(i%2==0){
			var tr=document.createElement("tr");
		}
		var td1=document.createElement("td");
		td1.innerHTML=curData.attrList[i].attrName;
		var td2=document.createElement("td");
		td2.innerHTML=curData.attrList[i].attrValue;
		
		tr.appendChild(td1);
		tr.appendChild(td2);
		
		table.appendChild(tr);
	}
	
	//专题图
	var zhuanTi=yx.g('#bottom .content .img');
	zhuanTi.innerHTML=curData.itemDetail.detailHtml;
})();

//评价功能
(function(){
	console.log(commentData);
	
	var evaluateNum=commentData[pageId].data.result.length;		//评价总数
	var evaluateText=evaluateNum>1000?'999+':evaluateNum;
	yx.ga('#bottom .title a')[1].innerHTML='评价<span> ('+evaluateText+')</span>';
	
	var allData=[[],[]];		//第一个全部评价，第二个有图评价
	for (var i = 0; i < evaluateNum; i++) {
		allData[0].push(commentData[pageId].data.result[i]);
		if(commentData[pageId].data.result[i].picList.length){
			allData[1].push(commentData[pageId].data.result[i]);
		}
	}
	yx.ga('#bottom .eTitle span')[0].innerHTML='全部('+allData[0].length+')';
	yx.ga('#bottom .eTitle span')[1].innerHTML='有图('+allData[1].length+')';
	
	var curData=allData[0];		//当前显示数据
	
	var btns=yx.ga('#bottom .eTitle div');
	var ln=0;
	for (var i = 0; i < btns.length; i++) {
		btns[i].index=i;
		btns[i].onclick=function(){
			btns[ln].className='';
			this.className='active';
			
			ln=this.index;
			
			curData=allData[this.index];
			showComment(10,0);
			createPage(10,curData.length);
		}
	}
	
	//显示评价数据
	showComment(10,0);
	function showComment(pn,cn){
		//pn		一页显示几条
		//cn		现在是哪页
		var ul=yx.g('#bottom .border>ul');
		var dataStart=pn*cn;		//起始评价
		var dataEnd=dataStart+pn;		//结束评价
		
		if(dataEnd>curData.length){
			dataEnd=curData.length;
		}
		//主要结构
		var str='';
		ul.innerHTML='';
		for (var i = dataStart; i < dataEnd; i++) {
			var avatart=curData[i].frontUserAvatar?curData[i].frontUserAvatar:'images/avatar.png';		//头像地址
			
			var smallImg='';
			var dialog='';
			if(curData[i].picList.length){
				//这个条件满足，说明这条评论有小图以及轮播图
				var span='';
				var li=''
				for (var j=0;j<curData[i].picList.length;j++) {
					span+='<span><img src="'+curData[i].picList[j]+'" alt="" /></span>';
					li+='<li><img src="'+curData[i].picList[j]+'"/></li>';
				}
				smallImg='<div class="smallImg">'+span+'</div>';
				dialog='<div class="dialog" id="commentImg'+i+'" data-imgnum="'+curData[i].picList.length+'">'+
							'<div class="carouselImgCon">'+
								'<ul>'+li+'</ul>'+
							'</div>'+
							'<div class="close">×</div>'+
						'</div>'
			}
			
			str+='<li>'+
					'<div class="avatar">'+
						'<img src="'+avatart+'"/>'+
						'<a href="#" class="vip1"></a><span>'+curData[i].frontUserName+'</span>'+
					'</div>'+
					'<div class="text">'+
						'<p>'+curData[i].content+'</p>'+
						'<div class="smallImg">'+smallImg+
						'</div>'+
						'<div class="color clearfix">'+
							'<span class="left">'+
								curData[i].skuInfo+
							'</span>'+
							'<span class="right">'+
								yx.formatDate(curData[i].createTime)+
							'</span>'+
						'</div>'+dialog+
						'</div>'+
					'</div>'+
				'</li>';
				
		}
		ul.innerHTML=str;
		
		showImg();
	};
	
	//调用轮播图组件
	function showImg(){
		var spans=yx.ga('#bottom .smallImg span');
		for (var i = 0; i < spans.length; i++) {
			spans[i].onclick=function(){
				var dialog=this.parentNode.parentNode.parentNode.lastElementChild;
				dialog.style.opacity=1;
				dialog.style.height='510px';
				
				var en=0;
				dialog.addEventListener('transitionend',function(){
					en++;
					if(en==1){
						var id=this.id;
						var commentImg=new Carousel();
						commentImg.init({
							id:id,
							autoPlay:false,
							intervalTime:1500,
							loop:false,
							totalNum:dialog.getAttribute('data-imgnum'),
							moveNum:1,
							circle:false,
							moveWay:'position'
						});
					}
				});
				var closeBtn=dialog.querySelector('.close');
				closeBtn.onclick=function(){
					dialog.style.opacity=0;
					dialog.style.height='0px';
				}
			}
		}
	}
	
	//页码功能
	createPage(10,curData.length);
	function createPage(pn,tn){
		//pn		显示页码
		//tn		数据总数
		var page=yx.g('#bottom .page');
		var totalNum=Math.ceil(tn/pn);		//最多能显示的页码数量
		
		//如果用户给的页数比总页数还要大，就改成总数
		if(pn>totalNum){
			pn=totalNum;
		}
		
		page.innerHTML='';
		
		var cn=0;			//页码索引值
		var spans=[];		//把数字的页码都放在一个数组里，其它的地方要用到
		var div=document.createElement("div");
		div.className='mainPage';
		
		//创建页码
		pageFn('首页',function(){
			
		});
		pageFn('上一页',function(){
			
		});
		
		//创建数字页码
		for (var i = 0; i < pn; i++) {
			var span=document.createElement("span");
			span.index=i;
			span.innerHTML=i+1;
			spans.push(span);
			
			//给第1个页码加上class
			span.className=i?'':'active';
			
			span.onclick=function(){
				cn=this.index;
				showComment(10,this.innerHTML-1);
				changePage();
			};
			
			div.appendChild(span);
		}
		page.appendChild(div);
		
		pageFn('下一页',function(){
			
		});
		pageFn('尾页',function(){
			
		});
		//更新页码功能
		function changePage(){
			var cur=spans[cn];		//当前点击的页码
			var curInner=cur.innerHTML;
			
			//用更新后索引的差值做变量更新页码
			var differ=spans[spans.length-1].innerHTML-spans[0].innerHTML;
			
			//点击的是最后的页码
			if(cur.index==spans.length-1){
				if(Number(curInner)+differ>totalNum){
					differ=totalNum-curInner;
				}
			}
			//点击的是最前面地页码
			if(cur.index==0){
				if(Number(curInner)-differ<1){
					differ=Number(curInner)-1;
				}
			}
			for (var i=0;i<spans.length;i++) {
				//点击最后页码，更新所有页码
				if(cur.index==spans.length-1){
					spans[i].innerHTML=Number(spans[i].innerHTML)+differ;
				}
				
				//点击第一个页码
				if(cur.index==0){
					spans[i].innerHTML-=differ;
				}
				
				//设置class
				spans[i].className='';
				if(spans[i].innerHTML==curInner){
					spans[i].className='active';
				}
				
			}
		}
		//页码创建
		function pageFn(inner,fn){
			if(pn<2){
				return;
			}
			
			var span=document.createElement("span");
			span.innerHTML=inner;
			span.onclick=fn;
			page.appendChild(span);
		}
	}
})();
