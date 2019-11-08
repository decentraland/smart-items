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
  animation?: "run" | "die" | "granade" | "idle";
};

export default class Button implements IScript<Props> {
  init() {}
  spawn(host: Entity, props: Props) {
    const bus = new MessageBus();
    const entity = new Entity();

    entity.addComponent(new GLTFShape("models/Alien.glb"));
    const animator = new Animator();
    const animations = {
      idle: new AnimationState("tpose"),
      run: new AnimationState("run"),
      die: new AnimationState("die"),
      granade: new AnimationState("granade")
    };

    animator.addClip(animations["idle"]);
    animator.addClip(animations["run"]);
    animator.addClip(animations["die"]);
    animator.addClip(animations["granade"]);

    entity.addComponent(animator);

    const animationKey = props.animation || "idle";
    animations[animationKey].play();

    bus.on(host.name, ({ actionId, values }: Action) => {
      log(actionId, values);
      debugger;
      if (actionId === "setAnimation") {
        const anim = values["animation"];
        animations[anim].play();
      }
    });

    entity.addComponent(
      new Transform({
        scale: new Vector3(2, 2, 2)
      })
    );

    entity.setParent(host);
  }
}
