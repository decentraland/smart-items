export type Props = {
  text?: string
  fontSize?: number
}

export default class Button implements IScript<Props> {
  instances: [Entity, Props][] = []
  clip = new AudioClip('sounds/open.mp3')
  canvas = new UICanvas()
  texture = new Texture('images/scroll.png')
  image = new UIImage(this.canvas, this.texture)
  message = new UIText(this.canvas)

  init() {
    const width = 700
    const height = 700

    this.canvas.visible = false
    this.canvas.isPointerBlocker = true

    this.message.adaptWidth = true
    this.message.vAlign = 'center'
    this.message.hAlign = 'center'
    this.message.color = new Color4(0, 0, 0, 1)

    this.image.width = width
    this.image.height = height
    this.image.vAlign = 'center'
    this.image.hAlign = 'center'
    this.image.sourceTop = 0
    this.image.sourceLeft = 0
    this.image.sourceHeight = width
    this.image.sourceWidth = height
    this.image.isPointerBlocker = true
    this.image.onClick = new OnClick(() => {
      this.canvas.visible = false
    })

    const handler = (event: LocalActionButtonEvent) => {
      if (this.canvas.visible) {
        this.canvas.visible = false
      } else if (event.hit) {
        const entity = engine.entities[event.hit.entityId]
        for (const [scroll, props] of this.instances) {
          if (scroll === entity) {
            this.open(scroll, props.text, props.fontSize)
          }
        }
      }
    }

    Input.instance.subscribe('BUTTON_DOWN', ActionButton.PRIMARY, true, handler)
    Input.instance.subscribe(
      'BUTTON_DOWN',
      ActionButton.SECONDARY,
      true,
      handler
    )
    Input.instance.subscribe('BUTTON_DOWN', ActionButton.POINTER, true, handler)
  }

  open(entity: Entity, text = '', fontSize = 36) {
    const source = new AudioSource(this.clip)
    entity.addComponentOrReplace(source)
    source.playing = true

    this.message.value = text
    this.message.fontSize = fontSize
    this.canvas.visible = true
  }

  spawn(host: Entity, props: Props) {
    const scroll = new Entity()
    scroll.setParent(host)

    scroll.addComponent(new GLTFShape('models/Scroll.glb'))

    this.instances.push([scroll, props])
  }
}
