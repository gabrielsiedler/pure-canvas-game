const canvas = document.getElementById('myCanvas')
let ctx = canvas.getContext('2d')
let x = canvas.width / 4
let y = canvas.height - 30
let dx = 2
let dy = -2

const ballCount = 4
const ballRadius = 10
const ballDiameter = ballRadius * 2
const ballContainer = ballDiameter + ballRadius / 2

const flaskWidth = ballContainer
const flaskHeight = ballContainer * ballCount

const containerGap = 20

function drawBall(slotX, slotY, color) {
  ctx.beginPath()
  ctx.arc(slotX + ballContainer / 2, slotY - ballContainer / 2, ballRadius, 0, Math.PI * 2)
  ctx.fillStyle = color
  ctx.fill()
  ctx.closePath()
}

const drawFlask = (index) => {
  const gap = flaskWidth * 2
  const x = containerGap + index * gap
  const y = containerGap + ballContainer

  ctx.beginPath()
  ctx.strokeRect(x, y, flaskWidth, flaskHeight)
  ctx.fill()
  ctx.closePath()

  return { x, y }
}

const clearCanvas = () => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}

const flasks = [
  { balls: ['red', 'blue', 'green', 'green'] },
  { balls: [] },
  { balls: [] },
  { balls: [] },
  { balls: [] },
  { balls: [] },
]

const getSlots = (x, y) => {
  const slots = []

  for (let i = 0; i < ballCount + 1; i++) {
    const yi = y + ballContainer * i

    slots.push({ x, y: yi })
  }

  const slotsQueue = slots.reverse()
  return slotsQueue
}

function draw() {
  clearCanvas()

  flasks.forEach((flask, i) => {
    const { x, y } = drawFlask(i)

    const slots = getSlots(x, y)

    // slots.forEach((slot) => drawBall(slot.x, slot.y, 'yellow'))
    flask.balls.forEach((ball, j) => {
      const { x: slotX, y: slotY } = slots[j]

      drawBall(slotX, slotY, ball)
    })
  })

  // if (x < 300) {
  //   x += dx
  //   y += dy
  // } else {
  //   clearInterval(myInterval)
  // }
}

draw()
// let myInterval = setInterval(draw, 10)
