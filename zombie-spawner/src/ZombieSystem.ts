import { getGlobalPosition, setGlobalPosition, globalLookAt } from './utils'

@Component('org.decentraland.zombie-follower')
export class Zombie {
  speed: number
}

export class ZombieSystem implements ISystem {
  group = engine.getComponentGroup(Zombie)

  update(dt: number) {
    for (let entity of this.group.entities) {
      const transform = entity.getComponentOrCreate(Transform)
      const { speed } = entity.getComponent(Zombie)

      const targetPosition = Camera.instance.position

      // transform.position.x = Scalar.Lerp(transform.position.x, targetPosition.x, speed * dt)
      // transform.position.z = Scalar.Lerp(transform.position.z, targetPosition.z, speed * dt)

      const globalPos = getGlobalPosition(entity)

      const newPos = new Vector3(
        Scalar.Lerp(globalPos.x, targetPosition.x, speed * dt),
        globalPos.y,
        Scalar.Lerp(globalPos.z, targetPosition.z, speed * dt)
      )

      setGlobalPosition(entity, newPos)

      globalLookAt(entity, targetPosition)
      transform.rotation.x = 0
      transform.rotation.z = 0
    }
  }
}
