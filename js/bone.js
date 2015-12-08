/**
 * Created by kyungsu on 2015. 11. 24..
 */

var _bone = [];
var _real_position = [];
var _new_position = null;
var _cx,_cy,_cz;
var _x, _y, _z, _num, _nx, _ny, _nz;
var _length;
var movieData = [];
var mesh;
var timerId1;
var timerId2;
var __dae;
var __characterY = 0;

function saveSkeletonInfo(a,b,c,d){
    var info = {};
    info.name = a;
    info.pos = b;
    info.scl = c;
    info.rotq = d;
    _bone.push(info);

}

function setBoneData(scene_num,object_num,pose_num){
    if(_bone.length > 0){
        localStorage.setItem('_scene'+scene_num+'_object'+object_num+'_boneQty',_bone.length);
        for(var i=0; i < _bone.length; i++){

            var position = _bone[i].rotq;
            //var data = i+position;
            //poserSaver(data);
            localStorage.setItem('_scene'+scene_num+'_object'+object_num+'_bone'+i+'pose'+pose_num,position);
        }
    }
}
function setPoseQty(str,num){
    localStorage.setItem(str,num);
}

function getPoseQty(str){
    var poseQty = localStorage.getItem(str);
    return poseQty;
}

function setselectPoseNum(pose_num){
    localStorage.setItem('nowPoseNum',pose_num);
}

function getselectedPoseNum(){
    var poseNum = localStorage.nowPoseNum;
    return poseNum;
}

function makeSkeletonHandler(){
    var str = '<form id="boneHandler">bone Controller<br><select onchange="numChange(this.value);"><option value="null">select</option>';
    for(var i = 0; i < _bone.length; i++){
        var bone_name = _bone[i].name;
        str += '<option value="'+i+'">'+bone_name+'('+i+')</option>';
    }
    str += '</select><br><input type="text" onchange="xyzChange(this.value);" placeholder="input x or y or z"><br>' +
        '<br>Pose setting<br><input type="text" placeholder="input x" onchange="nxyzChange(\'x\',this.value);" tabindex="1"><br><input type="text" placeholder="input y" onchange="nxyzChange(\'y\',this.value);" tabindex="2"><br><input type="text" placeholder="input z" onchange="nxyzChange(\'z\',this.value);"tabindex="3"><br>' +
        '<input type="button" onclick="poseSetting()" value="Pose Change"><br><input type="text" placeholder="Caracter Y position" onchange="characterYpositionChanger(this.value)" ><br><br><input type="text" placeholder="PoseData" onchange="poserSaver(this.value)"></form> ';
    document.getElementById('skelHandler').innerHTML = str;
}

function numChange(num){
    _num = num;
    getNewPosition(num);
    console.log(_num);
}

function characterYpositionChanger(y){
    __characterY = y;
    characterPositionSet(0,y,0);
}

function xyzChange(v){
    _cx,_cy,_cz = 0;
    if(v === 'x'){_cx = 1};
    if(v === 'y'){_cy = 1};
    if(v === 'z'){_cz = 1};

    //console.log('xyzChange: '+e+'/'+v);
}

function nxyzChange(v,p){
    //_cx,_cy,_cz = 0;
    var _newposition = parseFloat(p);
    if(v === 'x'){_nx = _newposition};
    if(v === 'y'){_ny = _newposition};
    if(v === 'z'){_nz = _newposition};

    //console.log('xyzChange: '+e+'/'+v);
}

function meshSender(_mesh,_dae){
    mesh = _mesh;
    __dae = _dae;
}

/*
function saveSkeletonData(mesh){
    _bone = mesh.skeleton.bones;
    console.log(_bone);
    for(var i = 0; i < _bone.length; i++){
        bone[i] = null;
        movieData = bone[i];
    }
}*/

function characterYsender(characterY){
    __characterY = characterY;
}

function getRealPosition(num){
    //_real_position = new THREE.Vector3();
    _real_position = _bone[num].rotq;
    console.log('real_position: '+_real_position);

    return _real_position;
    //return _real_position;
}

