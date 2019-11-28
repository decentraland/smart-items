import { TweenSystem, Tweenable, Tween } from './tween'
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

const getEntityByName = (name: string) =>
  Object.keys(engine.entities)
    .map(key => engine.entities[key])
    .filter(entity => (entity as Entity).name === name)[0]

export default class Tools implements IScript<Props> {
  canvas = new UICanvas()
  container: UIContainerStack

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
    engine.addSystem(new DelaySystem())
    engine.addSystem(new TweenSystem())
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
  }
}
