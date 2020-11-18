import { Spawner } from '../node_modules/decentraland-builder-scripts/spawner'
import SignPost, { Props } from './item'

const post = new SignPost()
const spawner = new Spawner<Props>(post)

spawner.spawn('post', new Transform({ position: new Vector3(4, 2, 8) }), {
  text: 'Juancalandia',
  fontSize: 10,
  font: 'SF',
})
