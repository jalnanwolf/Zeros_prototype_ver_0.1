/**
 * Created by contz on 15. 11. 25..
 */

function checkScene(){
    if(localStorage !== undefined){
        if(localStorage._sceneqty === null){
            localStorage.setItem("_sceneqty", 0);
            var checkScene1 = localStorage._sceneqty;
            console.log('scene'+checkScene1+'checkScene1');
            sceneCreator('new');
        } else {
            var checkScene1 = localStorage._sceneqty;
            console.log('scene'+checkScene1+'checkScene2');
            sceneCreator();
        }
    }else {
        console.log('Sorry! No Web Storage support..');
    }
}


function sceneCreator(num){
    if(num === 'new'){
        var sceneQty = localStorage._sceneqty;
        sceneQty = parseInt(sceneQty) + 1;
        var checkScene1 = localStorage._sceneqty;
        console.log('scene'+checkScene1+'checkScene3');
        localStorage.setItem('_sceneqty',sceneQty);
        $('#sceneList').append('<div id="scene'+sceneQty+'"></div>');
        setScene(sceneQty);
        sceneThumbnailCreator(sceneQty);
    } else {
        var checkScene1 = localStorage._sceneqty;
        console.log('scene'+checkScene1+'checkScene4');
        var sceneqty = localStorage._sceneqty;
        sceneqty = parseInt(sceneqty);
        console.log(sceneqty);
        if (sceneqty > 0) {
            for (var i = 0; i < sceneqty; i++) {
                //console.log(i);
                var num = i + 1;
                var scenenum = '_scene' + num;
                var thumbnail_name = scenenum + '_thumbnail';
                var thumbnail_src = localStorage.getItem(thumbnail_name);
                $('#sceneList').append('<div id="' + scenenum + '"onclick="sceneChanger('+ scenenum +')"><img src="'+thumbnail_src+'" width="240px"></div>');
                if (num === sceneqty) {
                    setViewport(num);
                    setScene(num);
                }
            }
        }

    }
}

function setScene(num){
    localStorage.setItem('nowScene',num);
}

function getScene(){
    var sceneNum = localStorage.nowScene;
    return sceneNum;
}

function sceneThumbnailCreator(num){
    var render = document.querySelector('canvas').toDataURL('image/jpeg');
    $('#scene'+num+'').html('<img src="'+render+'" width="230px">');
    var thumbnailScene = '_scene'+num+'_thumbnail';
    localStorage.setItem(thumbnailScene,render);
}

function setViewport(num){
    console.log('debugging1');
    var objectQty = parseInt(localStorage.getItem('_scene'+num+'_objectQty'));
    if(objectQty > 0) {
        for (var i = 0; i < objectQty; i++) {
            var qty = i + 1;
            var src = localStorage.getItem('_scene' + num + '_object' + qty);
            var url = 'src/' + src;
            var objectPosition = localStorage.getItem('_scene' + num + '_object' + qty + 'position');
            var positionArray = objectPosition.split(',');
            var x = parseFloat(positionArray[0]);
            var y = parseFloat(positionArray[1]);
            var z = parseFloat(positionArray[2]);
            srcLoader(url, x, y, z);
            if (qty = objectQty) {
                setTimeLine(num, qty);
            }
        }
    }
}

function setTimeLine(num,qty){
    var _poseQty = localStorage.getItem('_scene'+num+'_object'+qty+'_poseQty');
    if(_poseQty > 0) {
        for (var i = 0; i < _poseQty; i++) {
            var _num = i + 1;
            var poseThumbnail = localStorage.getItem('_scene' + num + '_object' + qty + '_pose' + _num+'_thumbnail');
            $('#timeLine_object' + qty + '').append('<div id="_scene' + num + '_object' + qty + '_pose' + _num + '" style="margin:5px"><img src="' + poseThumbnail + '" height="130px"></div>');
            if (_num !== _poseQty) {
                var animationTime = localStorage.getItem('_scene' + num + '_object' + qty + '_pose' + _num + '_animationTime' + _num);
                $('#timeLine_object' + qty + '').append('<div id="_scene' + num + '_object' + qty + '_pose' + _num + '_animationTime' + _num + '" style="margin:5px; width="100px" height="130px"><input type="hidden" value="' + animationTime + '"></div>');
            }
        }
    }
}

function sceneChanger(num){
    var nowScene = getScene();
    if(num !== nowScene){
        setScene(num);
        setViewport(num);
    }
}

function addpose(){
    var poseNum = getselectedPoseNum();
    var newPoseNum = parseInt(poseNum) + 1;
    setselectPoseNum(newPoseNum);
    var objectNum = getSelectedObject();
    var str = objectNum+'_poseQty';
    var poseQty = parseInt(getPoseQty(str))+1;
    setPoseQty(str,poseQty);

    var render = document.querySelector('canvas').toDataURL('image/jpeg');
    if(poseNum == 1){
        $('#timeLine').append('<div id="'+objectNum+'_pose' + poseNum + '" style="margin:5px"><img src="' + render + '" height="190px"></div>');
    }
    //var thumbnailPose = objectNum+'_pose' + poseNum + '_thumbnail';
    //localStorage.setItem(thumbnailPose,render);
    /*var __str = '<div>Charater Y position : '+characterY+'<br>';
    var selOb = getSelectedObject();
    var poseNum = getPoseNum();
    var boneQty = localStorage.getItem(selOb+'_boneQty');
    for(var i= 0; i < boneQty; i++){
        var bonePosition = localStorage.getItem(selOb+'_bone'+i+'_pose'+poseNum);
        __str += i+','+bonePosition+'<br>';
    }
    __str += '</div>';
    document.getElementById('showData').innerHTML = __str;
    $('#showData').toggle();*/
}