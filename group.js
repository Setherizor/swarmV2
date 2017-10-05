const getRandomColor = () => {
  var letters = '012345'.split('');
  var color = '#';        
  color += letters[Math.round(Math.random() * 5)];
  letters = '0123456789ABCDEF'.split('');
  for (var i = 0; i < 5; i++) {
      color += letters[Math.round(Math.random() * 15)];
  }
  return color;
}  

function Group(world, name, num) {
  this.name = name
  this.num = num
  this.world = world
  this.color = getRandomColor()
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
    var info = 0
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
      //creature.network.propagate(learningRate, target)

      var t = new Trainer(creature.network)
      train = t.train([{
        input: input,
        output: target
      }], {
          rate: learningRate,
          iterations: 1,
          error: .95,
          cost: Trainer.cost.MSE
        })

        info += train.error
      // draw
      creature.draw()
    })
    return info / this.creatures.length
  },
  fitness: function () {
    return 0
  }
}
