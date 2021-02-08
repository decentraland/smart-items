export type Props = {
  onClick?: Actions
  onActivate?: Actions
  onDeactivate?: Actions
  station?: string
  customStation?: string
  onClickText: string
  startOn: boolean
  volume: number
  image?: string
}

  
let defaultStation = 'https://theuniverse.club/live/genesisplaza/index.m3u8'
export type screenData = {
  screen1: Entity
  material: Material
  texture: VideoTexture
  volume: number
  active: boolean
}
export default class Button implements IScript<Props> {
  channel = ''
  data: Record<string, screenData> = {}
  activeScreen: string
  init() {}
  toggle(hostName: string, value: boolean) {
    // log('all screens: ', this.video, ' setting: ', entity.name, ' to ', value)
    if (value) {
      if (this.activeScreen && this.activeScreen == hostName) {
        return
      } else if (this.activeScreen) {
        this.toggle(this.activeScreen, false)
      }
      this.activeScreen = hostName
      let data = this.data[hostName]
      data.screen1.addComponentOrReplace(data.material)
      data.active = true
      data.texture.volume = data.volume
      data.texture.playing = true
    } else {
      if (!this.activeScreen || this.activeScreen != hostName) {
        return
      }
      this.activeScreen = null
      let data = this.data[hostName]
      data.active = false
      data.texture.playing = false
    }
    return
  }
  spawn(host: Entity, props: Props, channel: IChannel) {
    const screen = new Entity(host.name + '-screen')
    screen.setParent(host)
    let scaleMult = 0.35
    screen.addComponent(new PlaneShape())
    screen.addComponent(
      new Transform({
        scale: new Vector3(1.92 * scaleMult, 1.08 * scaleMult, 10 * scaleMult),
        position: new Vector3(-0.001, 1.5 * scaleMult, -0.001),
        rotation: Quaternion.Euler(0,180,180)
      })
    )
    let billboard = new Entity()
    billboard.setParent(host)
    billboard.addComponent(new Transform({ position: new Vector3(0, 0, 0) }))
    billboard.addComponent(new GLTFShape('models/Display_Monitor.glb'))
   
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
    let myTexture = new VideoTexture(new VideoClip(this.channel))
    let myMaterial = new Material()
    myMaterial.albedoTexture = myTexture
    myMaterial.specularIntensity = 0
    myMaterial.roughness = 1
    myMaterial.metallic = 0
    myMaterial.emissiveTexture = myTexture
    myMaterial.emissiveIntensity = 0.8
    myMaterial.emissiveColor = new Color3(1, 1, 1)
    let placeholderMaterial = new Material()
    placeholderMaterial.albedoTexture = new Texture(
      props.image ? props.image : 'images/stream.png'
    )
    placeholderMaterial.specularIntensity = 0
    placeholderMaterial.roughness = 1
    screen.addComponent(placeholderMaterial)
    let volume = props.volume
    if (props.onClick) {
      screen.addComponent(
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
     
      billboard.addComponent(
        new OnPointerDown(
          () => {
            log('clicked')
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
    this.data[host.name] = {
      screen1: screen,
      volume: volume,
      texture: myTexture,
      material: myMaterial,
      active: props.startOn ? true : false,
    }
    if (props.startOn) {
      this.toggle(host.name, true)
    } else {
      this.toggle(host.name, false)
    }
    // handle actions
    channel.handleAction('activate', ({ sender }) => {
      this.toggle(host.name, true)
      if (sender === channel.id) {
        channel.sendActions(props.onActivate)
      }
    })
    channel.handleAction('deactivate', ({ sender }) => {
      this.toggle(host.name, false)
      if (sender === channel.id) {
        channel.sendActions(props.onDeactivate)
      }
    })
    channel.handleAction('toggle', ({ sender }) => {
      let value = !this.data[host.name].active
      this.toggle(host.name, value)
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
      this.toggle(host.name, isActive)
    )
    channel.reply<boolean>('isActive', () => this.data[host.name].active)
  }
}