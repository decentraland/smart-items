import { Spawner } from '../node_modules/decentraland-builder-scripts/spawner'
import Spark, { Props } from './item'

const arrow = new Spark()
const spawner = new Spawner<Props>(arrow)

spawner.spawn(
  'spark',
  new Transform({
    position: new Vector3(4, 1, 8),
  }),
  { active: true }
)
