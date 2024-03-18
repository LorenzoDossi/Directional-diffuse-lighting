import data from "./data.js"
import properties from './properties.js'
import utils from './utils.js'
import fragment from "./shaders/base.frag"
import vertex from "./shaders/base.vert"
import { mat4 } from "gl-matrix"

let canvas = document.querySelector('canvas')
let cWidth = canvas.width
let cHeight = canvas.height
let mvMatrix = mat4.create()
let pMatrix = mat4.create()
let nMatrix = mat4.create()
let normals = utils.calculateNormals(data.vertices, data.indices)

let gl = canvas.getContext('webgl')
let prg = utils.createProgram(gl, vertex, fragment)

prg.aVertexPosition = gl.getAttribLocation(prg, 'aVertexPosition')
prg.aVertexNormal = gl.getAttribLocation(prg, 'aVertexNormal')

prg.uPMatrix = gl.getUniformLocation(prg, 'uPMatrix');
prg.uMVMatrix = gl.getUniformLocation(prg, 'uMVMatrix')
prg.uNMatrix = gl.getUniformLocation(prg, 'uNMatrix')

prg.uMaterialDiffuse = gl.getUniformLocation(prg, 'uMaterialDiffuse');
prg.uLightDiffuse = gl.getUniformLocation(prg, 'uLightDiffuse')
prg.uLightDirection = gl.getUniformLocation(prg, 'uLightDirection')

let sphereVerticesBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, sphereVerticesBuffer)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data.vertices), gl.STATIC_DRAW)
gl.bindBuffer(gl.ARRAY_BUFFER, null)

let sphereNormalsBuffer = gl.createBuffer()
gl.bindBuffer(gl.ARRAY_BUFFER, sphereNormalsBuffer)
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(normals), gl.STATIC_DRAW)
gl.bindBuffer(gl.ARRAY_BUFFER, null)

let sphereIndicesBuffer = gl.createBuffer()
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereIndicesBuffer)
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(data.indices), gl.STATIC_DRAW)
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)

function loop() {
	requestAnimationFrame(loop)

	gl.clearColor(0.3, 0.5, 0.3, 1.)
	gl.clearDepth(100.)
	gl.enable(gl.DEPTH_TEST)
    gl.depthFunc(gl.LEQUAL);
	gl.viewport(0, 0, cWidth, cHeight)
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT)

	gl.uniform3fv(prg.uLightDirection, [properties.lightDirectionX, properties.lightDirectionY, properties.lightDirectionZ])
	gl.uniform4fv(prg.uLightDiffuse, [properties.lightDiffuse, properties.lightDiffuse, properties.lightDiffuse, properties.lightDiffuse])
	gl.uniform4fv(prg.uMaterialDiffuse, [0.5, 0.8, 0.1, 1.0])

	mat4.perspective(pMatrix, 45, cWidth / cHeight, 0.1, 1000)

	mat4.identity(mvMatrix)
	mat4.translate(mvMatrix, mvMatrix, [0, 0, properties.translateZ])

	gl.uniformMatrix4fv(prg.uMVMatrix, false, mvMatrix)
	gl.uniformMatrix4fv(prg.uPMatrix, false, pMatrix)

	mat4.copy(nMatrix, mvMatrix)
	mat4.invert(nMatrix, nMatrix)
	mat4.transpose(nMatrix, nMatrix)
	gl.uniformMatrix4fv(prg.uNMatrix, false, nMatrix)

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereVerticesBuffer)
	gl.vertexAttribPointer(prg.aVertexPosition, 3, gl.FLOAT, false, 0, 0)
	gl.enableVertexAttribArray(prg.aVertexPosition)

	gl.bindBuffer(gl.ARRAY_BUFFER, sphereNormalsBuffer)
	gl.vertexAttribPointer(prg.aVertexNormal, 3, gl.FLOAT, false, 0, 0)
	gl.enableVertexAttribArray(prg.aVertexNormal)

	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, sphereIndicesBuffer)
	gl.drawElements(gl.TRIANGLES, data.indices.length, gl.UNSIGNED_SHORT, 0)

	gl.bindBuffer(gl.ARRAY_BUFFER, null)
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, null)
}

loop()
