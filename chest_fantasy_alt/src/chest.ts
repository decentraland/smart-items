@Component('org.decentraland.OpenableChest')
export class OpenableChest {
  transition: number = -1
  isOpen: boolean = false
  constructor(
    public channel: IChannel,
    public onOpen?: Actions,
    public onClose?: Actions
  ) {}
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
      const speed = openable.isOpen ? 1.5 : 3

      if (openable.transition >= 0 && openable.transition < 1) {
        openable.transition += dt * speed
        transform.rotation.copyFrom(
          Quaternion.Slerp(start, end, openable.transition)
        )
      } else if (openable.transition > 1) {
        openable.transition = -1
        transform.rotation.copyFrom(end)
        // send actions
        if (openable.isOpen && openable.onOpen) {
          openable.channel.sendActions(openable.onOpen)
        } else if (!openable.isOpen && openable.onClose) {
          openable.channel.sendActions(openable.onClose)
        }
      }
    }
  }
}
