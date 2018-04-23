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

