class Entity {
  constructor(world, mass, x, y, maxspeed, maxforce, color) {
    this.world = world
    this.mass = mass
    this.square = true
    this.maxspeed = maxspeed
    this.maxforce = maxforce
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

    this.location.add(this.velocity)
    this.acceleration.mul(0)
    this.draw()
  }

  applyForce(force) {
    this.acceleration.add(force)
  }

  boundaries() {
    var buffer = 15
    var force = 4
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
    super(world, mass, x, y, maxspeed, maxforce, color)
    this.square = false
    this.group = group
    var nodes = (this.group.num * 4)
    this.network = new Architect.Perceptron(nodes, nodes / 2 + 5, 3)
  }

  update() {
    if (this.velocity.mag() < 1.5) { this.velocity.setMag(1.5) }
    super.update()
  }

  moveTo(networkOutput, creatures) {
    var target = new Vector(networkOutput[0] * this.world.width, networkOutput[1] * this.world.height)
    var angle = (networkOutput[2] * this.TWO_PI) - Math.PI

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
    seek.normalize()
    seek.mul(this.maxspeed)
    seek.sub(this.velocity).limit(0.3)

    return seek
  }

  separate(creatures) {
    var sum = new Vector(0, 0)

    creatures.forEach((x) => {
      var d = this.location.dist(x.location)
      if (d < 24 && d > 0) {
        var diff = this.location.copy().sub(x.location)
        diff.normalize()
        diff.div(d)
        sum.add(diff)
      }
    }, this)
 
    sum.div(creatures.length)

    sum.normalize()
    sum.mul(this.maxspeed)
    sum.sub(this.velocity)
    sum.limit(this.maxforce)

    return sum.mul(2)
  }

  align(neighboors) {
    // Get all the velocities
    var locations = neighboors.map((c) => { return c.velocity })
    var avgVelocity = new Vector().avg(locations, this)
    avgVelocity.normalize()
    avgVelocity.mul(this.maxspeed)
    avgVelocity.sub(this.velocity).limit(this.maxspeed)
    // CHANGE THIS BACK TO .1
    return avgVelocity.limit(0.9)
  }

  cohesion(neighboors) {
    // Get all the locations and average them
    var locations = neighboors.map((c) => { return c.location })
    return new Vector().avg(locations, this)
  }
}
