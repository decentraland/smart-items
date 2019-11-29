import { RisingPillar, Position, RisingPillarGenesisSystem } from './pillar'

export type Props = {
  height?: number
  speed?: number
  onReachBottom?: Actions
  onReachTop?: Actions
}

export default class Pillar implements IScript<Props> {
  risingClip = new AudioClip('sounds/RisingPillar.mp3')

  init() {
    engine.addSystem(new RisingPillarGenesisSystem())
  }

  move(entity: Entity, newPosition?: Position, useTransition = true) {
    const platform = entity.getComponent(RisingPillar)
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
    const { height, speed, onReachBottom, onReachTop } = props

    const pillar = new Entity(host.name + '-rising-pillar')
    pillar.setParent(host)
    pillar.addComponent(new Transform({ position: new Vector3(0, 0, 0) }))
    pillar.addComponent(new GLTFShape('models/Rising_Pillar_Column.glb'))
    pillar.addComponent(
      new RisingPillar(channel, height, speed, onReachBottom, onReachTop)
    )
    const source = new AudioSource(this.risingClip)
    source.volume = 1
    source.playing = false
    pillar.addComponentOrReplace(source)

    const base = new Entity(host.name + '-rising-pillar-base')
    base.setParent(host)
    base.addComponent(new Transform({ position: new Vector3(0, 0, 0) }))
    base.addComponent(new GLTFShape('models/RisingPillarGenesisBase.glb'))

    // handle actions
    channel.handleAction('rise', () => this.move(pillar, 'end'))
    channel.handleAction('hide', () => this.move(pillar, 'start'))

    // sync initial values
    channel.request<Position>('position', position =>
      this.move(pillar, position, false)
    )
    channel.reply<Position>(
      'position',
      () => pillar.getComponent(RisingPillar).position
    )
  }
}
