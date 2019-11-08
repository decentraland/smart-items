export type Props = {
  onClick?: Actions
}

export default class Button implements IScript<Props> {
  instances: [Entity, Props, IChannel][] = []
  clip = new AudioClip('sounds/click.mp3')

  init() {
    Input.instance.subscribe(
      'BUTTON_DOWN',
      ActionButton.PRIMARY,
      true,
      event => {
        if (event.hit) {
          const entity = engine.entities[event.hit.entityId]
          for (const [button, props, channel] of this.instances) {
            if (button === entity) {
              this.play(button)
              channel.sendActions(props.onClick)
            }
          }
        }
      }
    )
  }

  play(entity: Entity) {
    const source = new AudioSource(this.clip)
    entity.addComponentOrReplace(source)
    source.playing = true

    const animator = entity.getComponent(Animator)
    const clip = animator.getClip('ButtonAction')
    clip.stop()
    clip.play()
  }

  spawn(host: Entity, props: Props, channel: IChannel) {
    const button = new Entity()
    button.setParent(host)

    button.addComponent(new GLTFShape('models/Button.glb'))

    const animator = new Animator()
    const clip = new AnimationState('ButtonAction', { looping: false })
    animator.addClip(clip)
    button.addComponent(animator)

    button.addComponent(
      new OnClick(() => {
        this.play(button)
        channel.sendActions(props.onClick)
      })
    )

    this.instances.push([button, props, channel])
  }
}
