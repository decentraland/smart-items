@Component('org.decentraland.ScoreBoard')
export class ScoreBoardComponent {
  currentValue: number = 0
  enabled: boolean = true
  digit1: TextShape
  digit2: TextShape
  digit3: TextShape
  digit4: TextShape
  digit5: TextShape
  initialValue: number
  threshold: number
  onThreshold: Actions


  constructor(
	public channel: IChannel,
	currentValue: number,
	threshold: number,
	onThreshold: Actions,
	enabled: boolean,
	digit1: TextShape,
	digit2: TextShape,
	digit3: TextShape,
	digit4: TextShape,
  ) {
	  this.currentValue = currentValue
	  this.initialValue = currentValue
	  this.enabled = enabled
	  this.threshold = threshold
	  this.onThreshold = onThreshold
	  this.digit1 = digit1
	  this.digit2 = digit2
	  this.digit3 = digit3
	  this.digit4 = digit4
  }
}
