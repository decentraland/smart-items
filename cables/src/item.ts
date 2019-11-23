export type Props = {
	redCable: boolean
	greenCable: boolean
	blueCable: boolean
	onRedCut: Actions
	onGreenCut: Actions
	onBlueCut: Actions
	onBoxOpen: Actions
	onBoxClose: Actions
}

export enum CableColors {
	Blue,
	Green,
	Red
  }


export default class Cables implements IScript<Props> {
  openClip = new AudioClip('sounds/Chest_Open.mp3')
  closeClip = new AudioClip('sounds/Chest_Close.mp3')
  //cableClip
  open: Record<string, boolean> = {}
  redCableCut: Record<string, boolean> = {}
  greenCableCut: Record<string, boolean> = {}
  blueCableCut: Record<string, boolean> = {}

  init() {}

  toggleBox(entity: Entity, value: boolean, playSound = true) {
    if (this.open[entity.name] === value) return

    if (playSound) {
	   const source = value? new AudioSource(this.openClip) : new AudioSource(this.closeClip)       
	   entity.addComponentOrReplace(source)
	   source.volume = 0.3
       source.playing = true
    }

    const animator = entity.getComponent(Animator)
	const openClip = animator.getClip('open')
    const closeClip =  animator.getClip('close')
    openClip.stop()
    closeClip.stop()
    const clip = value ? openClip : closeClip
    clip.play()

    this.open[entity.name] = value
  }



  toggleCable(entity: Entity, value: boolean, color: CableColors, playSound = true) {

	if (playSound) {
		//   const source = new AudioSource(this.clip)
		//   entity.addComponentOrReplace(source)
		//   source.playing = true
	}
	const animator = entity.getComponent(Animator)
	let cableClip: AnimationState
	
	switch (color){
		case  CableColors.Red:
			if (this.redCableCut[entity.name] === value) return  
			cableClip = animator.getClip('CableRedAction')
			this.redCableCut[entity.name] = value
			break
		
		case CableColors.Green:
			if (this.greenCableCut[entity.name] === value) return
			cableClip = animator.getClip('CableGreenAction')
			this.greenCableCut[entity.name] = value
			break

		case CableColors.Blue:
			if (this.blueCableCut[entity.name] === value) return
			cableClip = animator.getClip('CableBlueAction')
			this.blueCableCut[entity.name] = value
			break
	}

	if (value){
		cableClip.play()
	  } else {
		cableClip.stop()
	  }

  }

