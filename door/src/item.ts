import { DoorSystem, OpenableDoor } from './door'

export type Props = {
  onClick?: Actions
  onOpen?: Actions
  onClose?: Actions
}

export default class Door implements IScript<Props> {
  init() {
    engine.addSystem(new DoorSystem())
  }
  spawn(host: Entity, props: Props, channel: IChannel) {
    const pivot = new Entity('pivot')
    pivot.setParent(host)
    pivot.addComponent(new Transform({ position: new Vector3(0.8, 0, 0) }))
    pivot.addComponent(new OpenableDoor(channel, props.onOpen, props.onClose))

    const door = new Entity('door')
    door.setParent(pivot)
    door.addComponent(new Transform({ position: new Vector3(-0.8, 0, 0) }))
    door.addComponent(new GLTFShape('models/door/door.glb'))

    // util
    const toggle = (value?: boolean) => {
      const openable = pivot.getComponent(OpenableDoor)

      // compute new value
      if (value === true) {
        if (openable.isOpen) return
        openable.isOpen = true
      } else if (value === false) {
        if (!openable.isOpen) return
        openable.isOpen = false
      } else {
        openable.isOpen = !openable.isOpen
      }

      // start transition
      if (openable.transition === -1) {
        openable.transition = 0
      } else {
        openable.transition = 1 - openable.transition
      }
    }

    door.addComponent(new OnClick(() => channel.sendActions(props.onClick)))

    // handle actions
    channel.handleAction('open', () => toggle(true))
    channel.handleAction('close', () => toggle(false))
    channel.handleAction('toggle', () => toggle())

    // sync initial values
    channel.request<boolean>('isOpen', isOpen => toggle(isOpen))
    channel.reply<boolean>(
      'isOpen',
      () => pivot.getComponent(OpenableDoor).isOpen
    )
  }
}
