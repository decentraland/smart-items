import { Spawner } from '../node_modules/decentraland-builder-scripts/spawner'
import ScoreBoard, { Props } from './item'

const timer = new ScoreBoard()
const spawner = new Spawner<Props>(timer)

spawner.spawn(
  'scoreBoard',
  new Transform({
    position: new Vector3(4, 1.5, 8)
  }),
  {
    totalTime: 6,
    active: true,
    onThreshold: null,
    onTimeUp: [{ entityName: 'timer', actionId: 'reset', values: {} }]
  }
)
