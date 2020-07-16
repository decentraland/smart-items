export type Props = {
  enabled: boolean
}

let invisibleCube = new BoxShape()
invisibleCube.visible = false
invisibleCube.withCollisions = false
invisibleCube.isPointerBlocker = false

export default class Button implements IScript<Props> {
  active: Record<string, boolean> = {}

  init() {}

  setEnabled(host: Entity, ent: Entity, enabled: boolean) {
    if (enabled) {
      ent.removeComponent(BoxShape)
      ent.addComponentOrReplace(new GLTFShape('models/Collider.glb'))
    } else if (ent.hasComponent(GLTFShape)) {
      ent.removeComponent(GLTFShape)
      ent.addComponentOrReplace(invisibleCube)
    }
  }

  spawn(host: Entity, props: Props, channel: IChannel) {
    const shape = new GLTFShape('models/Collider.glb')
    const ent = new Entity()
    ent.setParent(host)
    ent.addComponent(shape)
    ent.addComponent(new Transform({ position: new Vector3(0, 0, 0) }))

    this.setEnabled(host, ent, props.enabled)

    channel.handleAction('enable', () => {
      this.setEnabled(host, ent, true)
    })

    channel.handleAction('disable', () => {
      this.setEnabled(host, ent, false)
    })

    // sync initial values
    channel.request<boolean>('enabled', (enabled) => {
      this.setEnabled(host, ent, enabled)
    })

    channel.reply<boolean>('enabled', () => this.active[host.name])
  }
}
