export type Props = {
  text?: string
  fontSize?: number
}

type ChangeTextType = { newText: string }

export default class SignPost implements IScript<Props> {
  init() { }

  spawn(host: Entity, props: Props, channel: IChannel) {
    const sign = new Entity()
    sign.setParent(host)

    sign.addComponent(new GLTFShape('models/signpost/SignPost_Square.glb'))

    let signText = new Entity()
    signText.setParent(host)
    let text = new TextShape(props.text)
    text.fontSize = props.fontSize
    text.color = Color3.Black()

    text.outlineColor = Color3.Black()
    text.outlineWidth = 0.3

    text.width = 20
    text.height = 10
    text.hTextAlign = 'center'

    signText.addComponent(text)

    signText.addComponent(
      new Transform({
        position: new Vector3(0, 2.05, -0.03),
        rotation: Quaternion.Euler(0, 0, 0),
        scale: new Vector3(0.05, 0.05, 0.05)
      })
    )

    channel.handleAction<ChangeTextType>('changeText', action => {
      text.value = action.values.newText
    })

    channel.request<string>('getText', signText => (text.value = signText))
    channel.reply<string>('getText', () => text.value)
  }
}
