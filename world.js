class World {
  constructor (canvas, ctx) {
    this.fps = 100
    this.width = canvas.width
    this.height = canvas.height
    this.context = ctx
    this.loops = 0

    this.seekWeight = 2//0.3
    this.separateWeight = 2
    this.alignWeight = 0.1

    var size = 30
    this.things = [
      // apple: new Entity(this, 4, 202, 202, 0, 0 , '#f44542')
    ]
    this.groups = [
      new Group(this, 'GroupA', size),
      new Group(this, 'GroupB', size),
      new Group(this, 'GroupC', size),
      new Group(this, 'GroupD', size),
      new Group(this, 'GroupE', size),
      new Group(this, 'GroupF', size)
    ]
  }

  // Calls update function for all groups and things
  update () {
    const forEachUpdate = (x) => { x.forEach((a) => { a.update() }) }
    forEachUpdate(this.groups)
    forEachUpdate(this.things)
    const groupFitness = this.groups.reduce((sum, g) => { return sum + g.avgError }, 0)
    return groupFitness
  }
  // Re initializex the groups
  reset() {
    const forEachUpdate = (x) => { x.forEach((a) => { a.init() }) }
    forEachUpdate(this.groups)
  }
  // Recursively calls function to enable dynamic FPS
  loop () {
    world.loops++
    // Fade effect
    world.context.globalAlpha = 0.25
    world.context.fillStyle = '#f7f3d7'
    world.context.fillRect(0, 0, world.width, world.height)
    world.context.globalAlpha = 1

    const error = world.update()
    // if (world.loops % 20 === 0) {
    //   console.log(error)
    // }
    setTimeout(world.loop, 1000 / world.fps)
  }
}
