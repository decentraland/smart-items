import { DoorSystem, OpenableDoor } from './door'

export type Props = {
  onClick?: Actions
  onOpen?: Actions
  onClose?: Actions
}

export default class Door implements IScript<Props> {
  openClip = new AudioClip('sounds/doorOpen.mp3')
  closeClip = new AudioClip('sounds/doorClose.mp3')

  init() {
    engine.addSystem(new DoorSystem())
  }

  toggle(entity: Entity, value?: boolean, playSound = true) {
    const openable = entity.getComponent(OpenableDoor)

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

    // Play sound
    if (playSound) {
      const clip = openable.isOpen ? this.openClip : this.closeClip
      const source = new AudioSource(clip)
      entity.addComponentOrReplace(source)
      source.playing = true
    }

    // start transition
    if (openable.transition === -1) {
      openable.transition = 0
    } else {
      openable.transition = 1 - openable.transition
    }
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

    // handle click
    door.addComponent(
      new OnPointerDown(() => channel.sendActions(props.onClick))
    )

    // handle actions
    channel.handleAction('open', () => this.toggle(pivot, true))
    channel.handleAction('close', () => this.toggle(pivot, false))
    channel.handleAction('toggle', () => this.toggle(pivot))

    // sync initial values
    channel.request<boolean>('isOpen', isOpen =>
      this.toggle(pivot, isOpen, false)
    )
    channel.reply<boolean>(
      'isOpen',
      () => pivot.getComponent(OpenableDoor).isOpen
    )
  }
}