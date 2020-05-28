// Adapted from Threejs
export class Box {
  min: Vector3 = new Vector3(+Infinity, +Infinity, +Infinity)
  max: Vector3 = new Vector3(-Infinity, -Infinity, -Infinity)

  constructor(min: Vector3, max: Vector3) {
    this.min = min
    this.max = max
  }

  containsPoint(point: Vector3): boolean {
    return point.x < this.min.x ||
      point.x > this.max.x ||
      point.y < this.min.y ||
      point.y > this.max.y ||
      point.z < this.min.z ||
      point.z > this.max.z
      ? false
      : true
  }
}
