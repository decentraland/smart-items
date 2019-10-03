import { Openable, DoorSystem } from './door'

export type Props = {
  isLocked?: boolean
}

export default (entity: Entity, props: Props) => {
  const pivot = new Entity('pivot')
  pivot.setParent(entity)
  pivot.addComponent(new Transform({ position: new Vector3(-0.2, 0, 0) }))
  pivot.addComponent(new Openable())
  const door = new Entity('door')
  door.setParent(pivot)
  door.addComponent(new Transform({ position: new Vector3(-0.8, 0, 0) }))
  door.addComponent(new GLTFShape('models/Door_Wood_01/Door_Wood_01.glb'))
  door.addComponent(
    new OnClick(() => {
      if (props.isLocked) return
      const openable = pivot.getComponent(Openable)
      openable.isOpen = !openable.isOpen
      if (openable.transition === -1) {
        openable.transition = 0
      } else {
        openable.transition = 1 - openable.transition
      }
    })
  )
  engine.addSystem(new DoorSystem())
}
