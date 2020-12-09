export type Props = {
  text?: string
  font: string
  fontSize: number
  color: string
}

export default class PlainText implements IScript<Props> {
  init() {}

  spawn(host: Entity, props: Props, channel: IChannel) {
    let signText = new Entity()
    signText.setParent(host)
    let text = new TextShape(
      splitTextIntoLines(props.text, (28 * 5) / props.fontSize)
    )
    text.fontSize = props.fontSize
    text.color = Color3.FromHexString(props.color)

    switch (props.font) {
      case 'SF':
        text.font = new Font(Fonts.SanFrancisco)
        break
      case 'SF_Heavy':
        text.font = new Font(Fonts.SanFrancisco_Heavy)
        break
    }

    text.height = 10
    text.width = 10
    text.lineSpacing = `50px`
    text.paddingBottom = 0
    text.paddingTop = 0
    text.paddingLeft = 0
    text.paddingRight = 0
    text.zIndex = 1

    text.lineCount = 10
    text.hTextAlign = 'center'
    text.vTextAlign = 'center'
    text.textWrapping = false

    signText.addComponent(text)

    signText.addComponent(
      new Transform({
        position: new Vector3(-1, 2, 0.05),
        rotation: Quaternion.Euler(0, 180, 0),
        scale: new Vector3(0.2, 0.2, 0.2),
      })
    )

    let wall = new Entity()
    wall.setParent(host)
    wall.addComponentOrReplace(new GLTFShape('models/BlackGalleryInfo.glb'))
  }
}

export function splitTextIntoLines(
  text: string,
  maxLenght: number,
  maxLines?: number
) {
  let finalText: string = ''
  for (let i = 0; i < text.length; i++) {
    let lines = finalText.split('\n')

    if (lines[lines.length - 1].length >= maxLenght && i !== text.length) {
      if (finalText[finalText.length - 1] !== ' ') {
        if (maxLines && lines.length >= maxLines) {
          finalText = finalText.concat('...')
          return finalText
        } else {
          finalText = finalText.concat('-')
        }
      }
      finalText = finalText.concat('\n')
      if (text[i] === ' ') {
        continue
      }
    }

    finalText = finalText.concat(text[i])
  }

  return finalText
}
