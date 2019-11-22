import { RisingPillarSystem, RisingPillar, Position } from './pillar'

export type Props = {
  height?: number
  speed?: number
  autoStart: boolean
  onReachBottom?: Actions
  onReachTop?: Actions
}

export default class Pillar implements IScript<Props> {
  risingClip = new AudioClip('sounds/RisingPillar.mp3')

	
  init() {
    engine.addSystem(new RisingPillarSystem())
  }

  move(entity: Entity, newPosition?: Position, useTransition = true) {
    const platform = entity.getComponent(RisingPillar)
    const isStart = platform.position === 'start'


	// const clip = this.risingClip
	// const source = new AudioSource(clip)
	// source.volume = 1
    // entity.addComponentOrReplace(source)
    // source.playing = true

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
    const { height, speed, autoStart, onReachBottom, onReachTop } = props

    const platform = new Entity('verticalPlatform')
    platform.setParent(host)
    platform.addComponent(new Transform({ position: new Vector3(0, 0, 0) }))
    platform.addComponent(new GLTFShape('models/Rising_Pillar.glb'))
    platform.addComponent(
      new RisingPillar(channel, height, speed, onReachBottom, onReachTop)
    )

    // // add animation
    // const animator = new Animator()
    // const clip = new AnimationState('LightAction', { looping: true })
    // animator.addClip(clip)
    // platform.addComponent(animator)

    // handle actions
    channel.handleAction('rise', () => this.move(platform, 'end'))
    channel.handleAction('hide', () => this.move(platform, 'start'))

    // sync initial values
    channel.request<Position>('position', position =>
      this.move(platform, position, false)
    )
    channel.reply<Position>(
      'position',
      () => platform.getComponent(RisingPillar).position
    )

    //auto start platform
    if (autoStart !== false) {
      const goToTopAction: BaseAction<{}> = {
        entityName: host.name,
        actionId: 'rise',
        values: {}
      }
      channel.sendActions([goToTopAction])
    }
  }
}