function getNewPosition(num){
    console.log(_new_position);
    _new_position = getRealPosition(num);
    _x = _new_position[0];
    _y = _new_position[1];
    _z = _new_position[2];
    var __d = _new_position[4];
    console.log('new Position : '+_x+','+_y+','+_z);
    mesh.skeleton.bones[num].rotation.set(0,0,0,__d);
    //return _new_position;
}

function checkData(num){
    var check = movieData.bone[num];
    if (check !== null) return true;
}

function skeletonHandler(signal){

    /*var num = document.boneHandler.bone_num.value;
    var x = document.boneHandler.posix.value;
    var y = document.boneHandler.posiy.value;
    var z = document.boneHandler.posiz.value;*/

    var range;

    if(signal === 'plus') {
        range = +0.05;
    } else {
        range = -0.05;
    }

    //_new_position = getNewPosition(_num);


    console.log('skeletonHandler'+_x+'/'+_y+'/'+_z);

    if(_cx === 1){
        _x = _x + range;
        mesh.skeleton.bones[_num].rotation.set(_x,_y,_z);
        saveNewBonePositionData(_x,_y,_z);
    }
    if(_cy === 1){
        _y = _y + range;
        mesh.skeleton.bones[_num].rotation.set(_x,_y,_z);
        saveNewBonePositionData(_x,_y,_z);
    }
    if(_cz === 1){
        _z = _z + range;
        mesh.skeleton.bones[_num].rotation.set(_x,_y,_z);
        saveNewBonePositionData(_x,_y,_z);
    }

    saveSkeletonNewPosition(_num,_x,_y,_z);

}

function saveSkeletonNewPosition(num,x,y,z){
    movieData[num] = x+','+y+','+z;
}

function saveNewBonePositionData(_x,_y,_z){
    var objectNum = getSelectedObject();
    //var poseNum = getPoseNum();
    var newPosition = _x+','+_y+','+_z;
    localStorage.setItem(objectNum+'_bone'+_num+'_pose'+poseNum,newPosition);
}

function showData(){
    var __str = '<div>Charater Y position : '+characterY+'<br>';
    for(var i= 0; i < 78; i++){
        __str += i+','+movieData[i]+')<br>';
    }
    __str += '</div>';
    document.getElementById('showData').innerHTML = __str;
    $('#showData').toggle();
}

function selectObject(scenenum,objectnum){
    localStorage.setItem('objectselected','_scene'+scenenum+'_object'+objectnum);
}

function getSelectedObject(){
    var objectnum = localStorage.objectselected;
    return objectnum;
}

function resetPose(){
    for(var i = 0; i < _bone.length; i++){
        mesh.skeleton.bones[i].rotation.set(0,0,0);
    }
}

function resetPosition(){
    characterPositionSet(0,0,0);
}

function poserSaver(data,poseNum){
    var dataArray = data.split(',');
    var bone = parseInt(dataArray[0]);
    var x = parseFloat(dataArray[1]);
    var y = parseFloat(dataArray[2]);
    var z = parseFloat(dataArray[3]);
    mesh.skeleton.bones[bone].rotation.set(x,y,z);
    var objectNum = getSelectedObject();
    //var poseNum = getselectedPoseNum();
    var newPosition = x+','+y+','+z;
    localStorage.setItem(objectNum+'_bone'+bone+'_pose'+poseNum,newPosition);
    var debugData = localStorage.getItem(objectNum+'_bone'+bone+'_pose'+poseNum);
    //console.log(debugData);
}

