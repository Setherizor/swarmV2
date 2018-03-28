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
  gui.add(world, 'fps', 5, 200)
  gui.add(world, 'seekWeight', -1, 1)
  gui.add(world, 'separateWeight', -1, 3)
  gui.add(world, 'alignWeight', -1, 3)
  gui.add(world, 'boundForce', 3, 20)
  gui.add(world, 'buffer', 15, 550)
  gui.add(world, 'reset')
  gui.remember(world)
}

function windowResized() {
  resizeCanvas(windowWidth - adj, windowHeight - adj);
}

function draw() {
  background('#f7f3d7')

  // First Creature Hightlight
  let l = world.groups[0].creatures[0]
  fill(l.color)
  ellipse(l.location.x, l.location.y, 40, 40);

  // Run The World
  frameRate(world.fps)
  world.show()
}