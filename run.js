const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

function blastoff() {
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
  world.loop()
}

window.onload = function () {
  blastoff()
  asyncGui = function () {
    var w = world
    var gui = new dat.GUI()
    gui.close()
    gui.add(w, 'fps', 10, 300)
    gui.add(w, 'seekWeight', -2, 2)
    gui.add(w, 'separateWeight', -1, 6)
    gui.add(w, 'alignWeight', 0, 3)
    gui.add(w, 'boundForce', 3, 20)
    gui.add(w, 'buffer', 15, 550)
    gui.add(w, 'reset')
    gui.remember(w)
  }
  setTimeout(asyncGui, 0)
}
