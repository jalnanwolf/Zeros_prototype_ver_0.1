/**
 * Created by cineker on 15. 11. 22..
 */


if ( ! Detector.webgl ) Detector.addGetWebGLMessage();

var container;
var camera;
var renderer;
var scene;
var hemiLight;
var controls,control;
var loader;
var mesh;
var bone = [];
var helper;
var pos = [],scl = [],rotq = [];
var _new_pos = 0;
var val1;
var data = [];
var light;
var dae;

var timerId = setInterval(null,null);

var clock = new THREE.Clock();
var characterY = 0;

init();
var checkScene1 = localStorage._sceneqty;
console.log('scene'+checkScene1+'zeros_proto');
checkScene();
localStorage.clear();

function init(){

    container = document.getElementById('contents');

    scene = new THREE.Scene();

    var width = document.getElementById('contents').offsetWidth;
    var height = document.getElementById('contents').offsetHeight;
    //camera

    camera = new THREE.PerspectiveCamera( 75, width / height, 1, 10000 );
    camera.position.y = 50;
    camera.position.x = 50;

    //light

    hemiLight = new THREE.HemisphereLight( 0xffffff, 0xffffff, 0.6 );
    hemiLight.position.set( 0, 0, 0 );
    scene.add( hemiLight );

    //scene.add( new THREE.AmbientLight( 0x666666 ) );

    //light = new THREE.DirectionalLight( 0xdfebff, 1.75 );
    light = new THREE.DirectionalLight( 0xebf3ff, 1.5 );
    light.position.set( 50, 200, 100 ).multiplyScalar( 1.3 );

    light.castShadow = true;

    light.shadowMapWidth = 1024;
    light.shadowMapHeight = 1024;

    var d = 300;

    light.shadowCameraLeft = -d;
    light.shadowCameraRight = d;
    light.shadowCameraTop = d;
    light.shadowCameraBottom = -d;

    light.shadowCameraFar = 1000;

    scene.add( light );



    //Grid

    var grid = new THREE.GridHelper( 1000, 25 );
    scene.add(grid);

    scene.add( makeSkybox( [
        'src/textures/px.jpg', // right
        'src/textures/nx.jpg', // left
        'src/textures/py.jpg', // top
        'src/textures/ny.jpg', // bottom
        'src/textures/pz.jpg', // back
        'src/textures/nz.jpg'  // front
    ], 8000 ));


    //renderer


    renderer = new THREE.WebGLRenderer({antialias: true, preserveDrawingBuffer: true});
    renderer.shadowMap.Enabled = true;
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( width , height );

    container.appendChild( renderer.domElement );

    //controller

    controls = new THREE.EditorControls( camera, renderer.domElement );
    controls.addEventListener( 'change', render );

    control = new THREE.TransformControls( camera, renderer.domElement );
    control.addEventListener( 'change', render );

    scene.add( control );

    window.addEventListener( 'keydown', function ( event ) {

        switch ( event.keyCode ) {

            case 83: // S
                showData();


                break;

            case 82: // R
                //addpose();
                break;



            /*case 87: // W
                control.setMode( "translate" );
                break;

            case 69: // E
                control.setMode( "rotate" );
                break;*/

            case 72:
                var _new_visible = helper.visible;
                console.log(_new_visible);
                if(_new_visible == true){_new_visible = false} else {_new_visible = true};
                console.log(_new_visible);
                helper.visible = _new_visible;
                break;
/*
            case 82: // R
                control.setMode( "scale" );
                break;

            case 90:
                console.log(data.length);
                var myWindow = window.open("", "MsgWindow", "width=1280px, height=1080px");
                myWindow.document.write('<img src="'+data[1]+'" width="1280px", height="1080px"/>');
                break;

            //case 187:
            //case 107: // +, =, num+

                //break;

            //case 189:
            //case 109: // -, _, num-
               // control.setSize( Math.max( control.size - 0.1, 0.1 ) );
               // break;*/

        }

    });
    camera.lookAt( scene.position );
    animate();
}

