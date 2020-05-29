export type Props = {
  onClick?: Actions
  onActivate?: Actions
  onDeactivate?: Actions
  station?: string
  customStation?: string
  onClickText: string
}

let defaultStation = 'https://icecast.ravepartyradio.org/ravepartyradio-192.mp3'

export default class Button implements IScript<Props> {
  clip = new AudioClip('sounds/click.mp3')
  station = ''
  active: Record<string, boolean> = {}
  init() {}

  toggle(entity: Entity, value: boolean, silent?: boolean) {
    if (!silent) {
      const source = new AudioSource(this.clip)
      entity.addComponentOrReplace(source)
      source.playing = true
    }

    const animator = entity.getComponent(Animator)
    const switchClip = animator.getClip('ON/OFF_Action')
    const lightClip = animator.getClip('Light_Action')

    if (value) {
      lightClip.play()
      let musicStream = new AudioStream(this.station)
      entity.addComponentOrReplace(musicStream)
      musicStream.playing = true
    } else {
      lightClip.stop()
      switchClip.stop()
      switchClip.play()
      if (entity.hasComponent(AudioStream)) {
        entity.getComponent(AudioStream).playing = false
      }
    }
  }

  spawn(host: Entity, props: Props, channel: IChannel) {
    const button = new Entity(host.name + '-radio')
    button.setParent(host)

    button.addComponent(new GLTFShape('models/radio.glb'))

    const animator = new Animator()
    const switchClip = new AnimationState('ON/OFF_Action', { looping: false })
    const lightClip = new AnimationState('Light_Action', { looping: true })
    animator.addClip(switchClip)
    animator.addClip(lightClip)
    button.addComponent(animator)

    this.active[button.name] = false

    if (props.customStation) {
      this.station = props.customStation
    } else if (props.station) {
      this.station = props.station
    } else {
      this.station = defaultStation
    }

    button.addComponent(
      new OnPointerDown(
        () => {
          channel.sendActions(props.onClick)
        },
        {
          button: ActionButton.POINTER,
          hoverText: props.onClickText,
          distance: 6,
        }
      )
    )

    // handle actions
    channel.handleAction('activate', ({ sender }) => {
      this.active[button.name] = true
      this.toggle(button, true)

      if (sender === channel.id) {
        channel.sendActions(props.onActivate)
      }
    })
    channel.handleAction('deactivate', ({ sender }) => {
      this.active[button.name] = false
      this.toggle(button, false)
      if (sender === channel.id) {
        channel.sendActions(props.onDeactivate)
      }
    })
    channel.handleAction('toggle', ({ sender }) => {
      let value = !this.active[button.name]
      this.active[button.name] = value
      this.toggle(button, value)
      if (sender === channel.id) {
        if (value) {
          channel.sendActions(props.onActivate)
        } else {
          channel.sendActions(props.onDeactivate)
        }
      }
    })

    // sync initial values
    channel.request<boolean>('isActive', (isActive) =>
      this.toggle(button, isActive, true)
    )
    channel.reply<boolean>('isActive', () => this.active[button.name])
  }
}
