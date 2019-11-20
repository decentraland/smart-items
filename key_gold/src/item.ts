export type Props = {
  onClick?: Actions
  onUse?: Actions
}

export default class Button implements IScript<Props> {
  hiddenKeys: Entity[] = []

  inventory: IInventory

  clip = new AudioClip('sounds/use.mp3')
  canvas = new UICanvas()
  container = new UIContainerStack(this.canvas)
  texture = new Texture('images/Key.png')

  init({ inventory }) {
    this.inventory = inventory
  }

  playSound(key: Entity) {
    const source = new AudioSource(this.clip)
    key.addComponentOrReplace(source)
    source.playing = true
  }

  isEquipped(key: Entity) {
    return this.inventory.has(key.name)
  }

  isHidden(key: Entity) {
    return this.hiddenKeys.indexOf(key) !== -1
  }

  equip(key: Entity) {
    if (this.isEquipped(key)) return

    this.inventory.add(key.name, this.texture)
    this.playSound(key)
  }

  hide(key: Entity) {
    if (this.isHidden(key)) return
    this.hiddenKeys.push(key)

    const gltfShape = key.getComponent(GLTFShape)
    gltfShape.visible = false
  }

  unequip(key: Entity) {
    if (!this.isEquipped(key)) return

    this.inventory.remove(key.name)
    this.playSound(key)
  }

  show(key: Entity) {
    if (!this.isHidden(key)) return

    const gltfShape = key.getComponent(GLTFShape)
    gltfShape.visible = true

    this.hiddenKeys = this.hiddenKeys.filter(_key => _key !== key)
  }

  spawn(host: Entity, props: Props, channel: IChannel) {
    const key = new Entity(host.name + '-key')
    key.setParent(host)

    key.addComponent(new GLTFShape('models/Golden_Key.glb'))
    key.addComponent(
      new OnPointerDown(() => channel.sendActions(props.onClick))
    )

    channel.handleAction('equip', action => {
      if (!this.isEquipped(key)) {
        // we only equip the key for the player who triggered the action
        if (action.sender === channel.id) {
          this.equip(key)
        }
        // we remove the key from the scene for everybody
        this.hide(key)
      }
    })

    channel.handleAction('use', action => {
      if (this.isEquipped(key)) {
        if (action.sender === channel.id) {
          channel.sendActions(props.onUse)
          this.unequip(key)
        }
        // we respawn the key for everybody
        this.show(key)
      }
    })
  }
}
