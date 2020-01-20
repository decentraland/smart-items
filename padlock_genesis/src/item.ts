import { PadLockComponent } from './padlock'

export type Props = {
  onSolve: Actions
  combination: number
}

export default class PadLock implements IScript<Props> {
  spinClip = new AudioClip('sounds/Button_Press.mp3')
  solveClip = new AudioClip('sounds/Resolve.mp3')

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

    wheels.wheel1.getComponent(Transform).rotation = Quaternion.Euler(
      wheels.digit1 * 36,
      0,
      0
    )
    wheels.wheel2.getComponent(Transform).rotation = Quaternion.Euler(
      wheels.digit2 * 36,
      0,
      0
    )
    wheels.wheel3.getComponent(Transform).rotation = Quaternion.Euler(
      wheels.digit3 * 36,
      0,
      0
    )
    wheels.wheel4.getComponent(Transform).rotation = Quaternion.Euler(
      wheels.digit4 * 36,
      0,
      0
    )

    let nums =
      wheels.digit1 * 1000 +
      wheels.digit2 * 100 +
      wheels.digit3 * 10 +
      wheels.digit4
    if (nums == wheels.combination) {
      //log("GOT IT RIGHT!")
      const clip = this.solveClip
      const source = new AudioSource(clip)
      source.volume = 1
      entity.addComponentOrReplace(source)
      source.playOnce()
      wheels.channel.sendActions(wheels.onSolve)
    } else {
      const clip = this.spinClip
      const source = new AudioSource(clip)
      source.volume = 0.3
      entity.addComponentOrReplace(source)
      source.playOnce()
    }
  }

  spawn(host: Entity, props: Props, channel: IChannel) {
    const padLock = new Entity()
    padLock.setParent(host)
    padLock.addComponent(
      new Transform({
        position: new Vector3(0, 0, 0.01),
        scale: new Vector3(0.8, 1, 1)
      })
    )
    padLock.addComponent(new GLTFShape('models/padlock/Padlock_Main.glb'))

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
        position: new Vector3(0.15, 0.1375, 0)
      })
    )
    wheel1.addComponent(new GLTFShape('models/padlock/PadlockRullet.glb'))

    wheel1.addComponent(
      new OnPointerDown(
        e => {
          lockProperties.digit1 = (lockProperties.digit1 + 1) % 10
          this.rotateWheels(padLock)
        },
        {
          button: ActionButton.POINTER,
          hoverText: 'Spin',
          distance: 4
        }
      )
    )

    wheel2.setParent(host)
    wheel2.addComponent(
      new Transform({
        rotation: Quaternion.Euler(0, 0, 0),
        position: new Vector3(0.05, 0.1375, 0)
      })
    )
    wheel2.addComponent(new GLTFShape('models/padlock/PadlockRullet.glb'))
    wheel2.addComponent(
      new OnPointerDown(
        e => {
          lockProperties.digit2 = (lockProperties.digit2 + 1) % 10
          this.rotateWheels(padLock)
        },
        {
          button: ActionButton.POINTER,
          hoverText: 'Spin',
          distance: 4
        }
      )
    )

    wheel3.setParent(host)
    wheel3.addComponent(
      new Transform({
        rotation: Quaternion.Euler(0, 0, 0),
        position: new Vector3(-0.05, 0.1375, 0)
      })
    )
    wheel3.addComponent(new GLTFShape('models/padlock/PadlockRullet.glb'))
    wheel3.addComponent(
      new OnPointerDown(
        e => {
          lockProperties.digit3 = (lockProperties.digit3 + 1) % 10
          this.rotateWheels(padLock)
        },
        {
          button: ActionButton.POINTER,
          hoverText: 'Spin',
          distance: 4
        }
      )
    )

    wheel4.setParent(host)
    wheel4.addComponent(
      new Transform({
        rotation: Quaternion.Euler(0, 0, 0),
        position: new Vector3(-0.15, 0.1375, 0)
      })
    )
    wheel4.addComponent(new GLTFShape('models/padlock/PadlockRullet.glb'))
    wheel4.addComponent(
      new OnPointerDown(
        e => {
          lockProperties.digit4 = (lockProperties.digit4 + 1) % 10
          this.rotateWheels(padLock)
        },
        {
          button: ActionButton.POINTER,
          hoverText: 'Spin',
          distance: 4
        }
      )
    )

    this.scrambleWheels(padLock)

    // handle actions
    channel.handleAction('scramble', () => {
      this.scrambleWheels(padLock)
    })

    // sync initial values
    channel.request<number[]>('value', ([digit1, digit2, digit3, digit4]) => {
      lockProperties.digit1 = digit1
      lockProperties.digit2 = digit2
      lockProperties.digit3 = digit3
      lockProperties.digit4 = digit4
      this.rotateWheels(padLock)
    })
    channel.reply<number[]>('value', () => {
      const { digit1, digit2, digit3, digit4 } = padLock.getComponent(
        PadLockComponent
      )
      return [digit1, digit2, digit3, digit4]
    })
  }
}
