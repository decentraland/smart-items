import { Spawner } from '../node_modules/decentraland-builder-scripts/spawner'
import SignPost, { Props } from './item'

const post = new SignPost()
const spawner = new Spawner<Props>(post)

spawner.spawn(
  'post',
  new Transform({
    position: new Vector3(4, 1, 8),
    scale: new Vector3(4, 4, 4),
  }),
  {
    image:
      'https://s3.amazonaws.com/events.decentraland.org/poster/570906395efe2b3f.png',
    nsfw: true,
  }
)
