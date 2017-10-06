const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

function blastoff () {
  const adj = 4.0001
  canvas.width = window.innerWidth - adj
  canvas.height = window.innerHeight - adj

  const resizeCanvas = () => {
    canvas.width = world.width = window.innerWidth - adj
    canvas.height = world.height = window.innerHeight - adj
  }
  // resize the canvas to fill browser window dynamically
  window.addEventListener('resize', resizeCanvas, false)

  // blastoff
  world = new World(canvas, ctx)
  setInterval(world.loop, 1000 / world.fps)
}

blastoff()
