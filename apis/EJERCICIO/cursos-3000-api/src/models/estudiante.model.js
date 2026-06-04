// Modelo de Estudiante - Define la estructura de un estudiante

class Estudiante {
  constructor({
    id,
    nombre,
    email,
    password,
    telefono = null,
    direccion = null,
    fechaRegistro = new Date().toISOString()
  }) {
    this.id = id
    this.nombre = nombre
    this.email = email
    this.password = password
    this.telefono = telefono
    this.direccion = direccion
    this.fechaRegistro = fechaRegistro
  }

  // Método para obtener datos sin password
  toSafeObject() {
    const { password, ...safeData } = this
    return safeData
  }
}

module.exports = Estudiante