function poser(num){

    $('#poseThumbnail').toggle();

 if(num === "a") {
     setBoneData(1, 1, 1);
     var a1 = "0,1.4518347494622603,1.5439166775465225,0.45183474946225943";
     var a2 = "1,-0.10000000000000002,-0.10000000000000002,-0.16868209232737794";
     var a3 = "2,0.09999999999999999,0.09999999999999999,-0.3167256875337818";
     var a4 = "5,-0.004421328216126688,-0.00033245570337699093,-0.1772070741248778";
     var a5 = "10,22.967753966223697,23.86787856312999,11.032246033776518";
     var a6 = "11,-0.24979034540863365,-0.24557115214254766,-0.035298993722112315";
     var a7 = "12,-0.21726381155918617,-0.16691326960536995,0.5672638115591863";
     var a8 = "34,-1.5000000000000007,-1.5000000000000007,-0.8000000000000002";
     var a9 = "35,-0.3385608466388962,-0.13169632727138364,-0.03859275258484925";
     var a10 = "36,6.249999999999987,6.249999999999987,0.3502786265433857";
     var a11 = "57,-3.1499999999999972,0,-1.839259817623033";
     var a12 = "62,-2.9999999999999973,0,-0.6";
     var a13 = "63,-3.284835956605798,0.09107196449115341,0.968853836110647";
     var a14 = "75,0.15000000000000002,0.15000000000000002,0.1986144030103656";
     poserSaver(a1);
     poserSaver(a2);
     poserSaver(a3);
     poserSaver(a4);
     poserSaver(a5);
     poserSaver(a6);
     poserSaver(a7);
     poserSaver(a8);
     poserSaver(a9);
     poserSaver(a10);
     poserSaver(a11);
     poserSaver(a12);
     poserSaver(a13);
     poserSaver(a14);
     //poserSaver(a15);
 }
 if (num === 'b') {
     setBoneData(1, 1, 2);
     var b1 = "0,1.4518347494622603,1.5439166775465225,0.45183474946225943";
     var b2 = "1,-0.10000000000000002,-0.10000000000000002,-0.16868209232737794";
     var b3 = "2,0.09999999999999999,0.09999999999999999,-0.3167256875337818";
     var b4 = "5,-0.004421328216126688,-0.00033245570337699093,-0.1772070741248778";
     var b5 = "10,22.967753966223697,23.86787856312999,11.032246033776518";
     var b6 = "11,-0.24979034540863365,-0.24557115214254766,-0.035298993722112315";
     var b7 = "12,-0.21726381155918617,-0.16691326960536995,0.5672638115591863";
     var b8 = "34,-1.5000000000000007,-1.5000000000000007,-0.8000000000000002";
     var b9 = "35,-0.3385608466388962,-0.13169632727138364,-0.03859275258484925";
     var b10 = "57,3.1999999999999966,0,-2.439259817623032";
     var b11 = "58,3.149999999999997,0,7.149999999999983";
     var b12 = "62,9.299999999999997,0,7.299999999999982";
     var b13 = "63,3.1651640433941965,0.09107196449115341,1.9188538361106477";
     var b14 = "75,-0.05,-0.05,0.29861440301036557";
     var b15 = "36,6.249999999999987,6.249999999999987,0.3502786265433857";
     poserSaver(b1);
     poserSaver(b2);
     poserSaver(b3);
     poserSaver(b4);
     poserSaver(b5);
     poserSaver(b6);
     poserSaver(b7);
     poserSaver(b8);
     poserSaver(b9);
     poserSaver(b10);
     poserSaver(b11);
     poserSaver(b12);
     poserSaver(b13);
     poserSaver(b14);
     poserSaver(b15);
 }
    if(num === 'c') {
        setBoneData(1, 1, 3);
        var c1 = "0,1.4518347494622603,1.5439166775465225,0.45183474946225943";
        var c2 = "1,-0.10000000000000002,-0.10000000000000002,-0.16868209232737794";
        var c3 = "2,0.09999999999999999,0.09999999999999999,-0.3167256875337818";
        var c4 = "5,-0.004421328216126688,-0.00033245570337699093,-0.1772070741248778";
        var c5 = "10,22.967753966223697,23.86787856312999,11.032246033776518";
        var c6 = "11,-0.24979034540863365,-0.24557115214254766,-0.035298993722112315";
        var c7 = "12,-0.21726381155918617,-0.16691326960536995,0.5672638115591863";
        var c8 = "34,-1.5000000000000007,-1.5000000000000007,-0.8000000000000002";
        var c9 = "35,-0.3385608466388962,-0.13169632727138364,-0.03859275258484925";
        var c10 = "57,-3.2499999999999964,0,-4.0392598176230265";
        var c11 = "58,3.099999999999997,0,0.8000000000000002";
        var c12 = "62,3.049999999999997,0,7.4499999999999815";
        var c13 = "63,3.2651640433941957,0.09107196449115341,0.21885383611064663";
        var c14 = "75,-0.05,-0.05,0.29861440301036557";
        var c15 = "36,6.249999999999987,6.249999999999987,0.3502786265433857";
        poserSaver(c1);
        poserSaver(c2);
        poserSaver(c3);
        poserSaver(c4);
        poserSaver(c5);
        poserSaver(c6);
        poserSaver(c7);
        poserSaver(c8);
        poserSaver(c9);
        poserSaver(c10);
        poserSaver(c11);
        poserSaver(c12);
        poserSaver(c13);
        poserSaver(c14);
        poserSaver(c15);
    }

    if(num === 'd') {

        setBoneData(1, 1, 4);
        var d1 = "0,1.4518347494622603,1.5439166775465225,0.45183474946225943";
        var d2 = "1,-0.10000000000000002,-0.10000000000000002,-0.16868209232737794";
        var d3 = "2,0.09999999999999999,0.09999999999999999,-0.3167256875337818";
        var d4 = "5,-0.004421328216126688,-0.00033245570337699093,-0.1772070741248778";
        var d5 = "10,22.967753966223697,23.86787856312999,11.032246033776518";
        var d6 = "11,-0.24979034540863365,-0.24557115214254766,-0.035298993722112315";
        var d7 = "12,-0.21726381155918617,-0.16691326960536995,0.5672638115591863";
        var d8 = "34,-1.5000000000000007,-1.5000000000000007,-0.8000000000000002";
        var d9 = "35,-0.3385608466388962,-0.13169632727138364,-0.03859275258484925";
        var d10 = "57,3.2499999999999964,0,4.410740182376961";
        var d11 = "58,3.249999999999997,0,-4.3499999999999925";
        var d12 = "62,2.9499999999999975,0,6.299999999999986";
        var d13 = "63,3.2651640433941957,0.09107196449115341,0.21885383611064663";
        var d14 = "75,-0.05,-0.05,0.29861440301036557";
        var d15 = "36,6.249999999999987,6.249999999999987,0.3502786265433857";
        poserSaver(d1);
        poserSaver(d2);
        poserSaver(d3);
        poserSaver(d4);
        poserSaver(d5);
        poserSaver(d6);
        poserSaver(d7);
        poserSaver(d8);
        poserSaver(d9);
        poserSaver(d10);
        poserSaver(d11);
        poserSaver(d12);
        poserSaver(d13);
        poserSaver(d14);
        poserSaver(d15);

    }

    /*
    var x1 = 1.4518347494622603;
    var y1 = 1.5439166775465225;
    var z1 = 0.45183474946225943;
    var ax1 = x1;
    var ay1 = y1;
    var az1 = z1;

    //var x2 = 3.099999999999996;
    //var y2 = 0;
    //var z2 = -1.6392598176230329;
    //var a3 = a1;

    //var zz1 = 1.1500000000000004;
    //var zz2 = 0;
    //var zz3 = zz1;

    /*for(z1; z1 < z2; z1 + 0.05){
        mesh.skeleton.bones[57].rotation.set(3.099999999999997,0,z1);
    }*/

    /*timerId1 = setInterval(function(){
        x1 = x1 - 0.1;
        y1 = y1 - 0.1;
        z1 = z1 - 0.1;
        ax1 = ax1 + 0.1;
        ay1 = ax1 + 0.1;
        az1 = az1 + 0.1;
        if(z1 > z2){
            mesh.skeleton.bones[0].rotation.set(ax1,ay1,az1);
        } else {
            clearInterval(timerId1);
        }
    },100);

    /*timerId2 = setInterval(function(){
        zz1 = zz1 - 0.1;
        zz3 = zz3 + 0.1;
        if(zz1 > zz2){
            mesh.skeleton.bones[58].rotation.set(3.099999999999997,0,zz3);
        } else {
            clearInterval(timerId2);
        }
    },100);*/


    //mesh.skeleton.bones[57].rotation.set(3.099999999999996,0,-1.6392598176230329);
    //mesh.skeleton.bones[58].rotation.set(3.099999999999996,0,0);

}

