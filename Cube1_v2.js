/** @type {HTMLCanvasElement} */
"use strict";

var gl;
var canvas;
var cubePoints=[];
var cubeCcolors=[];
var textcurePoints=[];
var program;
var vertexColors=[
    vec4( 0.0, 0.0, 0.0, 1.0 ),  // black
    vec4( 1.0, 21/255, 100/255, 1.0 ),  // red
    vec4( 245/255, 1.0, 90/255, 1.0 ),  // yellow
    vec4( 13/255, 1.0, 165/255, 1.0 ),  // green
    vec4( 100/255, 149/255, 237/255, 1.0 ),  // blue
    vec4( 1.0, 13/255, 166/255, 1.0 ),  // magenta
    vec4( 0.0, 191/255, 1.0, 1.0 ),  // cyan
    vec4( 1.0, 1.0, 1.0, 1.0 )   // white
];
var theta=[0,0,0];
var thetaLoc;
var standardMatrix= mat4(
    vec4(1,0,0,0),
    vec4(0,1,0,0),
    vec4(0,0,1,0),
    vec4(0,0,0,1)
);
var cubeR;


/**以下开始主程序 */
window.onload= function main(){

    canvas = document.getElementById( "gl-canvas" );
    gl = WebGLUtils.setupWebGL( canvas );
    if ( !gl ) { alert( "WebGL isn't available" ); }

    gl.viewport( 0, 0, canvas.width, canvas.height );
    gl.clearColor( 0.0,0.01,0.0,0.5 );
    gl.enable(gl.DEPTH_TEST);
    linkShader();
};


function linkShader()
{

    program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    drawCube();
    // drawPedestal();

    var vbuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, vbuffer );
    gl.bufferData( gl.ARRAY_BUFFER,
         flatten(cubePoints),
          gl.STATIC_DRAW );

    var vPosition = gl.getAttribLocation( program, "vPosition" );
    gl.vertexAttribPointer( vPosition, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vPosition );

    /**画一个小人 */
    // drawDoll(); 


    var cbuffer = gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, cbuffer );
    gl.bufferData( gl.ARRAY_BUFFER,
         flatten(cubeCcolors),
          gl.STATIC_DRAW );

    var vColor = gl.getAttribLocation( program, "vColor" );
    gl.vertexAttribPointer( vColor, 4, gl.FLOAT, false, 0, 0 );
    gl.enableVertexAttribArray( vColor );

    thetaLoc=gl.getUniformLocation(program,"theta");

    cubeRender();
    // setInterval(cubeRender(points,gl.TRIANGLES),60);
}


function cubeRender(){

    var texture = gl.createTexture();

    var image=document.getElementById("texture");

    var tbuffer=gl.createBuffer();
    gl.bindBuffer( gl.ARRAY_BUFFER, tbuffer );
    gl.bufferData( gl.ARRAY_BUFFER,
         flatten(textcurePoints),
          gl.STATIC_DRAW );
    
    let attrTexture = gl.getAttribLocation(program, 'vTextCoord')
    gl.vertexAttribPointer(attrTexture, 2, gl.FLOAT, false, 0, 0)
    gl.enableVertexAttribArray(attrTexture)
    gl.bindTexture( gl.TEXTURE_2D, texture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB,
        gl.RGB, gl.UNSIGNED_BYTE, image)
    gl.generateMipmap(gl.TEXTURE_2D);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER,
        gl.NEAREST_MIPMAP_LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST)

    let sampler = gl.getUniformLocation(program, 'sampler')
        gl.uniform1i(sampler, 0)


    gl.clear( gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);
    theta[1]-=2.0;
    gl.uniform3fv(thetaLoc,flatten(theta));
    gl.drawArrays( gl.TRIANGLES, 0, cubePoints.length );
    //绘制方式、起始点、点的个数
    requestAnimFrame(cubeRender);
}


