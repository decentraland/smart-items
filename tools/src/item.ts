import {
  TweenSystem,
  Tweenable,
  Tween,
  Syncable,
  TweenType,
  CurveType,
} from './tween'
import { setTimeout, DelaySystem } from './delay'
import { Animated, AnimType } from './animation'

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

type AnimationValues = {
  target: string
  animAction: string
  speed: number
  loop: boolean
  animation?: string
}

type SyncEntity = {
  entityName: string
  transform: {
    position: [number, number, number]
    rotation: [number, number, number, number]
    scale: [number, number, number]
  }
  tween?: {
    transition: number
    type: TweenType
    curve: CurveType
    x: number
    y: number
    z: number
    speed: number
    relative: boolean
    onComplete: Actions
    origin: Vector3
  }
  anim?: {
    type: AnimType
    name: string
    speed: number
    loop: boolean
  }
}

const syncv = (vector: Vector3, values: [number, number, number]) => {
  const [x, y, z] = values
  vector.set(x, y, z)
}

const syncq = (
  quaternion: Quaternion,
  values: [number, number, number, number]
) => {
  const [x, y, z, w] = values
  quaternion.set(x, y, z, w)
}

const getEntityByName = (name: string) =>
  Object.keys(engine.entities)
    .map((key) => engine.entities[key])
    .filter((entity) => (entity as Entity).name === name)[0]

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
    channel.handleAction<Tween>('move', (action) => {
      const { target, ...tween } = action.values
      const sender = action.sender
      const entity = getEntityByName(target)

      if (entity) {
        const currentTime: number = +Date.now()
        if (entity.hasComponent(Tweenable)) {
          let existingTweenble = entity.getComponent(Tweenable)
          if (
            existingTweenble.sender !== action.sender &&
            existingTweenble.type == 'move' &&
            currentTime - existingTweenble.timestamp < 500 &&
            existingTweenble.x === action.values.x &&
            existingTweenble.y === action.values.y &&
            existingTweenble.z === action.values.z
          ) {
            // same tween already in progress?
            return
          }
        }

        const origin = entity.getComponent(Transform).position.clone()
        const tweenable = new Tweenable({
          ...tween,
          type: 'move',
          channel,
          origin,
          sender,
          timestamp: currentTime,
        })
        entity.addComponentOrReplace(tweenable)
        entity.addComponentOrReplace(new Syncable())
      }
    })

    channel.handleAction<Tween>('rotate', (action) => {
      const { target, ...tween } = action.values
      const sender = action.sender
      const entity = getEntityByName(target)
      if (entity) {
        const currentTime: number = +Date.now()
        if (entity.hasComponent(Tweenable)) {
          let existingTweenble = entity.getComponent(Tweenable)
          if (
            existingTweenble.sender !== action.sender &&
            existingTweenble.type == 'rotate' &&
            currentTime - existingTweenble.timestamp < 500 &&
            existingTweenble.x === action.values.x &&
            existingTweenble.y === action.values.y &&
            existingTweenble.z === action.values.z
          ) {
            // same tween already in progress?
            return
          }
        }
        const origin = entity.getComponent(Transform).rotation.clone()
          .eulerAngles
        const tweenable = new Tweenable({
          ...tween,
          type: 'rotate',
          channel,
          origin,
          sender,
          timestamp: currentTime,
        })
        entity.addComponentOrReplace(tweenable)
        entity.addComponentOrReplace(new Syncable())
      }
    })

    channel.handleAction<Tween>('scale', (action) => {
      const { target, ...tween } = action.values
      const sender = action.sender
      const entity = getEntityByName(target)
      if (entity) {
        const currentTime: number = +Date.now()
        if (entity.hasComponent(Tweenable)) {
          let existingTweenble = entity.getComponent(Tweenable)
          if (
            existingTweenble.sender !== action.sender &&
            existingTweenble.type == 'scale' &&
            currentTime - existingTweenble.timestamp < 500 &&
            existingTweenble.x === action.values.x &&
            existingTweenble.y === action.values.y &&
            existingTweenble.z === action.values.z
          ) {
            // same tween already in progress?
            return
          }
        }
        const origin = entity.getComponent(Transform).scale.clone()
        const tweenable = new Tweenable({
          ...tween,
          type: 'scale',
          channel,
          origin,
          sender,
          timestamp: currentTime,
        })
        entity.addComponentOrReplace(tweenable)
        entity.addComponentOrReplace(new Syncable())
      }
    })

    channel.handleAction<AnimationValues>('animate', (action) => {
      const { target, animation, animAction, speed, loop } = action.values
      const sender = action.sender
      const entity = getEntityByName(target)
      if (entity) {
        const currentTime: number = +Date.now()
        let animator: Animator

        if (entity.hasComponent(Animator)) {
          animator = entity.getComponent(Animator)
        } else {
          animator = new Animator()
          entity.addComponent(animator)
        }

        let currentAnim: string
        switch (animAction) {
          case 'play':
            if (entity.hasComponent(Animated)) {
              let existingAnim = entity.getComponent(Animated)

              if (
                existingAnim.sender !== action.sender &&
                existingAnim.type == 'play' &&
                currentTime - existingAnim.timestamp < 500 &&
                existingAnim.name === action.values.animation &&
                existingAnim.speed === existingAnim.speed
              ) {
                // same anim already in progress?
                break
              }
              if (existingAnim.type == 'play') {
                // stop any other playing animations

                animator.getClip(existingAnim.name).stop()
              }
            }

            let animClip = animator.getClip(animation)
            animClip.looping = loop
            animClip.speed = speed
            animClip.playing = true
            const animated = new Animated({
              type: 'play',
              name: animation,
              speed: speed,
              loop: loop,
              channel,
              sender,
              timestamp: currentTime,
            })

            entity.addComponentOrReplace(animated)
            entity.addComponentOrReplace(new Syncable())
            break
          case 'stop':
            if (!entity.hasComponent(Animated)) {
              break
            }
            currentAnim = entity.getComponent(Animated).name

            animator.getClip(currentAnim).stop()
            entity.getComponent(Animated).type = 'stop'
            break
          case 'pause':
            if (!entity.hasComponent(Animated)) {
              break
            }
            currentAnim = entity.getComponent(Animated).name

            animator.getClip(currentAnim).pause()
            entity.getComponent(Animated).type = 'pause'
            break
          case 'reset':
            if (!entity.hasComponent(Animated)) {
              break
            }
            currentAnim = entity.getComponent(Animated).name

            animator.getClip(currentAnim).reset()
            entity.getComponent(Animated).type = 'reset'
            break
        }
      }
    })

    channel.handleAction<DelayValues>('delay', (action) => {
      const { timeout, onTimeout } = action.values
      if (action.sender === channel.id) {
        setTimeout(() => {
          channel.sendActions(onTimeout)
        }, timeout * 1000)
      }
    })

    channel.handleAction<DelayValues>('interval', (action) => {
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

    channel.handleAction<PrintValues>('print', (action) => {
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
    channel.request<SyncEntity[]>('syncEntities', (syncEntities) => {
      for (const syncEntity of syncEntities) {
        const { entityName, transform, tween, anim } = syncEntity
        const entity = getEntityByName(entityName)
        if (entity) {
          const original = entity.getComponent(Transform)
          syncv(original.position, transform.position)
          syncq(original.rotation, transform.rotation)
          syncv(original.scale, transform.scale)
          if (tween) {
            const tweenable = new Tweenable({
              ...tween,
              channel,
            })

            entity.addComponentOrReplace(tweenable)
          }
          if (anim) {
            const animated = new Animated({
              ...anim,
              channel,
            })
            entity.addComponentOrReplace(animated)
            let animator = new Animator()
            entity.addComponentOrReplace(animator)

            let animClip = animator.getClip(anim.name)
            animClip.looping = anim.loop
            animClip.speed = anim.speed
            switch (anim.type) {
              case 'play':
                animClip.play()
                break
              case 'stop':
                animClip.stop()
                break
              case 'pause':
                animClip.pause()
                break
              case 'reset':
                animClip.reset()
                break
            }
          }
        }
      }
    })
    channel.reply<SyncEntity[]>('syncEntities', () => {
      const entities = this.getEntities()
      return entities.map((entity) => {
        const transform = entity.getComponent(Transform)
        const syncEntity: SyncEntity = {
          entityName: entity.name,
          transform: {
            position: [
              transform.position.x,
              transform.position.y,
              transform.position.z,
            ],
            rotation: [
              transform.rotation.x,
              transform.rotation.y,
              transform.rotation.z,
              transform.rotation.w,
            ],
            scale: [transform.scale.x, transform.scale.y, transform.scale.z],
          },
        }
        if (entity.hasComponent(Tweenable)) {
          const { channel: _, ...tween } = entity.getComponent(Tweenable)
          syncEntity.tween = tween
        }
        if (entity.hasComponent(Animated)) {
          const { channel: _, ...anim } = entity.getComponent(Animated)
          syncEntity.anim = anim
        }

        return syncEntity
      })
    })
  }
}
