export { default as vector } from './vector'

import Geo from './Geo'
import Shapes from './Shapes'
import Look from './Look'

const alpha = 'abcdefghijklmnopqrstuvwxyz'
const ALPHA = alpha.toUpperCase()
const numbers = '0123456789'

export const alphabet = alpha.split('')
export const alphanum = (alpha+ALPHA+numbers).split('')
export const numalpha = (numbers+alpha+ALPHA).split('')

export default Geo