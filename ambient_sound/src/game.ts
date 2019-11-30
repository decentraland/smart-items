import { Spawner } from '../node_modules/decentraland-builder-scripts/spawner'
import Ambient, { Props } from './item'

const sound = new Ambient()
const spawner = new Spawner<Props>(sound)

spawner.spawn(
  'sound',
  new Transform({
    position: new Vector3(4, 2, 8)
  }),
  { active: true, loop: true, sound: 'Birds' }
)
