class Entity {
  constructor(world, mass, x, y, maxspeed, maxforce, color) {
    this.world = world
    this.mass = mass
    this.square = true
    this.maxspeed = maxspeed
    this.maxforce = maxforce
    this.lookRange = this.mass * 70
    this.length = this.mass * 10
    this.base = this.length * 0.5
    this.HALF_PI = Math.PI * 0.5
    this.TWO_PI = Math.PI * 2
    this.location = new Vector(x, y)
    this.velocity = new Vector(0, 0)
    this.acceleration = new Vector(0, 0)
    this.color = color
  }

  draw() {
    var ctx = this.world.context
    var angle = this.velocity.angle()

    var pts = []
    if (this.square) {
      var inc = 10
      var x1 = this.location.x
      var y1 = this.location.y
      var x2 = this.location.x
      var y2 = this.location.y + inc
      var x3 = this.location.x + inc
      var y3 = this.location.y + inc
      var x4 = this.location.x + inc
      var y4 = this.location.y
      pts = [
        { x: x1, y: y1 },
        { x: x2, y: y2 },
        { x: x3, y: y3 },
        { x: x4, y: y4 }
      ]
    } else {
      var x1 = this.location.x + Math.cos(angle) * this.base
      var y1 = this.location.y + Math.sin(angle) * this.base

      var x2 = this.location.x + Math.cos(angle + this.HALF_PI) * this.base
      var y2 = this.location.y + Math.sin(angle + this.HALF_PI) * this.base

      var x3 = this.location.x + Math.cos(angle - this.HALF_PI) * this.base
      var y3 = this.location.y + Math.sin(angle - this.HALF_PI) * this.base
      pts = [
        { x: x1, y: y1 },
        { x: x2, y: y2 },
        { x: x3, y: y3 }
      ]
    }

    ctx.lineWidth = 2
    ctx.fillStyle = this.color
    ctx.strokeStyle = this.color
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    pts.forEach((pt) => {
      ctx.lineTo(pt.x, pt.y)
    })
    ctx.stroke()
    ctx.fill()
  }
  update() {
    this.boundaries()
    this.velocity.add(this.acceleration)
    this.velocity.limit(this.maxspeed)
    // Speed Normalization
    if (this.velocity.mag() < 1.5) { this.velocity.setMag(1.5) }
    this.location.add(this.velocity)
    this.acceleration.mul(0)
    this.draw()
  }
  applyForce(force) {
    this.acceleration.add(force)
  }
  boundaries() {
    const buffer = world.buffer
    const force = world.boundForce
    if (this.location.x < buffer) { this.applyForce(new Vector(this.maxforce * force, 0)) }

    if (this.location.x > this.world.width - buffer) { this.applyForce(new Vector(-this.maxforce * force, 0)) }

    if (this.location.y < buffer) { this.applyForce(new Vector(0, this.maxforce * force)) }

    if (this.location.y > this.world.height - buffer) { this.applyForce(new Vector(0, -this.maxforce * force)) }
  }
}

class Creature extends Entity {
  constructor(world, x, y, group, color) {
    var mass = 0.7
    var maxspeed = 2
    var maxforce = 0.2
    super(world, mass, x, y, maxspeed, maxforce, color)
    this.square = false
    this.group = group
  }

  moveTo(output, creatures) {
    var target = new Vector(output[0] * this.world.width, output[1] * this.world.height)
    var angle = (output[2] * this.TWO_PI) - Math.PI

    var separation = this.separate(creatures)
    var alignment = this.align(creatures).setAngle(angle)
    var cohesion = this.seek(target)

    var forces = [separation, alignment, cohesion]
    var force = new Vector(0, 0)
    forces.forEach((f) => { force.add(f) })
    this.applyForce(force)
  }
  seek(target) {
    var seek = target.copy().sub(this.location)
    this.applyVector(seek)
    seek.limit(world.seekWeight)
    return seek
  }
  separate(creatures) {
    var sum = new Vector(0, 0)

    var neighboors = creatures.filter((c, i) => {
      var d = this.location.dist(c.location)
      return (d < 24 && d > 0)
    })

    if (neighboors.length > 0) {
      var values = neighboors.map((c, i) => {
        var diff = this.location.copy().sub(c.location)
        diff.normalize()
        diff.div(this.location.dist(c.location))
        return diff
      }, this)
      sum = new Vector().avg(values, this)
    }

    this.applyVector(sum)
    sum.limit(this.maxforce)
    // Pushes individual away from pack until they can turn around
    return sum.mul(world.separateWeight)
  }
  // Averages, and makes average velocity normal
  // align(neighboors) {
  //   var velocities = neighboors.map((c) => { return c.velocity })
  //   var avgVelocity = new Vector().avg(velocities, this)
  //   this.applyVector(avgVelocity)
  //   avgVelocity.limit(this.maxforce)
  //   return avgVelocity.limit(world.alignWeight)
  // }
  align(creatures) {
    var avgVelocity = new Vector(0, 0)
    var neighboors = creatures.filter((c, i) => {
      var d = this.location.dist(c.location)
      return (d < this.lookRange && d > 0)
    })

    if (neighboors.length > 0) {
      var velocities = neighboors.map((c) => { return c.velocity })
      avgVelocity = new Vector().avg(velocities, this)
      this.applyVector(avgVelocity)
      avgVelocity.limit(this.maxforce)

    }
    return avgVelocity.limit(world.alignWeight)
  }
  // Averages Location of neighbors
  cohesion(creatures) {
    var locations = creatures.map((c) => { return c.location })
    return new Vector().avg(locations, this)
  }

  applyVector(v) {
    v.normalize()
    v.mul(this.maxspeed)
    v.sub(this.velocity)
  }
}
