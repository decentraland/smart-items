import { ChestSystem, OpenableChest } from './chest'

export interface IScript<T extends {}> {
  init(): void
  spawn(host: Entity, props: T): void
}

export type Props = {
  isLocked?: boolean
}

const offsetX = 0.4
const offsetY = -0.15

export default class Chest implements IScript<Props> {
  init() {
    engine.addSystem(new ChestSystem())
  }
  spawn(host: Entity, props: Props) {
    const pivot = new Entity('pivot')
    pivot.setParent(host)
    pivot.addComponent(
      new Transform({ position: new Vector3(0, -offsetY, -offsetX) })
    )
    pivot.addComponent(new OpenableChest())
    const base = new Entity('base')
    base.setParent(host)
    base.addComponent(new Transform({ position: new Vector3(0, 0, 0) }))
    base.addComponent(new GLTFShape('models/Chest_Base_01/Chest_Base_01.glb'))
    const top = new Entity('base')
    top.setParent(pivot)
    top.addComponent(
      new Transform({ position: new Vector3(0, offsetY, offsetX) })
    )
    top.addComponent(new GLTFShape('models/Chest_Top_01/Chest_Top_01.glb'))
    top.addComponent(
      new OnClick(() => {
        if (props.isLocked) return
        const openable = pivot.getComponent(OpenableChest)
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
