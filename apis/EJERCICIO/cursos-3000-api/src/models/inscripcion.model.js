// Modelo de Inscripción - Define la estructura de una inscripción

class Inscripcion {
  constructor({
    id,
    estudianteId,
    cursoId,
    estado = 'activo',
    fechaInscripcion = new Date().toISOString(),
    cantidadAbonada,
    transaccionId,
    fechaCancelacion = null
  }) {
    this.id = id
    this.estudianteId = estudianteId
    this.cursoId = cursoId
    this.estado = estado
    this.fechaInscripcion = fechaInscripcion
    this.cantidadAbonada = cantidadAbonada
    this.transaccionId = transaccionId
    this.fechaCancelacion = fechaCancelacion
  }
}

module.exports = Inscripcion
