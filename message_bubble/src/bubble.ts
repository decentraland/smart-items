@Component('org.decentraland.MessageBubble')
export class MessageBubbleComponent {
  transition: number = -1
  isOpen: boolean = false
  text: string
  rotation: Quaternion
  constructor(public channel: IChannel, text: string, rotation: Quaternion) {
    this.text = text
    this.rotation = rotation
  }
}

const openBubble = new Vector3(2, 2, 2)
const closedBubble = new Vector3(0.25, 0.25, 0.25)

export class BubbleSystem {
  group = engine.getComponentGroup(MessageBubbleComponent)
  update(dt: number) {
    for (const entity of this.group.entities) {
      const openable = entity.getComponent(MessageBubbleComponent)
      const transform = entity.getComponent(Transform)

      const start = openable.isOpen ? closedBubble : openBubble
      const end = openable.isOpen ? openBubble : closedBubble
      const speed = openable.isOpen ? 1 : 2

      if (openable.transition >= 0 && openable.transition < 1) {
        openable.transition += dt * speed
        transform.scale.copyFrom(Vector3.Lerp(start, end, openable.transition))
      } else if (openable.transition > 1) {
        openable.transition = -1
        transform.scale.copyFrom(end)

        // send actions
        // if (openable.isOpen && openable.onOpen) {
        //   openable.channel.sendActions(openable.onOpen)
        // } else if (!openable.isOpen && openable.onClose) {
        //   openable.channel.sendActions(openable.onClose)
        // }
      } else if (!openable.isOpen) {
        transform.rotate(new Vector3(0, 1, 0), 1)
      }
    }
  }
}
