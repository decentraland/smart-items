import zombieSpawner from './item'

const ent = new Entity()
zombieSpawner(ent, { speed: 0.08, amount: 10, spawnRadius: 10 })
engine.addEntity(ent)
