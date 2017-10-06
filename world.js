class World {
  constructor (canvas, ctx) {
    this.fps = 60
    this.width = canvas.width
    this.height = canvas.height
    this.context = ctx
    this.loops = 0
    var size = 5
    this.things = [
      // apple: new Entity(this, 4, 202, 202, 0, 0 , '#f44542')
    ]
    this.groups = [
      new Group(this, 'GroupA', size),
      new Group(this, 'GroupB', size),
      new Group(this, 'GroupC', size),
      new Group(this, 'GroupD', size)
      // new Group(this, 'GroupE', size),
      // new Group(this, 'GroupF', size)
    ]
  }

  update () {
    const groupFitness = this.groups.reduce((sum, g) => {
      return sum + g.avgError
    }, 0)

    // Fancy Nested Updater Function
    const forEachUpdate = (x) => { x.forEach((a) => { a.update() }) }
    forEachUpdate(this.groups)
    forEachUpdate(this.things)

    return groupFitness
  }
  loop () {
    // For each creature train it to predict average target and angle based on input of every other creature's pos and velocity
    world.loops++
    // fade effect
    world.context.globalAlpha = 0.2
    world.context.fillStyle = '#f7f3d7'
    world.context.fillRect(0, 0, world.width, world.height)
    world.context.globalAlpha = 1

    const error = world.update()
    // if (world.loops % 20 === 0) {
    //   console.log(error)
    // }
  }
}
