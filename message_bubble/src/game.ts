import { Spawner } from '../node_modules/decentraland-builder-scripts/spawner'
import MessageBubble, { Props } from './item'

const post = new MessageBubble()
const spawner = new Spawner<Props>(post)

spawner.spawn('bubble', new Transform({ position: new Vector3(4, 1, 8) }), {
  text: 'eeee wacho',
  fontSize: 30
})
