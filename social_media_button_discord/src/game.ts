import { Spawner } from '../node_modules/decentraland-builder-scripts/spawner'
import SMedia_Link, { Props } from './item'

const post = new SMedia_Link()
const spawner = new Spawner<Props>(post)

spawner.spawn('post', new Transform({ position: new Vector3(4, 0, 8) }), {
  name: 'Juancalandia',
  url: '/channels/417796904760639509/433376431603580970',
  bnw: false,
})
