'use strict'

//上次旋转视角时记录的位置
let position = vec2()

/**@type {[DrawableObj]} */
let drawableObjs = [];
let isMouseDown = false;
window.onmousedown = (e) => {
    isMouseDown = true;
    position[0] = e.x, position[1] = e.y
}
window.onmouseup = () => {
    isMouseDown = false;
}
window.onmousemove = mouseControl


function mouseControl(e) {
    {
        if (isMouseDown) {
            //    let cameraMatrix=lookAt(vec3(x/1000,y/1000,0.5),vec3(0, 0, 0), vec3(-0.5, -0.5, 0));
            //    glControl.setTransformationMatrix(null,cameraMatrix,null)
            if (!position) {
                position = vec2(e.x, e.y)
                return
            }
            theta[0] = (e.x - position[0]) / window.innerWidth * 360
            theta[1] = (e.y - position[1]) / window.innerHeight * 360
            thetaLoc = gl.getUniformLocation(program, "theta");
            gl.uniform3fv(thetaLoc, flatten(theta));
            gl.clear();
            gl.drawArrays(gl.TRIANGLES, 0, cubePoints.length);

            position[0] = e.x, position[1] = e.y
            
        } else {
            return
        }
    }
}