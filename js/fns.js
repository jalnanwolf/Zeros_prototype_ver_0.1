var __data = ["pose1","pose2","pose3","pose4"];
var __suburl = "thumbnail/";
var __format = ".png";
var __src = ['src/newconi002.dae','src/coni_light02.dae','src/futurgo.dae','src/ltg_rig011_mayaskin_fixed.dae'];
var __result = "";

function ObjectSearch(text){
	if(text.length > 0){
		$('#resultList').html('<div id="result"></div>');
		var str = 0;
		for(var i=0; i < __data.length; i++){
			if(__data[i].indexOf(text) != -1){
				str = str + 1 ;
				$('#result').html(str+'개의 검색결과');
				var url = __suburl + __data[i] + __format;
				console.log("url="+url);
				ResultListView(__data[i],url,__src[i]);
			}
		}
		if (str > 0){
			$('#resultList').css({'position':'absolute','top':'10%','left':'10%','z-index':'9999','padding':'5px','background-color':'#F1F1F1','display':'inline','width':'810px'});
		} 
	} else {
		$('#resultList').css({'display':'none'});
	}	
}


function ResultListView(id,url,src){
	$('#resultList').append('<div id="resultList'+id+'"></div>');
	var str = '<img src="'+url+'" height="300px">';
	$('#resultList'+id+'').css({'float':'left','margin':'5px'});
	$('#resultList'+id+'').html(str);
	$('#resultList'+id+'').click(function(){
		$('#resultList').css({'display':'none'});
		$('#search').toggle();
		srcLoader(src);
	});
}