const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

function blastoff () {
  const adj = 4.0001
  canvas.width = window.innerWidth - adj
  canvas.height = window.innerHeight - adj

  // resize the canvas to fill browser window dynamically
  const resizeCanvas = () => {
    canvas.width = world.width = window.innerWidth - adj
    canvas.height = world.height = window.innerHeight - adj
  }
  window.addEventListener('resize', resizeCanvas, false)

  world = new World(canvas, ctx)
  // Use this and the SetTimeout for recursion
  world.loop()
  // Use this for a non Recursive option (FPS LOCKED)
  //setInterval(world.loop, 1000 / world.fps)
}

window.onload = function() {
  blastoff()
  var w = world
  var gui = new dat.GUI()
  gui.close()
  gui.add(w, 'fps', 2, 100)
  gui.add(w, 'seekWeight', -1, 2)
  gui.add(w, 'separateWeight', -1, 2)
  gui.add(w, 'alignWeight', -1, 2)
  gui.remember(w);
}
