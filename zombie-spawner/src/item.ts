export type SmartItemProperties = {
  speed: number
  amount: number
  spawnRadius: number
}

export default (rootEntity: Entity, props: SmartItemProperties) => {
  const system = new ZombieSystem()
  const shape = new GLTFShape('models/zombie.glb')
  const animator = new Animator()

  for (let i = 0; i < props.amount; i++) {
    const walkClip = new AnimationState('walk')
    walkClip.speed = props.speed * 35 // magic
    animator.addClip(walkClip)
    walkClip.play()

    const e = new Entity()
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

    e.setParent(rootEntity)
  }

  engine.addSystem(system)
  return rootEntity
}

function randomRange(min: number, max: number): number {
  min = Math.ceil(min)
  max = Math.floor(max)
  return Math.floor(Math.random() * (max - min)) + min
}
