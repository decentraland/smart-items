import { PadLockComponent } from './padlock'

export type Props = {
  onSolve: Actions
  combination: number
}

export default class PadLock implements IScript<Props> {
  spinClip = new AudioClip('sounds/Button_Press.mp3')

  init() {}

  scrambleWheels(entity: Entity) {
    let wheels = entity.getComponent(PadLockComponent)

    wheels.digit1 = Math.floor(Math.random() * 10)
    wheels.digit2 = Math.floor(Math.random() * 10)
    wheels.digit3 = Math.floor(Math.random() * 10)
    wheels.digit4 = Math.floor(Math.random() * 10)

    this.rotateWheels(entity)
  }

  rotateWheels(entity: Entity) {
    let wheels = entity.getComponent(PadLockComponent)
    //log(wheels.digit1, wheels.digit2, wheels.digit3, wheels.digit4)

    const clip = this.spinClip
    const source = new AudioSource(clip)
    source.volume = 0.3
    entity.addComponentOrReplace(source)
    source.playOnce()

    wheels.wheel1.getComponent(Transform).rotation = Quaternion.Euler(
      (wheels.digit1 - 1) * 36,
      0,
      0
    )
    wheels.wheel2.getComponent(Transform).rotation = Quaternion.Euler(
      (wheels.digit2 - 1) * 36,
      0,
      0
    )
    wheels.wheel3.getComponent(Transform).rotation = Quaternion.Euler(
      (wheels.digit3 - 1) * 36,
      0,
      0
    )
    wheels.wheel4.getComponent(Transform).rotation = Quaternion.Euler(
      (wheels.digit4 - 1) * 36,
      0,
      0
    )

    let nums =
      wheels.digit1 * 1000 +
      wheels.digit2 * 100 +
      wheels.digit3 * 10 +
      wheels.digit4

    log(
      nums,
      wheels.combination,
      wheels.digit1,
      wheels.digit2,
      wheels.digit3,
      wheels.digit4
    )
    if (nums == wheels.combination) {
      //log("GOT IT RIGHT!")
      wheels.channel.sendActions(wheels.onSolve)
    }
  }

  spawn(host: Entity, props: Props, channel: IChannel) {
    const padLock = new Entity()
    padLock.setParent(host)
    padLock.addComponent(
      new Transform({
        position: new Vector3(0, 0, 0),
        scale: new Vector3(1, 1, 1)
      })
    )
    padLock.addComponent(new GLTFShape('models/padlock/Padlock_base.glb'))

    const wheel1 = new Entity()
    const wheel2 = new Entity()
    const wheel3 = new Entity()
    const wheel4 = new Entity()

    let lockProperties = new PadLockComponent(
      channel,
      props.combination,
      props.onSolve,
      wheel1,
      wheel2,
      wheel3,
      wheel4,
      0,
      0,
      0,
      0
    )

    padLock.addComponent(lockProperties)

    wheel1.setParent(host)
    wheel1.addComponent(
      new Transform({
        rotation: Quaternion.Euler(0, 0, 0),
        position: new Vector3(0.14, 0, 0)
      })
    )
    wheel1.addComponent(new GLTFShape('models/padlock/Padlock_roulette.glb'))

    wheel1.addComponent(
      new OnPointerDown(e => {
        if (e.hit.length > 3) return

        lockProperties.digit1 = (lockProperties.digit1 + 1) % 10
        this.rotateWheels(padLock)
      })
    )

    wheel2.setParent(host)
    wheel2.addComponent(
      new Transform({
        rotation: Quaternion.Euler(0, 0, 0),
        position: new Vector3(0.03, 0, 0)
      })
    )
    wheel2.addComponent(new GLTFShape('models/padlock/Padlock_roulette.glb'))
    wheel2.addComponent(
      new OnPointerDown(e => {
        if (e.hit.length > 3) return

        lockProperties.digit2 = (lockProperties.digit2 + 1) % 10
        this.rotateWheels(padLock)
      })
    )

    wheel3.setParent(host)
    wheel3.addComponent(
      new Transform({
        rotation: Quaternion.Euler(0, 0, 0),
        position: new Vector3(-0.08, 0, 0)
      })
    )
    wheel3.addComponent(new GLTFShape('models/padlock/Padlock_roulette.glb'))
    wheel3.addComponent(
      new OnPointerDown(e => {
        if (e.hit.length > 3) return

        lockProperties.digit3 = (lockProperties.digit3 + 1) % 10
        this.rotateWheels(padLock)
      })
    )

    wheel4.setParent(host)
    wheel4.addComponent(
      new Transform({
        rotation: Quaternion.Euler(0, 0, 0),
        position: new Vector3(-0.18, 0, 0)
      })
    )
    wheel4.addComponent(new GLTFShape('models/padlock/Padlock_roulette.glb'))
    wheel4.addComponent(
      new OnPointerDown(e => {
        if (e.hit.length > 3) return

        lockProperties.digit4 = (lockProperties.digit4 + 1) % 10
        this.rotateWheels(padLock)
      })
    )

    this.scrambleWheels(padLock)

    // handle actions
    channel.handleAction('scramble', () => {
      this.scrambleWheels(padLock)
    })

    // sync initial values
    channel.request<PadLockComponent>('value', wheels => {
      lockProperties.digit1 = wheels.digit1
      lockProperties.digit2 = wheels.digit2
      lockProperties.digit3 = wheels.digit3
      lockProperties.digit4 = wheels.digit4
      this.rotateWheels(padLock)
    })
    channel.reply<PadLockComponent>('value', () => {
      return padLock.getComponent(PadLockComponent)
    })
  }
}
