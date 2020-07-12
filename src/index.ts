import { start } from './canvas/engine'
import { getLevel } from './levels'

const urlParams = new URLSearchParams(window.location.search)
const levelHash = urlParams.get('level')

const level = getLevel(levelHash)

start(level, levelHash)
