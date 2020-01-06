export type Props = {
  onActivate?: Actions
  onDeactivate?: Actions
}

export default class Button implements IScript<Props> {
  clip = new AudioClip('sounds/click.mp3')

  active: Record<string, boolean> = {}

  init() {}

  toggle(entity: Entity, value: boolean, playSound = true) {
    if (this.active[entity.name] === value) return

    if (playSound) {
      const source = new AudioSource(this.clip)
      entity.addComponentOrReplace(source)
      source.playing = true
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
    const button = new Entity(host.name + '-button')
    button.setParent(host)

    const animator = new Animator()
    const deactivateClip = new AnimationState('deactivate', { looping: false })
    const activateClip = new AnimationState('activate', { looping: false })
    animator.addClip(deactivateClip)
    animator.addClip(activateClip)
    button.addComponent(animator)
    activateClip.stop()

    button.addComponent(new GLTFShape('models/Lever_Pirates.glb'))

    button.addComponent(
      new OnPointerDown(
        () => {
          const value = !this.active[button.name]
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

    this.active[button.name] = false

    // handle actions
    channel.handleAction('activate', ({ sender }) => {
      this.toggle(button, true)
      if (sender === channel.id) {
        channel.sendActions(props.onActivate)
      }
    })
    channel.handleAction('deactivate', ({ sender }) => {
      this.toggle(button, false)
      if (sender === channel.id) {
        channel.sendActions(props.onDeactivate)
      }
    })

    // sync initial values
    channel.request<boolean>('isActive', isActive =>
      this.toggle(button, isActive, false)
    )
    channel.reply<boolean>('isActive', () => this.active[button.name])
  }
}
