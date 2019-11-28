import { Spawner } from '../node_modules/decentraland-builder-scripts/spawner'
import PadLock, { Props } from './item'

const padLock = new PadLock()
const spawner = new Spawner<Props>(padLock)

spawner.spawn('padLock', new Transform({ position: new Vector3(4, 1.7, 8) }), {
  combination: 1234,
  onSolve: null
})
