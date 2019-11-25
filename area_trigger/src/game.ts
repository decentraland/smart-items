import { Spawner } from '../node_modules/decentraland-builder-scripts/spawner'
import AreaTrigger, { Props } from './item'

const button = new AreaTrigger()
const spawner = new Spawner<Props>(button)

spawner.spawn(
  'area1',
  new Transform({
    position: new Vector3(8, 0, 8),
    scale: new Vector3(8, 1, 4),
    rotation: Quaternion.Euler(90, 0, 0)
  })
)

const dbg = new Entity()
const shape = new BoxShape()
shape.withCollisions = false
const trs = new Transform({
  position: new Vector3(8, 0, 8),
  rotation: Quaternion.Euler(90, 0, 0)
})
const child = new Entity()
child.addComponent(
  new Transform({
    scale: new Vector3(8, 1, 4),
    position: new Vector3(0, 0.5, 0)
  })
)
dbg.addComponent(trs)
child.addComponent(shape)
child.setParent(dbg)
engine.addEntity(dbg)
