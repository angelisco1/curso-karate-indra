// Generar ID de transacción único
const generarTransaccionId = () => {
  return 'TXN-' + Math.random().toString(36).substring(2, 11).toUpperCase()
}

// Generar código de autorización
const generarAutorizacion = () => {
  return 'AUTH-' + Math.random().toString(36).substring(2, 8).toUpperCase()
}

// Generar ID de reembolso único
const generarReembolsoId = () => {
  return 'REF-' + Math.random().toString(36).substring(2, 11).toUpperCase()
}

// Determinar si el pago falla (25% probabilidad)
const debeRechazarPago = () => {
  return Math.random() < 0.25
}

// Obtener tipo de error aleatorio
const obtenerErrorAleatorio = () => {
  const errores = [
    { codigo: 'TARJETA_CADUCADA', mensaje: 'La tarjeta ha caducado' },
    { codigo: 'FONDOS_INSUFICIENTES', mensaje: 'No hay fondos suficientes en la cuenta' },
    { codigo: 'TARJETA_BLOQUEADA', mensaje: 'La tarjeta ha sido bloqueada por el banco' },
    { codigo: 'CVV_INVALIDO', mensaje: 'El código CVV no es válido' }
  ]
  return errores[Math.floor(Math.random() * errores.length)]
}

// Obtener últimos 4 dígitos de tarjeta
const obtenerUltimosDigitos = (numeroTarjeta) => {
  return numeroTarjeta.replace(/\s/g, '').slice(-4)
}

module.exports = {
  generarTransaccionId,
  generarAutorizacion,
  generarReembolsoId,
  debeRechazarPago,
  obtenerErrorAleatorio,
  obtenerUltimosDigitos
}
