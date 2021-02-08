import { Spawner } from '../node_modules/decentraland-builder-scripts/spawner'
import Door, { Props } from './item'

const myLamp = new Door()
const spawner = new Spawner<Props>(myLamp)

spawner.spawn(
  'myLamp',
  new Transform({
    position: new Vector3(4, 0, 8),
  }),
  {
    clickable: true
  }
 
)
