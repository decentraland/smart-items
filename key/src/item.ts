export type Props = {
  onClick?: Actions
  onUse?: Actions
}

export default class Button implements IScript<Props> {
  equippedKeys: Entity[] = []
  hiddenKeys: Entity[] = []
  images: Record<string, UIImage> = {}

  clip = new AudioClip('sounds/use.mp3')
  canvas = new UICanvas()
  container = new UIContainerStack(this.canvas)
  texture = new Texture('images/Key.png')

  init() {
    this.container.isPointerBlocker = false
    this.container.vAlign = 'bottom'
    this.container.hAlign = 'right'
    this.container.stackOrientation = UIStackOrientation.VERTICAL
    this.container.spacing = 0
    this.container.positionY = 75
    this.container.positionX = -25
  }

  playSound(key: Entity) {
    const source = new AudioSource(this.clip)
    key.addComponentOrReplace(source)
    source.playing = true
  }

  isEquipped(key: Entity) {
    return this.equippedKeys.indexOf(key) !== -1
  }

  isHidden(key: Entity) {
    return this.hiddenKeys.indexOf(key) !== -1
  }

  equip(key: Entity) {
    if (this.isEquipped(key)) return

    const width = 150
    const height = 125

    this.equippedKeys.push(key)

    const image = new UIImage(this.container, this.texture)
    image.width = width
    image.height = height
    image.sourceTop = 0
    image.sourceLeft = 0
    image.sourceHeight = 200
    image.sourceWidth = 270

    image.isPointerBlocker = false
    image.visible = true

    this.images[key.uuid] = image

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

    const image = this.images[key.uuid]
    if (image) {
      image.visible = false
    }

    this.equippedKeys = this.equippedKeys.filter(_key => _key !== key)

    this.playSound(key)
  }

  show(key: Entity) {
    if (!this.isHidden(key)) return

    const gltfShape = key.getComponent(GLTFShape)
    gltfShape.visible = true

    this.hiddenKeys = this.hiddenKeys.filter(_key => _key !== key)
  }

  spawn(host: Entity, props: Props, channel: IChannel) {
    const key = new Entity()
    key.setParent(host)

    key.addComponent(new GLTFShape('models/Key.glb'))
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
