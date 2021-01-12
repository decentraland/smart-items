export type Props = {
  url: string
  name?: string
  bnw: boolean
}

let siteName = 'facebook'
let siteURL = 'facebook.com'
let defaulthover = 'Facebook Page'

let stringsToReplace: string[] = [
  'http://',
  'https://',
  'http:',
  'https:',
  'www.',
  siteURL,
  '/',
]

export default class SMedia_Link implements IScript<Props> {
  clip = new AudioClip('sounds/click.mp3')
  init() {}
  push(entity: Entity) {
    const source = new AudioSource(this.clip)
    entity.addComponentOrReplace(source)
    source.playing = true

    const animator = entity.getComponent(Animator)
    const clip = animator.getClip('Action')
    clip.looping = false
    clip.stop()
    clip.play()
  }
  spawn(host: Entity, props: Props, channel: IChannel) {
    const link = new Entity()
    link.setParent(host)

    if (props.bnw) {
      link.addComponent(new GLTFShape('models/facebook_bnw.glb'))
    } else {
      link.addComponent(new GLTFShape('models/facebook.glb'))
    }

    let url = parseURL(props.url)

    let locationString = props.name ? props.name : defaulthover

    link.addComponent(
      new OnPointerDown(
        function () {
          //this.push(link)
          const pushAction = channel.createAction('push', {})
          channel.sendActions([pushAction])
          openExternalURL(url)
        },
        {
          button: ActionButton.PRIMARY,
          hoverText: locationString,
        }
      )
    )
    link.addComponent(new Animator())

    channel.handleAction('push', ({ sender }) => {
      this.push(link)

      // if (sender === channel.id) {
      //   channel.sendActions(props.onOpen)
      // }
    })
  }
}

export function parseURL(url: string) {
  let newURL = url.trim()

  for (let str of stringsToReplace) {
    if (newURL.substr(0, str.length) == str) {
      newURL = newURL.substring(str.length).trim()
    }
  }

  let finalURL = 'https://www.' + siteURL + '/' + newURL

  return finalURL
}
