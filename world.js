class World {
  constructor() {
    this.fps = 100
    this.width = width
    this.height = height

    this.highlightFirst = false
    this.showGroupMiddles = false

    // this.cohesionWeight = 0.01
    // this.separateWeight = .5
    // this.alignWeight = 0.02
    this.separateWeight = 2.5
    this.alignWeight = 1.0
    this.cohesionWeight = 1.0

    this.boundForce = 4
    this.buffer = 15
    this.viewRange = 50;

    this.groupNum = 5
    this.groupSize = 50
    this.reset()
  }

  // Calls update function for all groups and things, can return the fitness
  update() {
    const forEachUpdate = x => x.forEach(a => a.update())
    forEachUpdate(this.groups)
    // return this.groups.reduce((sum, g) => { return sum + g.avgError }, 0)
  }

  // Re initialize the groups
  reset() {
    this.groups = []
    for (let i = 0; i < this.groupNum; i++)
      this.groups.push(new Group(this, 'Group' + i, this.groupSize))
    const forEachInit = x => x.forEach(a => a.init())
    forEachInit(this.groups)
  }

  zero() {
    this.separateWeight = 0
    this.alignWeight = 0
    this.cohesionWeight = 0
  }

  addGroup() {
    this.groups.push(new Group(this, 'Group' + this.groupNum++, this.groupSize))
  }

}
