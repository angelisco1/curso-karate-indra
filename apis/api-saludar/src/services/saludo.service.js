const SALUDOS = {
  'es': 'Hola',
  'en': 'Hello',
  'fr': 'Bonjour',
  'de': 'Hallo'
}

const getSaludoHolaMundo = () => {
  return {
    mensaje: 'Hola Mundo desde Karate!!!'
  }
}

const getSaludoPorNombre = (nombre) => {
  return {
    mensaje: `Hola ${nombre}!`,
    nombre: nombre
  }
}

const crearSaludoPersonalizado = (nombre, idioma) => {
  const saludo = SALUDOS[idioma] || SALUDOS['es']
  return {
    mensaje: `${saludo} ${nombre}!`,
    idioma: idioma,
    nombre: nombre
  }
}

module.exports = {
  getSaludoHolaMundo,
  getSaludoPorNombre,
  crearSaludoPersonalizado
}
