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
    this.velocity = createVector(0, 0)
    this.acceleration = createVector(0, 0)
    this.color = color
  }

  update() {
    this.boundaries()
    this.velocity.add(this.acceleration)
    this.velocity.limit(this.maxspeed)
    // Speed Normalization
    // if (this.velocity.mag() < 1.5) { this.velocity.setMag(1.5) }
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

  applyVector(v) {
    v.normalize()
    v.mult(this.maxspeed)
    v.sub(this.velocity)
  }

  avgVec(values) {
    let sum = createVector(0, 0)
    values.forEach((v) => {
      if (v !== this)
        sum.add(v)
    })
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
    strokeWeight(.5);
    triangle(x1, y1, x2, y2, x3, y3)
  }
}

class Creature extends Entity {
  constructor(world, x, y, group, color) {
    let mass = 1.5
    let maxspeed = 2
    let maxforce = 0.2
    super(world, mass, x, y, maxspeed, maxforce, color)
    this.group = group
    this.velocity = p5.Vector.random2D()
  }

  moveTo(output) {
    let target = createVector(output[0] * this.world.width, output[1] * this.world.height)
    let angle = output[2]

    function setAngle(v, a) {
      var mag = v.mag()
      v.x = mag * Math.cos(a)
      v.y = mag * Math.sin(a)
      return v
    }

    let separation = this.separate()
    let alignment = setAngle(this.align(), angle)
    let cohesion = this.seek(target)


    separation.limit(this.maxforce)
    separation.mult(world.separateWeight);
    // alignment.mult(1.0);
    alignment.limit(world.alignWeight)
    // cohesion.mult(1.0);
    cohesion.limit(world.seekWeight)

    this.applyForce(separation)
    this.applyForce(alignment)
    this.applyForce(cohesion)
  }

  seek(target) {
    let seek = target.copy().sub(this.location)
    this.applyVector(seek)
    return seek
  }

  separate() {
    let sum = createVector(0, 0)
    let range = new Circle(this.location.x, this.location.y, this.lookRange);
    let neighboors = this.group.qtree.query(range);

    if (neighboors.length > 0) {
      let values = neighboors.map((c, i) => {
        let diff = this.location.copy()
        diff.sub(c)
        diff.normalize()
        let dis = this.location.dist(c)
        diff.div(dis)
        return diff
      }, this)
      sum = this.avgVec(values)
    }

    this.applyVector(sum)
    // Pushes individual away from pack until they can turn around
    return sum
  }

  // Averages, and makes average velocity normal
  align() {
    let avgVelocity = createVector(0, 0)
    let range = new Circle(this.location.x, this.location.y, this.lookRange);
    let neighboors = this.group.qtree.query(range);

    if (neighboors.length > 0) {
      let velocities = neighboors.map((c) => { return c.parent.velocity })
      avgVelocity = this.avgVec(velocities)
      this.applyVector(avgVelocity)
      avgVelocity.limit(this.maxforce)
    }
    return avgVelocity
  }

  // Averages Location of neighbors
  cohesion() {
    let range = new Circle(this.location.x, this.location.y, this.lookRange);
    let points = this.group.qtree.query(range);
    let locations = points.map((c) => { return c })
    return this.avgVec(locations)
  }
}
