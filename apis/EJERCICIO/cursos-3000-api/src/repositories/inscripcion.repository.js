const { runQuery, getQuery, allQuery } = require('../config/database')

const findAll = async () => {
  return await allQuery('SELECT * FROM inscripciones', [])
}

const findById = async (id) => {
  return await getQuery('SELECT * FROM inscripciones WHERE id = ?', [id])
}

const findByEstudianteId = async (estudianteId) => {
  return await allQuery('SELECT * FROM inscripciones WHERE estudianteId = ?', [estudianteId])
}

const findByCursoId = async (cursoId) => {
  return await allQuery('SELECT * FROM inscripciones WHERE cursoId = ?', [cursoId])
}

const findActiveByEstudianteCurso = async (estudianteId, cursoId) => {
  return await getQuery(
    'SELECT * FROM inscripciones WHERE estudianteId = ? AND cursoId = ? AND estado != ?',
    [estudianteId, cursoId, 'cancelado']
  )
}

const hasActiveInscripciones = async (estudianteId) => {
  const result = await getQuery(
    'SELECT COUNT(*) as count FROM inscripciones WHERE estudianteId = ? AND estado = ?',
    [estudianteId, 'activo']
  )
  return result.count > 0
}

const hasInscripciones = async (cursoId) => {
  const result = await getQuery(
    'SELECT COUNT(*) as count FROM inscripciones WHERE cursoId = ?',
    [cursoId]
  )
  return result.count > 0
}

const create = async (inscripcionData) => {
  const { estudianteId, cursoId, estado, cantidadAbonada, transaccionId } = inscripcionData
  const fechaInscripcion = new Date().toISOString()

  const result = await runQuery(
    `INSERT INTO inscripciones (estudianteId, cursoId, estado, fechaInscripcion, cantidadAbonada, transaccionId)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [estudianteId, cursoId, estado, fechaInscripcion, cantidadAbonada, transaccionId]
  )

  return await findById(result.lastID)
}

const update = async (id, inscripcionData) => {
  const inscripcion = await findById(id)
  if (!inscripcion) return null

  const fields = []
  const params = []

  Object.keys(inscripcionData).forEach(key => {
    if (inscripcionData[key] !== undefined) {
      fields.push(`${key} = ?`)
      params.push(inscripcionData[key])
    }
  })

  params.push(id)

  await runQuery(
    `UPDATE inscripciones SET ${fields.join(', ')} WHERE id = ?`,
    params
  )

  return await findById(id)
}

const updateEstado = async (id, estado) => {
  await runQuery('UPDATE inscripciones SET estado = ? WHERE id = ?', [estado, id])
  return await findById(id)
}

const cancel = async (id) => {
  const fechaCancelacion = new Date().toISOString()
  await runQuery(
    'UPDATE inscripciones SET estado = ?, fechaCancelacion = ? WHERE id = ?',
    ['cancelado', fechaCancelacion, id]
  )
  return await findById(id)
}

module.exports = {
  findAll,
  findById,
  findByEstudianteId,
  findByCursoId,
  findActiveByEstudianteCurso,
  hasActiveInscripciones,
  hasInscripciones,
  create,
  update,
  updateEstado,
  cancel
}
