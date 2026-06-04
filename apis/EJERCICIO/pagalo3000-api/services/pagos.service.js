const {
  generarTransaccionId,
  generarAutorizacion,
  generarReembolsoId,
  debeRechazarPago,
  obtenerErrorAleatorio,
  obtenerUltimosDigitos
} = require('../utils/helpers')

const transaccionesRepo = require('../repositories/transacciones.repository')

// Procesar pago
const procesarPago = async (cantidad, moneda, tarjeta, referencia) => {
  const transaccionId = generarTransaccionId()
  const fechaTransaccion = new Date().toISOString()
  const ultimosDigitos = obtenerUltimosDigitos(tarjeta.numero)

  // Determinar si rechazar el pago (25% probabilidad)
  if (debeRechazarPago()) {
    return await crearTransaccionRechazada(
      transaccionId,
      cantidad,
      moneda,
      fechaTransaccion,
      ultimosDigitos,
      referencia
    )
  }

  // Pago exitoso
  return await crearTransaccionAprobada(
    transaccionId,
    cantidad,
    moneda,
    fechaTransaccion,
    ultimosDigitos,
    referencia
  )
}

// Crear transacción rechazada
const crearTransaccionRechazada = async (transaccionId, cantidad, moneda, fechaTransaccion, ultimosDigitos, referencia) => {
  const error = obtenerErrorAleatorio()

  const transaccionRechazada = {
    transaccionId,
    estado: 'rechazado',
    codigoError: error.codigo,
    mensaje: error.mensaje,
    cantidad,
    moneda: moneda || 'EUR',
    fechaTransaccion,
    ultimosDigitos,
    referencia
  }

  await transaccionesRepo.crearTransaccion(transaccionRechazada)
  return transaccionRechazada
}

// Crear transacción aprobada
const crearTransaccionAprobada = async (transaccionId, cantidad, moneda, fechaTransaccion, ultimosDigitos, referencia) => {
  const autorizacion = generarAutorizacion()

  const transaccionExitosa = {
    transaccionId,
    estado: 'aprobado',
    cantidad,
    moneda: moneda || 'EUR',
    fechaTransaccion,
    ultimosDigitos,
    autorizacion,
    referencia
  }

  await transaccionesRepo.crearTransaccion(transaccionExitosa)
  return transaccionExitosa
}

// Consultar transacción
const consultarTransaccion = async (transaccionId) => {
  return await transaccionesRepo.buscarPorTransaccionId(transaccionId)
}

// Procesar reembolso
const procesarReembolso = async (transaccion, cantidad, motivo) => {
  const cantidadReembolso = cantidad || transaccion.cantidad

  const reembolso = {
    reembolsoId: generarReembolsoId(),
    transaccionId: transaccion.transaccionId,
    cantidad: cantidadReembolso,
    motivo: motivo || 'Reembolso solicitado',
    estado: 'procesado',
    fechaReembolso: new Date().toISOString()
  }

  // Actualizar transacción como reembolsada
  await transaccionesRepo.actualizarTransaccion(transaccion.transaccionId, {
    cantidadReembolsado: cantidadReembolso
  })

  return reembolso
}

// Listar todas las transacciones
const listarTransacciones = async () => {
  return await transaccionesRepo.listarTodas()
}

module.exports = {
  procesarPago,
  consultarTransaccion,
  procesarReembolso,
  listarTransacciones
}
