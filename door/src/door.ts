@Component('org.decentraland.OpenableDoor')
export class OpenableDoor {
  transition: number = -1
  isOpen: boolean = false
  constructor(
    public channel: IChannel,
    public onOpen?: Actions,
    public onClose?: Actions
  ) {}
}

const openDoor = Quaternion.Euler(0, 90, 0)
const closedDoor = Quaternion.Euler(0, 0, 0)

export class DoorSystem {
  group = engine.getComponentGroup(OpenableDoor)
  update(dt: number) {
    for (const entity of this.group.entities) {
      const openable = entity.getComponent(OpenableDoor)
      const transform = entity.getComponent(Transform)

      const start = openable.isOpen ? closedDoor : openDoor
      const end = openable.isOpen ? openDoor : closedDoor
      const speed = openable.isOpen ? 1 : 2

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
