import { ScoreBoardComponent } from './scoreboard'

export type Props = {
  initialVal: number
  enabled: boolean
  threshold: number
  onThreshold?: Actions
}

type ScoreBoardSync = {
  enabled: boolean
  currentValue: number
}

export default class ScoreBoard implements IScript<Props> {
  activateClip = new AudioClip('sounds/NumpadPress.mp3')

  numberMaterial: Material
  //   uvTable = [
  // 	   [0.25, 0.25, 0.5, 0.25, 0.5, 0.5, 0.25, 0.5, 0.25, 0.25, 0.5, 0.25, 0.5, 0.5, 0.25, 0.5],  //0
  // 	   [0, 0.75, 0.25, 0.75, 0.25, 1, 0, 1, 0, 0.75, 0.25, 0.75, 0.25, 1, 0, 1] ,  //1
  // 	   [0.25, 0.75, 0.5, 0.75, 0.5, 1, 0.25, 1, 0.25, 0.75, 0.5, 0.75, 0.5, 1, 0.25, 1],  //2
  // 	   [0.5, 0.75, 0.75, 0.75, 0.75, 1, 0.5, 1, 0.5, 0.75, 0.75, 0.75, 0.75, 1, 0.5, 1],  //3
  // 	   [0.75, 0.75, 1, 0.75, 1, 1, 0.75, 1, 0.75, 0.75, 1, 0.75, 1, 1, 0.75, 1],   //4
  // 	   [0, 0.5, 0.25, 0.5, 0.25, 0.75, 0, 0.75, 0, 0.5, 0.25, 0.5, 0.25, 0.75, 0, 0.75] ,  //5
  // 	   [0.25, 0.5, 0.5, 0.5, 0.5, 0.75, 0.25, 0.75, 0.25, 0.5, 0.5, 0.5, 0.5, 0.75, 0.25, 0.75],  //6
  // 	   [0.5, 0.5, 0.75, 0.5, 0.75, 0.75, 0.5, 0.75, 0.5, 0.5, 0.75, 0.5, 0.75, 0.75, 0.5, 0.75],  //7
  // 	   [0.75, 0.5, 1, 0.5, 1, 0.75, 0.75, 0.75, 0.75, 0.5, 1, 0.5, 1, 0.75, 0.75, 0.75],  //8
  // 	   [0, 0.25, 0.25, 0.25, 0.25, 0.5, 0, 0.5, 0, 0.25, 0.25, 0.25, 0.25, 0.5, 0, 0.5],   //9
  // 	   [0.5, 0.25, 0.75, 0.25, 0.75, 0.5, 0.5, 0.5, 0.5, 0.25, 0.75, 0.25, 0.75, 0.5, 0.5, 0.5]   //empty
  //   ]

  init() {
    // const numberMaterial = new Material()
    // const numberTexture = new Texture('images/Scoreboard1024_TX.png')
    // numberMaterial.albedoTexture = numberTexture
    // numberMaterial.alphaTexture = numberTexture
    // numberMaterial.metallic  = 0
    // numberMaterial.emissiveColor = Color3.Red()
    // numberMaterial.emissiveIntensity = 3
    // this.numberMaterial = numberMaterial
  }

  updateBoard(entity: Entity, newValue: number, playSound = true) {
    let score = entity.getComponent(ScoreBoardComponent)

    score.currentValue = Math.max(0, newValue)

    if (playSound) {
      const clip = this.activateClip
      const source = new AudioSource(clip)
      source.volume = 0.3
      entity.addComponentOrReplace(source)
      source.playOnce()
    }

    if (newValue == score.threshold) {
      score.channel.sendActions(score.onThreshold)
    }

    let d1 = score.currentValue % 10
    let d2 = Math.floor((score.currentValue % 100) / 10)
    let d3 = Math.floor((score.currentValue % 1000) / 100)
    let d4 = Math.floor((score.currentValue % 10000) / 1000)

    // score.digit1.uvs = this.uvTable[d1]
    // score.digit2.uvs = this.uvTable[d2]
    // score.digit3.uvs = this.uvTable[d3]
    // score.digit4.uvs = this.uvTable[d4]

    score.digit1.value = d1.toString()
    score.digit2.value = d2.toString()
    score.digit3.value = d3.toString()
    score.digit4.value = d4.toString()

    if (score.currentValue < 1000) {
      score.digit4.value = ''
    }
    if (score.currentValue < 100) {
      score.digit3.value = ''
    }
    if (score.currentValue < 10) {
      score.digit2.value = ''
    }
  }

