function World (canvas, ctx) {
  this.width = canvas.width
  this.height = canvas.height
  var size = 10
  this.groups = {
    GroupA: new Group(this, 'GroupA', size),
    GroupB: new Group(this, 'GroupB', size),
    GroupC: new Group(this, 'GroupC', size),
    GroupD: new Group(this, 'GroupD', size),
    GroupE: new Group(this, 'GroupE', size),
    GroupF: new Group(this, 'GroupA', size)
  }
  this.context = ctx
  this.fps = 150
  this.loops = 0
}

World.prototype = {

  populate: function () {
    this.GroupA = []
    this.GroupB = []
  },
  update: function () {
    var groupFitness = 0
    for (group in world.groups) {
      groupFitness += world.groups[group].update()
    }
    return groupFitness
  }
}

var loop = function () {
  // For each creature train it to predict average target and angle based on input of every other creature's pos and velocity
  world.loops++

  var ctx = world.context
  console.assert(ctx !== undefined)
  // fade effect
  ctx.globalAlpha = 0.2
  ctx.fillStyle = '#f7f3d7'
  ctx.fillRect(0, 0, world.width, world.height)
  ctx.globalAlpha = 1

  var error = world.update()
  if (world.loops % 20 === 0) {
    console.log(error)
  }

  setTimeout(loop, 1000 / world.fps)
}

var canvas = document.getElementById('canvas')
var ctx = canvas.getContext('2d')

function blastoff () {
  var adj = 4.0001
  canvas.width = window.innerWidth - adj
  canvas.height = window.innerHeight - adj

  var resizeCanvas = () => {
    canvas.width = world.width = window.innerWidth - adj
    canvas.height = world.height = window.innerHeight - adj
  }
  // resize the canvas to fill browser window dynamically
  window.addEventListener('resize', resizeCanvas, false)

  // blastoff
  world = new World(canvas, ctx)
  loop()
}

blastoff()
