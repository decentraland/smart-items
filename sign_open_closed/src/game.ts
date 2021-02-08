import { Spawner } from '../node_modules/decentraland-builder-scripts/spawner'
import Lamp, { Props } from './item'

const myLamp = new Lamp()
const spawner = new Spawner<Props>(myLamp)

spawner.spawn(
  'myLamp',
  new Transform({
    position: new Vector3(4, 2, 8),
  }),
  {
    clickable: true,
    startOn: true,
  }
)
