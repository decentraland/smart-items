import { randomRange } from './utils'
import { Zombie, ZombieSystem } from './ZombieSystem'

const defaultProps = {
  speed: 0.1,
  amount: 5,
  spawnRadius: 5
}

export interface IScript<T extends {}> {
  init(): void
  spawn(host: Entity, props: T): void
}

export type Props = {
  speed: number
  amount: number
  spawnRadius: number
}

export default class ZombieSpawner implements IScript<Props> {
  init() {
    const system = new ZombieSystem()
    engine.addSystem(system)
  }

  spawn(host: Entity, props: Props) {
    const shape = new GLTFShape('models/zombie.glb')
    const animator = new Animator()
    props = { ...defaultProps, ...props }

    for (let i = 0; i < props.amount; i++) {
      const walkClip = new AnimationState('walk')
      walkClip.speed = props.speed * 35 // magic
      animator.addClip(walkClip)
      walkClip.play()

      const e = new Entity(`zombie-${i}`)
      const zombie = new Zombie()
      zombie.speed = props.speed
      const transform = new Transform()
      transform.position = new Vector3(
        randomRange(-props.spawnRadius, props.spawnRadius),
        0,
        randomRange(-props.spawnRadius, props.spawnRadius)
      )
      e.addComponent(animator)
      e.addComponent(zombie)
      e.addComponent(shape)
      e.addComponent(transform)

      e.setParent(host)
    }
  }
}
