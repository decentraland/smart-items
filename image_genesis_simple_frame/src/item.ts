export type Props = {
  image: string
  nsfw: boolean
}

type ChangeTextType = { newText: string }

export default class SignPost implements IScript<Props> {
  init() {}

  spawn(host: Entity, props: Props, channel: IChannel) {
    const sign = new Entity()
    sign.setParent(host)

    //sign.addComponent(new GLTFShape('models/QR_SimpleFrame.glb'))
    sign.addComponent(new Transform({}))

    let url = props.image

    let QRTexture = new Texture(url)
    let QRMaterial = new Material()
    QRMaterial.metallic = 0
    QRMaterial.roughness = 1
    QRMaterial.specularIntensity = 0
    QRMaterial.albedoTexture = QRTexture

    let NSFWMaterial = new Material()
    NSFWMaterial.albedoColor = Color4.Black()
    NSFWMaterial.metallic = 0
    NSFWMaterial.roughness = 1
    NSFWMaterial.specularIntensity = 0

    let QRPlane = new Entity()
    QRPlane.setParent(host)
    QRPlane.addComponent(new PlaneShape())
    QRPlane.addComponent(QRMaterial)
    QRPlane.addComponent(
      new Transform({
        position: new Vector3(0, 0.35, 0),
        rotation: Quaternion.Euler(180, 0, 0),
        scale: new Vector3(0.5, 0.5, 0.5),
      })
    )

    if (props.nsfw) {
      let nsfwLabel = new Entity()
      nsfwLabel.setParent(host)
      nsfwLabel.addComponent(new TextShape('NSFW'))
      nsfwLabel.getComponent(TextShape).fontSize = 3
      nsfwLabel.addComponent(
        new Transform({
          position: new Vector3(0, 0.35, 0.003),
          rotation: Quaternion.Euler(0, 180, 0),
          scale: new Vector3(0.5, 0.5, 0.5),
        })
      )

      let cover = new Entity()
      cover.setParent(host)
      cover.addComponent(new PlaneShape())
      cover.getComponent(PlaneShape).isPointerBlocker = true
      cover.addComponent(NSFWMaterial)
      cover.addComponent(
        new Transform({
          position: new Vector3(0, 0.35, 0.002),
          rotation: Quaternion.Euler(0, 0, 0),
          scale: new Vector3(0.5, 0.5, 0.5),
        })
      )
      cover.addComponent(
        new OnPointerDown(
          () => {
            cover.getComponent(PlaneShape).visible = false
            cover.getComponent(PlaneShape).isPointerBlocker = false
            backCover.getComponent(PlaneShape).visible = false
            nsfwLabel.getComponent(TextShape).value = ''
          },
          { hoverText: 'Uncover NSFW Image' }
        )
      )

      let backCover = new Entity()
      backCover.setParent(host)
      backCover.addComponent(new PlaneShape())
      backCover.addComponent(NSFWMaterial)
      backCover.addComponent(
        new Transform({
          position: new Vector3(0, 0.35, -0.002),
          rotation: Quaternion.Euler(0, 0, 0),
          scale: new Vector3(0.5, 0.5, 0.5),
        })
      )
    }
  }
}
