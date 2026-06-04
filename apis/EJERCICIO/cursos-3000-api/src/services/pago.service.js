const axios = require('axios')
const config = require('../config/environment')
const { PaymentError, ServiceUnavailableError } = require('../utils/http-errors')

const procesarPago = async (cantidad, datosPago, referencia) => {
  try {
    const response = await axios.post(config.pagalo3000Url, {
      cantidad,
      moneda: 'EUR',
      tarjeta: datosPago,
      referencia
    })

    const pagoData = response.data

    if (pagoData.estado === 'rechazado') {
      throw new PaymentError('Pago rechazado', 402)
    }

    return pagoData
  } catch (error) {
    if (error instanceof PaymentError) {
      throw error
    }
    console.error('Error al procesar pago:', error.message)
    throw new ServiceUnavailableError('Error al conectar con el servicio de pagos')
  }
}

module.exports = {
  procesarPago
}
