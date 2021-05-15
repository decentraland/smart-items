export type Props = {
  image: string
}

type ChangeTextType = { newText: string }

export default class SignPost implements IScript<Props> {
  init() {}

  spawn(host: Entity, props: Props, channel: IChannel) {
    const sign = new Entity()
    sign.setParent(host)

    sign.addComponent(new GLTFShape('models/Game_Cube_C.glb'))
    sign.addComponent(new Transform({}))

    let url = props.image

    let QRTexture = new Texture(url)
    let QRMaterial = new Material()
    QRMaterial.metallic = 0
    QRMaterial.roughness = 1
    QRMaterial.specularIntensity = 0
    QRMaterial.albedoTexture = QRTexture

    //modifying rotations after init. using Transform.rotate to finish rotation
    //something with Quaternion.Euler(x,y,z) y of certian values causing issues
    //when deployed from builder works great but when deployed with dcl deploy breaks
    //if they ever fix we can revert this file

    let QRPlane = new Entity()
    QRPlane.setParent(host)
    QRPlane.addComponent(new PlaneShape())
    QRPlane.addComponent(QRMaterial)
    QRPlane.addComponent(
      new Transform({
        position: new Vector3(-0.62, 0.97, -0.25),
        rotation: Quaternion.Euler(180, 0, 0),//was y=75
        scale: new Vector3(0.58, 0.58, 0.58),
      })
    )
    QRPlane.getComponent(Transform).rotate(Vector3.Up(), 75)

    let QRPlane2 = new Entity()
    QRPlane2.setParent(host)
    QRPlane2.addComponent(new PlaneShape())
    QRPlane2.addComponent(QRMaterial)
    QRPlane2.addComponent(
      new Transform({
        position: new Vector3(-0.04, 0.97, -0.4),
        rotation: Quaternion.Euler(180, 0, 0),//was y=75+180
        scale: new Vector3(0.58, 0.58, 0.58),
      })
    )
    QRPlane2.getComponent(Transform).rotate(Vector3.Up(), 75+180)

    let QRPlane3 = new Entity()
    QRPlane3.setParent(host)
    QRPlane3.addComponent(new PlaneShape())
    QRPlane3.addComponent(QRMaterial)
    QRPlane3.addComponent(
      new Transform({
        position: new Vector3(-0.39, 2.265, -0.03),
        rotation: Quaternion.Euler(180, 0, 0),//was y=12.4
        scale: new Vector3(0.58, 0.58, 0.58),
      })
    )
    QRPlane3.getComponent(Transform).rotate(Vector3.Up(), 12.4)

    let QRPlane4 = new Entity()
    QRPlane4.setParent(host)
    QRPlane4.addComponent(new PlaneShape())
    QRPlane4.addComponent(QRMaterial)
    QRPlane4.addComponent(
      new Transform({
        position: new Vector3(-0.23, 2.265, -0.602),
        rotation: Quaternion.Euler(180, 0, 0),//was y=193
        scale: new Vector3(0.58, 0.58, 0.58),
      })
    )
    QRPlane4.getComponent(Transform).rotate(Vector3.Up(), 193)
  }
}
