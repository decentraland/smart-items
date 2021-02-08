
import { Spawner } from '../node_modules/decentraland-builder-scripts/spawner'
import Platform, { Props } from './item'

const platform = new Platform()
const spawner = new Spawner<Props>(platform)

spawner.spawn('platform', new Transform({ position: new Vector3(8, 0, 8) }), {
  distance: 4,
  speed: 5,
  onReachStart: [{ entityName: 'platform', actionId: 'goToEnd', values: {} }],
  onReachEnd: [{ entityName: 'platform', actionId: 'goToStart', values: {} }]
})
