const { runQuery, getQuery, allQuery } = require('../config/database')

const findAll = async (filters = {}) => {
  let sql = 'SELECT * FROM cursos WHERE 1=1'
  const params = []

  if (filters.categoria) {
    sql += ' AND categoria = ?'
    params.push(filters.categoria)
  }
  if (filters.nivel) {
    sql += ' AND nivel = ?'
    params.push(filters.nivel)
  }
  if (filters.precioMax) {
    sql += ' AND precio <= ?'
    params.push(parseFloat(filters.precioMax))
  }

  return await allQuery(sql, params)
}

const findById = async (id) => {
  return await getQuery('SELECT * FROM cursos WHERE id = ?', [id])
}

const create = async (cursoData) => {
  const { titulo, descripcion, categoria, nivel, precio, maxEstudiantes, fechaInicio, fechaFin } = cursoData

  const result = await runQuery(
    `INSERT INTO cursos (titulo, descripcion, categoria, nivel, precio, maxEstudiantes, fechaInicio, fechaFin, inscritosCount)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)`,
    [titulo, descripcion, categoria, nivel, precio, maxEstudiantes, fechaInicio, fechaFin]
  )

  return await findById(result.lastID)
}

const update = async (id, cursoData) => {
  const curso = await findById(id)
  if (!curso) return null

  const fields = []
  const params = []

  Object.keys(cursoData).forEach(key => {
    if (cursoData[key] !== undefined) {
      fields.push(`${key} = ?`)
      params.push(cursoData[key])
    }
  })

  params.push(id)

  await runQuery(
    `UPDATE cursos SET ${fields.join(', ')} WHERE id = ?`,
    params
  )

  return await findById(id)
}

const deleteById = async (id) => {
  const result = await runQuery('DELETE FROM cursos WHERE id = ?', [id])
  return result.changes > 0
}

const incrementInscritosCount = async (id) => {
  await runQuery('UPDATE cursos SET inscritosCount = inscritosCount + 1 WHERE id = ?', [id])
  return await findById(id)
}

const decrementInscritosCount = async (id) => {
  await runQuery('UPDATE cursos SET inscritosCount = inscritosCount - 1 WHERE id = ? AND inscritosCount > 0', [id])
  return await findById(id)
}

module.exports = {
  findAll,
  findById,
  create,
  update,
  delete: deleteById,
  incrementInscritosCount,
  decrementInscritosCount
}