function animationPlay(){
    var a1 = "0,1.4518347494622603,1.5439166775465225,0.45183474946225943";
    var a2 = "1,-0.10000000000000002,-0.10000000000000002,-0.16868209232737794";
    var a3 = "2,0.09999999999999999,0.09999999999999999,-0.3167256875337818";
    var a4 = "5,-0.004421328216126688,-0.00033245570337699093,-0.1772070741248778";
    var a5 = "10,22.967753966223697,23.86787856312999,11.032246033776518";
    var a6 = "11,-0.24979034540863365,-0.24557115214254766,-0.035298993722112315";
    var a7 = "12,-0.21726381155918617,-0.16691326960536995,0.5672638115591863";
    var a8 = "34,-1.5000000000000007,-1.5000000000000007,-0.8000000000000002";
    var a9 = "35,-0.3385608466388962,-0.13169632727138364,-0.03859275258484925";
    var a10 = "36,6.249999999999987,6.249999999999987,0.3502786265433857";
    var a11 = "57,-3.1499999999999972,0,-1.839259817623033";
    var a12 = "62,-2.9999999999999973,0,-0.6";
    var a13 = "63,-3.284835956605798,0.09107196449115341,0.968853836110647";
    var a14 = "75,0.15000000000000002,0.15000000000000002,0.1986144030103656";
    poserSaver(a1);
    poserSaver(a2);
    poserSaver(a3);
    poserSaver(a4);
    poserSaver(a5);
    poserSaver(a6);
    poserSaver(a7);
    poserSaver(a8);
    poserSaver(a9);
    poserSaver(a10);
    poserSaver(a11);
    poserSaver(a12);
    poserSaver(a13);
    poserSaver(a14);

    for(var i=0; i < _bone.length; i++){
        var position = localStorage.getItem('_scene1_object1_bone'+i+'_pose1');
        var dataArray = position.split(',');
        var bone = parseInt(dataArray[0]);
        var x1 = parseFloat(dataArray[1]);
        var y1= parseFloat(dataArray[2]);
        var z1 = parseFloat(dataArray[3]);
        var ax1 = x1;
        var ay1 = y1;
        var az1 = z1;

        var dd = i+1;
        var position2 = localStorage.getItem('_scene1_object1_bone'+i+'_pose2');
        var dataArray2 = position2.split(',');
        var xx1 = parseFloat(dataArray2[1]);
        var yy1= parseFloat(dataArray2[2]);
        var zz1 = parseFloat(dataArray2[3]);
        var axx1 = xx1;
        var ayy1 = yy1;
        var azz1 = zz1;
        timerId1 = setInterval(function(){
            x1 = x1 - 0.1;
            y1 = y1 - 0.1;
            z1 = z1 - 0.1;
            ax1 = ax1 + 0.1;
            ay1 = ax1 + 0.1;
            az1 = az1 + 0.1;
            if(z1 > zz1){
                mesh.skeleton.bones[bone].rotation.set(ax1,ay1,az1);
            } else {
                clearInterval(timerId1);
            }
        },1000);
    }
}

function poseSetting(){
    _x = _nx;
    _y = _ny;
    _z = _nz;
    mesh.skeleton.bones[_num].rotation.set(_x,_y,_z);
    saveSkeletonNewPosition(_num,_x,_y,_z);
}