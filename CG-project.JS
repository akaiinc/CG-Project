'use strict'
var gl
var program
var canvas

window.onload = function init() {
    canvas = document.getElementById("my-canvas")
    gl = WebGLUtils.setupWebGL(canvas);
    gl = canvas.getContext('webgl');

    gl.viewport(0, 0, canvas.width, canvas.height)
    gl.clearColor(1.0, 1.0, 1.0, 1.0)
    gl.enable(gl.DEPTH_TEST)
    //初始化着色器
    program = initShaders(gl, 'vertex-shader', 'fragment-shader')
    gl.useProgram(program)
    
    draw()
}