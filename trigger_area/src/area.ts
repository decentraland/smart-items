import { Box } from './utils'

@Component('org.decentraland.TriggerableArea')
export class TriggerableArea {
  lastState: 0 | 1 = 0
  enabled: boolean = true
  _transformCache: string = '(0 0 0)'
  _boxCache: Box
  onEnter: () => void
  onLeave: () => void
}

export function getGlobalPosition(subject: IEntity): Vector3 {
  const entityPosition = subject.hasComponent(Transform)
    ? subject.getComponent(Transform).position.clone()
    : Vector3.Zero()
  const parentEntity = subject.getParent() as Entity

  if (parentEntity.alive) {
    if (parentEntity != null) {
      const parentRotation = parentEntity.hasComponent(Transform)
        ? parentEntity.getComponent(Transform).rotation
        : Quaternion.Identity
      return getGlobalPosition(parentEntity).add(
        entityPosition.rotate(parentRotation)
      )
    }
  }

  return entityPosition
}

export class TriggerableAreaSystem implements ISystem {
  group = engine.getComponentGroup(TriggerableArea)

  update(_: number) {
    for (const entity of this.group.entities) {
      const triggerableArea = entity.getComponent(TriggerableArea)
      const transform = entity.getComponent(Transform)
      const { rotation, scale } = transform

      const position = getGlobalPosition(entity)

      if (triggerableArea.enabled) {
        const radius = Math.max(
          Math.max(Math.abs(scale.x), Math.abs(scale.z)),
          Math.abs(scale.y)
        )
        const distance = Vector3.DistanceSquared(
          position,
          Camera.instance.position
        )
        if (
          distance >
          (radius + Camera.instance.playerHeight) *
            (radius + Camera.instance.playerHeight)
        )
          continue

        const transformCache = `${position} ${rotation} ${scale}`
        const inverseMatrix = Matrix.Invert(
          Matrix.Compose(Vector3.One(), rotation, position)
        )
        const playerPos = Camera.instance.position.clone()

        if (transformCache !== triggerableArea._transformCache) {
          triggerableArea._boxCache = this.computeBoundingBox(transform)
          triggerableArea._transformCache = transformCache
        }

        // Feet
        const inversePoint1 = playerPos.subtractFromFloats(
          0,
          Camera.instance.playerHeight,
          0
        )
        inversePoint1.applyMatrix4(inverseMatrix)

        // Mid body
        const inversePoint2 = playerPos.subtractFromFloats(
          0,
          Camera.instance.playerHeight / 2,
          0
        )
        inversePoint2.applyMatrix4(inverseMatrix)

        // Head
        const inversePoint3 = playerPos.clone()
        inversePoint3.applyMatrix4(inverseMatrix)

        if (
          triggerableArea._boxCache.containsPoint(inversePoint1) ||
          triggerableArea._boxCache.containsPoint(inversePoint2) ||
          triggerableArea._boxCache.containsPoint(inversePoint3)
        ) {
          if (triggerableArea.lastState === 0) {
            triggerableArea.onEnter()
          }
          triggerableArea.lastState = 1
        } else {
          if (triggerableArea.lastState === 1) {
            triggerableArea.onLeave()
          }
          triggerableArea.lastState = 0
        }
      }
    }
  }

  computeBoundingBox(transform: Transform) {
    const { scale } = transform

    const halfScaleX = scale.x * 0.5
    const halfScaleZ = scale.z * 0.5
    const max = new Vector3(halfScaleX, scale.y, halfScaleZ)
    const min = new Vector3(-halfScaleX, 0, -halfScaleZ)

    const inverseBox = new Box(min, max)

    return inverseBox
  }
}
