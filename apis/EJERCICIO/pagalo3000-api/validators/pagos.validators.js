// Validar cantidad
const validarCantidad = (cantidad) => {
  if (!cantidad) {
    return { valido: false, error: 'El campo cantidad es requerido' }
  }

  if (cantidad <= 0) {
    return { valido: false, error: 'La cantidad debe ser mayor a 0' }
  }

  return { valido: true }
}

// Validar tarjeta
const validarTarjeta = (tarjeta) => {
  // Tarjeta requerida
  if (!tarjeta) {
    return { valido: false, error: 'El campo tarjeta es requerido' }
  }

  // Número de tarjeta requerido
  if (!tarjeta.numero) {
    return { valido: false, error: 'El número de tarjeta es requerido' }
  }

  // Formato de número de tarjeta (solo dígitos, 13-19 caracteres)
  const numeroLimpio = tarjeta.numero.replace(/\s/g, '')
  if (!/^\d{13,19}$/.test(numeroLimpio)) {
    return { valido: false, error: 'El número de tarjeta debe tener entre 13 y 19 dígitos' }
  }

  // CVV requerido
  if (!tarjeta.cvv) {
    return { valido: false, error: 'El CVV es requerido' }
  }

  // CVV debe ser numérico (3 o 4 dígitos)
  if (!/^\d{3,4}$/.test(tarjeta.cvv)) {
    return { valido: false, error: 'El CVV debe ser un número de 3 o 4 dígitos' }
  }

  // Fecha de expiración requerida
  if (!tarjeta.expiracion) {
    return { valido: false, error: 'La fecha de expiración es requerida' }
  }

  // Formato de fecha de expiración (MM/YY o MM/YYYY)
  if (!/^\d{2}\/\d{2,4}$/.test(tarjeta.expiracion)) {
    return { valido: false, error: 'El formato de expiración debe ser MM/YY o MM/YYYY' }
  }

  // Validar mes y fecha de expiración
  const [mesExp, añoExp] = tarjeta.expiracion.split('/')
  const añoCompleto = añoExp.length === 2 ? `20${añoExp}` : añoExp

  const mesExpiracion = parseInt(mesExp)
  const añoExpiracion = parseInt(añoCompleto)

  // Mes debe estar entre 01 y 12
  if (mesExpiracion < 1 || mesExpiracion > 12) {
    return { valido: false, error: 'El mes de expiración debe estar entre 01 y 12' }
  }

  // Fecha de expiración no puede ser en el pasado
  const fechaActual = new Date()
  const mesActual = fechaActual.getMonth() + 1
  const añoActual = fechaActual.getFullYear()

  if (añoExpiracion < añoActual || (añoExpiracion === añoActual && mesExpiracion < mesActual)) {
    return { valido: false, error: 'La tarjeta ha caducado' }
  }

  return { valido: true }
}

// Validar datos de reembolso
const validarReembolso = (cantidadReembolso, cantidadOriginal) => {
  if (cantidadReembolso > cantidadOriginal) {
    return {
      valido: false,
      error: 'La cantidad del reembolso no puede ser mayor a la cantidad de la transacción'
    }
  }

  return { valido: true }
}

module.exports = {
  validarCantidad,
  validarTarjeta,
  validarReembolso
}
