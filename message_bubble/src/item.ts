import { BubbleSystem, MessageBubbleComponent } from './bubble'

export type Props = {
  text?: string
  fontSize?: number
}

type ChangeTextType = {
  newText: string
}

export default class MessageBubble implements IScript<Props> {
  openClip = new AudioClip('sounds/MessageBubble.mp3')
  init() {
    engine.addSystem(new BubbleSystem())
  }

  toggle(bubble: Entity, text: TextShape, value: boolean, playSound = true) {
    let bubbleData = bubble.getComponent(MessageBubbleComponent)

    if (bubbleData.isOpen === value) return

    if (playSound) {
      const source = new AudioSource(this.openClip)
      bubble.addComponentOrReplace(source)
      source.playing = true
    }

    bubble.getComponent(Transform).rotation = bubbleData.rotation.clone()

    bubbleData.isOpen = value
    bubbleData.transition = 0

    if (value) {
      text.value = bubbleData.text.toString()
    } else {
      text.value = ''
    }
  }

  spawn(host: Entity, props: Props, channel: IChannel) {
    const bubble = new Entity()
    bubble.setParent(host)

    bubble.addComponent(new GLTFShape('models/bubble/MessageBubble.glb'))

    bubble.addComponent(
      new Transform({
        position: new Vector3(0, 0, 0),
        scale: new Vector3(0.25, 0.25, 0.25)
      })
    )

    let bubbleData = new MessageBubbleComponent(
      channel,
      props.text,
      bubble.getComponent(Transform).rotation.clone()
    )
    bubble.addComponent(bubbleData)

    let signText = new Entity()
    signText.setParent(bubble)
    let text = new TextShape(props.text)
    text.fontSize = props.fontSize
    text.color = Color3.FromHexString('#242424')
    // text.outlineWidth = 0.4
    // text.outlineColor = Color3.FromHexString('#8cfdff')

    text.width = 20
    text.height = 10
    text.hTextAlign = 'center'
    text.value = ''

    signText.addComponent(text)

    signText.addComponent(
      new Transform({
        position: new Vector3(0.25, 0.45, -0.01),
        rotation: Quaternion.Euler(0, 0, 0),
        scale: new Vector3(0.05, 0.05, 0.05)
      })
    )

    bubble.addComponent(
      new OnPointerDown(
        e => {
          this.toggle(bubble, text, !bubbleData.isOpen, true)
        },
        {
          button: ActionButton.POINTER,
          hoverText: 'Open/Close',
          distance: 8
        }
      )
    )

    // handle actions
    channel.handleAction('open', ({ sender }) => {
      this.toggle(bubble, text, true)
    })
    channel.handleAction('close', ({ sender }) => {
      this.toggle(bubble, text, false)
    })
    channel.handleAction<ChangeTextType>('changeText', action => {
      text.value = action.values.newText
      bubbleData.text = action.values.newText
    })

    channel.request<string>('getText', signText => (bubbleData.text = signText))
    channel.reply<string>('getText', () => bubbleData.text)
  }
}
