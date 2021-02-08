@Component('org.decentraland.radioDelay')
export class Delay {
  timer: number
  action: () => void
  constructor(timer: number, action: () => void) {
    this.timer = timer / 1000
    this.action = action
  }
}

export class RadioDelayManager implements ISystem {
  group = engine.getComponentGroup(Delay)
  update(dt: number) {
    for (const entity of this.group.entities) {
      const delay = entity.getComponent(Delay)
      delay.timer -= dt
      if (delay.timer < 0) {
        delay.action()
        entity.removeComponent(Delay)
      }
    }
  }
}
