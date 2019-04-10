'use strict'
var gl
var program
var canvas
//缓冲区列表
var bufferList = []

window.onload = function init() {
    canvas = document.getElementById("my-canvas")
    /**@type {WebGLRenderingContext} */
    gl = WebGLUtils.setupWebGL(canvas);
    //初始化配置
    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.clearColor(1.0, 1.0, 1.0, 1.0)
    gl.enable(gl.DEPTH_TEST)
    //初始化着色器
    program = initShaders(gl, 'vertex-shader', 'fragment-shader')
    gl.useProgram(program)
    //初始化变换矩阵
    draw()
}