export type Props = {
  enabled: boolean
}

export default class Button implements IScript<Props> {
  active: Record<string, boolean> = {}
  material: BasicMaterial

  init() {
    this.material = new BasicMaterial()
    this.material.texture = new Texture('models/transparent.png')
    this.material.alphaTest = 1
  }

  setEnabled(host: Entity, ent: Entity, enabled: boolean) {
    const shape = ent.getComponent(BoxShape)
    this.active[host.name] = enabled
    shape.withCollisions = enabled
  }

  spawn(host: Entity, props: Props, channel: IChannel) {
    const shape = new BoxShape()
    const ent = new Entity()
    ent.setParent(host)
    ent.addComponent(shape)
    ent.addComponent(this.material)
    ent.addComponent(new Transform({ position: new Vector3(0, 0.5, 0) }))

    this.setEnabled(host, ent, props.enabled)

    channel.handleAction('enable', () => {
      this.setEnabled(host, ent, true)
    })

    channel.handleAction('disable', () => {
      this.setEnabled(host, ent, false)
    })

    // sync initial values
    channel.request<boolean>('enabled', enabled => {
      this.setEnabled(host, ent, enabled)
    })

    channel.reply<boolean>('enabled', () => this.active[host.name])
  }
}
