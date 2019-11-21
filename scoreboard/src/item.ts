import { ScoreBoardComponent } from './scoreboard'

export type Props = {
  onClick?: Actions
  initialVal: number,
  enabled: boolean,
  threshold: number,
  onThreshold: Actions

}


export default class ScoreBoard implements IScript<Props> {

 activateClip = new AudioClip('sounds/NumpadPress.mp3')

  numberMaterial: Material
  uvTable = [
	   [0.25, 0.25, 0.5, 0.25, 0.5, 0.5, 0.25, 0.5, 0.25, 0.25, 0.5, 0.25, 0.5, 0.5, 0.25, 0.5],  //0
	   [0, 0.75, 0.25, 0.75, 0.25, 1, 0, 1, 0, 0.75, 0.25, 0.75, 0.25, 1, 0, 1] ,  //1
	   [0.25, 0.75, 0.5, 0.75, 0.5, 1, 0.25, 1, 0.25, 0.75, 0.5, 0.75, 0.5, 1, 0.25, 1],  //2
	   [0.5, 0.75, 0.75, 0.75, 0.75, 1, 0.5, 1, 0.5, 0.75, 0.75, 0.75, 0.75, 1, 0.5, 1],  //3
	   [0.75, 0.75, 1, 0.75, 1, 1, 0.75, 1, 0.75, 0.75, 1, 0.75, 1, 1, 0.75, 1],   //4
	   [0, 0.5, 0.25, 0.5, 0.25, 0.75, 0, 0.75, 0, 0.5, 0.25, 0.5, 0.25, 0.75, 0, 0.75] ,  //5
	   [0.25, 0.5, 0.5, 0.5, 0.5, 0.75, 0.25, 0.75, 0.25, 0.5, 0.5, 0.5, 0.5, 0.75, 0.25, 0.75],  //6
	   [0.5, 0.5, 0.75, 0.5, 0.75, 0.75, 0.5, 0.75, 0.5, 0.5, 0.75, 0.5, 0.75, 0.75, 0.5, 0.75],  //7
	   [0.75, 0.5, 1, 0.5, 1, 0.75, 0.75, 0.75, 0.75, 0.5, 1, 0.5, 1, 0.75, 0.75, 0.75],  //8
	   [0, 0.25, 0.25, 0.25, 0.25, 0.5, 0, 0.5, 0, 0.25, 0.25, 0.25, 0.25, 0.5, 0, 0.5],   //9
	   [0.5, 0.25, 0.75, 0.25, 0.75, 0.5, 0.5, 0.5, 0.5, 0.25, 0.75, 0.25, 0.75, 0.5, 0.5, 0.5]   //empty
  ]


  init() {
	const numberMaterial = new Material()
	const numberTexture = new Texture('images/Scoreboard1024_TX.png')
	
	numberMaterial.albedoTexture = numberTexture
	numberMaterial.alphaTexture = numberTexture
	numberMaterial.metallic  = 0
	numberMaterial.emissiveColor = Color3.Red()
	numberMaterial.emissiveIntensity = 3
	this.numberMaterial = numberMaterial
  }


  updateBoard(entity: Entity, newValue: number){
	
	let score = entity.getComponent(ScoreBoardComponent)
	
	score.currentValue = newValue
	const clip = this.activateClip
	const source = new AudioSource(clip)
	source.volume = 0.3
    entity.addComponentOrReplace(source)
    source.playOnce()

	if(newValue == score.threshold){
		score.channel.sendActions(score.onThreshold)
	}


	let d1 = score.currentValue % 10
	let d2 = Math.floor( (score.currentValue % 100)/10)
	let d3 = Math.floor( (score.currentValue % 1000)/100)
	let d4 = Math.floor( (score.currentValue% 10000)/1000)
	
	if (score.currentValue< 1000){
		d4 = 10
	} 
	if (score.currentValue< 100){
		d3 = 10
	} 
	if (score.currentValue< 10){
		d2 = 10
	} 

	score.digit1.uvs = this.uvTable[d1]
	score.digit2.uvs = this.uvTable[d2]
	score.digit3.uvs = this.uvTable[d3]
	score.digit4.uvs = this.uvTable[d4]

  }


  spawn(host: Entity, props: Props, channel: IChannel) {

	const board = new Entity()
	board.setParent(host)
	board.addComponent(new Transform({ 
		position: new Vector3(0, 0, 0) 
	}))
	board.addComponent(new GLTFShape('models/board/Scoreboard.glb'))

	// handle click
	board.addComponent(
		new OnPointerDown(() => channel.sendActions(props.onClick))
	)
	
	const digit1 = new Entity()
	digit1.setParent(host)
	digit1.addComponent(new Transform({ 
		rotation: Quaternion.Euler(90,180,180),
		position: new Vector3(-0.6, 0.05, 0.06),
		scale: new Vector3(0.8, 0.8, 0.8)
	}))
	digit1.addComponent(new PlaneShape())
	digit1.addComponent(this.numberMaterial)

	const digit2 = new Entity()
	digit2.setParent(host)
	digit2.addComponent(new Transform({ 
		rotation: Quaternion.Euler(90,180,180),
		position: new Vector3(-0.2, 0.05, 0.06),
		scale: new Vector3(0.8, 0.8, 0.8)
	}))
	digit2.addComponent(new PlaneShape())
	digit2.addComponent(this.numberMaterial)

	const digit3 = new Entity()
	digit3.setParent(host)
	digit3.addComponent(new Transform({ 
		rotation: Quaternion.Euler(90,180,180),
		position: new Vector3(0.2, 0.05, 0.06),
		scale: new Vector3(0.8, 0.8, 0.8)
	}))
	digit3.addComponent(new PlaneShape())
	digit3.addComponent(this.numberMaterial)

	const digit4 = new Entity()
	digit4.setParent(host)
	digit4.addComponent(new Transform({ 
		rotation: Quaternion.Euler(90,180,180),
		position: new Vector3(0.6, 0.05, 0.06),
		scale: new Vector3(0.8, 0.8, 0.8)
	}))
	digit4.addComponent(new PlaneShape())
	digit4.addComponent(this.numberMaterial)

	board.addComponent(new ScoreBoardComponent(
		channel,
		props.initialVal,
		props.threshold,
		props.onThreshold,
		props.enabled,
		digit1.getComponent(PlaneShape),
		digit2.getComponent(PlaneShape),
		digit3.getComponent(PlaneShape),
		digit4.getComponent(PlaneShape),
	))

	this.updateBoard(board, props.initialVal)
	let score = board.getComponent(ScoreBoardComponent)
	

    // handle actions
    channel.handleAction('increase', () => {
		if (!score.enabled) return
		this.updateBoard(board, score.currentValue + 1)
	})
    channel.handleAction('decrease', () => {
		if (!score.enabled) return
		this.updateBoard(board, score.currentValue - 1)
	})
    channel.handleAction('reset', () => {
		if (!score.enabled) return
		this.updateBoard(board , score.currentValue)
	})
	channel.handleAction('enable', () => {
		score.enabled = true
	})
	channel.handleAction('disable', () => {
		score.enabled = false
	})
	channel.handleAction('toggleEnable', () => {
		score.enabled != score.enabled
	})

    // sync initial values
	channel.request<ScoreBoardComponent>('value', count => {
		score.enabled = count.enabled
		this.updateBoard(board, count.currentValue)
	  }
    )
    channel.reply<ScoreBoardComponent>(
      'value',
      () => {
		 return board.getComponent(ScoreBoardComponent)
	  }
    )
  }
}
