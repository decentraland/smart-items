export type Props = {
  onClick?: Actions
  onActivate?: Actions
  onDeactivate?: Actions
  station?: string
  customStation?: string
  onClickText: string
  startOn: boolean
  volume: number
}

let defaultStation = 'https://theuniverse.club/live/genesisplaza/index.m3u8'

export default class Button implements IScript<Props> {
  channel = ''
  video: VideoTexture
  active: Record<string, boolean> = {}
  volume: Record<string, number> = {}
  sign: Entity
  init() {}

  toggle(entity: Entity, value: boolean) {
    if (value) {
      this.video.playing = true
      this.sign.getComponent(PlaneShape).visible = false
    } else {
      this.video.playing = false
      this.sign.getComponent(PlaneShape).visible = true
      this.video.volume = this.volume[entity.name]
    }
  }

  spawn(host: Entity, props: Props, channel: IChannel) {
    const screen = new Entity(host.name + '-screen')
    screen.setParent(host)

    let scaleMult = 1.55

    screen.addComponent(new PlaneShape())
    screen.addComponent(
      new Transform({
        scale: new Vector3(1.92 * scaleMult, 1.08 * scaleMult, 10 * scaleMult),
        position: new Vector3(0, 0.548 * scaleMult, 0),
      })
    )

    if (props.customStation) {
      this.channel = props.customStation
    } else if (props.station) {
      this.channel = props.station
    } else {
      this.channel = defaultStation
    }

    // //test
    // let test = new Entity()
    // test.setParent(host)
    // test.addComponentOrReplace(new GLTFShape('models/stream_preview.glb'))

    // video material
    this.video = new VideoTexture(new VideoClip(this.channel))
    const mat = new Material()
    mat.albedoTexture = this.video
    mat.specularIntensity = 0
    mat.roughness = 1
    mat.metallic = 0

    screen.addComponent(mat)

    // icon for streaming
    let sign = new Entity(host.name + '-sign')
    sign.setParent(screen)

    sign.addComponent(new PlaneShape())
    sign.addComponent(
      new Transform({
        position: new Vector3(0, 0, 0.002),
        rotation: Quaternion.Euler(180, 0, 0),
      })
    )

    this.volume[screen.name] = props.volume

    let placeholderMaterial = new Material()
    placeholderMaterial.albedoTexture = new Texture('images/stream.png')
    placeholderMaterial.specularIntensity = 0
    placeholderMaterial.roughness = 1

    sign.addComponent(placeholderMaterial)
    this.sign = sign

    if (props.onClick) {
      sign.addComponent(
        new OnPointerDown(
          () => {
            channel.sendActions(props.onClick)
          },
          {
            button: ActionButton.POINTER,
            hoverText: props.onClickText,
            distance: 6,
          }
        )
      )
    }

    if (props.startOn) {
      this.toggle(screen, true)
      this.active[screen.name] = true
    } else {
      this.active[screen.name] = false
    }

    // handle actions
    channel.handleAction('activate', ({ sender }) => {
      this.active[screen.name] = true
      this.toggle(screen, true)

      if (sender === channel.id) {
        channel.sendActions(props.onActivate)
      }
    })
    channel.handleAction('deactivate', ({ sender }) => {
      this.active[screen.name] = false
      this.toggle(screen, false)
      if (sender === channel.id) {
        channel.sendActions(props.onDeactivate)
      }
    })
    channel.handleAction('toggle', ({ sender }) => {
      let value = !this.active[screen.name]
      this.active[screen.name] = value
      this.toggle(screen, value)
      if (sender === channel.id) {
        if (value) {
          channel.sendActions(props.onActivate)
        } else {
          channel.sendActions(props.onDeactivate)
        }
      }
    })

    // sync initial values
    channel.request<boolean>('isActive', (isActive) =>
      this.toggle(screen, isActive)
    )
    channel.reply<boolean>('isActive', () => this.active[screen.name])
  }
}
