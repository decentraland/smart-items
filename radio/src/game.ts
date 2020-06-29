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
    onClickText: 'Radio On/Off',
    customStation: 'https://icecast.ravepartyradio.org/ravepartyradio-192.mp3',
    startOn: false,
    volume: 0.8,
    onClick: [
      {
        actionId: 'toggle',
        entityName: 'button',
        values: {},
      },
    ],
  }
)
