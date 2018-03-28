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

    let groupSize = 30
    // this.groups = ['A', 'B', 'C', 'D', 'E', 'F'].map(l => new Group(this, 'Group' + l, groupSize))
    this.groups = ['A', 'B'].map(l => new Group(this, 'Group' + l, groupSize))
  }

  // Calls update function for all groups and things
  update() {
    const forEachUpdate = (x) => { x.forEach((a) => a.update()) }
    forEachUpdate(this.groups)
    const groupFitness = this.groups.reduce((sum, g) => { return sum + g.avgError }, 0)
    return groupFitness
  }

  // Re initialize the groups
  reset() {
    const forEachInit = (x) => { x.forEach((a) => a.init()) }
    forEachInit(this.groups)
  }

  // Show and update
  show() {
    world.loops++
    const error = world.update()
  }
}
