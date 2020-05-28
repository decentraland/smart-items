import { Spawner } from '../node_modules/decentraland-builder-scripts/spawner'
import AreaTrigger, { Props } from './item'

const area = new AreaTrigger()
const spawner = new Spawner<Props>(area)

spawner.spawn(
  'area1',
  new Transform({
    position: new Vector3(8, 0, 8),
    scale: new Vector3(1, 1, 1),
    rotation: Quaternion.Euler(0, 0, 0),
  })
)
