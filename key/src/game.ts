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
    onClick: [
      {
        entityName: 'key',
        actionId: 'equip',
        values: {}
      }
    ]
  }
)

spawner.spawn(
  'key2',
  new Transform({
    position: new Vector3(4, 1, 8)
  }),
  {
    onClick: [
      {
        entityName: 'key2',
        actionId: 'equip',
        values: {}
      }
    ]
  }
)
