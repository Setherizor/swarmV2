let adj = 4
let quadtree;
let boundary;
let world;
let gui;

function setup() {
  createCanvas(windowWidth - adj, windowHeight - adj);
  boundary = new Rectangle(width / 2, height / 2, width / 2, height / 2);
  world = new World()
  gui = new dat.GUI()
  gui.close()
  gui.add(world, 'fps', 1, 150)
  gui.add(world, 'viewRange', 0, 150)
  gui.add(world, 'separateWeight', -2, 10)
  gui.add(world, 'cohesionWeight', -2, 2)
  gui.add(world, 'alignWeight', -1, 3)
  gui.add(world, 'boundForce', 3, 20)
  gui.add(world, 'buffer', 15, 550)
  gui.add(world, 'reset')
  gui.add(world, 'zero')
  gui.add(world, 'addGroup')
  gui.add(world, 'highlightFirst')
  gui.add(world, 'showGroupMiddles')
  gui.remember(world)
}

function windowResized() {
  resizeCanvas(windowWidth - adj, windowHeight - adj);
}

function draw() {
  background('#f7f3d7')

  if (world.highlightFirst) {
    // First Creature Hightlight
    let l = world.groups[0].creatures[0]
    fill(l.color)
    ellipse(l.location.x, l.location.y, 40, 40);
  }

  if (world.showGroupMiddles) {
    // Shows average location of group's creatures
    for (let g of world.groups) {
      var v = g.creatures[0].groupco()
      fill(g.color)
      ellipse(v.x, v.y, 20, 20);
    }
  }

  // Run The World
  frameRate(world.fps)
  world.update()
}