function drawCube(){
    var r=0.4;
    cubeR=r;
    var vertices = [
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

    // quad(1,0,3,2);
    // quad(2,3,7,6);
    // quad(3,0,4,7);
    // quad(6,5,1,2);
    // quad(4,5,6,7);
    // quad(5,4,0,1);

    quad(vertices,1,0,3,2,-1);
    quad(vertices,2,3,7,6,-1);
    quad(vertices,3,0,4,7,-1);
    quad(vertices,6,5,1,2,-1);
    quad(vertices,4,5,6,7,-1);
    quad(vertices,5,4,0,1,-1);
}

function quad(vertices,a,b,c,d,e){

    const _2dPoints = [
        vec2(0, 0),
        vec2(0, 1),
        vec2(1, 1),
        vec2(1, 0)
    ]
    var indices=[a,b,c,a,c,d];

    //不指定颜色
    if(e==-1){
        for(var i=0;i<indices.length;i+=1){
            cubePoints.push(vertices[indices[i]]);
            cubeCcolors.push(vertexColors[a]);
        }
    }
    else if(e>=0&&e<=7){
        for(var i=0;i<indices.length;i+=1){
            cubePoints.push(vertices[indices[i]]);
            cubeCcolors.push(vertexColors[e]);
        }
    }
    textcurePoints.push(
        _2dPoints[0],
        _2dPoints[1],
        _2dPoints[2],
        _2dPoints[0],
        _2dPoints[2],
        _2dPoints[3]
    )
}

/**画一个底座 */
function drawPedestal(){
    var cubeStandR=(2*Math.sqrt(6))*cubeR/3;
    var smallR=cubeStandR*2/3;
    var smallH=smallR*2/3;
    var bigR=smallR*2;
    var bigH=bigR*2/3;
    var offsetY=-Math.sqrt(3)*cubeR;
    var pedestal=[
        vec4(smallR,offsetY,smallR,1.0),
        vec4(smallR,offsetY,-smallR,1.0),
        vec4(-smallR,offsetY,-smallR,1.0),
        vec4(-smallR,offsetY,smallR,1.0),
        vec4(smallR,offsetY-smallH,smallR,1.0),
        vec4(smallR,offsetY-smallH,-smallR,1.0),
        vec4(-smallR,offsetY-smallH,-smallR,1.0),
        vec4(-smallR,offsetY-smallH,smallR,1.0),

        vec4(bigR,offsetY-smallH,bigR,1.0),
        vec4(bigR,offsetY-smallH,-bigR,1.0),
        vec4(-bigR,offsetY-smallH,-bigR,1.0),
        vec4(-bigR,offsetY-smallH,bigR,1.0),
        vec4(bigR,offsetY-smallH-bigH,bigR,1.0),
        vec4(bigR,offsetY-smallH-bigH,-bigR,1.0),
        vec4(-bigR,offsetY-smallH-bigH,-bigR,1.0),
        vec4(-bigR,offsetY-smallH-bigH,bigR,1.0)
    ];

    quad(pedestal,0,3,7,4,-1);
    quad(pedestal,1,0,4,5,-1);
    quad(pedestal,1,5,6,2,-1);
    quad(pedestal,3,2,6,7,-1);
    quad(pedestal,0,1,2,3,-1);
    quad(pedestal,8,11,15,12,-1);
    quad(pedestal,9,8,12,13,-1);
    quad(pedestal,9,13,14,10,-1);
    quad(pedestal,11,10,14,15,-1);
    quad(pedestal,9,10,11,8,-1);
    quad(pedestal,12,15,14,13,-1);


    // quad(pedestal,0,3,7,4,);
    // quad(pedestal,1,0,4,5,);
    // quad(pedestal,1,5,6,2,);
    // quad(pedestal,3,2,6,7,);
    // quad(pedestal,0,1,2,3,);
    // quad(pedestal,8,11,15,12,);
    // quad(pedestal,9,8,12,13,);
    // quad(pedestal,9,13,14,10,);
    // quad(pedestal,11,10,14,15,);
    // quad(pedestal,9,10,11,8,);
    // quad(pedestal,12,15,14,13,);

}


/**画一个小人儿 */
function drawDoll(){
    var scal=0.0125;
    var transX=0.875;
    var transY=-0.625;
    var doll=[
        vec4(3.0*scal+transX,0.0*scal+transY,0.0,1.0),
        vec4(3.0*scal+transX,-3.0*scal+transY,0.0,1.0),
        vec4(7.0*scal+transX,-3.0*scal+transY,0.0,1.0),
        vec4(7.0*scal+transX,0.0*scal+transY,0.0,1.0),
        vec4(5.0*scal+transX,-3.0*scal+transY,0.0,1.0),
        vec4(5.0*scal+transX,-7.0*scal+transY,0.0,1.0),
        vec4(3.0*scal+transX,-10.0*scal+transY,0.0,1.0),
        vec4(7.0*scal+transX,-10.0*scal+transY,0.0,1.0),

        //Emotion
        vec4(4.5*scal+transX,-0.5*scal+transY,0.0,1.0),
        vec4(3.5*scal+transX,-1.5*scal+transY,0.0,1.0),
        vec4(5.5*scal+transX,-0.5*scal+transY,0.0,1.0),
        vec4(6.5*scal+transX,-1.5*scal+transY,0.0,1.0),
        vec4(4.0*scal+transX,-3.0*scal+transY,0.0,1.0),
        vec4(4.0*scal+transX,-2.0*scal+transY,0.0,1.0),
        vec4(6.0*scal+transX,-2.0*scal+transY,0.0,1.0),
        vec4(6.0*scal+transX,-3.0*scal+transY,0.0,1.0)
    ];
    var pointLine=[];
    var i;
    for(i=0;i<3;i++){
        pointLine.push(doll[i]);
        pointLine.push(doll[i+1]);
    }
    pointLine.push(doll[3]);
    pointLine.push(doll[0]);
    for(i=4;i<6;i++){
        pointLine.push(doll[i]);
        pointLine.push(doll[i+1]);
    }
    pointLine.push(doll[5]);
    pointLine.push(doll[7]);

    pointLine.push(doll[8]);
    pointLine.push(doll[9]);
    pointLine.push(doll[10]);
    pointLine.push(doll[11]);

    for(i=12;i<15;i++){
        pointLine.push(doll[i]);
        pointLine.push(doll[i+1]);
    }
    render_2D(pointLine,gl.LINES);

}

function render_2D(points,mode){
    gl.bufferData( gl.ARRAY_BUFFER,
        flatten(points),
        gl.STATIC_DRAW );
    
    gl.drawArrays( mode, 0, points.length );
}