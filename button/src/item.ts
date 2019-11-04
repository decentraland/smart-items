export interface IScript<T extends {}> {
  init(): void
  spawn(host: Entity, props: T): void
}

export type Action = {
  entityName: string
  actionId: string
  values: Record<string, any>
}

export type Props = {
  onClick: Action
}

export default class Door implements IScript<Props> {
  init() {}
  spawn(host: Entity, props: Props) {
    const bus = new MessageBus()
    host.addComponent(new GLTFShape('models/ButtonPanel_01/ButtonPanel_01.glb'))
    host.addComponent(
      new OnClick(() => bus.emit(props.onClick.entityName, props.onClick))
    )
  }
}
