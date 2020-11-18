export type Props = {
  text?: string
  fontSize?: number
  font?: string
}

type ChangeTextType = { newText: string }

export default class SignPost implements IScript<Props> {
  init() {}

  spawn(host: Entity, props: Props, channel: IChannel) {
    let signText = new Entity()
    signText.setParent(host)
    let text = new TextShape(props.text)
    text.fontSize = props.fontSize
    text.color = Color3.White()

    switch (props.font) {
      case 'SF':
        text.font = new Font(Fonts.SanFrancisco)
        break
      case 'SF_Heavy':
        text.font = new Font(Fonts.SanFrancisco_Heavy)
        break
    }

    text.width = 20
    text.height = 10
    text.hTextAlign = 'center'

    signText.addComponent(text)

    signText.addComponent(
      new Transform({
        position: new Vector3(0, 0, 0),
        rotation: Quaternion.Euler(0, 0, 0),
        scale: new Vector3(2, 2, 2),
      })
    )
  }
}
