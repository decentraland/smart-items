import { Spawner } from '../node_modules/decentraland-builder-scripts/spawner'
import ScoreBoard, { Props } from './item'

const scoreBoard = new ScoreBoard()
const spawner = new Spawner<Props>(scoreBoard)

spawner.spawn(
  'scoreBoard',
  new Transform({
    position: new Vector3(4, 1.5, 8)
  }),
  {
    totalTime: 60,
    active: true,
    onThreshold: null,
    onTimeUp: null
  }
)
