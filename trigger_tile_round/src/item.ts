import { TriggerableTileRound, TriggerableTileRoundSystem } from './area'

export type Props = {
  onEnter?: Actions
  onLeave?: Actions
  enabled: boolean
}

export default class Button implements IScript<Props> {
  init() {
    engine.addSystem(new TriggerableTileRoundSystem())
  }

  spawn(host: Entity, props: Props, channel: IChannel) {
    const trigger = new TriggerableTileRound()
    trigger.enabled = props.enabled

    const tile = new Entity(host.name + '-tile')
    tile.setParent(host)

    const animator = new Animator()
    const clip = new AnimationState('RoundTrigger_Action', {
      looping: true,
      speed: 0.5,
    })
    const vanishClip = new AnimationState('RoundTriggerClose_Action', {
      looping: false,
    })
    animator.addClip(clip)
    animator.addClip(vanishClip)

    tile.addComponent(animator)

    tile.addComponent(new GLTFShape('models/round_trigger.glb'))

    if (props.enabled) {
      clip.playing = true
    }

    channel.handleAction('enable', () => {
      trigger.enabled = true
      clip.playing = true
      clip.speed = 0.5
      vanishClip.stop()
    })

    channel.handleAction('disable', () => {
      trigger.enabled = false
      clip.playing = false
      vanishClip.stop()
      vanishClip.play()
    })

    trigger.onEnter = () => {
      if (trigger.enabled) {
        channel.sendActions(props.onEnter)
        clip.speed = 2
        //channel.sendActions()
        log('triggered')
      }
    }
    trigger.onLeave = () => {
      if (trigger.enabled) {
        clip.speed = 0.5
        channel.sendActions(props.onLeave)
      }
    }

    // sync initial values
    channel.request<boolean>('enabled', (enabled) => {
      trigger.enabled = enabled
      clip.playing = enabled
    })
    channel.reply<boolean>('enabled', () => trigger.enabled)

    host.addComponent(trigger)
  }
}
