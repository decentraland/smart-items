export type TweenType = 'move' | 'rotate' | 'scale'

export type Tween = {
  target: string
  x: number
  y: number
  z: number
  curve: CurveType
  speed: number
  relative: boolean
  onComplete: Actions
}

@Component('org.decentraland.Syncable')
export class Syncable {}

@Component('org.decentraland.Tweenable')
export class Tweenable {
  transition: number = 0
  type: TweenType
  curve: CurveType = CurveType.LINEAR
  x: number
  y: number
  z: number
  speed: number
  relative: boolean
  onComplete: Actions
  channel: IChannel
  origin: Vector3
  sender: string = 'initial'
  timestamp: number

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
    curve?: CurveType
    sender?: string
    timestamp?: number
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
    this.curve = args.curve
    this.sender = args.sender
    this.timestamp = args.timestamp
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
            let easingIndex = easingConverter(
              tweenable.transition,
              tweenable.curve
            )
            transform.position.copyFrom(Vector3.Lerp(start, end, easingIndex))
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
            let easingIndex = easingConverter(
              tweenable.transition,
              tweenable.curve
            )
            transform.rotation.copyFrom(
              Quaternion.Slerp(start, end, easingIndex)
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
            let easingIndex = easingConverter(
              tweenable.transition,
              tweenable.curve
            )
            transform.scale.copyFrom(Vector3.Lerp(start, end, easingIndex))
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

export enum CurveType {
  LINEAR = 'linear',

  EASEINSINE = 'easeinsine',
  EASEOUTSINE = 'easeoutsine',
  EASEINOUTSINE = 'easeinoutsine',

  EASEINQUADRATIC = 'easeinquadratic',
  EASEOUTQUADRATIC = 'easeoutquadratic',
  EASEINOUTQUADRATIC = 'easeinoutquadratic',

  EASEINCUBIC = 'easeincubic',
  EASEOUTCUBIC = 'easeoutcubic',
  EASEINOUTCUBIC = 'easeinoutcubic',

  EASEINEXPO = 'easeinexpo',
  EASEOUTEXPO = 'easeoutexpo',
  EASEINOUTEXPO = 'easeinoutexpo',

  EASEINELASTIC = 'easeinelastic',
  EASEOUTELASTIC = 'easeoutelastic',
  EASEINOUTELASTIC = 'easeinoutelastic',

  EASEINBOUNCE = 'easeinbounce',
  EASEOUTEBOUNCE = 'easeoutbounce',
  EASEINOUTBOUNCE = 'easeinoutbounce',
}

export function easingConverter(x: number, curveType: CurveType) {
  switch (curveType) {
    case CurveType.LINEAR:
      return x
      break
    case CurveType.EASEINSINE:
      return 1 - Math.cos((x * Math.PI) / 2)
      break
    case CurveType.EASEOUTSINE:
      return Math.sin((x * Math.PI) / 2)
      break
    case CurveType.EASEINOUTSINE:
      return -(Math.cos(Math.PI * x) - 1) / 2
      break
    case CurveType.EASEINQUADRATIC:
      return x * x
      break
    case CurveType.EASEOUTQUADRATIC:
      return 1 - (1 - x) * (1 - x)
      break
    case CurveType.EASEINOUTQUADRATIC:
      return x < 0.5 ? 2 * x * x : 1 - Math.pow(-2 * x + 2, 2) / 2
      break

    case CurveType.EASEINCUBIC:
      return x * x * x
      break
    case CurveType.EASEOUTCUBIC:
      return 1 - Math.pow(1 - x, 3)
      break
    case CurveType.EASEINOUTCUBIC:
      return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2
      break
    case CurveType.EASEINEXPO:
      return x === 0 ? 0 : Math.pow(2, 10 * x - 10)
      break
    case CurveType.EASEOUTEXPO:
      return x === 1 ? 1 : 1 - Math.pow(2, -10 * x)
      break
    case CurveType.EASEINOUTEXPO:
      return x === 0
        ? 0
        : x === 1
        ? 1
        : x < 0.5
        ? Math.pow(2, 20 * x - 10) / 2
        : (2 - Math.pow(2, -20 * x + 10)) / 2
      break

    case CurveType.EASEINELASTIC:
      const c4 = (2 * Math.PI) / 3

      return x === 0
        ? 0
        : x === 1
        ? 1
        : -Math.pow(2, 10 * x - 10) * Math.sin((x * 10 - 10.75) * c4)
      break
    case CurveType.EASEOUTELASTIC:
      const c5 = (2 * Math.PI) / 3

      return x === 0
        ? 0
        : x === 1
        ? 1
        : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c5) + 1
      break

    case CurveType.EASEINOUTELASTIC:
      const c6 = (2 * Math.PI) / 4.5

      return x === 0
        ? 0
        : x === 1
        ? 1
        : x < 0.5
        ? -(Math.pow(2, 20 * x - 10) * Math.sin((20 * x - 11.125) * c6)) / 2
        : (Math.pow(2, -20 * x + 10) * Math.sin((20 * x - 11.125) * c6)) / 2 + 1
      break

    case CurveType.EASEINBOUNCE:
      return 1 - bounce(1 - x)
      break
    case CurveType.EASEOUTEBOUNCE:
      return bounce(x)
      break
    case CurveType.EASEINOUTBOUNCE:
      return x < 0.5 ? (1 - bounce(1 - 2 * x)) / 2 : (1 + bounce(2 * x - 1)) / 2
      break
  }
}

function bounce(x: number) {
  const n1 = 7.5625
  const d1 = 2.75

  if (x < 1 / d1) {
    return n1 * x * x
  } else if (x < 2 / d1) {
    return n1 * (x -= 1.5 / d1) * x + 0.75
  } else if (x < 2.5 / d1) {
    return n1 * (x -= 2.25 / d1) * x + 0.9375
  } else {
    return n1 * (x -= 2.625 / d1) * x + 0.984375
  }
}
