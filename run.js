function blastoff () {
  var canvas = document.getElementById('canvas')
  var ctx = canvas.getContext('2d')
  var fps = 100

  const adj = 20
  canvas.width = window.innerWidth - adj
  canvas.height = window.innerHeight - adj

  const resizeCanvas = () => {
    canvas.width = world.width = window.innerWidth - adj
    canvas.height = world.height = window.innerHeight - adj
  }
	// resize the canvas to fill browser window dynamically
  window.addEventListener('resize', resizeCanvas, false)

	// blastoff
  world = new World()
  world.loop()
}

blastoff()
