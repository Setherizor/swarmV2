class World {
  constructor(canvas, ctx) {
    this.fps = 150
    this.width = canvas.width
    this.height = canvas.height
    this.context = ctx
    this.loops = 0
    var size = 10
    this.things = {
      //apple: new Entity(this, 4, 202, 202, 0, 0 , '#f44542')
    }
    this.groups = {
      GroupA: new Group(this, 'GroupA', size),
      GroupB: new Group(this, 'GroupB', size),
      GroupC: new Group(this, 'GroupC', size),
      GroupD: new Group(this, 'GroupD', size),
      GroupE: new Group(this, 'GroupE', size),
      GroupF: new Group(this, 'GroupF', size)
    }
  }

  populate() {
    this.GroupA = []
    this.GroupB = []
  }
  update() {
    var groupFitness = 0
    for (var group in this.groups) {
      groupFitness += this.groups[group].update()
    }
    for (var key in this.things) {
      this.things[key].update()
    }
    
    return groupFitness
  }
  loop() {
    // For each creature train it to predict average target and angle based on input of every other creature's pos and velocity
    world.loops++
    const ctx = world.context
    // fade effect
    ctx.globalAlpha = 0.2
    ctx.fillStyle = '#f7f3d7'
    ctx.fillRect(0, 0, world.width, world.height)
    ctx.globalAlpha = 1
  
    var error = world.update()
    if (world.loops % 20 === 0) {
      console.log(error)
    }
  
    setTimeout(world.loop, 1000 / world.fps)
  }
}


// function blastoff() {
//   var adj = 4.0001
//   canvas.width = window.innerWidth - adj
//   canvas.height = window.innerHeight - adj

//   const resizeCanvas = () => {
//     canvas.width = world.width = window.innerWidth - adj
//     canvas.height = world.height = window.innerHeight - adj
//   }
//   // resize the canvas to fill browser window dynamically
//   window.addEventListener('resize', resizeCanvas, false)

//   // blastoff
//   world = new World(canvas, ctx)
//   world.loop()
// }

// blastoff()
