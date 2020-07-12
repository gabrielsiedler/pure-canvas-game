import { ballContainer, ballCount } from '../definitions'
import { clearCanvas, drawBall, drawFlask } from './draw'

const canvas = <HTMLCanvasElement>document.getElementById('myCanvas')
let ctx = canvas.getContext('2d')

const flasks = [
  { balls: ['blue', 'orange', 'red', 'blue'] },
  { balls: ['orange', 'orange', 'red', 'blue'] },
  { balls: ['red', 'blue', 'orange', 'red'] },
  { balls: [] },
  { balls: [] },
]

const getSlots = (x: number, y: number) => {
  const slots = []

  for (let i = 0; i < ballCount + 1; i++) {
    const yi = y + ballContainer * i

    slots.push({ x, y: yi })
  }

  const slotsQueue = slots.reverse()
  return slotsQueue
}

export const start = () => {
  clearCanvas(ctx, canvas)

  flasks.forEach((flask, i) => {
    const { x, y } = drawFlask(ctx, i)

    const slots = getSlots(x, y)

    flask.balls.forEach((ball, j) => {
      const { x: slotX, y: slotY } = slots[j]

      drawBall(ctx, slotX, slotY, ball)
    })
  })
}
