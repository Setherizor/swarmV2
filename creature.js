class Entity {
  constructor(world, mass, x, y, maxspeed, maxforce, color) {
    this.world = world
    this.maxspeed = maxspeed
    this.maxforce = maxforce
    this.lookRange = 50
    this.mass = mass
    this.length = this.mass * 10
    this.base = this.length * 0.5
    this.location = createVector(x, y)
    this.location.parent = this
    this.velocity = p5.Vector.random2D()
    this.acceleration = createVector(0, 0)
    this.color = color
  }

  update() {
    this.boundaries()
    this.velocity.add(this.acceleration)
    this.velocity.limit(this.maxspeed)
    this.location.add(this.velocity)
    this.acceleration.mult(0)
    this.draw()
  }

  boundaries() {
    const buffer = world.buffer
    const force = world.boundForce
    if (this.location.x < buffer)
      this.applyForce(createVector(this.maxforce * force, 0))

    if (this.location.x > this.world.width - buffer)
      this.applyForce(createVector(-this.maxforce * force, 0))

    if (this.location.y < buffer)
      this.applyForce(createVector(0, this.maxforce * force))

    if (this.location.y > this.world.height - buffer)
      this.applyForce(createVector(0, -this.maxforce * force))
  }

  applyForce(force) {
    this.acceleration.add(force)
  }

  avgVec(values) {
    let sum = createVector(0, 0)
    values.forEach(v => sum.add(v))
    sum.div(values.length)
    return sum
  }

  draw() {
    let angle = this.velocity.heading()
    let x1 = this.location.x + Math.cos(angle) * this.base
    let y1 = this.location.y + Math.sin(angle) * this.base
    let x2 = this.location.x + Math.cos(angle + (PI / 2)) * this.base
    let y2 = this.location.y + Math.sin(angle + (PI / 2)) * this.base
    let x3 = this.location.x + Math.cos(angle - (PI / 2)) * this.base
    let y3 = this.location.y + Math.sin(angle - (PI / 2)) * this.base
    fill(this.color)
    stroke(0, 0, 0)
    strokeWeight(.5)
    triangle(x1, y1, x2, y2, x3, y3)
  }
}

class Creature extends Entity {
  constructor(world, x, y, group, color) {
    let mass = 1.5
    let maxspeed = 2
    let maxforce = 0.05
    super(world, mass, x, y, maxspeed, maxforce, color)
    this.group = group
  }

  // Gets neighbor's locations from the quadtree
  getNeighbors(range = this.world.viewRange) {
    let bounds = new Circle(this.location.x, this.location.y, range)
    let all = this.group.qtree.query(bounds)
    return all.filter(l => p5.Vector.dist(this.location, l) != 0, this)
  }

  flock() {
    let separation = this.separate()
    let alignment = this.align()
    let cohesion = this.cohesion()

    separation.mult(world.separateWeight)
    alignment.mult(world.alignWeight)
    cohesion.mult(world.cohesionWeight)

    this.applyForce(separation)
    this.applyForce(alignment)
    this.applyForce(cohesion)
  }

  // Steers away from nearby neighbors
  separate() {
    let steer = createVector(0, 0)
    let neighboors = this.getNeighbors(25)
    if (neighboors.length > 0) {
      let values = neighboors.map((c, i) => {
        let diff = p5.Vector.sub(this.location, (c))
        diff.normalize()
        diff.div(this.location.dist(c))
        return diff
      }, this)
      steer = this.avgVec(values)
    }

    // Implement Reynolds: Steering = Desired - Velocity
    if (steer.mag() > 0) {
      steer.normalize()
      steer.mult(this.maxspeed)
      steer.sub(this.velocity)
      steer.limit(this.maxforce)
    }
    return steer
  }

  // Averages, and makes average velocity normal
  align() {
    let steer, avgVelocity
    let neighboors = this.getNeighbors()
    if (neighboors.length > 0) {
      let velocities = neighboors.map((c) => { return c.parent.velocity })
      avgVelocity = this.avgVec(velocities)
      avgVelocity.normalize()
      avgVelocity.mult(this.maxspeed)
      steer = p5.Vector.sub(avgVelocity, this.velocity)
      steer.limit(this.maxforce)
      return steer
    } else
      return createVector(0, 0)
  }

  // Averages Location of neighbors
  cohesion() {
    let neighboors = this.getNeighbors()
    if (neighboors.length > 0)
      return this.seek(this.avgVec(neighboors))
    else
      return createVector(0, 0)
  }

  groupco() {
    let neighboors = this.group.creatures
    var avg = (this.avgVec(neighboors.map(x => x.location)))
    return avg
  }

  seek(target) {
    let desired = p5.Vector.sub(target, this.location)
    desired.normalize()
    desired.mult(this.maxspeed)
    let steer = p5.Vector.sub(desired, this.velocity)
    steer.limit(this.maxforce)
    return steer
  }
}
