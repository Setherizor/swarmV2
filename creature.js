class Entity {
  constructor(mass, x, y, maxspeed, maxforce, color) {
    this.mass = 0.6
    this.maxspeed = 2
    this.maxforce = 0.2
    this.lookRange = this.mass * 200
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
    this.update()

    var ctx = this.world.context
    var angle = this.velocity.angle()

    var x1 = this.location.x + Math.cos(angle) * this.base
    var y1 = this.location.y + Math.sin(angle) * this.base

    var x2 = this.location.x + Math.cos(angle + this.HALF_PI) * this.base
    var y2 = this.location.y + Math.sin(angle + this.HALF_PI) * this.base

    var x3 = this.location.x + Math.cos(angle - this.HALF_PI) * this.base
    var y3 = this.location.y + Math.sin(angle - this.HALF_PI) * this.base

    ctx.lineWidth = 2
    ctx.fillStyle = this.color
    ctx.strokeStyle = this.color
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.lineTo(x3, y3)
    ctx.stroke()
    ctx.fill()
  }
  update() {
    this.boundaries()
    this.velocity.add(this.acceleration)
    this.velocity.limit(this.maxspeed)
    if (this.velocity.mag() < 1.5) { this.velocity.setMag(1.5) }
    this.location.add(this.velocity)
    this.acceleration.mul(0)
  }

  applyForce(force) {
    this.acceleration.add(force)
  }

  boundaries() {
    var buffer = 15
    var force = 2;
    if (this.location.x < buffer) { this.applyForce(new Vector(this.maxforce * force, 0)) }

    if (this.location.x > this.world.width - buffer) { this.applyForce(new Vector(-this.maxforce * force, 0)) }

    if (this.location.y < buffer) { this.applyForce(new Vector(0, this.maxforce * force)) }

    if (this.location.y > this.world.height - buffer) { this.applyForce(new Vector(0, -this.maxforce * force)) }
  }
}

class Creature extends Entity {
  constructor(world, x, y, group, color) {
    var mass = 0.6
    var maxspeed = 2
    var maxforce = 0.2
    super(mass, x, y, maxspeed, maxforce, color)

    this.world = world
    this.group = group
    var nodes = (this.group.num * 4)
    this.network = new Architect.Perceptron(nodes, nodes / 2 + 5, 3)
  }

  moveTo(networkOutput, creatures) {
    var force = new Vector(0, 0)

    var target = new Vector(networkOutput[0] * this.world.width, networkOutput[1] * this.world.height)
    var angle = (networkOutput[2] * this.TWO_PI) - Math.PI

    var separation = this.separate(creatures)
    var alignment = this.align(creatures).setAngle(angle)
    var cohesion = this.seek(target)

    force.add([separation, alignment, cohesion])
    this.applyForce(force)
  }

  seek(target) {
    var seek = target.copy().sub(this.location)
    seek.normalize()
    seek.mul(this.maxspeed)
    seek.sub(this.velocity).limit(0.3)

    return seek
  }

  separate(creatures) {
    var sum = new Vector(0, 0)
    var count = 0

    creatures.forEach((x) => {
      if (x != this) {
        var d = this.location.dist(x.location)
        if (d < 24 && d > 0) {
          var diff = this.location.copy().sub(x.location)
          diff.normalize()
          diff.div(d)
          sum.add(diff)
          count++
        }
      }
    }, this)
    if (!count) { return sum }

    sum.div(count)

    sum.normalize()
    sum.mul(this.maxspeed)
    sum.sub(this.velocity)
    sum.limit(this.maxforce)

    return sum.mul(2)
  }

  align(neighboors) {
    // Get all the velocities
    var values = neighboors.map((x) => { return x.velocity })
    var sum = new Vector().avg(values, this)
    sum.normalize()
    sum.mul(this.maxspeed)
    sum.sub(this.velocity).limit(this.maxspeed)
    return sum.limit(0.1)
  }

  cohesion(neighboors) {
    // Get all the locations
    var values = neighboors.map((x) => { return x.location })
    return new Vector().avg(values, this)
  }
}