import { NumPadComponent } from './numpad'
import { KeypadUI } from './ui'

export type Props = {
  combination: number
  blocked: boolean
  onSolve?: Actions
  onWrong?: Actions
}

export default class NumPad implements IScript<Props> {
  pressClip = new AudioClip('sounds/NumpadPress.mp3')
  canvas = new UICanvas()
//   grantedClip
//   deniedClip
  init() {}

 


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

	let ui = new KeypadUI(this.canvas)
	ui.container.visible = false

    let padProperties = new NumPadComponent(
      channel,
	  props.combination,
	  ui,
	  props.blocked,
      props.onSolve,
    )

	numPad.addComponent(padProperties)


	
	numPad.addComponent(new OnPointerDown( e => {
		if (e.hit.length > 4) return
		ui.container.visible = true
	}))

	// Wire up the keypad logic
	ui.onInput = (value: number): void => {
	  padProperties.currentInput += value;
	  ui.display(padProperties.currentInput);
	  //numPadLock.playButtonPressed();
	};
	ui.onReset = (): void => {
	  padProperties.currentInput = "";
	  ui.display(padProperties.currentInput);
	  //numPadLock.playButtonPressed();
	};
	ui.onSubmit = (): void => {
	  if (padProperties.currentInput == props.combination.toString()) {
		// Correct!
		ui.display("OK!", Color4.Green());
		//numPadLock.playAccessGranted();
		// PAUSE!
		ui.container.visible = false;
		channel.sendActions(props.onSolve)

	  } else {
		// The password is incorrect
		ui.display("Err", Color4.Red());
		//numPadLock.playAccessDenied();
		padProperties.currentInput = ""
		channel.sendActions(props.onWrong)
	  }
	}


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
