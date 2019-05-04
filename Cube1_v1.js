/** @type {HTMLCanvasElement} */
"use strict";

var gl;
var canvas;
var cubePoints=[];
var cubeCcolors=[];
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

var isMouseDown = false;
window.onmousedown = (e) =>{
    isMouseDown = true;
    position[0] = e.x, position[1] = e.y
}
window.onmouseup = () =>{
    isMouseDown = false;
}
window.onmousemove = fixupdate

window.onload = function init(){
    glControl.init()
    draw()
}


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

    var program = initShaders( gl, "vertex-shader", "fragment-shader" );
    gl.useProgram( program );

    drawCube();

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

    quad(1,0,3,2);
    quad(2,3,7,6);
    quad(3,0,4,7);
    quad(6,5,1,2);
    quad(4,5,6,7);
    quad(5,4,0,1);

    function quad(a,b,c,d){
        var indices=[a,b,c,a,c,d];
        for(var i=0;i<indices.length;i+=1){
            cubePoints.push(vertices[indices[i]]);
            cubeCcolors.push(vertexColors[a]);
        }
    }
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

/**鼠标控制 */
function fixupdate(e) {
    {
        if (isMouseDown) {
            if (!position) {
                position = vec2(e.x, e.y)
                return
            }
            glControl.rotateEye(
                (e.x - position[0]) / window.innerWidth * 360,
                (e.y - position[1]) / window.innerHeight * 360)
            position[0] = e.x, position[1] = e.y
            glControl.clear()
            glControl.render(drawableObjs)
        } else {
            return
        }
    }
}

function render_2D(points,mode){
    gl.bufferData( gl.ARRAY_BUFFER,
        flatten(points),
        gl.STATIC_DRAW );
    
    gl.drawArrays( mode, 0, points.length );
}