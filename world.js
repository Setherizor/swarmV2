class World {
  constructor(canvas, ctx) {
    this.fps = 100
    this.width = width
    this.height = height
    this.context = ctx
    this.loops = 0

    this.seekWeight = 0.01
    this.separateWeight = .5
    this.alignWeight = 0.02
    this.boundForce = 4
    this.buffer = 15

    this.groups = []
    let groups = 3
    let groupSize = 100
    for (let i = 0; i < groups; i++)
      this.groups.push(new Group(this, 'Group' + i, groupSize))
  }

  // Calls update function for all groups and things, can return the fitness
  update() {
    const forEachUpdate = x => x.forEach(a => a.update())
    forEachUpdate(this.groups)
    // return this.groups.reduce((sum, g) => { return sum + g.avgError }, 0)
  }

  // Re initialize the groups
  reset() {
    const forEachInit = x => x.forEach(a => a.init())
    forEachInit(this.groups)
  }

  // Show and update
  show() {
    world.loops++
    const fitness = world.update()
  }
}
