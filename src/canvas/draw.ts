import { ballContainer, ballRadius, containerGap, flaskHeight, flaskWidth } from '../definitions'

export const drawBall = (ctx: any, slotX: number, slotY: number, color: string) => {
  ctx.beginPath()
  ctx.arc(slotX + ballContainer / 2, slotY - ballContainer / 2, ballRadius, 0, Math.PI * 2)
  ctx.fillStyle = color
  ctx.fill()
  ctx.closePath()
}

export const drawFlask = (ctx: any, flask: any, index: number) => {
  const gap = flaskWidth * 2
  const x = containerGap + index * gap
  const y = containerGap + ballContainer

  ctx.beginPath()
  ctx.strokeRect(x, y, flaskWidth, flaskHeight)
  ctx.fill()
  ctx.closePath()

  return { x, y }
}

export const clearCanvas = (ctx: any, canvas: any) => {
  ctx.clearRect(0, 0, canvas.width, canvas.height)
}
