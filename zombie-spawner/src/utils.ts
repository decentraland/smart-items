export function getGlobalPosition(subject: IEntity): Vector3 {
  const entityPosition = subject.hasComponent(Transform) ? subject.getComponent(Transform).position.clone() : Vector3.Zero()
  const parentEntity = subject.getParent() as Entity

  if (parentEntity.alive) {
    if (parentEntity != null) {
      const parentRotation = parentEntity.hasComponent(Transform) ? parentEntity.getComponent(Transform).rotation : Quaternion.Identity
      return getGlobalPosition(parentEntity).add(entityPosition.rotate(parentRotation))
    }
  }

  return entityPosition
}

export function setGlobalPosition(target: IEntity, position: Vector3) {
  const transform = target.getComponent(Transform)

  if (transform) {
    const parentEntity = target.getParent()

    if (parentEntity) {
      const parentOffset = position.subtract(getGlobalPosition(parentEntity))
      transform.position = divideVector(
        parentOffset.rotate(Quaternion.Inverse(getGlobalRotation(parentEntity))),
        getGlobalScale(parentEntity)
      )
    } else {
      transform.position = position
    }
  }
}

export function getGlobalRotation(target: IEntity) {
  let entityRotation = target.hasComponent(Transform) ? target.getComponent(Transform).rotation.clone() : Quaternion.Identity
  let parentEntity = target.getParent() as Entity

  if (parentEntity != null) {
    return getGlobalRotation(parentEntity).multiply(entityRotation)
  }

  return entityRotation
}

export function getGlobalScale(target: IEntity) {
  let entityScale = target.hasComponent(Transform) ? target.getComponent(Transform).scale.clone() : Vector3.One()
  let parentEntity = target.getParent() as Entity

  if (parentEntity != null) {
    return getGlobalScale(parentEntity).multiply(entityScale)
  }

  return entityScale
}

export function randomRange(min: number, max: number): number {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}

function divideVector(v1: Vector3, v2: Vector3): Vector3 {
  const ret = new Vector3()
  ret.x = v2.x != 0 ? v1.x / v2.x : 0
  ret.y = v2.y != 0 ? v1.y / v2.y : 0
  ret.z = v2.z != 0 ? v1.z / v2.z : 0
  return ret
}

export function globalLookAt(subject: IEntity, target: Vector3, worldUp: Vector3 = Vector3.Up()) {
  const result = new Matrix()
  const transform = subject.getComponent(Transform)
  if (!transform) return
  Matrix.LookAtLHToRef(getGlobalPosition(subject), target, worldUp, result)
  result.invert()
  Quaternion.FromRotationMatrixToRef(result, transform.rotation)
  return subject
}
