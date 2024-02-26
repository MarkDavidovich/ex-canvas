'use strict'

let gElCanvas
let gCtx
let gColor
let gTool

let gPen = { pos: null, isDown: false }
let gShape = []

function onInit() {
    gElCanvas = document.querySelector('canvas')
    gCtx = gElCanvas.getContext('2d')
    gTool = 'pencil'

    gElCanvas.addEventListener('touchstart', onTouchStart)
    gElCanvas.addEventListener('touchmove', onTouchMove)
    gElCanvas.addEventListener('touchend', onTouchEnd)
}

function onClick(ev) {
    const { offsetX, offsetY } = ev

    switch (gTool) {
        case 'pencil':
            return

        case 'rect':
            drawRect(offsetX, offsetY)
            break
        case 'circle':
            drawCircle(offsetX, offsetY, 30)
            break
    }

}

function onStartLine(ev) {
    if (gTool !== 'pencil') return
    gPen.pos = { x: ev.offsetX, y: ev.offsetY }
    gPen.isDown = true
    gShape = []
    gShape.push(gPen.pos)

    gCtx.beginPath()
    gCtx.moveTo(gPen.pos.x, gPen.pos.y)
}


function onDrawLine(ev) {
    if (!gPen.isDown) return
    const { offsetX, offsetY } = ev

    gPen.pos = { x: offsetX, y: offsetY }
    gShape.push(gPen.pos)

    gCtx.lineTo(offsetX, offsetY)
    gCtx.stroke()
}

function onEndLine() {
    gPen.isDown = false
    gCtx.closePath()
}

function onClearCanvas() {
    gShape = []
    gCtx.clearRect(0, 0, gElCanvas.width, gElCanvas.height)
}

function onSave() {
    saveToStorage('canvas', { tool: gTool, color: gColor, shape: gShape })
}

function onLoad() {

    const savedData = loadFromStorage('canvas')

    if (savedData) {
        gTool = savedData.tool
        gColor = savedData.color
        gShape = savedData.shape


        if (gShape.length > 0) {
            if (gTool === 'pencil') {
                gCtx.moveTo(gShape[0].x, gShape[0].y)
                gCtx.beginPath()

                gShape.forEach(pos => gCtx.lineTo(pos.x, pos.y))
                gCtx.stroke()
            }
            else if (gTool === 'rect') {
                gShape.forEach(rect => drawRect(rect.x, rect.y))
            }
            else if (gTool === 'circle') {
                gShape.forEach(circle => drawCircle(circle.x, circle.y, 30))
            }
        }
    }
}

function onSetTool(tool) {
    gTool = tool

    document.querySelectorAll('.tool-btns button').forEach(btn => {
        btn.classList.remove('active')
    })

    document.querySelector(`.${tool}-btn`).classList.add('active')

    console.log(gTool)
}

function drawRect(x, y) {
    const rect = {
        type: 'rect',
        x: x,
        y: y,
        width: 120,
        height: 100,
        color: gColor,
    }

    gCtx.fillStyle = rect.color

    gCtx.fillRect(x, y, rect.width, rect.height)

    gShape.push(rect)
}

function drawCircle(x, y, radius) {
    const circle = {
        type: 'circle',
        x,
        y,
        radius,
        color: gColor,
    }

    gCtx.beginPath()
    gCtx.arc(x, y, radius, 0, 2 * Math.PI)
    gCtx.fillStyle = gColor
    gCtx.fill()
    gCtx.closePath()
    gShape.push(circle)
}

function onColorChange(ev) {
    gColor = ev.target.value
    gCtx.strokeStyle = gColor
}

function onWidthChange(ev) {
    const brushWidth = ev.target.value
    gCtx.lineWidth = brushWidth

    document.querySelector(".width-value").innerHTML = brushWidth
}

//Touch functions
function onTouchStart(ev) {
    ev.preventDefault()
    const touch = ev.touches[0]
    onStartLine({
        offsetX: touch.clientX - gElCanvas.getBoundingClientRect().left,
        offsetY: touch.clientY - gElCanvas.getBoundingClientRect().top
    })
}

function onTouchMove(ev) {
    ev.preventDefault()
    const touch = ev.touches[0]
    onDrawLine({
        offsetX: touch.clientX - gElCanvas.getBoundingClientRect().left,
        offsetY: touch.clientY - gElCanvas.getBoundingClientRect().top
    })
}

function onTouchEnd() {
    onEndLine()
}

function onDownload(elLink) {
    const canvasContent = gElCanvas.toDataURL('image/png')
    elLink.href = canvasContent;
    elLink.download = 'canvas_image.png'
}

function onImgInput(ev) {
    loadImageFromInput(ev, renderImg)
}

function loadImageFromInput(ev, onImageReady) {
    const reader = new FileReader()

    reader.onload = ev => {
        let img = new Image()
        img.src = ev.target.result
        img.onload = () => onImageReady(img)
    }
    reader.readAsDataURL(ev.target.files[0])
}

function renderImg(img) {
    gElCanvas.height = (img.naturalHeight / img.naturalWidth) * gElCanvas.width
    gCtx.drawImage(img, 0, 0, gElCanvas.width, gElCanvas.height)
}