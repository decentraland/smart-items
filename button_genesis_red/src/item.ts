export type Props = {
  onClick?: Actions
}

export default class Button implements IScript<Props> {
  clip = new AudioClip('sounds/click.mp3')

  init() {}

  play(entity: Entity) {
    const source = new AudioSource(this.clip)
    entity.addComponentOrReplace(source)
    source.playing = true

    const animator = entity.getComponent(Animator)
    const clip = animator.getClip('trigger')
    clip.stop()
    clip.play()
  }

  spawn(host: Entity, props: Props, channel: IChannel) {
    const button = new Entity()
    button.setParent(host)

    button.addComponent(new GLTFShape('models/Red_Button.glb'))

    const animator = new Animator()
    const clip = new AnimationState('trigger', { looping: false })
    animator.addClip(clip)
    button.addComponent(animator)

    button.addComponent(
      new OnPointerDown(
        () => {
          const pushAction = channel.createAction('push', {})
          channel.sendActions([pushAction])
        },
        {
          button: ActionButton.POINTER,
          hoverText: 'Press',
          distance: 6,
        }
      )
    )

    channel.handleAction('push', ({ sender }) => {
      this.play(button)

      if (sender === channel.id) {
        channel.sendActions(props.onClick)
      }
    })
  }
}
