class Entity {
  constructor(world, mass, x, y, maxspeed, maxforce, color) {
    this.world = world
    this.mass = mass
    this.maxspeed = maxspeed
    this.maxforce = maxforce
    this.lookRange = 250//this.mass * 70
    this.length = this.mass * 10
    this.base = this.length * 0.5
    this.HALF_PI = Math.PI * 0.5
    this.TWO_PI = Math.PI * 2
    this.location = createVector(x, y)//new Vector(x, y)
    this.x = this.location.x
    this.y = this.location.y
    this.velocity = createVector(0, 0)//new Vector(0, 0)
    this.acceleration = createVector(0, 0)//new Vector(0, 0)
    this.color = color
  }

  draw() {
    let angle = this.velocity.heading()
    let x1 = this.location.x + Math.cos(angle) * this.base
    let y1 = this.location.y + Math.sin(angle) * this.base
    let x2 = this.location.x + Math.cos(angle + this.HALF_PI) * this.base
    let y2 = this.location.y + Math.sin(angle + this.HALF_PI) * this.base
    let x3 = this.location.x + Math.cos(angle - this.HALF_PI) * this.base
    let y3 = this.location.y + Math.sin(angle - this.HALF_PI) * this.base
    fill(this.color)
    triangle(x1, y1, x2, y2, x3, y3)
  }

  update() {
    this.boundaries()
    this.velocity.add(this.acceleration)
    this.velocity.limit(this.maxspeed)
    // Speed Normalization
    if (this.velocity.mag() < 1.5) { this.velocity.setMag(1.5) }
    this.location.add(this.velocity)
    this.acceleration.mult(0)
    this.draw()
  }

  applyForce(force) {
    this.acceleration.add(force)
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

  moveTo(output, creatures) {
    let target = createVector(output[0] * this.world.width, output[1] * this.world.height)
    let angle = (output[2] * this.TWO_PI) - Math.PI

    let separation = this.separate(creatures)
    // let alignment = this.align(creatures).setAngle(angle)

    function setAngle (v, a) {
      var mag = v.mag()
      v.x = mag * Math.cos(a)
      v.y = mag * Math.sin(a)
      return v
    }

    let alignment = setAngle(this.align(creatures), angle)
    let cohesion = this.seek(target)

    let forces = [separation, alignment, cohesion]
    let force = createVector(0, 0)
    forces.forEach((f) => { force.add(f) })
    this.applyForce(force)
  }
  seek(target) {
    let seek = target.copy().sub(this.location)
    this.applyVector(seek)
    seek.limit(world.seekWeight)
    return seek
  }
  separate(creatures) {
    let sum = createVector(0, 0)

    let neighboors = creatures.filter((c, i) => {
      let d = this.location.dist(c.location)
      return (d < 24 && d > 0)
    })

    if (neighboors.length > 0) {
      let values = neighboors.map((c, i) => {
        let diff = this.location.copy().sub(c.location)
        diff.normalize()
        diff.div(this.location.dist(c.location))
        return diff
      }, this)
      sum = this.avgVec(values)
    }

    this.applyVector(sum)
    sum.limit(this.maxforce)
    // Pushes individual away from pack until they can turn around
    return sum.mult(world.separateWeight)
  }
  // Averages, and makes average velocity normal
  // align(neighboors) {
  //   let velocities = neighboors.map((c) => { return c.velocity })
  //   let avgVelocity = new Vector().avg(velocities, this)
  //   this.applyVector(avgVelocity)
  //   avgVelocity.limit(this.maxforce)
  //   return avgVelocity.limit(world.alignWeight)
  // }
  align(creatures) {
    let avgVelocity = createVector(0, 0)
    let neighboors = creatures.filter((c, i) => {
      let d = this.location.dist(c.location)
      return (d < this.lookRange && d > 0)
    })

    if (neighboors.length > 0) {
      let velocities = neighboors.map((c) => { return c.velocity })
      avgVelocity = this.avgVec(velocities)
      this.applyVector(avgVelocity)
      avgVelocity.limit(this.maxforce)
    }

    return avgVelocity.limit(world.alignWeight)
  }
  // Averages Location of neighbors
  cohesion(creatures) {
    let locations = creatures.map((c) => { return c.location })
    return this.avgVec(locations)
  }

  avgVec(values) {
    let sum = createVector(0, 0)
    values.forEach((v) => {
      if (v !== this) {
        sum.add(v)
      }
    })
    sum.div(values.length)
    return sum
  }

  applyVector(v) {
    v.normalize()
    v.mult(this.maxspeed)
    v.sub(this.velocity)
  }
}
