import { Spawner } from '../node_modules/decentraland-builder-scripts/spawner'
import Key, { Props } from './item'

const key = new Key()
const spawner = new Spawner<Props>(key)

spawner.spawn(
  'key',
  new Transform({
    position: new Vector3(4, 2, 8)
  }),
  {
    target: 'pepe',
    respawns: true
  }
)

spawner.spawn(
  'key2',
  new Transform({
    position: new Vector3(4, 1, 8)
  }),
  { target: 'pepe2', respawns: false }
)

const a = new Entity('pepe')
a.addComponent(new BoxShape())
a.addComponent(new Transform({ position: new Vector3(3, 0, 3) }))
engine.addEntity(a)
