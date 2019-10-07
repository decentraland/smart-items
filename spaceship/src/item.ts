import { ShipSystem, SpaceshipComponent } from './spaceship'

export interface IScript<T extends {}> {
  init(): void
  spawn(host: Entity, props: T): void
}

export type Props = {}

export default class Spaceship implements IScript<Props> {
  init() {
    engine.addSystem(new ShipSystem())
  }

  spawn(host: Entity, props: Props) {
    const ship = new Entity()
    const shape = new GLTFShape('models/SpaceShip_03/SpaceShip_03.glb')
    shape.withCollisions = true
    ship.addComponent(shape)
    ship.addComponent(new Transform({ scale: new Vector3(0.5, 0.5, 0.5) }))
    ship.addComponent(new SpaceshipComponent())
    ship.setParent(host)
  }
}
