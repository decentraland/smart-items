export type Props = {
  active: boolean
}

export default class Arrow implements IScript<Props> {
  active: Record<string, boolean> = {}

  init() {}

  toggle(entity: Entity, value: boolean) {
    if (this.active[entity.name] === value) return

    const animator = entity.getComponent(Animator)
    const clip = animator.getClip('ArmatureAction')
    clip.looping = true
    if (value) {
      entity.getComponent(GLTFShape).visible = true
      clip.playing = true
    } else {
      entity.getComponent(GLTFShape).visible = false
      clip.playing = false
    }

    this.active[entity.name] = value
  }

  spawn(host: Entity, props: Props, channel: IChannel) {
    const siren = new Entity(host.name + '-button')
    siren.setParent(host)

    const animator = new Animator()
    const clip = new AnimationState('ArmatureAction', { looping: true })
    animator.addClip(clip)

    siren.addComponent(animator)

    siren.addComponent(new GLTFShape('models/Arrow.glb'))

    if (!props.active) {
      siren.getComponent(GLTFShape).visible = false
    } else {
      clip.play()
    }

    this.active[siren.name] = props.active

    // handle actions
    channel.handleAction('activate', ({ sender }) => {
      this.toggle(siren, true)
    })
    channel.handleAction('deactivate', ({ sender }) => {
      this.toggle(siren, false)
    })

    // sync initial values
    channel.request<boolean>('isActive', isActive =>
      this.toggle(siren, isActive)
    )
    channel.reply<boolean>('isActive', () => this.active[siren.name])
  }
}
