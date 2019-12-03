export type TweenType = 'move' | 'rotate' | 'scale'

export type Tween = {
  target: string
  x: number
  y: number
  z: number
  speed: number
  relative: boolean
  onComplete: Actions
}

@Component('org.decentraland.Syncable')
export class Syncable {

}

@Component('org.decentraland.Tweenable')
export class Tweenable {
  transition: number = 0
  type: TweenType
  x: number
  y: number
  z: number
  speed: number
  relative: boolean
  onComplete: Actions
  channel: IChannel
  origin: Vector3

  constructor(args: {
    type: TweenType
    x: number
    y: number
    z: number
    speed: number
    relative: boolean
    onComplete: Actions
    channel: IChannel
    origin: Vector3
  }) {
    this.type = args.type
    this.x = args.x
    this.y = args.y
    this.z = args.z
    this.speed = args.speed
    this.relative = args.relative
    this.onComplete = args.onComplete
    this.channel = args.channel
    this.origin = args.origin
  }
}

const offsetFactory = (tweenable: Tweenable, relative: Vector3) => (
  axis: 'x' | 'y' | 'z'
) => {
  const value = tweenable[axis]
  const offset = relative[axis]

  return tweenable.relative ? value + offset : value
}

export class TweenSystem {
  syncableGroup = engine.getComponentGroup(Syncable)
  tweenableGroup = engine.getComponentGroup(Tweenable)
  update(dt: number) {
    for (const entity of this.tweenableGroup.entities) {
      const tweenable = entity.getComponent(Tweenable)
      const transform = entity.getComponent(Transform)

      const speed = tweenable.speed / 10

      switch (tweenable.type) {
        case 'move': {
          const start = tweenable.origin
          const offset = offsetFactory(tweenable, start)
          const end = new Vector3(offset('x'), offset('y'), offset('z'))

          if (tweenable.transition >= 0 && tweenable.transition < 1) {
            tweenable.transition += dt * speed
            transform.position.copyFrom(
              Vector3.Lerp(start, end, tweenable.transition)
            )
          } else if (tweenable.transition >= 1) {
            tweenable.transition = -1
            transform.position.copyFrom(end)

            // send actions
            tweenable.channel.sendActions(tweenable.onComplete)
          }
          break
        }
        case 'rotate': {
          const start = Quaternion.Euler(
            tweenable.origin.x,
            tweenable.origin.y,
            tweenable.origin.z
          )
          const end = start.multiply(
            Quaternion.Euler(tweenable.x, tweenable.y, tweenable.z)
          )

          if (tweenable.transition >= 0 && tweenable.transition < 1) {
            tweenable.transition += dt * speed
            transform.rotation.copyFrom(
              Quaternion.Slerp(start, end, tweenable.transition)
            )
          } else if (tweenable.transition >= 1) {
            tweenable.transition = -1
            transform.rotation.copyFrom(end)
            entity.removeComponent(Tweenable)

            // send actions
            tweenable.channel.sendActions(tweenable.onComplete)
          }
          break
        }
        case 'scale': {
          const start = tweenable.origin
          const offset = offsetFactory(tweenable, start)
          const end = new Vector3(offset('x'), offset('y'), offset('z'))

          if (tweenable.transition >= 0 && tweenable.transition < 1) {
            tweenable.transition += dt * speed
            transform.scale.copyFrom(
              Vector3.Lerp(start, end, tweenable.transition)
            )
          } else if (tweenable.transition >= 1) {
            tweenable.transition = -1
            transform.scale.copyFrom(end)
            entity.removeComponent(Tweenable)

            // send actions
            tweenable.channel.sendActions(tweenable.onComplete)
          }
          break
        }
      }
    }
  }
}
