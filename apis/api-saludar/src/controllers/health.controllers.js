const healthService = require('../services/health.service');

const checkHealth = (req, res) => {
  const resultado = healthService.getEstado()
  res.json(resultado)
}

module.exports = {
  checkHealth
}
