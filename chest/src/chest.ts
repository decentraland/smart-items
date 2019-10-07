@Component('org.decentraland.OpenableChest')
export class OpenableChest {
  transition: number = -1
  isOpen: boolean = false
}

const openChest = Quaternion.Euler(-90, 0, 0)
const closedChest = Quaternion.Euler(0, 0, 0)

export class ChestSystem {
  group = engine.getComponentGroup(OpenableChest)
  update(dt: number) {
    for (const entity of this.group.entities) {
      const openable = entity.getComponent(OpenableChest)
      const transform = entity.getComponent(Transform)

      const start = openable.isOpen ? closedChest : openChest
      const end = openable.isOpen ? openChest : closedChest

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
