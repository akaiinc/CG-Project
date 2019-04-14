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
var standardMatrix= mat4(
    vec4(1,0,0,0),
    vec4(0,1,0,0),
    vec4(0,0,1,0),
    vec4(0,0,0,1)
);

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
        vec4(r,r,r,1.0),
        vec4(-r,r,r,1.0),
        vec4(-r,-r,r,1.0),
        vec4(r,-r,r,1.0),
        vec4(r,r,-r,1.0),
        vec4(-r,r,-r,1.0),
        vec4(-r,-r,-r,1.0),
        vec4(r,-r,-r,1.0)
    ];

    var rotY=standardMatrix;
    rotY=mult(rotY,rotateZ(45));
    var c=Math.sqrt(3)/3;
    var radian=Math.asin(c);
    var angle=(radian/(2*Math.PI))*360;
    rotY=mult(rotY,rotateX(angle));

    for(var i=0;i<vertices.length;i++){
        vertices[i]=mult(rotY,vertices[i]);
    }
    

    vertexColors=[
        vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
        vec4( 1.0, 21/255, 100/255, 1.0 ),  // red
        vec4( 245/255, 1.0, 90/255, 1.0 ),  // yellow
        vec4( 13/255, 1.0, 165/255, 1.0 ),  // green
        vec4( 100/255, 149/255, 237/255, 1.0 ),  // blue
        vec4( 1.0, 13/255, 166/255, 1.0 ),  // magenta
        vec4( 0.0, 191/255, 1.0, 1.0 ),  // cyan
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
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
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

    cubeRender();
    // setInterval(cubeRender(points,gl.TRIANGLES),60);
}

function quad(a,b,c,d){
    var indices=[a,b,c,a,c,d];
    for(var i=0;i<indices.length;i+=1){
        points.push(vertices[indices[i]]);
        colors.push(vertexColors[a]);
    }
}


function cubeRender(){

    gl.clear( gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);

    theta[1]+=2.0;
    gl.uniform3fv(thetaLoc,flatten(theta));
    gl.drawArrays( gl.TRIANGLES, 0, points.length );
    //绘制方式、起始点、点的个数
    requestAnimFrame(cubeRender);
}

