import { KeypadUI } from "./ui"

@Component('org.decentraland.NumPad')
export class NumPadComponent {
  combination: number = 123
  ui: KeypadUI
  solved: boolean = false
  blocked: boolean = false
  onSolve: Actions
  onWrong: Actions


  constructor(
    public channel: IChannel,
	combination: number,
	ui: KeypadUI,
	blocked?: boolean,
	onSolve?: Actions,
	onWrong?: Actions
   
  ) {
	this.combination = combination
	this.ui = ui
	this.blocked = blocked
	this.onSolve = onSolve
	this.onWrong = onWrong
  }
}
