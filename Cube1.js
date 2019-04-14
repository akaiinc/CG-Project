/** @type {HTMLCanvasElement} */
"use strict";

var gl;
var canvas;
var points=[];
var colors=[];
var vertexColors=[];
var vertices=[];
var theta=[0,0,0];
var thetaLoc;

window.onload= function main(){

    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0,0.0,0.0,0.0 );



    gl.enable(gl.DEPTH_TEST);
        // 开启深度测试

    var r=0.4;
    vertices = [
        vec3(r,r,r),
        vec3(-r,r,r),
        vec3(-r,-r,r),
        vec3(r,-r,r),
        vec3(r,r,-r),
        vec3(-r,r,-r),
        vec3(-r,-r,-r),
        vec3(r,-r,-r)
    ];


    vertexColors=[
        vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
        vec4( 1.0, 0.0, 0.0, 1.0 ),  // red
        vec4( 1.0, 1.0, 0.0, 1.0 ),  // yellow
        vec4( 0.0, 1.0, 0.0, 1.0 ),  // green
        vec4( 0.0, 0.0, 1.0, 1.0 ),  // blue
        vec4( 1.0, 0.0, 1.0, 1.0 ),  // magenta
        vec4( 0.0, 1.0, 1.0, 1.0 ),  // cyan
        vec4( 1.0, 1.0, 1.0, 1.0 )   // white
    ];
    
    quad(1,0,3,2);
    quad(2,3,7,6);
    quad(3,0,4,7);
    quad(6,5,1,2);
    quad(4,5,6,7);
    quad(5,4,0,1);
    


    linkShader(points,colors);
};


function linkShader(pointsArray,colorsArray)
{

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );


    var vbuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vbuffer );
    gl.bufferData( gl.ARRAY_BUFFER,
         flatten(pointsArray),
          gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 3, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );



    var cbuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cbuffer );
    gl.bufferData( gl.ARRAY_BUFFER,
         flatten(colorsArray),
          gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    thetaLoc=gl.getUniformLocation(program,"theta");

    cubeRender(points,gl.TRIANGLES);
    // setInterval(cubeRender(points,gl.TRIANGLES),60);
}

function quad(a,b,c,d){
    var indices=[a,b,c,a,c,d];
    for(var i=0;i<indices.length;i+=1){
        points.push(vertices[indices[i]]);
        colors.push(vertexColors[indices[i]]);
    }
}


function cubeRender(array,drawingMode){

    gl.clear( gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    theta[0]+=2.0;
    theta[1]+=4.0;
    theta[2]+=6.0;
    gl.uniform3fv(thetaLoc,flatten(theta));
    gl.drawArrays( drawingMode, 0, array.length );
    //绘制方式、起始点、点的个数
    requestAnimationFrame(cubeRender(array,drawingMode));
}

