const { runQuery, getQuery, allQuery } = require('../config/database')

const findAll = async () => {
  return await allQuery('SELECT * FROM estudiantes', [])
}

const findById = async (id) => {
  return await getQuery('SELECT * FROM estudiantes WHERE id = ?', [id])
}

const findByEmail = async (email) => {
  return await getQuery('SELECT * FROM estudiantes WHERE email = ?', [email])
}

const emailExists = async (email, excludeId = null) => {
  let sql = 'SELECT COUNT(*) as count FROM estudiantes WHERE email = ?'
  const params = [email]

  if (excludeId) {
    sql += ' AND id != ?'
    params.push(excludeId)
  }

  const result = await getQuery(sql, params)
  return result.count > 0
}

const create = async (estudianteData) => {
  const { nombre, email, password, telefono = null } = estudianteData
  const fechaRegistro = new Date().toISOString()

  const result = await runQuery(
    `INSERT INTO estudiantes (nombre, email, password, telefono, fechaRegistro)
     VALUES (?, ?, ?, ?, ?)`,
    [nombre, email, password, telefono, fechaRegistro]
  )

  return await findById(result.lastID)
}

const update = async (id, estudianteData) => {
  const estudiante = await findById(id)
  if (!estudiante) return null

  const fields = []
  const params = []

  Object.keys(estudianteData).forEach(key => {
    if (estudianteData[key] !== undefined) {
      fields.push(`${key} = ?`)
      params.push(estudianteData[key])
    }
  })

  params.push(id)

  await runQuery(
    `UPDATE estudiantes SET ${fields.join(', ')} WHERE id = ?`,
    params
  )

  return await findById(id)
}

const deleteById = async (id) => {
  const result = await runQuery('DELETE FROM estudiantes WHERE id = ?', [id])
  return result.changes > 0
}

module.exports = {
  findAll,
  findById,
  findByEmail,
  emailExists,
  create,
  update,
  delete: deleteById
}
