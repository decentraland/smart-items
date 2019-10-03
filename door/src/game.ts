import door from './item'

const entity = new Entity()
engine.addEntity(entity)
entity.addComponent(
  new Transform({
    position: new Vector3(8, 0, 8)
  })
)
door(entity, {})
