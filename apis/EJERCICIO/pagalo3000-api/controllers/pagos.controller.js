const { procesarPago, consultarTransaccion, procesarReembolso, listarTransacciones } = require('../services/pagos.service')
const { validarCantidad, validarTarjeta, validarReembolso } = require('../validators/pagos.validators')

// POST /api/pagos - Procesar pago
const procesarPagoController = async (req, res) => {
  try {
    const { cantidad, moneda, tarjeta, referencia } = req.body

    // Validar cantidad
    const validacionCantidad = validarCantidad(cantidad)
    if (!validacionCantidad.valido) {
      return res.status(400).json({ error: validacionCantidad.error })
    }

    // Validar tarjeta
    const validacionTarjeta = validarTarjeta(tarjeta)
    if (!validacionTarjeta.valido) {
      return res.status(400).json({ error: validacionTarjeta.error })
    }

    // Procesar pago
    const transaccion = await procesarPago(cantidad, moneda, tarjeta, referencia)

    res.status(200).json(transaccion)
  } catch (error) {
    console.error('Error al procesar pago:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

// GET /api/pagos/:transaccionId - Consultar transacción
const consultarTransaccionController = async (req, res) => {
  try {
    const transaccion = await consultarTransaccion(req.params.transaccionId)

    if (!transaccion) {
      return res.status(404).json({ error: 'Transacción no encontrada' })
    }

    res.json(transaccion)
  } catch (error) {
    console.error('Error al consultar transacción:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

// POST /api/pagos/:transaccionId/reembolso - Reembolsar
const procesarReembolsoController = async (req, res) => {
  try {
    const transaccion = await consultarTransaccion(req.params.transaccionId)

    if (!transaccion) {
      return res.status(404).json({ error: 'Transacción no encontrada' })
    }

    if (transaccion.estado !== 'aprobado') {
      return res.status(400).json({ error: 'Solo se pueden reembolsar transacciones aprobadas' })
    }

    const { cantidad, motivo } = req.body
    const cantidadReembolso = cantidad || transaccion.cantidad

    // Validar cantidad de reembolso
    const validacion = validarReembolso(cantidadReembolso, transaccion.cantidad)
    if (!validacion.valido) {
      return res.status(400).json({ error: validacion.error })
    }

    // Procesar reembolso
    const reembolso = await procesarReembolso(transaccion, cantidad, motivo)

    res.status(201).json(reembolso)
  } catch (error) {
    console.error('Error al procesar reembolso:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

// GET /api/pagos - Listar todas las transacciones
const listarTransaccionesController = async (req, res) => {
  try {
    const transacciones = await listarTransacciones()
    res.json(transacciones)
  } catch (error) {
    console.error('Error al listar transacciones:', error)
    res.status(500).json({ error: 'Error interno del servidor' })
  }
}

module.exports = {
  procesarPagoController,
  consultarTransaccionController,
  procesarReembolsoController,
  listarTransaccionesController
}
