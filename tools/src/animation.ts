export type AnimType = 'play' | 'stop' | 'pause' | 'reset'

export type Animation = {
  target: string
  name: string
  speed: number
}

@Component('org.decentraland.Animation')
export class Animated {
  type: AnimType
  name: string
  speed: number
  loop: boolean
  channel: IChannel
  sender: string = 'initial'
  timestamp: number

  constructor(args: {
    type: AnimType
    name: string
    speed: number
    loop: boolean
    channel: IChannel
    sender?: string
    timestamp?: number
  }) {
    this.type = args.type
    this.name = args.name
    this.speed = args.speed
    this.channel = args.channel
    this.sender = args.sender
    this.loop = args.loop
    this.timestamp = args.timestamp
  }
}
