export interface IScript<T extends {}> {
  init(): void;
  spawn(host: Entity, props: T): void;
}

export type Action = {
  entityName: string;
  actionId: string;
  values: Record<string, any>;
};

export type Props = {
  onClick: Action[];
};

export default class Button implements IScript<Props> {
  init() {}
  spawn(host: Entity, props: Props) {
    const bus = new MessageBus();
    host.addComponent(
      new GLTFShape("models/ButtonPanel_01/ButtonPanel_01.glb")
    );
    host.addComponent(
      new OnClick(() => {
        for (const action of props.onClick) {
          bus.emit(action.entityName, action);
        }
      })
    );
  }
}
