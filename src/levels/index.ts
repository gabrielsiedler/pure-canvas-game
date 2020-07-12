import { level as level1 } from './1'
import { level as level2 } from './2'
import { level as level3 } from './3'
import { level as level4 } from './4'
import { level as level5 } from './5'
import { level as level6 } from './6'

export const levels: any = {
  1: level1,
  2: level2,
  3: level3,
  4: level4,
  5: level5,
  6: level6,
}

export { getLevel, getNextLevel } from './hash'
