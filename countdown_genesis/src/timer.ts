@Component('org.decentraland.CountDown')
export class CountdownTimerComponent {
  totalTime: number = 0
  currentTime: number = 0
  active: boolean = true
  thresHoldReached: boolean = false
  endReached: boolean = false
  arrow: Entity
  onTimeUp: Actions
  onThreshold: Actions

  constructor(
    public channel: IChannel,
    totalTime: number,
    onTimeUp: Actions,
    onThreshold: Actions,
    active: boolean,
    arrow: Entity
  ) {
    this.totalTime = totalTime
    this.currentTime = totalTime
    this.active = active
    this.onTimeUp = onTimeUp
    this.onThreshold = onThreshold
    this.arrow = arrow
  }
}

export class CountdownTimerSystem {
  group = engine.getComponentGroup(CountdownTimerComponent)
  update(dt: number) {
    for (const entity of this.group.entities) {
      const timer = entity.getComponent(CountdownTimerComponent)
      const transform = timer.arrow.getComponent(Transform)

      if (timer.active) {
        timer.currentTime -= dt
      }

      let angle = (timer.currentTime / timer.totalTime) * -270 - 45

      transform.rotation = Quaternion.Euler(90, angle, 0)

      if (!timer.thresHoldReached && timer.currentTime <= timer.totalTime / 3) {
        timer.channel.sendActions(timer.onThreshold)
        timer.thresHoldReached = true
      }

      if (timer.currentTime <= 0 && !timer.endReached) {
        timer.active = false
        timer.endReached = true
        timer.channel.sendActions(timer.onTimeUp)
      }
    }
  }
}
