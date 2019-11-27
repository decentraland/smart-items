import { Spawner } from '../node_modules/decentraland-builder-scripts/spawner'
import InvisibleWall, { Props } from './item'

const wall = new InvisibleWall()
const spawner = new Spawner<Props>(wall)

spawner.spawn(
  'wall1',
  new Transform({
    position: new Vector3(8, 0, 8),
    scale: new Vector3(8, 1, 8),
    rotation: Quaternion.Euler(90, 45, 0)
  })
)
declare var console
console.log(engine)
