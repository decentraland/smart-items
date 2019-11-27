import { CountdownTimerComponent, CountdownTimerSystem } from './timer'

export type Props = {
  totalTime: number
  active: boolean
  onThreshold: Actions
  onTimeUp: Actions
}

type TimeValues = {
  seconds: number
}

export default class Timer implements IScript<Props> {
  //activateClip = new AudioClip('sounds/NumpadPress.mp3')

  numberMaterial: Material

  init() {
    engine.addSystem(new CountdownTimerSystem())
  }

  updateBoard(entity: Entity, newValue: number, playSound = true) {}

  spawn(host: Entity, props: Props, channel: IChannel) {
    const board = new Entity()
    board.setParent(host)
    board.addComponent(
      new Transform({
        position: new Vector3(0, 0, 0)
      })
    )
    board.addComponent(new GLTFShape('models/Countdown_Pirate_Board.glb'))

    const arrow = new Entity()
    arrow.setParent(host)
    arrow.addComponent(
      new Transform({
        rotation: Quaternion.Euler(90, 0, 0),
        position: new Vector3(0, 0.25, 0.01)
      })
    )

    arrow.addComponent(new GLTFShape('models/Countdown_Pirate_Arrow.glb'))

    let timeData = new CountdownTimerComponent(
      channel,
      props.totalTime,
      props.onTimeUp,
      props.onThreshold,
      props.active,
      arrow
    )

    board.addComponent(timeData)

    //this.updateBoard(board, props.initialVal, false)

    // handle actions
    const reset = () => {
      timeData.active = false
      timeData.currentTime = timeData.totalTime
      timeData.thresHoldReached = false
    }

    channel.handleAction<TimeValues>('addTime', e => {
      timeData.currentTime += e.values.seconds
      if (timeData.currentTime > timeData.totalTime / 3) {
        timeData.thresHoldReached = false
      }
    })
    channel.handleAction<TimeValues>('subtractTime', e => {
      timeData.currentTime -= e.values.seconds
    })
    channel.handleAction('reset', () => reset())
    channel.handleAction('activate', () => {
      timeData.active = true
      reset()
    })
    channel.handleAction('pause', () => {
      timeData.active = false
    })
    channel.handleAction('toggleActivate', () => {
      timeData.active != timeData.active
    })

    // sync initial values
    channel.request<CountdownTimerComponent>('value', count => {
      timeData.active = count.active
      timeData.currentTime = count.currentTime
    })
    channel.reply<CountdownTimerComponent>('value', () => {
      return board.getComponent(CountdownTimerComponent)
    })

    if (props.active) {
    }
  }
}
