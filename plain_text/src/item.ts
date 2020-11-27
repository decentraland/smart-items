export type Props = {
  text?: string
  font: string
  color: string
}

export default class PlainText implements IScript<Props> {
  init() {}

  spawn(host: Entity, props: Props, channel: IChannel) {
    let signText = new Entity()
    signText.setParent(host)
    let text = new TextShape(props.text)
    text.fontSize = 1
    text.color = Color3.FromHexString(props.color)
    text.hTextAlign = 'bottom'

    switch (props.font) {
      case 'SF':
        text.font = new Font(Fonts.SanFrancisco)
        break
      case 'SF_Heavy':
        text.font = new Font(Fonts.SanFrancisco_Heavy)
        break
    }

    // let test = new Entity()
    // test.setParent(host)
    // test.addComponentOrReplace(new GLTFShape('models/SomeText.glb'))

    text.width = 5
    text.height = 1
    //text.hTextAlign = 'center'

    signText.addComponent(text)

    signText.addComponent(
      new Transform({
        position: new Vector3(0, 0.09, 0),
        rotation: Quaternion.Euler(0, 180, 0),
        scale: new Vector3(2, 2, 2),
      })
    )
  }
}
