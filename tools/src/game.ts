import { Spawner } from '../node_modules/decentraland-builder-scripts/spawner'
import Tools, { Props } from './item'

const tools = new Tools()
const toolsSpawner = new Spawner<Props>(tools)

toolsSpawner.spawn('tools', new Transform(), {})

const box = new Entity('box')
engine.addEntity(box)
box.addComponent(new BoxShape())
box.addComponent(new Transform({ position: new Vector3(4, 0, 4) }))
box.addComponent(
  new OnPointerDown(() => {
    const bus = new MessageBus()
    bus.emit('tools', {
      entityName: 'tools',
      sender: 'channel-id',
      actionId: 'delay',
      values: {
        delay: 2,
        onComplete: [
          {
            entityName: 'tools',
            sender: 'channel-id',
            actionId: 'print',
            values: {
              message: 'Hola',
              duration: 5
            }
          },
          {
            entityName: 'tools',
            sender: 'channel-id',
            actionId: 'delay',
            values: {
              delay: 1,
              onComplete: [
                {
                  entityName: 'tools',
                  sender: 'channel-id',
                  actionId: 'print',
                  values: {
                    message: 'Como andas',
                    duration: 5
                  }
                }
              ]
            }
          }
        ]
      }
    })

    bus.emit('tools', {
      entityName: 'tools',
      actionId: 'move',
      values: {
        target: 'box',
        x: 4,
        y: 0,
        z: 4,
        speed: 10,
        relative: false,
        onComplete: [
          {
            entityName: 'tools',
            actionId: 'move',
            values: {
              target: 'box',
              x: 0,
              y: 5,
              z: 0,
              speed: 10,
              relative: true,
              onComplete: [
                {
                  entityName: 'tools',
                  actionId: 'scale',
                  values: {
                    target: 'box',
                    x: 2,
                    y: 2,
                    z: 2,
                    speed: 10,
                    relative: true,
                    onComplete: [
                      {
                        entityName: 'tools',
                        actionId: 'rotate',
                        values: {
                          target: 'box',
                          x: 0,
                          y: 0,
                          z: 180,
                          speed: 10,
                          relative: true,
                          onComplete: []
                        }
                      }
                    ]
                  }
                }
              ]
            }
          }
        ]
      }
    })
  })
)
