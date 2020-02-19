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
    respawns: false
  }
)

spawner.spawn(
  'key2',
  new Transform({
    position: new Vector3(4, 1, 8)
  }),
  { target: 'pepe2', respawns: true }
)

const a = new Entity('pepe')
a.addComponent(new BoxShape())
a.addComponent(new Transform({ position: new Vector3(3, 0, 3) }))
engine.addEntity(a)

const b = new Entity('pepe2')
b.addComponent(new BoxShape())
b.addComponent(new Transform({ position: new Vector3(5, 0, 3) }))
engine.addEntity(b)
