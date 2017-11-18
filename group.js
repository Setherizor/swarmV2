class Group {
  constructor(world, name, num) {
    this.name = name
    this.num = num
    this.world = world
    this.avgError = 0
    this.color = '#' + Math.floor(Math.random() * 16777215).toString(16)
    this.creatures = []
    this.package = []
    this.init()
  }

  init() {
    for (var i = 0; i < this.num; i++) {
      var x = Math.random() * this.world.width
      var y = Math.random() * this.world.height
      this.creatures[i] = new Creature(this.world, x, y, this, this.color)
      this.creatures[i].velocity.random()
    }
  }
  targetXY(creature) {
    var c = creature.cohesion(this.creatures)
    var x = c.x / world.width
    var y = c.y / world.width
    return { x: x, y: y }
  }
  targetAngle(creature) {
    var alignment = creature.align(this.creatures)
    return (alignment.angle() + Math.PI) / (Math.PI * 2)
  }
  update() {
    var info = 0
    this.creatures.forEach(function (creature, i, array) {
      var targetXY = this.targetXY(creature)
      var target = [targetXY.x, targetXY.y, this.targetAngle(creature)]
      creature.moveTo(target, array)
      creature.update()
    }, this)
    // Avg Error
    this.avgError = (info / this.creatures.length)
  }
}
