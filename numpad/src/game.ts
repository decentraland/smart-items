import { Spawner } from '../node_modules/decentraland-builder-scripts/spawner'
import NumPad, { Props } from './item'

const numPad = new NumPad()
const spawner = new Spawner<Props>(numPad)

spawner.spawn('numPad', new Transform({ position: new Vector3(4, 1.7, 8) }), {
  combination: 123,
  blocked: false,
  onWrong: null,
  onSolve: null
})
