import { Spawner } from '../node_modules/decentraland-builder-scripts/spawner'
import SignPost, { Props } from './item'

const post = new SignPost()
const spawner = new Spawner<Props>(post)

spawner.spawn('post', new Transform({ position: new Vector3(4, 0, 8) }), {
  textTop: 'Juancalandia',
  textLower: 'La villa',
  fontSize: 20
})
