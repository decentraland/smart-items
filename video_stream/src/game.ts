import { Spawner } from '../node_modules/decentraland-builder-scripts/spawner'
import Button, { Props } from './item'

const button = new Button()
const spawner = new Spawner<Props>(button)

spawner.spawn(
  'screen1',
  new Transform({
    position: new Vector3(4, 0, 8),
  }),
  {
    onClickText: 'Start stream',
    customStation: 'https://theuniverse.club/live/consensys/index.m3u8',
    startOn: false,
    volume: 0.8,
    onClick: [
      {
        actionId: 'toggle',
        entityName: 'screen1',
        values: {},
      },
    ],
  }
)

spawner.spawn(
  'screen2',
  new Transform({
    position: new Vector3(8, 0.5, 8),
  }),
  {
    onClickText: 'Start stream',
    customStation: 'https://theuniverse.club/live/consensys/index.m3u8',
    startOn: false,
    volume: 0.8,
    onClick: [
      {
        actionId: 'toggle',
        entityName: 'screen2',
        values: {},
      },
    ],
  }
)
