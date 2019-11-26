import { Spawner } from '../node_modules/decentraland-builder-scripts/spawner'
import ScoreBoard, { Props } from './item'

const scoreBoard = new ScoreBoard()
const spawner = new Spawner<Props>(scoreBoard)

spawner.spawn(
  'scoreBoard',
  new Transform({
    position: new Vector3(4, 2, 8),
    rotation: Quaternion.Euler(90, 0, 0)
  }),
  {
    totalTime: 60,
    active: true,
    onThreshold: null,
    onTimeUp: null
  }
)
