import { ballContainer, ballCount, containerGap, flaskWidth, flaskHeight } from '../definitions'
import { clearCanvas, drawBall, drawFlask } from './draw'
import { getNextLevel } from '../levels'
import { level } from '~levels/1'

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

let flasks: flask[]

interface selected {
  flask?: number
  color?: string
}

const selected: selected = {
  flask: -1,
  color: null,
}

let moves = 0
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

  if (hasMoved) {
    checkGameState()
    hasMoved = false
  }
}

const checkGameState = () => {
  const completed = flasks.every((flask) => {
    const ballsLength = flask.balls.length

    if (ballsLength > 0 && ballsLength < ballCount) return false
    if (!ballsLength) return true

    let flaskBallColor: string
    return flask.balls.every((ball) => {
      if (!flaskBallColor) {
        flaskBallColor = ball

        return true
      }

      return flaskBallColor === ball
    })
  })

  if (completed) {
    finished = true
    alert(`Nice! You finished with ${moves} moves.`)

    toNextLevel()
  }
}

let finished = false
let hasMoved = false
const moveTo = (targetFlask: flask) => {
  flasks[selected.flask].balls.pop()
  targetFlask.balls.push(selected.color)

  hasMoved = true
  moves += 1

  const movesText = moves === 1 ? `1 move` : `${moves} moves`
  const countElement = document.getElementById('count')
  countElement.innerText = String(movesText)
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

document.getElementById('reset').onclick = () => {
  if (window.confirm('Are you sure you want to reset the game?')) {
    document.location.reload()
  }
}

document.getElementById('gameScreen').onclick = (event: any) => {
  if (finished) return

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

const toNextLevel = () => {
  if (currentLevel === 6) {
    alert('Done! You have beaten all levels.')

    return
  }

  const newHash = getNextLevel(currentLevelHash, flasks)

  var params = [`level=${newHash}`]

  window.location.href = 'http://' + window.location.host + window.location.pathname + '?' + params.join('&')
}

let currentLevelHash: string
let currentLevel: number
export const start = (level: any, levelHash: string) => {
  flasks = level.level
  currentLevelHash = levelHash
  currentLevel = level.number

  document.getElementById('currentLevel').innerText = `${String(currentLevel)} / 6`
  canvas.width = (2 * containerGap + flasks.length * flaskWidth) * 2

  const gameInterval = setInterval(draw, 10)
}
