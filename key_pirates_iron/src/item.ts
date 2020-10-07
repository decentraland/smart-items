export type Props = {
  target?: string
  onEquip?: Actions
  onUse?: Actions
  respawns?: boolean
}

export default class Button implements IScript<Props> {
  hiddenKeys: Entity[] = []
  targets: Record<string, [Entity, IChannel]> = {}

  inventory: IInventory

  clip = new AudioClip('sounds/use.mp3')
  equipClip = new AudioClip('sounds/KeyEquip.mp3')
  canvas = new UICanvas()
  container = new UIContainerStack(this.canvas)
  texture = new Texture('images/Key.png')

  init({ inventory }) {
    this.inventory = inventory
    Input.instance.subscribe(
      'BUTTON_DOWN',
      ActionButton.POINTER,
      true,
      event => {
        if (event.hit && event.hit.length < 5) {
          let entity = engine.entities[event.hit.entityId] as Entity
          while (entity) {
            const target = this.targets[entity.name]
            if (target) {
              const [key, channel] = target
              if (this.isEquipped(key)) {
                const useAction = channel.createAction('use', {})
                channel.sendActions([useAction])
              }
            }
            entity = entity.getParent() as Entity
          }
        }
      }
    )
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

    key.addComponent(new GLTFShape('models/Iron_Key_Pirates.glb'))
    key.addComponent(
      new OnPointerDown(
        () => {
          const equipAction = channel.createAction('equip', {})
          channel.sendActions([equipAction])
          const source = new AudioSource(this.equipClip)
          key.addComponentOrReplace(source)
          source.playing = true
        },
        {
          button: ActionButton.POINTER,
          hoverText: 'Pick up',
          distance: 6
        }
      )
    )

    this.targets[props.target] = [key, channel]

    channel.handleAction('equip', action => {
      if (!this.isEquipped(key)) {
        // we only equip the key for the player who triggered the action
        if (action.sender === channel.id) {
          this.equip(key)
          channel.sendActions(props.onEquip)
        }
        // we remove the key from the scene for everybody
        this.hide(key)
      }
    })

    channel.handleAction('unequip', action => {
      if (this.isEquipped(key)) {
        // we only equip the key for the player who triggered the action
        if (action.sender === channel.id) {
          this.unequip(key)
        }
        // we remove the key from the scene for everybody
      }
      if (props.respawns == true) {
        this.show(key)
      }
    })

    channel.handleAction('use', action => {
      if (this.isEquipped(key) && action.sender === channel.id) {
        const unequipAction = channel.createAction('unequip', {})
        channel.sendActions([unequipAction, ...(props.onUse || [])])
      }
    })

    channel.handleAction('respawn', action => {
      if (this.isEquipped(key) && action.sender === channel.id) {
        const unequipAction = channel.createAction('unequip', {})
        channel.sendActions([unequipAction, ...(props.onUse || [])])
      }
      this.show(key)
    })
  }
}
