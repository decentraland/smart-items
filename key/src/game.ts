import { Spawner } from '../node_modules/decentraland-builder-scripts/spawner'
import Scroll, { Props } from './item'

const scroll = new Scroll()
const spawner = new Spawner<Props>(scroll)

spawner.spawn(
  'scroll',
  new Transform({
    position: new Vector3(4, 2, 8)
  }),
  {
    text: 'Testing'
  }
)
