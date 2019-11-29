import { Spawner } from '../node_modules/decentraland-builder-scripts/spawner'
import Scroll, { Props } from './item'

const scroll = new Scroll()
const spawner = new Spawner<Props>(scroll)

spawner.spawn(
  'scroll',
  new Transform({
    position: new Vector3(4, 0, 8)
  }),
  {
    text: `Some
multiline text
haha
what a beautiful
test this is indeed`
  }
)

spawner.spawn(
  'scroll2',
  new Transform({
    position: new Vector3(3, 0, 6)
  }),
  {
    text: `simple text`
  }
)
