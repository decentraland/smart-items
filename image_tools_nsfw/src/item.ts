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
    let NSFWTexture = new Texture('images/sensitive_content.png')
    NSFWMaterial.albedoTexture = NSFWTexture
    NSFWMaterial.metallic = 0
    NSFWMaterial.roughness = 1
    NSFWMaterial.specularIntensity = 0

    let QRPlane = new Entity()
    QRPlane.setParent(host)
    QRPlane.addComponent(new PlaneShape())
    QRPlane.addComponent(QRMaterial)
    QRPlane.addComponent(
      new Transform({
        position: new Vector3(0, 0.5, 0),
        rotation: Quaternion.Euler(180, 0, 0),
        scale: new Vector3(1, 1, 1),
      })
    )

    if (props.nsfw) {
      let cover = new Entity()
      cover.setParent(host)
      cover.addComponent(new PlaneShape())
      cover.getComponent(PlaneShape).isPointerBlocker = true
      cover.addComponent(NSFWMaterial)
      cover.addComponent(
        new Transform({
          position: new Vector3(0, 0.5, 0.002),
          rotation: Quaternion.Euler(180, 0, 0),
          scale: new Vector3(1, 1, 1),
        })
      )
      cover.addComponent(
        new OnPointerDown(
          () => {
            cover.getComponent(PlaneShape).visible = false
            cover.getComponent(PlaneShape).isPointerBlocker = false
            backCover.getComponent(PlaneShape).visible = false
          },
          { hoverText: 'Uncover Image' }
        )
      )

      let backCover = new Entity()
      backCover.setParent(host)
      backCover.addComponent(new PlaneShape())
      backCover.addComponent(NSFWMaterial)
      backCover.addComponent(
        new Transform({
          position: new Vector3(0, 0.5, -0.002),
          rotation: Quaternion.Euler(0, 0, 180),
          scale: new Vector3(1, 1, 1),
        })
      )

      backCover.addComponent(
        new OnPointerDown(
          () => {
            cover.getComponent(PlaneShape).visible = false
            cover.getComponent(PlaneShape).isPointerBlocker = false
            backCover.getComponent(PlaneShape).visible = false
          },
          { hoverText: 'Uncover Image' }
        )
      )
    }
  }
}
