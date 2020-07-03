export type Props = {
  x: string
  y: string
  name?: string
}

type ChangeCoordsType = { x: string; y: string; name?: string }

export default class Teleport implements IScript<Props> {
  init() {}

  spawn(host: Entity, props: Props, channel: IChannel) {
    const teleport = new Entity()
    teleport.setParent(host)

    teleport.addComponent(new GLTFShape('models/pua.glb'))

    let location = props.x + ',' + props.y

    let locationString = props.name
      ? 'Go to ' + props.name
      : 'Go to ' + props.x + ',' + props.y

    teleport.addComponent(
      new OnPointerDown(
        async function () {
          teleportTo(location)
        },
        {
          button: ActionButton.PRIMARY,
          hoverText: locationString,
        }
      )
    )

    // let Particles = new Entity()
    // Particles.addComponent(new GLTFShape('models/particles.glb'))
    // Particles.setParent(teleport)

    let teleportFloor = new Entity()
    teleportFloor.addComponent(new GLTFShape('models/teleport.glb'))
    teleportFloor.addComponent(new Transform({}))
    teleportFloor.setParent(teleport)

    channel.handleAction<ChangeCoordsType>('changeLocation', (action) => {
      let location = action.values.x + ',' + action.values.y
      let locationString = action.values.name
        ? 'Go to ' + action.values.name
        : 'Go to ' + action.values.x + ',' + action.values.y

      teleport.getComponent(OnPointerDown).callback = async function () {
        teleportTo(location)
      }
      teleport.getComponent(OnPointerDown).hoverText = locationString
    })

    channel.request<string>('getCoords', (result) => {
      teleport.getComponent(OnPointerDown).callback = result.function
      teleport.getComponent(OnPointerDown).hoverText = result.hoverText
    })
    channel.reply<string>('getCoords', () => {
      return {
        function: teleport.getComponent(OnPointerDown).callback,
        hoverText: teleport.getComponent(OnPointerDown).hoverText,
      }
    })
  }
}
