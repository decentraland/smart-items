export type Props = {
  onActivate?: Actions
  onDeactivate?: Actions
}

export default class Button implements IScript<Props> {
  clip = new AudioClip('sounds/siren.mp3')

  active: Record<string, boolean> = {}

  init() {}

  toggle(entity: Entity, value: boolean) {
    if (this.active[entity.name] === value) return

    if (value) {
      const source = new AudioSource(this.clip)
      entity.addComponentOrReplace(source)
      source.loop = true
      source.playing = true
    } else {
      const source = entity.getComponent(AudioSource)
      if (source) {
        source.playing = false
      }
    }

    const animator = entity.getComponent(Animator)
    const activateClip = animator.getClip('activate')
    const deactivateClip = animator.getClip('deactivate')
    activateClip.stop()
    deactivateClip.stop()
    const clip = value ? activateClip : deactivateClip
    clip.play()

    this.active[entity.name] = value
  }

  spawn(host: Entity, props: Props, channel: IChannel) {
    const siren = new Entity(host.name + '-button')
    siren.setParent(host)

    const animator = new Animator()
    const deactivateClip = new AnimationState('deactivate', { looping: true })
    const activateClip = new AnimationState('activate', { looping: true })
    animator.addClip(deactivateClip)
    animator.addClip(activateClip)
    siren.addComponent(animator)
    deactivateClip.play()

    siren.addComponent(new GLTFShape('models/Siren.glb'))

    siren.addComponent(
      new OnPointerDown(
        () => {
          const value = !this.active[siren.name]
          const action = channel.createAction(
            value ? 'activate' : 'deactivate',
            {}
          )
          channel.sendActions([action])
        },
        {
          button: ActionButton.POINTER,
          hoverText: 'Activate',
          distance: 6
        }
      )
    )

    this.active[siren.name] = false

    // handle actions
    channel.handleAction('activate', ({ sender }) => {
      this.toggle(siren, true)
      if (sender === channel.id) {
        channel.sendActions(props.onActivate)
      }
    })
    channel.handleAction('deactivate', ({ sender }) => {
      this.toggle(siren, false)
      if (sender === channel.id) {
        channel.sendActions(props.onDeactivate)
      }
    })

    // sync initial values
    channel.request<boolean>('isActive', isActive =>
      this.toggle(siren, isActive)
    )
    channel.reply<boolean>('isActive', () => this.active[siren.name])
  }
}
