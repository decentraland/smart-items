export type Props = {
  url: string
  name?: string
  bnw: boolean
}

let siteName = 'reddit'
let siteURL = 'reddit.com'
let defaulthover = 'Reddit Page'

let stringsToReplace: string[] = [
  'http://',
  'https://',
  'http:',
  'https:',
  'www.',
  siteURL,
  '/',
  'r/',
]

export default class SMedia_Link implements IScript<Props> {
  init() {}

  spawn(host: Entity, props: Props, channel: IChannel) {
    const link = new Entity()
    link.setParent(host)

    if (props.bnw) {
      link.addComponent(new GLTFShape('models/reddit_bnw.glb'))
    } else {
      link.addComponent(new GLTFShape('models/reddit.glb'))
    }

    let url = parseURL(props.url)

    let locationString = props.name ? props.name : defaulthover

    link.addComponent(
      new OnPointerDown(
        async function () {
          openExternalURL(url)
        },
        {
          button: ActionButton.PRIMARY,
          hoverText: locationString,
        }
      )
    )
  }
}

export function parseURL(url: string) {
  let newURL = url.trim()

  for (let str of stringsToReplace) {
    if (newURL.substr(0, str.length) == str) {
      newURL = newURL.substring(str.length).trim()
    }
  }

  let finalURL = 'https://www.' + siteURL + '/' + 'r/' + newURL

  return finalURL
}
