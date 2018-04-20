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
var positionFn=yx.g('#position .center');
positionFn.innerHTML='<a href="#">首页</a> > ';
for (var i=0;i<curData.categoryList.length;i++) {
	positionFn.innerHTML+='<a href="#"> '+curData.categoryList[i].name+'</a> >';
}
positionFn.innerHTML+=' '+curData.name;