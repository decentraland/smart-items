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

  spawn(host: Entity, props: Props, channel: IChannel) {
    const shape = new BoxShape()

    this.active[host.name] = props.enabled
    shape.withCollisions = props.enabled

    channel.handleAction('enable', () => {
      this.active[host.name] = true
      shape.withCollisions = true
    })

    channel.handleAction('disable', () => {
      this.active[host.name] = false
      shape.withCollisions = false
    })

    const ent = new Entity()
    ent.setParent(host)
    ent.addComponent(shape)
    ent.addComponent(this.material)
    ent.addComponent(new Transform({ position: new Vector3(0, 0.5, 0) }))
  }
}
