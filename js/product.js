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
})();
