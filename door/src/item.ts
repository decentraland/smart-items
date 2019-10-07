import { DoorSystem, OpenableDoor } from './door'

export interface IScript<T extends {}> {
  init(): void
  spawn(host: Entity, props: T): void
}

export type Props = {
  isLocked?: boolean
}

export default class Door implements IScript<Props> {
  init() {
    engine.addSystem(new DoorSystem())
  }
  spawn(host: Entity, props: Props) {
    const pivot = new Entity('pivot')
    pivot.setParent(host)
    pivot.addComponent(new Transform({ position: new Vector3(0.8, 0, 0) }))
    pivot.addComponent(new OpenableDoor())
    const door = new Entity('door')
    door.setParent(pivot)
    door.addComponent(new Transform({ position: new Vector3(-0.8, 0, 0) }))
    door.addComponent(new GLTFShape('models/Door_Wood_01/Door_Wood_01.glb'))
    door.addComponent(
      new OnClick(() => {
        if (props.isLocked) return
        const openable = pivot.getComponent(OpenableDoor)
        openable.isOpen = !openable.isOpen
        if (openable.transition === -1) {
          openable.transition = 0
        } else {
          openable.transition = 1 - openable.transition
        }
      })
    )
  }
}
