import { RisingPillarSystem, RisingPillar, Position } from './pillar'

export type Props = {
  height?: number
  speed?: number
  onReachBottom?: Actions
  onReachTop?: Actions
}

export default class Pillar implements IScript<Props> {
  risingClip = new AudioClip('sounds/RisingPillar.mp3')

  init() {
    engine.addSystem(new RisingPillarSystem())
  }

  move(entity: Entity, newPosition?: Position, useTransition = true) {
    const pillar = entity.getComponent(RisingPillar)
    const isStart = pillar.position === 'start'

    const source = new AudioSource(this.risingClip)
    source.volume = 1
    entity.addComponentOrReplace(source)
    // source.playing = true

    // compute new value
    if (newPosition === 'end') {
      if (!isStart) return
      pillar.position = 'end'
    } else if (newPosition === 'start') {
      if (isStart) return
      pillar.position = 'start'
    }

    // start transition
    if (useTransition) {
      if (pillar.transition === -1) {
        pillar.transition = 0
      } else {
        pillar.transition = 1 - pillar.transition
      }
    } else {
      pillar.transition = 1
    }
  }

  spawn(host: Entity, props: Props, channel: IChannel) {
    const { height, speed, onReachBottom, onReachTop } = props

    const pillar = new Entity(host.name + '-rising-pillar')
    pillar.setParent(host)
    pillar.addComponent(new Transform({ position: new Vector3(0, 0, 0) }))
    pillar.addComponent(new GLTFShape('models/Rising_Pillar_SciFi.glb'))
    pillar.addComponent(
      new RisingPillar(channel, height, speed, onReachBottom, onReachTop)
    )

    const source = new AudioSource(this.risingClip)
    source.volume = 1
    source.playing = false
    pillar.addComponentOrReplace(source)

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
