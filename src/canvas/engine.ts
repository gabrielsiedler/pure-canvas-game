import { ballContainer, ballCount, flaskWidth, flaskHeight } from '../definitions'
import { clearCanvas, drawBall, drawFlask } from './draw'

const canvas = <HTMLCanvasElement>document.getElementById('gameScreen')
let ctx = canvas.getContext('2d')

interface flask {
  pos: {
    startX?: number
    endX?: number
    startY?: number
    endY?: number
  }
  balls: string[]
}

const flasks: flask[] = [
  { pos: {}, balls: ['blue', 'orange', 'red', 'blue'] },
  { pos: {}, balls: ['orange', 'orange', 'red', 'blue'] },
  { pos: {}, balls: ['red', 'blue', 'orange', 'red'] },
  { pos: {}, balls: [] },
  { pos: {}, balls: [] },
]

interface selected {
  flask?: number
  color?: string
}

const selected: selected = {
  flask: -1,
  color: null,
}

const getSlots = (x: number, y: number) => {
  const slots = []

  for (let i = 0; i < ballCount + 1; i++) {
    const yi = y + ballContainer * i

    slots.push({ x, y: yi })
  }

  const slotsQueue = slots.reverse()
  return slotsQueue
}

const setupFlask = (flask: flask, x: number, y: number) => {
  flask.pos = {
    startX: x,
    endX: x + flaskWidth,
    startY: y,
    endY: y + flaskHeight,
  }
}

const draw = () => {
  clearCanvas(ctx, canvas)

  flasks.forEach((flask, i) => {
    const { x, y } = drawFlask(ctx, flask, i)
    setupFlask(flask, x, y)
    const slots = getSlots(x, y)

    const ballsInFlask = flask.balls.length
    const flaskIsSelected = selected.flask === i
    flask.balls.forEach((ball, j) => {
      let { x: slotX, y: slotY } = slots[j]
      const isLastBallInFlask = j === ballsInFlask - 1

      if (flaskIsSelected && isLastBallInFlask) {
        const activeSlot = slots[ballCount]

        slotX = activeSlot.x
        slotY = activeSlot.y
      }

      drawBall(ctx, slotX, slotY, ball)
    })
  })
}

const moveTo = (targetFlask: flask) => {
  flasks[selected.flask].balls.pop()
  targetFlask.balls.push(selected.color)
}

const tryToMoveTo = (target: number) => {
  const targetFlask = flasks[target]

  const isEmpty = targetFlask.balls.length === 0
  const isFull = targetFlask.balls.length === ballCount
  const lastBallInFlaskIndex = targetFlask.balls.length - 1
  const lastBallInFlask = targetFlask.balls[lastBallInFlaskIndex]

  if (isEmpty || (lastBallInFlask === selected.color && !isFull)) {
    moveTo(targetFlask)

    return true
  }

  return false
}

document.getElementById('gameScreen').onclick = (event: any) => {
  var clickX = event.layerX
  var clickY = event.layerY

  const sel = flasks.findIndex((flask) => {
    const { pos } = flask

    const isX = clickX >= pos.startX && clickX <= pos.endX
    const isY = clickY >= pos.startY && clickY <= pos.endY

    return isX && isY
  })

  if (sel === -1) return

  if (sel === selected.flask) {
    selected.flask = -1
    selected.color = null

    return
  }

  if (selected.flask === -1 && !flasks[sel].balls.length) return

  if (selected.flask >= 0 && tryToMoveTo(sel)) {
    selected.flask = -1
    selected.color = null

    return
  }

  selected.flask = sel
  const lastBallInFlask = flasks[sel].balls.length - 1
  selected.color = flasks[sel].balls[lastBallInFlask]
}

export const start = () => {
  const gameInterval = setInterval(draw, 10)
}
