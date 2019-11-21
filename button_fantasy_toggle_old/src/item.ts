export type Props = {
  onActivate?: Actions
  onDeactivate?: Actions
}

export default class Button implements IScript<Props> {
  clip = new AudioClip('sounds/click.mp3')

  active: Record<string, boolean> = {}

  init() {}

  toggle(entity: Entity, value: boolean, playSound = true) {
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
    button.addComponent(new GLTFShape('models/Pirate_Wheel.glb'))

    const animator = new Animator()
    const deactivateClip = new AnimationState('deactivate', { looping: false })
    const activateClip = new AnimationState('activate', { looping: false })
    animator.addClip(deactivateClip)
    animator.addClip(activateClip)
    button.addComponent(animator)

    button.addComponent(
      new OnPointerDown(() => {
        const value = !this.active[button.name]
        this.toggle(button, value)
        channel.sendActions(value ? props.onActivate : props.onDeactivate)
      })
    )

    this.toggle(button, false)

    // sync initial values
    channel.request<boolean>('isActive', isActive =>
      this.toggle(host, isActive, false)
    )
    channel.reply<boolean>('isActive', () => this.active[button.name])
  }
}
