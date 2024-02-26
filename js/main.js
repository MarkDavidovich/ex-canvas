'use strict'

let gElCanvas
let gCtx
let gColor


let gPen = { pos: null, isDown: false }
let gLine = []

function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
}

function onStartLine(ev) {
    gPen.pos = { x: ev.offsetX, y: ev.offsetY }
    gPen.isDown = true
    gLine = []
    gLine.push(gPen.pos)

    gCtx.beginPath()
    gCtx.moveTo(gPen.pos.x, gPen.pos.y)
}

function onDrawLine(ev) {
    if (!gPen.isDown) return
    const { offsetX, offsetY } = ev

    gPen.pos = { x: offsetX, y: offsetY }
    gLine.push(gPen.pos)

    gCtx.lineTo(offsetX, offsetY)
    gCtx.stroke()
}

function onEndLine(ev) {
    gPen.isDown = false
    gCtx.closePath()
}

function onClearCanvas() {
    gLine = []
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
}

function onSave() {
    saveToStorage('canvas', gLine)
}

function onLoad() {
    gLine = loadFromStorage('canvas')

    gCtx.moveTo(gLine[0].x, gLine[0].y)
    gCtx.beginPath()

    gLine.forEach(pos => gCtx.lineTo(pos.x, pos.y))

    gCtx.stroke()
}

function onColorChange(ev) {
    gColor = ev.target.value
    gCtx.strokeStyle = gColor
}

function onWidthChange(ev) {
    const brushWidth = ev.target.value
    gCtx.lineWidth = brushWidth

    document.querySelector("width-value").innerHTML = brushWidth
}