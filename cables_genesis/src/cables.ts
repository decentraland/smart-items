@Component('org.decentraland.CableBox')
export class CableBox {
  redCable: boolean = true
  greenCable: boolean = true
  blueCable: boolean = true
  redCableCut: boolean = false
  greenCableCut: boolean = false
  blueCableCut: boolean = false
  doorOpen: boolean = false
  constructor(
    public channel: IChannel,
    redCable: boolean,
    greenCable: boolean,
    blueCable: boolean
  ) {
    this.redCable = redCable
    this.greenCable = greenCable
    this.blueCable = blueCable
  }
}