  spawn(host: Entity, props: Props, channel: IChannel) {
    const box = new Entity()
	box.setParent(host)
	this.open[box.name] = false

    const animator = new Animator()
	const openClip = new AnimationState("open", {looping: false})
	const closeClip = new AnimationState("close", {looping: false})
    animator.addClip(openClip)
    animator.addClip(closeClip)
    box.addComponent(animator)
    //openClip.stop()

	box.addComponent(new GLTFShape('models/Cable_Box.glb'))
	box.addComponent(new Transform({
		position: new Vector3(0,0,0),
		rotation: Quaternion.Euler(90,0,0),
		scale: new Vector3(0.3, 0.3, 0.3)
	}))

    box.addComponent(
      new OnPointerDown(e => {
		if (e.hit.length > 4) return
        const value = !this.open[box.name]
        const action = channel.createAction(
          value ? 'openBox' : 'closeBox',
          {}
        )
        channel.sendActions([action])
      })
    )
	const redCable = new Entity()
	this.redCableCut[redCable.name] = false
	if (props.redCable){	
		redCable.addComponent(new Transform({
			position: new Vector3(-0.07,0,0.05),
			rotation: Quaternion.Euler(90,0,0),
			scale: new Vector3(0.3, 0.3, 0.3)
		}))
		const redClip = new AnimationState("CableRedAction", {looping: false})
		redCable.addComponent(new Animator()).addClip(redClip)
		redCable.setParent(host)
		redCable.addComponent(new GLTFShape("models/RedCable.glb"))
		redCable.addComponent(new OnPointerDown( e=> {
			if (e.hit.length > 4) return

			const action = channel.createAction('onRedCut', {})
			channel.sendActions([action])
		} ))	
	}

	const greenCable = new Entity()
	this.greenCableCut[greenCable.name] = false
	if (props.greenCable){
		greenCable.addComponent(new Transform({
			position: new Vector3(0,0,0.05),
			rotation: Quaternion.Euler(90,0,0),
			scale: new Vector3(0.3, 0.3, 0.3)
		}))
		const greenClip = new AnimationState("CableGreenAction", {looping: false})
		greenCable.addComponent(new Animator()).addClip(greenClip)
		greenCable.setParent(host)
		greenCable.addComponent(new GLTFShape("models/GreenCable.glb"))
		greenCable.addComponent(new OnPointerDown( e=> {
			if (e.hit.length > 4) return
			const action = channel.createAction('onGreenCut', {})
			channel.sendActions([action])
		} ))
	}

	const blueCable = new Entity()
	this.blueCableCut[blueCable.name] = false
	if (props.blueCable){
		blueCable.addComponent(new Transform({
			position: new Vector3(0.07,0,0.05),
			rotation: Quaternion.Euler(90,0,0),
			scale: new Vector3(0.3, 0.3, 0.3)
		}))
		const blueClip = new AnimationState("CableBlueAction", {looping: false})
		blueCable.addComponent(new Animator()).addClip(blueClip)
		blueCable.setParent(host)
		blueCable.addComponent(new GLTFShape("models/BlueCable.glb"))
		blueCable.addComponent(new OnPointerDown( e=> {
			if (e.hit.length > 4) return
			const action = channel.createAction('onBlueCut', {})
			channel.sendActions([action])
		} ))
	}


	// background surface (to avoid closing the door when missing cables)
	// let backroundMaterial = new Material()
	// backroundMaterial.albedoColor = Color3.FromHexString("#1C1C1C")
	// backroundMaterial.metallic = 0

	// let background = new Entity()
	// background.addComponent(new PlaneShape())
	// background.setParent(host)
	// background.addComponent(new Transform({
	// 	position: new Vector3(0,0,0.01),
	// 	rotation: Quaternion.Euler(0,0,0),
	// 	scale: new Vector3(0.35, 0.4, 0.35)
	// }))
	// background.addComponent(backroundMaterial)

    // handle actions
    channel.handleAction('openBox', ({ sender }) => {
	  this.toggleBox(box, true)
      if (sender === channel.id) {
        channel.sendActions(props.onBoxOpen)
      }
    })
    channel.handleAction('closeBox', ({ sender }) => {
	  this.toggleBox(box, false)
      if (sender === channel.id) {
        channel.sendActions(props.onBoxClose)
      }
	})
	channel.handleAction('toggleBox', ({ sender }) => {
		let newState = !this.open[box.name]
		this.toggleBox(box, newState)
		if (sender === channel.id) {
		  if (newState){
			channel.sendActions(props.onBoxOpen)
		  } else {
			channel.sendActions(props.onBoxClose)
		  } 
		}
	  })
	  channel.handleAction('onRedCut', ({ sender }) => {
		this.toggleCable(redCable, true, CableColors.Red)
	  })
	  channel.handleAction('onBlueCut', ({ sender }) => {
		this.toggleCable(blueCable, true, CableColors.Blue)
	  })
	  channel.handleAction('onGreenCut', ({ sender }) => {
		this.toggleCable(greenCable, true, CableColors.Green)
	  })
	 

	channel.handleAction('reset', ({ sender }) => {
		this.toggleCable(redCable, false, CableColors.Red)
		this.toggleCable(blueCable, false, CableColors.Blue)
		this.toggleCable(greenCable, false, CableColors.Green)
		this.toggleBox(box, false)
	})

    // sync initial values
    channel.request<boolean[]>('isActive', state => {
	  this.toggleBox(box, state[0], false)
	  this.toggleCable(redCable, state[1], CableColors.Red)
	  this.toggleCable(greenCable, state[2], CableColors.Green)
	  this.toggleCable(blueCable, state[3], CableColors.Blue)
	})
	channel.reply<boolean[]>('isActive', () => 
	[
		this.open[box.name], 
		this.redCableCut[redCable.name], 
		this.greenCableCut[greenCable.name], 
		this.blueCableCut[blueCable.name]
	]
	)
  }
}
