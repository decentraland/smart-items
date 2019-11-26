import { Spawner } from '../node_modules/decentraland-builder-scripts/spawner'
import TrapDoor, { Props } from './item'

const door = new TrapDoor()
const spawner = new Spawner<Props>(door)

spawner.spawn('door', new Transform({ position: new Vector3(4, 1, 8) }), {
  onClick: [{ entityName: 'door', actionId: 'toggle', values: {} }]
})
