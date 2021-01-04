export type Props = {
  id: string
  contract: string
  style: string
  color: string
  ui: boolean
  uiText: string
}

export default class SignPost implements IScript<Props> {
  init() {}

  spawn(host: Entity, props: Props, channel: IChannel) {
    const frame = new Entity()
    frame.setParent(host)

    frame.addComponent(
      new Transform({
        position: new Vector3(0, 0.25, 0),
        rotation: Quaternion.Euler(0, 180, 0),
      })
    )

    let nft = 'ethereum://' + props.contract + '/' + props.id

    frame.addComponent(
      new NFTShape(nft, {
        color: Color3.FromHexString(props.color),
        style: PictureFrameStyle[props.style],
      })
    )

    if (props.ui) {
      frame.addComponent(
        new OnPointerDown(
          () => {
            openNFTDialog(nft, props.uiText ? props.uiText : null)
          },
          { hoverText: 'Open UI' }
        )
      )
    }

    // let test = new Entity()
    // test.setParent(host)
    // test.addComponent(new GLTFShape('models/CustomFrame.glb'))
  }
}
