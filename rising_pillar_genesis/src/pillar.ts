export type Position = 'start' | 'end'

@Component('org.decentraland.RisingPillarGenesis')
export class RisingPillar {
  transition: number = -1
  delay: number = -1 // this is a delay to stop the animation, to prevent a flickr in the transition
  position: Position = 'start'
  constructor(
    public channel: IChannel,
    public height: number = 10,
    public speed: number = 5,
    public onReachBottom?: Actions,
    public onReachTop?: Actions
  ) {}
}

const startPosition = new Vector3(0, 0, 0)

export class RisingPillarGenesisSystem {
  group = engine.getComponentGroup(RisingPillar)
  update(dt: number) {
    for (const entity of this.group.entities) {
      const platform = entity.getComponent(RisingPillar)
      const transform = entity.getComponent(Transform)
      const clip = entity.getComponent(AudioSource)

      const endPosition = new Vector3(0, platform.height, 0)

      const isStart = platform.position === 'start'

      const start = !isStart ? startPosition : endPosition
      const end = !isStart ? endPosition : startPosition
      const speed = platform.speed / 20

      if (platform.transition >= 0 && platform.transition < 1) {
        platform.transition += dt * speed
        transform.position.copyFrom(
          Vector3.Lerp(start, end, platform.transition)
        )
        clip.playing = true
      } else if (platform.transition >= 1) {
        platform.transition = -1
        platform.delay = 0
        transform.position.copyFrom(end)
        const clip = entity.getComponent(AudioSource)
        clip.playing = false

        // send actions
        if (!isStart && platform.onReachTop) {
          platform.channel.sendActions(platform.onReachTop)
        } else if (isStart && platform.onReachBottom) {
          platform.channel.sendActions(platform.onReachBottom)
        }
      } else if (platform.delay >= 0 && platform.delay < 1) {
        platform.delay += dt
      } else if (platform.delay >= 1) {
        platform.delay = -1
      }
    }
  }
}
