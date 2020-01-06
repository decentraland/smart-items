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
  openTime = 0

  init() {
    const width = 700
    const height = 700
    const padding = 100

    this.message.vAlign = 'center'
    this.message.hAlign = 'center'
    this.message.hTextAlign = 'center'
    this.message.adaptWidth = true
    this.message.color = new Color4(0, 0, 0, 1)
    this.message.visible = false

    this.image.width = width
    this.image.height = height + padding
    this.image.paddingBottom = padding
    this.image.vAlign = 'center'
    this.image.hAlign = 'center'
    this.image.sourceTop = 0
    this.image.sourceLeft = 0
    this.image.sourceHeight = 500
    this.image.sourceWidth = 500
    this.image.isPointerBlocker = true
    this.image.visible = false
    this.image.onClick = new OnClick(() => this.hide())

    const handleClose = (_: LocalActionButtonEvent) => {
      const currentTime = +Date.now()
      const isOpen = this.message.visible && this.image.visible
      if (isOpen && currentTime - this.openTime > 100) {
        debugger
        this.hide()
      }
    }

    Input.instance.subscribe(
      'BUTTON_DOWN',
      ActionButton.PRIMARY,
      true,
      handleClose
    )
    Input.instance.subscribe(
      'BUTTON_DOWN',
      ActionButton.SECONDARY,
      true,
      handleClose
    )
    Input.instance.subscribe(
      'BUTTON_DOWN',
      ActionButton.POINTER,
      true,
      handleClose
    )
  }

  open(entity: Entity, text = '', fontSize = 36) {
    this.openTime = +Date.now()
    const source = new AudioSource(this.clip)
    entity.addComponentOrReplace(source)
    source.playing = true

    this.message.value = text
    this.message.fontSize = fontSize
    this.message.visible = true
    this.message.paddingBottom =
      50 - ((text.split('\n').length - 1) / 2) * fontSize
    this.image.visible = true
  }

  hide() {
    this.message.visible = false
    this.image.visible = false
  }

  isOpen() {
    return this.message.visible && this.image.visible
  }

  spawn(host: Entity, props: Props, channel: IChannel) {
    const scroll = new Entity()
    scroll.setParent(host)

    scroll.addComponent(new GLTFShape('models/Scroll.glb'))
    scroll.addComponent(
      new OnPointerDown(
        () => {
          this.open(scroll, props.text, props.fontSize)
        },
        {
          button: ActionButton.POINTER,
          hoverText: 'Read',
          distance: 6
        }
      )
    )

    this.instances.push([scroll, props])

    // handle actions
    channel.handleAction('open', ({ sender }) => {
      this.open(scroll, props.text, props.fontSize)
    })
    channel.handleAction('close', ({ sender }) => {
      this.hide()
    })
  }
}
