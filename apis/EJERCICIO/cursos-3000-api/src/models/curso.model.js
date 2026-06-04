// Modelo de Curso - Define la estructura de un curso

class Curso {
  constructor({
    id,
    titulo,
    descripcion,
    categoria,
    nivel,
    precio,
    maxEstudiantes,
    fechaInicio,
    fechaFin,
    inscritosCount = 0
  }) {
    this.id = id
    this.titulo = titulo
    this.descripcion = descripcion
    this.categoria = categoria
    this.nivel = nivel
    this.precio = parseFloat(precio)
    this.maxEstudiantes = parseInt(maxEstudiantes)
    this.fechaInicio = fechaInicio
    this.fechaFin = fechaFin
    this.inscritosCount = inscritosCount
  }
}

module.exports = Curso
