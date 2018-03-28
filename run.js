let adj = 4
let quadtree;
let boundary;
let world;
let gui;

function setup() {
  createCanvas(windowWidth - adj, windowHeight - adj);

  boundary = new Rectangle(width / 2, height / 2, width / 2, height / 2);
  qtree = new QuadTree(boundary, 4);

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


function wow(r) {
  let l = world.groups[0].creatures[0].location

  let range = new Circle(l.x, l.y, r);

  let points = qtree.query(range);

  let finals = points.filter((c, i) => {
    let d = l.dist(c.location)
    return (d < r && d > 0)
    // return (d < l.lookRange && d > 0)
  })

  // if (points.length > 0)
  //   console.log(points)

  // for (let point of points) {
  //   let other = point.userData;
  //   if (p != other) {
  //     let d = dist(p.x, p.y, other.x, other.y);
  //     if (d < p.r / 2 + other.r / 2) {
  //       p.highlight = true;
  //     }
  //   }
  // }
  return finals;
}

function draw() {
  let l = world.groups[0].creatures[0].location


  qtree = new QuadTree(boundary, 4);
  for (let g of world.groups)
    for (let c of g.creatures)
      qtree.insert(c);

  // wow()

  background('#f7f3d7')

  ellipse(200, 200, 100, 100);
  ellipse(l.x, l.y, 50, 50);
  frameRate(world.fps)
  world.show()
}