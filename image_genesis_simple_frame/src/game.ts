import { Spawner } from '../node_modules/decentraland-builder-scripts/spawner'
import SignPost, { Props } from './item'

const post = new SignPost()
const spawner = new Spawner<Props>(post)

spawner.spawn(
  'post',
  new Transform({
    position: new Vector3(4, 1, 8),
    scale: new Vector3(4, 4, 4)
  }),
  {
    image:
      'https://lh6.googleusercontent.com/W6Ht1u0NKh59qt5zgdXNn8xrkYMxDXOFGdkiJVU9rWzOUdZ0wLE_qoYvltbmKNVcYAxAI5D82Q79Zeiw98-waNMCFhnZHM35BYEoNZie8w2ydhxrGuLd-aApfCs5-lv1aQAjsV2ar4G2K3Fd7kBFUJC7RdhBq1vCM-8FG5MziSBX-ubVQbQgOZgVUBaA2rjuFqBO0Q=s200'
  }
)