  spawn(host: Entity, props: Props, channel: IChannel) {
    const board = new Entity()
    board.setParent(host)
    board.addComponent(
      new Transform({
        position: new Vector3(0, 0, 0)
      })
    )
    board.addComponent(new GLTFShape('models/board/Scoreboard.glb'))

    const digit1 = new Entity()
    digit1.setParent(host)
    digit1.addComponent(
      new Transform({
        rotation: Quaternion.Euler(0, 180, 0),
        position: new Vector3(-0.6, 0.5, 0.06),
        scale: new Vector3(0.8, 0.8, 0.8)
      })
    )
    let digit1Text = new TextShape('0')
    digit1Text.fontSize = 9
    digit1Text.color = Color3.Red()
    digit1.addComponent(digit1Text)
    // digit1.addComponent(new PlaneShape())
    // digit1.addComponent(this.numberMaterial)

    const digit2 = new Entity()
    digit2.setParent(host)
    digit2.addComponent(
      new Transform({
        rotation: Quaternion.Euler(0, 180, 0),
        position: new Vector3(-0.2, 0.5, 0.06),
        scale: new Vector3(0.8, 0.8, 0.8)
      })
    )
    let digit2Text = new TextShape('0')
    digit2Text.fontSize = 9
    digit2Text.color = Color3.Red()
    digit2.addComponent(digit2Text)
    // digit2.addComponent(new PlaneShape())
    // digit2.addComponent(this.numberMaterial)

    const digit3 = new Entity()
    digit3.setParent(host)
    digit3.addComponent(
      new Transform({
        rotation: Quaternion.Euler(0, 180, 0),
        position: new Vector3(0.2, 0.5, 0.06),
        scale: new Vector3(0.8, 0.8, 0.8)
      })
    )
    let digit3Text = new TextShape('0')
    digit3Text.fontSize = 9
    digit3Text.color = Color3.Red()
    digit3.addComponent(digit3Text)
    // digit3.addComponent(new PlaneShape())
    // digit3.addComponent(this.numberMaterial)

    const digit4 = new Entity()
    digit4.setParent(host)
    digit4.addComponent(
      new Transform({
        rotation: Quaternion.Euler(0, 180, 0),
        position: new Vector3(0.6, 0.5, 0.06),
        scale: new Vector3(0.8, 0.8, 0.8)
      })
    )
    let digit4Text = new TextShape('0')
    digit4Text.fontSize = 9
    digit4Text.color = Color3.Red()
    digit4.addComponent(digit4Text)
    // digit4.addComponent(new PlaneShape())
    // digit4.addComponent(this.numberMaterial)

    board.addComponent(
      new ScoreBoardComponent(
        channel,
        props.initialVal,
        props.threshold,
        props.onThreshold,
        props.enabled,
        digit1.getComponent(TextShape),
        digit2.getComponent(TextShape),
        digit3.getComponent(TextShape),
        digit4.getComponent(TextShape)
      )
    )

    this.updateBoard(board, props.initialVal, false)
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
      this.updateBoard(board, score.initialValue)
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
    channel.request<ScoreBoardSync>('value', count => {
      score.enabled = count.enabled
      this.updateBoard(board, count.currentValue, false)
    })
    channel.reply<ScoreBoardSync>('value', () => {
      const { enabled, currentValue } = board.getComponent(ScoreBoardComponent)
      return { enabled, currentValue }
    })
  }
}
