import {
  HorizontalPlatformSystem,
  HorizontalPlatform,
  Position
} from './platform'

export type Props = {
  distance?: number
  speed?: number
  onReachStart?: Actions
  onReachEnd?: Actions
}

export default class Door implements IScript<Props> {
  init() {
    engine.addSystem(new HorizontalPlatformSystem())
  }

  move(entity: Entity, newPosition?: Position, useTransition = true) {
    const platform = entity.getComponent(HorizontalPlatform)
    const isStart = platform.position === 'start'

    // compute new value
    if (newPosition === 'end') {
      if (!isStart) return
      platform.position = 'end'
    } else if (newPosition === 'start') {
      if (isStart) return
      platform.position = 'start'
    }

    // start transition
    if (useTransition) {
      if (platform.transition === -1) {
        platform.transition = 0
      } else {
        platform.transition = 1 - platform.transition
      }
    } else {
      platform.transition = 1
    }
  }

  spawn(host: Entity, props: Props, channel: IChannel) {
    const { distance, speed, onReachStart, onReachEnd } = props

    const platform = new Entity('HorizontalPlatform')
    platform.setParent(host)
    platform.addComponent(new Transform({ position: new Vector3(0, 0, 0) }))
    platform.addComponent(new GLTFShape('models/Platform.glb'))
    platform.addComponent(
      new HorizontalPlatform(channel, distance, speed, onReachStart, onReachEnd)
    )

    // add animation
    const animator = new Animator()
    const clip = new AnimationState('LightAction', { looping: true })
    animator.addClip(clip)
    platform.addComponent(animator)

    // handle actions
    channel.handleAction('goToEnd', () => this.move(platform, 'end'))
    channel.handleAction('goToStart', () => this.move(platform, 'start'))

    // sync initial values
    channel.request<Position>('position', position =>
      this.move(platform, position, false)
    )
    channel.reply<Position>(
      'position',
      () => platform.getComponent(HorizontalPlatform).position
    )

    if (onReachStart) {
      channel.sendActions(onReachStart)
    }
  }
}
