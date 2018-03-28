class Group {
  constructor(world, name, num) {
    this.name = name
    this.num = num
    this.world = world
    this.avgError = 0
    this.color = '#' + Math.floor(random(16777215)).toString(16)
    this.creatures = []
    this.package = []
    this.init()
  }

  init() {
    for (let i = 0; i < this.num; i++) {
      let x = random(this.world.width)
      let y = random(this.world.height)
      this.creatures[i] = new Creature(this.world, x, y, this, this.color)
    }
  }

  targetXY(creature) {
    let c = creature.cohesion(this.creatures)
    let x = c.x / world.width
    let y = c.y / world.width
    return { x: x, y: y }
  }

  targetAngle(creature) {
    let alignment = creature.align(this.creatures)
    return (alignment.heading() + Math.PI) / (Math.PI * 2)
  }

  update() {
    let info = 0
    this.creatures.forEach(function (creature, i, array) {
      let targetXY = this.targetXY(creature)
      let target = [targetXY.x, targetXY.y, this.targetAngle(creature)]
      creature.moveTo(target, array)
      creature.update()
    }, this)
    // Avg Error
    this.avgError = (info / this.creatures.length)
  }
}
