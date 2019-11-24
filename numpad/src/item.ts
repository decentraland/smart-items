import { NumPadComponent } from './numpad'

export type Props = {
  combination: number
  blocked: boolean
  onSolve?: Actions
  onWrong?: Actions
}

export default class PadLock implements IScript<Props> {
  pressClip = new AudioClip('sounds/NumpadPress.mp3')
//   grantedClip
//   deniedClip
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
      wheels.channel.sendActions(wheels.onSolve)
    }
  }

  spawn(host: Entity, props: Props, channel: IChannel) {
    const numPad = new Entity()
    numPad.setParent(host)
    numPad.addComponent(
      new Transform({
        position: new Vector3(0, -0.1375, 0.01),
        scale: new Vector3(0.8, 1, 1)
      })
    )
    numPad.addComponent(new GLTFShape('models/Num_Pad.glb'))


    let padProperties = new NumPadComponent(
      channel,
	  props.combination,
	  props.blocked,
      props.onSolve,
    )

    numPad.addComponent(padProperties)

    // handle actions
    channel.handleAction('enable', () => {
		padProperties.blocked = false
	})
	
	channel.handleAction('disable', () => {
		padProperties.blocked = true
	})
	
	channel.handleAction('reset', () => {
		padProperties.blocked = props.blocked
		padProperties.solved = false
    })

    // sync initial values
    channel.request<NumPadComponent>('value', pad => {
	  padProperties.blocked = pad.blocked
	  padProperties.solved = pad.solved

    })
    channel.reply<NumPadComponent>('value', () => {
      return numPad.getComponent(NumPadComponent)
    })
  }
}
