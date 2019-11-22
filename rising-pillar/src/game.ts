import { Spawner } from '../node_modules/decentraland-builder-scripts/spawner'
import Platform, { Props } from './item'

const pillar = new Platform()
const spawner = new Spawner<Props>(pillar)

spawner.spawn('pillar', new Transform({ position: new Vector3(8, 0, 8) }), {
  height: 15,
  speed: 5,
  autoStart: true,
  onReachBottom: [{ entityName: 'pillar', actionId: 'rise', values: {} }],
  onReachTop: [{ entityName: 'pillar', actionId: 'hide', values: {} }]
})
