export type Props = {
  url: string
  name?: string
}

export type LinkData = {
  callback: (event: any) => void
  hoverText: string
}

type ChangeLinkType = { url: string; name?: string }

export default class Teleport implements IScript<Props> {
  init() {}

  spawn(host: Entity, props: Props, channel: IChannel) {
    const link = new Entity()
    link.setParent(host)

    link.addComponent(new GLTFShape('models/hiper.glb'))

    let url = parseURL(props.url)

    let locationString = props.name ? props.name : 'Visit site'

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

    channel.handleAction<ChangeLinkType>('changeLink', (action) => {
      let newUrl = parseURL(action.values.url)
      let hoverString = action.values.name ? action.values.name : 'Visit site'

      link.getComponent(OnPointerDown).callback = async function () {
        openExternalURL(url)
      }
      link.getComponent(OnPointerDown).hoverText = hoverString
    })

    channel.handleAction<ChangeLinkType>('activate', ({ sender }) => {
      if (sender === channel.id) {
        openExternalURL(url)
      }
    })

    channel.request<LinkData>('getCoords', (result) => {
      link.getComponent(OnPointerDown).callback = result.callback
      link.getComponent(OnPointerDown).hoverText = result.hoverText
    })
    channel.reply<void>('getCoords', () => {
      let response: LinkData = {
        callback: link.getComponent(OnPointerDown).callback,
        hoverText: link.getComponent(OnPointerDown).hoverText,
      }
      return response
    })
  }
}

export function parseURL(url: string) {
  let newURL = url.trim()

  if (url.substr(0, 7) == 'http://') {
    newURL = 'https://' + url.substring(7).trim()
  } else if (url.substr(0, 8) != 'https://') {
    newURL = 'https://' + url.trim()
  }

  return newURL
}
