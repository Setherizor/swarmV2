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

class Group {
  constructor(world, name, num) {
    this.name = name
    this.num = num
    this.world = world
    this.color = getRandomColor()
    this.creatures = []
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
  targetX(creature) {
    var cohesion = creature.cohesion(this.creatures)
    return cohesion.x / world.width
  }
  targetY(creature) {
    var cohesion = creature.cohesion(this.creatures)
    return cohesion.y / world.height
  }
  targetAngle(creature) {
    var alignment = creature.align(this.creatures)
    return (alignment.angle() + Math.PI) / (Math.PI * 2)
  }
  update() {
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
      var target = [this.targetX(creature), this.targetY(creature), this.targetAngle(creature)]
      
      //creature.network.propagate(learningRate, target)
      info += new Trainer(creature.network).train([{
        input: input,
        output: target
      }], {
          rate: learningRate,
          iterations: 1,
          error: .95,
          cost: Trainer.cost.MSE
        }).error
      
      creature.update()
    }, this)
    // Avg Error
    return (info / this.creatures.length)
  }
}
