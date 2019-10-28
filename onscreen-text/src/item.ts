const defaultProps = {
  value: '',
  visible: true
}

export interface IScript<T extends {}> {
  init(): void
  spawn(host: Entity, props: T): void
}

export type Props = {
  value: string
  visible: boolean
}

export default class OnscreenText implements IScript<Props> {
  canvas: UICanvas

  init() {
    this.canvas = new UICanvas()
  }

  spawn(_: Entity, props: Props = defaultProps) {
    const text = new UIText(this.canvas)
    text.value = props.value || defaultProps.value
    text.fontSize = 32
    // text.shadowColor = Color4.Black()
    // text.shadowBlur = 0
    // text.shadowOffsetX = 1
    // text.shadowOffsetY = -1
    text.paddingLeft = 10
    text.paddingRight = 10
    text.paddingTop = 10
    text.paddingBottom = 10
    text.adaptWidth = true
  }
}
