import { TweenSystem, Tweenable, Tween, Syncable, TweenType } from './tween'
import { setTimeout, DelaySystem } from './delay'

export type Props = {}

type DelayValues = {
  timeout: number
  onTimeout: Actions
}

type PrintValues = {
  message: string
  duration: number
  multiplayer: boolean
}

type SyncEntity = {
  entityName: string
  transform: {
    position: [number, number, number],
    rotation: [number, number, number, number],
    scale: [number, number, number]
  },
  tween?: {
    transition: number
    type: TweenType
    x: number
    y: number
    z: number
    speed: number
    relative: boolean
    onComplete: Actions
    origin: Vector3
  }
}

const syncv = (vector: Vector3, values: [number, number, number]) => {
  const [x, y, z] = values
  vector.set(x, y, z)
}

const syncq = (quaternion: Quaternion, values: [number, number, number, number]) => {
  const [x, y, z, w] = values
  quaternion.set(x, y, z, w)
}

const getEntityByName = (name: string) =>
  Object.keys(engine.entities)
    .map(key => engine.entities[key])
    .filter(entity => (entity as Entity).name === name)[0]

export default class Tools implements IScript<Props> {
  canvas = new UICanvas()
  container: UIContainerStack

  tweenSystem = new TweenSystem()
  delaySystem = new DelaySystem()

  getContainer = () => {
    if (!this.container) {
      this.container = new UIContainerStack(this.canvas)
      this.container.width = 800
      this.container.height = '100%'
      this.container.hAlign = 'center'
      this.container.vAlign = 'bottom'
      this.container.positionY = 50
    }

    return this.container
  }
  init() {
    engine.addSystem(this.tweenSystem)
    engine.addSystem(this.delaySystem)
  }

  getEntities() {
    return this.tweenSystem.syncableGroup.entities as Entity[]
  }

  spawn(host: Entity, props: Props, channel: IChannel) {
    // handle actions
    channel.handleAction<Tween>('move', action => {
      const { target, ...tween } = action.values
      const entity = getEntityByName(target)
      if (entity) {
        const origin = entity.getComponent(Transform).position.clone()
        const tweenable = new Tweenable({
          ...tween,
          type: 'move',
          channel,
          origin
        })
        entity.addComponentOrReplace(tweenable)
        entity.addComponentOrReplace(new Syncable())
      }
    })

    channel.handleAction<Tween>('rotate', action => {
      const { target, ...tween } = action.values
      const entity = getEntityByName(target)
      if (entity) {
        const origin = entity.getComponent(Transform).rotation.clone()
          .eulerAngles
        const tweenable = new Tweenable({
          ...tween,
          type: 'rotate',
          channel,
          origin
        })
        entity.addComponentOrReplace(tweenable)
        entity.addComponentOrReplace(new Syncable())
      }
    })

    channel.handleAction<Tween>('scale', action => {
      const { target, ...tween } = action.values
      const entity = getEntityByName(target)
      if (entity) {
        const origin = entity.getComponent(Transform).scale.clone()
        const tweenable = new Tweenable({
          ...tween,
          type: 'scale',
          channel,
          origin
        })
        entity.addComponentOrReplace(tweenable)
        entity.addComponentOrReplace(new Syncable())
      }
    })

    channel.handleAction<DelayValues>('delay', action => {
      const { timeout, onTimeout } = action.values
      if (action.sender === channel.id) {
        setTimeout(() => {
          channel.sendActions(onTimeout)
        }, timeout * 1000)
      }
    })

    channel.handleAction<DelayValues>('interval', action => {
      const { timeout, onTimeout } = action.values
      if (action.sender === channel.id) {
        const intervalAction = channel.createAction<DelayValues>(
          action.actionId,
          action.values
        )
        channel.sendActions(onTimeout)
        setTimeout(() => channel.sendActions([intervalAction]), timeout * 1000)
      }
    })

    channel.handleAction<PrintValues>('print', action => {
      const { message, duration, multiplayer } = action.values

      if (!multiplayer && action.sender !== channel.id) {
        // if not multiplayer and not ours prevent showing the message
        return
      }

      const text = new UIText(this.getContainer())
      text.value = message
      text.fontSize = 24
      text.height = 30
      text.width = '100%'
      text.hAlign = 'center'
      text.hTextAlign = 'center'

      setTimeout(() => {
        text.visible = false
        text.height = 0
      }, duration * 1000)
    })

    // sync initial values
    channel.request<SyncEntity[]>('syncEntities', syncEntities => {
      for (const syncEntity of syncEntities) {
        const { entityName, transform, tween } = syncEntity
        const entity = getEntityByName(entityName)
        if (entity) {
          const original = entity.getComponent(Transform)
          syncv(original.position, transform.position)
          syncq(original.rotation, transform.rotation)
          syncv(original.scale, transform.scale)
          if (tween) {
            const tweenable = new Tweenable({
              ...tween,
              channel
            })
            entity.addComponentOrReplace(tweenable)
          }
        }
      }
    })
    channel.reply<SyncEntity[]>('syncEntities', () => {
      const entities = this.getEntities()
      return entities.map(entity => {
        const transform = entity.getComponent(Transform)
        const syncEntity: SyncEntity = {
          entityName: entity.name,
          transform: {
            position: [transform.position.x, transform.position.y, transform.position.z],
            rotation: [transform.rotation.x, transform.rotation.y, transform.rotation.z, transform.rotation.w],
            scale: [transform.scale.x, transform.scale.y, transform.scale.z],
          }
        }
        if (entity.hasComponent(Tweenable)) {
          const { channel: _, ...tween } = entity.getComponent(Tweenable)
          syncEntity.tween = tween
        }
        return syncEntity
      })
    })
  }
}
