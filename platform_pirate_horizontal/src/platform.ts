export type Position = 'start' | 'end'

@Component('org.decentraland.HorizontalPlatformPirates')
export class HorizontalPlatform {
  transition: number = -1
  delay: number = -1 // this is a delay to stop the animation, to prevent a flickr in the transition
  position: Position = 'start'
  constructor(
    public channel: IChannel,
    public distance: number = 10,
    public speed: number = 5,
    public onReachStart?: Actions,
    public onReachEnd?: Actions
  ) {}
}

const startPosition = new Vector3(0, 0, 0)

export class HorizontalPlatformSystem {
  group = engine.getComponentGroup(HorizontalPlatform)
  update(dt: number) {
    for (const entity of this.group.entities) {
      const platform = entity.getComponent(HorizontalPlatform)
      const transform = entity.getComponent(Transform)

      const endPosition = new Vector3(0, 0, -platform.distance)

      const isStart = platform.position === 'start'

      const start = !isStart ? startPosition : endPosition
      const end = !isStart ? endPosition : startPosition
      const speed = platform.speed / 20

      if (platform.transition >= 0 && platform.transition < 1) {
        platform.transition += dt * speed
        transform.position.copyFrom(
          Vector3.Lerp(start, end, platform.transition)
        )
      } else if (platform.transition >= 1) {
        platform.transition = -1
        platform.delay = 0
        transform.position.copyFrom(end)

        // send actions
        if (!isStart && platform.onReachEnd) {
          platform.channel.sendActions(platform.onReachEnd)
        } else if (isStart && platform.onReachStart) {
          platform.channel.sendActions(platform.onReachStart)
        }
      } else if (platform.delay >= 0 && platform.delay < 1) {
        platform.delay += dt
      } else if (platform.delay >= 1) {
        platform.delay = -1
      }
    }
  }
}
