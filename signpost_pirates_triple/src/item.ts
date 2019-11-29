export type Props = {
  textTop?: string
  textMiddle?: string
  textLower?: string
  fontSize?: number
}

type ChangeTextType = { newText: string }

export default class SignPost implements IScript<Props> {
  init() { }

  spawn(host: Entity, props: Props, channel: IChannel) {
    const sign = new Entity()
    sign.setParent(host)

    sign.addComponent(new GLTFShape('models/signpost/SignPost_Wood_Triple.glb'))

    let signTextTop = new Entity()
    signTextTop.setParent(host)
    let text1 = new TextShape(props.textTop)
    text1.fontSize = props.fontSize
    text1.color = Color3.White()

    text1.width = 20
    text1.height = 10
    text1.hTextAlign = 'center'

    signTextTop.addComponent(text1)

    signTextTop.addComponent(
      new Transform({
        position: new Vector3(0.02, 1.4, -0.4),
        rotation: Quaternion.Euler(0, 88, 0),
        scale: new Vector3(0.05, 0.05, 0.05)
      })
    )

    let signTextTop2 = new Entity()
    signTextTop2.setParent(host)
    signTextTop2.addComponent(text1)

    signTextTop2.addComponent(
      new Transform({
        position: new Vector3(0.07, 1.4, -0.4),
        rotation: Quaternion.Euler(0, 268, 0),
        scale: new Vector3(0.05, 0.05, 0.05)
      })
    )

    let signTextMiddle = new Entity()
    signTextMiddle.setParent(host)
    let text3 = new TextShape(props.textMiddle)
    text3.fontSize = props.fontSize
    text3.color = Color3.White()

    text3.width = 20
    text3.height = 10
    text3.hTextAlign = 'center'

    signTextMiddle.addComponent(text3)

    signTextMiddle.addComponent(
      new Transform({
        position: new Vector3(0.4, 1.36, 0.03),
        rotation: Quaternion.Euler(0, 180, 0),
        scale: new Vector3(0.05, 0.05, 0.05)
      })
    )

    let signTextMiddle2 = new Entity()
    signTextMiddle2.setParent(host)

    signTextMiddle2.addComponent(text3)

    signTextMiddle2.addComponent(
      new Transform({
        position: new Vector3(0.4, 1.36, -0.03),
        rotation: Quaternion.Euler(0, -2, 0),
        scale: new Vector3(0.05, 0.05, 0.05)
      })
    )

    let signTextLower = new Entity()
    signTextLower.setParent(host)
    let text2 = new TextShape(props.textLower)
    text2.fontSize = props.fontSize
    text2.color = Color3.White()

    text2.width = 20
    text2.height = 10
    text2.hTextAlign = 'center'

    signTextLower.addComponent(text2)

    signTextLower.addComponent(
      new Transform({
        position: new Vector3(-0.02, 1.25, 0.35),
        rotation: Quaternion.Euler(0, 88, 0),
        scale: new Vector3(0.05, 0.05, 0.05)
      })
    )

    let signTextLower2 = new Entity()
    signTextLower2.setParent(host)

    signTextLower2.addComponent(text2)

    signTextLower2.addComponent(
      new Transform({
        position: new Vector3(0.02, 1.25, 0.35),
        rotation: Quaternion.Euler(0, 268, 0),
        scale: new Vector3(0.05, 0.05, 0.05)
      })
    )

    channel.handleAction<ChangeTextType>('changeTopText', action => {
      text1.value = action.values.newText
    })
    channel.handleAction<ChangeTextType>('changeMiddleText', action => {
      text3.value = action.values.newText
    })
    channel.handleAction<ChangeTextType>('changeLowerText', action => {
      text2.value = action.values.newText
    })

    channel.request<string[]>('getText', signText => {
      text1.value = signText[0]
      text2.value = signText[1]
      text3.value = signText[2]
    })
    channel.reply<string[]>('getText', () => [
      text1.value,
      text2.value,
      text3.value
    ])
  }
}
