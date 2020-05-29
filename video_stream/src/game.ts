import { Spawner } from '../node_modules/decentraland-builder-scripts/spawner'
import Button, { Props } from './item'

const button = new Button()
const spawner = new Spawner<Props>(button)

spawner.spawn(
  'button',
  new Transform({
    position: new Vector3(4, 1, 8),
  }),
  {
    onClickText: 'Start stream',
    customStation: 'https://theuniverse.club/live/genesisplaza/index.m3u8',
    startOn: false,
    onClick: [
      {
        actionId: 'toggle',
        entityName: 'button',
        values: {},
      },
    ],
  }
)
