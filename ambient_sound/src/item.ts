export type Props = {
  active: boolean
  loop: boolean
  sound: string
}

export enum soundList {
  'Birds',
  'City',
  'Factory',
  'Field',
  'Swamp',
  'Town'
}

export default class Ambient implements IScript<Props> {
  active: Record<string, boolean> = {}
  songs: Record<string, AudioClip> = {}

  init() {
    this.songs['Birds'] = new AudioClip('sounds/Birds.mp3')
    this.songs[`City`] = new AudioClip('sounds/City.mp3')
    this.songs[`Factory`] = new AudioClip('sounds/Factory.mp3')
    this.songs[`Field`] = new AudioClip('sounds/Field.mp3')
    this.songs[`Swamp`] = new AudioClip('sounds/Swamp.mp3')
    this.songs[`Town`] = new AudioClip('sounds/Town.mp3')
  }

  toggle(entity: Entity, value: boolean) {
    if (this.active[entity.name] === value) return

    const soundComponent = entity.getComponent(AudioSource)

    if (value) {
      soundComponent.playing = true
    } else {
      soundComponent.playing = false
    }

    this.active[entity.name] = value
  }

  spawn(host: Entity, props: Props, channel: IChannel) {
    const source = new Entity(host.name + '-button')
    source.setParent(host)

    const soundComponent = new AudioSource(this.songs[props.sound])
    soundComponent.loop = props.loop
    soundComponent.audioClip.loop = props.loop

    source.addComponent(soundComponent)

    if (props.active) {
      soundComponent.playing = true
    }

    this.active[source.name] = false

    // handle actions
    channel.handleAction('activate', ({ sender }) => {
      this.toggle(source, true)
    })
    channel.handleAction('deactivate', ({ sender }) => {
      this.toggle(source, false)
    })

    // sync initial values
    channel.request<boolean>('isActive', isActive =>
      this.toggle(source, isActive)
    )
    channel.reply<boolean>('isActive', () => this.active[source.name])
  }
}
