const saludoService = require('../services/saludo.service')

const getSaludoHolaMundo = (req, res) => {
  const resultado = saludoService.getSaludoHolaMundo()
  res.json(resultado)
}

const getSaludoPorNombre = (req, res) => {
  const { nombre } = req.params
  const resultado = saludoService.getSaludoPorNombre(nombre)
  res.json(resultado)
}

const crearSaludo = (req, res) => {
  const { nombre, idioma } = req.body
  const resultado = saludoService.crearSaludoPersonalizado(nombre, idioma)
  res.status(201).json(resultado)
}

module.exports = {
  getSaludoHolaMundo,
  getSaludoPorNombre,
  crearSaludo
}
