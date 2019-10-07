@Component('org.decentraland.spaceship')
export class SpaceshipComponent {}

const GRAVITY = 0.005

let up = false
let forward = false
let acceleration = 0

Input.instance.subscribe(
  'BUTTON_DOWN',
  ActionButton.PRIMARY,
  false,
  () => (up = true)
)
Input.instance.subscribe(
  'BUTTON_UP',
  ActionButton.PRIMARY,
  false,
  () => (up = false)
)

Input.instance.subscribe(
  'BUTTON_DOWN',
  ActionButton.SECONDARY,
  false,
  () => (forward = true)
)
Input.instance.subscribe(
  'BUTTON_UP',
  ActionButton.SECONDARY,
  false,
  () => (forward = false)
)

export class ShipSystem {
  group = engine.getComponentGroup(Transform, SpaceshipComponent)
  update(dt: number) {
    for (const entity of this.group.entities) {
      const transform = entity.getComponent(Transform)
      const parent = entity.getParent()
      const rotation = transform.rotation.clone()
      const target = new Transform({ rotation })
      const ray = PhysicsCast.instance.getRayFromCamera(1)
      const user = ray.direction

      const parentTransform = parent.getComponent(Transform)

      const distance = Vector3.Distance(
        parentTransform.position.add(new Vector3(0, 4, 0).add(ray.direction)),
        Camera.instance.position
      )
      const direction = new Vector3(user.x, transform.position.y, user.z)
      if (distance < 1.5) {
        target.lookAt(direction)
        if (up) {
          acceleration += 0.01
        }
        if (forward) {
          Vector3.LerpToRef(
            parentTransform.position,
            parentTransform.position.add(
              Vector3.Forward().rotate(transform.rotation)
            ),
            dt * 10,
            parentTransform.position
          )
        }
      }
      Quaternion.SlerpToRef(
        transform.rotation,
        target.rotation,
        dt,
        transform.rotation
      )

      if (parentTransform.position.y > 0) {
        acceleration -= GRAVITY
      }

      parentTransform.position.addInPlaceFromFloats(0, acceleration, 0)

      if (parentTransform.position.y < 0) {
        parentTransform.position.y = 0
        acceleration = 0
      }
    }
  }
}
