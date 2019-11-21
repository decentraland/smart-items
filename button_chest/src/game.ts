import { Spawner } from '../node_modules/decentraland-builder-scripts/spawner'
import Chest, { Props } from './item'

const chest = new Chest()
const spawner = new Spawner<Props>(chest)

spawner.spawn(
  'chest',
  new Transform({
    position: new Vector3(4, 0, 8)
  }),
  {
    onClick: [
      {
        actionId: 'toggle',
        entityName: 'chest',
        values: {}
      }
    ]
  }
)
