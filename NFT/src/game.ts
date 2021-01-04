import { Spawner } from '../node_modules/decentraland-builder-scripts/spawner'
import SignPost, { Props } from './item'

const post = new SignPost()
const spawner = new Spawner<Props>(post)

spawner.spawn(
  'post',
  new Transform({
    position: new Vector3(4, 0, 8),
    scale: new Vector3(1, 1, 1),
  }),
  {
    contract: '0x06012c8cf97BEaD5deAe237070F9587f8E7A266d',
    id: '558536',
    color: '#0000FF',
    style: 'Classic',
    ui: true,
    uiText: 'I really like this painting, I did it myself.',
  }
)
