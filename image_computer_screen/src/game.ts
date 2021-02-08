
import { Spawner } from '../node_modules/decentraland-builder-scripts/spawner'
import SignPost, { Props } from './item'

const post = new SignPost()
const spawner = new Spawner<Props>(post)

spawner.spawn(
  'post',
  new Transform({
    position: new Vector3(4, 0, 8),
    scale: new Vector3(4, 4, 4),
  }),
  {
    image: 'https://i.imgur.com/d25gO61.jpg',
  }
)