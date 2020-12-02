export type Props = {
  onActivate?: Actions
  onDeactivate?: Actions
  startOn: boolean
  clickable: boolean
}

export default class Lamp implements IScript<Props> {
  clip = new AudioClip('sounds/Click.mp3')

  active: Record<string, boolean> = {}
  onModels: Record<string, GLTFShape> = {}
  offModels: Record<string, GLTFShape> = {}
  AudioSources: Record<string, AudioSource> = {}

  init() {}

  toggle(entityName: string, value: boolean) {
    if (this.active[entityName] === value) return

    this.AudioSources[entityName].playOnce()

    if (value) {
      this.onModels[entityName].visible = true
      this.offModels[entityName].visible = false
    } else {
      this.onModels[entityName].visible = false
      this.offModels[entityName].visible = true
    }

    this.active[entityName] = value
  }

  spawn(host: Entity, props: Props, channel: IChannel) {
    const lampOff = new Entity(host.name + '-off')
    lampOff.setParent(host)
    lampOff.addComponent(new Transform())
    let offModel = new GLTFShape('models/GalleryLightB_Off.glb')
    lampOff.addComponent(offModel)

    const lampOn = new Entity(host.name + '-on')
    lampOn.setParent(host)
    lampOn.addComponent(new Transform())
    let onModel = new GLTFShape('models/GalleryLightB_On.glb')
    lampOn.addComponent(onModel)

    if (props.startOn) {
      offModel.visible = false
    } else {
      onModel.visible = false
    }

    if (props.clickable) {
      lampOff.addComponent(
        new OnPointerDown(
          () => {
            const value = !this.active[host.name]
            const action = channel.createAction(
              value ? 'activate' : 'deactivate',
              {}
            )
            channel.sendActions([action])
          },
          {
            button: ActionButton.POINTER,
            hoverText: 'Switch',
            distance: 6,
          }
        )
      )

      lampOn.addComponent(
        new OnPointerDown(
          () => {
            const value = !this.active[host.name]
            const action = channel.createAction(
              value ? 'activate' : 'deactivate',
              {}
            )
            channel.sendActions([action])
          },
          {
            button: ActionButton.POINTER,
            hoverText: 'Switch',
            distance: 6,
          }
        )
      )
    }

    const source = new AudioSource(this.clip)
    lampOn.addComponent(source)

    this.active[host.name] = props.startOn
    this.onModels[host.name] = onModel
    this.offModels[host.name] = offModel
    this.AudioSources[host.name] = source

    // handle actions
    channel.handleAction('activate', ({ sender }) => {
      this.toggle(host.name, true)
      if (sender === channel.id) {
        channel.sendActions(props.onActivate)
      }
    })
    channel.handleAction('deactivate', ({ sender }) => {
      this.toggle(host.name, false)
      if (sender === channel.id) {
        channel.sendActions(props.onDeactivate)
      }
    })

    // sync initial values
    channel.request<boolean>('isActive', (isActive) =>
      this.toggle(host.name, isActive)
    )
    channel.reply<boolean>('isActive', () => this.active[host.name])
  }
}
