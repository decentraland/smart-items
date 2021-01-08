import { Spawner } from '../node_modules/decentraland-builder-scripts/spawner'
import SMedia_Link, { Props } from './item'

const post = new SMedia_Link()
const spawner = new Spawner<Props>(post)

spawner.spawn('post', new Transform({ position: new Vector3(4, 0, 8) }), {
  name: 'Juancalandia',
  url: 'https://www.facebook.com/decentraland/posts/1693201640849682',
})