function makeSkybox( urls, size ) {
    var skyboxCubemap = THREE.ImageUtils.loadTextureCube( urls );
    skyboxCubemap.format = THREE.RGBFormat;

    var skyboxShader = THREE.ShaderLib['cube'];
    skyboxShader.uniforms['tCube'].value = skyboxCubemap;

    return new THREE.Mesh(
        new THREE.BoxGeometry( size, size, size ),
        new THREE.ShaderMaterial({
            fragmentShader : skyboxShader.fragmentShader, vertexShader : skyboxShader.vertexShader,
            uniforms : skyboxShader.uniforms, depthWrite : false, side : THREE.BackSide
        })
    );
}


function srcLoader(src,x,y,z){
    var _x = x, _y = y, _z = z;
    console.log(_x);
    if(_x === undefined) {
        _x = 0, _y = 0, _z = 0;
    }
    loader = new THREE.ColladaLoader();
    loader.load(src, function( collada ){
        dae = collada.scene;
        dae.traverse(function(child){
            if(child instanceof THREE.SkinnedMesh){

                camera.lookAt( child.position );

                mesh = child;
                mesh.castShadow = true;
                mesh.receiveShadow = true;

            }
        });

        scene.add(dae);



        //skeletonHelper

        //helper = new THREE.SkeletonHelper( mesh );
        //helper.material.linewidth = 3;
        //helper.visible = false;
        //scene.add( helper );

        dae.position.set(_x,_y,_z);
        dae.addEventListener( "mouseDown", srcClick(), false);

        dae.scale.x = dae.scale.y = dae.scale.z = 1;
        dae.updateMatrix();

        //poser!
        //makeSkeletonHandler();

        meshSender(mesh,dae);

        var _nowScene = localStorage.nowScene;
        var objectQty = localStorage.getItem('_scene'+_nowScene+'_objectQty');
        if (objectQty === undefined ){
            localStorage.setItem('_scene'+_nowScene+'_objectQty',1);
        } else {
            var objectNum = parseInt(objectQty) + 1;
            localStorage.setItem('_scene'+_nowScene+'_objectQty',objectNum);
        }
        localStorage.setItem('_scene'+_nowScene+'_object'+objectNum+'_src',src);
        var objectPosition = _x+','+_y+','+_z;
        localStorage.setItem('_scene'+_nowScene+'_object'+objectNum+'_position',objectPosition);

        setBoneData(_nowScene,objectNum);
        selectObject(_nowScene,objectNum);
        setBoneData(_nowScene,objectNum,1);
        var str = '_scene'+_nowScene+'_object'+objectNum+'poseQty';
        setPoseQty(str,1);
        setselectPoseNum(1);

        window.addEventListener( 'keydown', function ( event ) {

            switch ( event.keyCode ) {

                case 187:
                case 107: // +, =, num+
                    skeletonHandler('plus');
                    break;

                case 189:
                case 109: // -, _, num-
                    skeletonHandler('minus');
                    break;

                case 38: // Ctrl
                    characterY = characterY + 0.5;
                    dae.position.set(0,characterY,0);
                    characterYsender(characterY);
                    break;

                case 40:
                    characterY = characterY - 0.5;
                    dae.position.set(0,characterY,0);
                    characterYsender(characterY);
                    break;
            }
        });
        console.log('Loading...'+src);
        animate();
    });


}

function characterPositionSet(x,y,z){
    dae.position.set(x,y,z);
}



function addBackground(src){
    switch ( src ){
        case 1:
            scene.add( makeSkybox( [
                'src/texture/px.jpg', // right
                'src/texture/nx.jpg', // left
                'src/texture/py.jpg', // top
                'src/texture/ny.jpg', // bottom
                'src/texture/pz.jpg', // back
                'src/texture/nz.jpg'  // front
            ], 8000 ));
            break;
    }

    render();
}

function srcClick(){

    this.addEventListener( 'mouseUp' , function(){
        console.log('src clicked');
        THREE.EditorControls.enabled = false;
        control.attach( mesh );
        scene.add( control );
    });
}

function animate(){


    requestAnimationFrame( animate );
    render();
}

var clock = new THREE.Clock();

function render(){
    var timer = Date.now() * 0.001;

    if(helper){
        helper.update();
    }

    //light.position.x = Math.cos( timer ) * 10;
    //light.position.y = 2;
    //light.position.z = Math.sin( timer ) * 10;

    //
    renderer.render( scene, camera );
}
