@Component('org.decentraland.zombie-follower')
class Zombie {
  speed: number
}

class ZombieSystem implements ISystem {
  group = engine.getComponentGroup(Zombie)

  update(dt: number) {
    for (let entity of this.group.entities) {
      const transform = entity.getComponentOrCreate(Transform)
      const { speed } = entity.getComponent(Zombie)

      const targetPosition = Camera.instance.position

      transform.position.x = Scalar.Lerp(transform.position.x, targetPosition.x, speed * dt)
      transform.position.z = Scalar.Lerp(transform.position.z, targetPosition.z, speed * dt)

      transform.lookAt(targetPosition)
      transform.rotation.x = 0
      transform.rotation.z = 0
    }
  }
}
