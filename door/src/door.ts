@Component('openable')
export class Openable {
  transition: number = -1
  isOpen: boolean = false
}

const openDoor = Quaternion.Euler(0, 90, 0)
const closedDoor = Quaternion.Euler(0, 0, 0)

export class DoorSystem {
  group = engine.getComponentGroup(Openable)
  update(dt: number) {
    for (const entity of this.group.entities) {
      const openable = entity.getComponent(Openable)
      const transform = entity.getComponent(Transform)

      const start = openable.isOpen ? closedDoor : openDoor
      const end = openable.isOpen ? openDoor : closedDoor

      if (openable.transition >= 0 && openable.transition < 1) {
        openable.transition += dt
        transform.rotation.copyFrom(
          Quaternion.Slerp(start, end, openable.transition)
        )
      } else if (openable.transition > 1) {
        openable.transition = -1
        transform.rotation.copyFrom(end)
      }
    }
  }
}
