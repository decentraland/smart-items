import { TriggerableArea, TriggerableAreaSystem } from './area'

export type Props = {
  onEnter?: Actions
  onLeave?: Actions
  enabled: boolean
}

export default class Button implements IScript<Props> {
  init() {
    engine.addSystem(new TriggerableAreaSystem())
  }

  spawn(host: Entity, props: Props, channel: IChannel) {
    const trigger = new TriggerableArea()
    trigger.enabled = props.enabled

    channel.handleAction('enable', () => {
      trigger.enabled = true
    })

    channel.handleAction('disable', () => {
      trigger.enabled = false
    })

    trigger.onEnter = () => {
      if (trigger.enabled) {
        channel.sendActions(props.onEnter)
      }
    }
    trigger.onLeave = () => {
      if (trigger.enabled) {
        channel.sendActions(props.onLeave)
      }
    }

    // sync initial values
    channel.request<boolean>('enabled', enabled => (trigger.enabled = enabled))
    channel.reply<boolean>('enabled', () => trigger.enabled)

    host.addComponent(trigger)
  }
}
