function Group (world, name, num, color) {
  this.name = name
  this.num = num
  this.world = world
  this.color = color
  this.creatures = []
  this.init()
}

var targetX = function (creature, creatures) {
  var cohesion = creature.cohesion(creatures)
  return cohesion.x / world.width
}

var targetY = function (creature, creatures) {
  var cohesion = creature.cohesion(creatures)
  return cohesion.y / world.height
}

var targetAngle = function (creature, creatures) {
  var alignment = creature.align(creatures)
  return (alignment.angle() + Math.PI) / (Math.PI * 2)
}

Group.prototype = {

  init: function () {
    for (var i = 0; i < this.num; i++) {
      var x = Math.random() * this.world.width
      var y = Math.random() * this.world.height
      this.creatures[i] = new Creature(this.world, x, y, this, this.color)
      this.creatures[i].velocity.random()
    }
  },
  update: function () {
    // Fitness All Creatures
    var totalFit = 0
    this.creatures.forEach(function (creature, i, array) {
      // move
      var input = []
      for (var i in array) {
        input.push(array[i].location.x)
        input.push(array[i].location.y)
        input.push(array[i].velocity.x)
        input.push(array[i].velocity.y)
      }
      var output = creature.network.activate(input)
      creature.moveTo(output, array)
      // learn
      var learningRate = 0.085
      var target = [targetX(creature, array), targetY(creature, array), targetAngle(creature, array)]
      creature.network.propagate(learningRate, target)

      // draw
      creature.draw()

      // Helps with overall Fitness
      totalFit += new Vector(output[0], output[1]).dist(new Vector(target[0], target[1]))
    })
    return totalFit
  },
  fitness: function () {
    return 0
  }
}
