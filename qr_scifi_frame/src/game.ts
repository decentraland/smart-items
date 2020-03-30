import { Spawner } from '../node_modules/decentraland-builder-scripts/spawner'
import SignPost, { Props } from './item'

const post = new SignPost()
const spawner = new Spawner<Props>(post)

spawner.spawn('post', new Transform({ position: new Vector3(4, 1, 8) }), {
  text: 'Make a donation',
  fontSize: 20,
  publicKey: '0xe2b6024873d218B2E83B462D3658D8D7C3f55a18'
})
