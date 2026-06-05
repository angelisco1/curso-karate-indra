({
  crearUsuario: function(nombre) {
    return {
      nombre,
      email: `${nombre.toLowerCase()}@undercover.com`,
      timestamp: Date.now(),
      id: Math.random()
    }
  }
})