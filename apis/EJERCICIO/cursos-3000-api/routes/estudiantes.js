const express = require('express');
const router = express.Router();

// GET /api/estudiantes/:id - Obtener perfil de estudiante
router.get('/:id', (req, res) => {
  const estudiante = req.db.estudiantes.find(e => e.id === parseInt(req.params.id));

  if (!estudiante) {
    return res.status(404).json({ error: 'Estudiante no encontrado' });
  }

  // No devolver el password
  const { password, ...estudianteSinPassword } = estudiante;
  res.json(estudianteSinPassword);
});

// GET /api/estudiantes/:id/inscripciones - Inscripciones del estudiante
router.get('/:id/inscripciones', (req, res) => {
  const estudiante = req.db.estudiantes.find(e => e.id === parseInt(req.params.id));

  if (!estudiante) {
    return res.status(404).json({ error: 'Estudiante no encontrado' });
  }

  const inscripciones = req.db.inscripciones.filter(i => i.estudianteId === parseInt(req.params.id));

  // Enriquecer con datos del curso
  const inscripcionesDetalle = inscripciones.map(insc => {
    const curso = req.db.cursos.find(c => c.id === insc.cursoId);
    return {
      ...insc,
      curso: curso ? { id: curso.id, titulo: curso.titulo, precio: curso.precio } : null
    };
  });

  res.json(inscripcionesDetalle);
});

// POST /api/estudiantes - Crear cuenta de estudiante
router.post('/', (req, res) => {
  const { nombre, email, password, telefono } = req.body;

  // Validaciones
  if (!nombre || !email || !password) {
    return res.status(400).json({ error: 'Faltan campos requeridos: nombre, email, password' });
  }

  // Validar email único
  const emailExiste = req.db.estudiantes.some(e => e.email === email);
  if (emailExiste) {
    return res.status(400).json({ error: 'El email ya está registrado' });
  }

  // Validar formato de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: 'Email inválido' });
  }

  const nuevoEstudiante = {
    id: req.db.nextEstudianteId++,
    nombre,
    email,
    password, // En producción debería hashearse
    telefono: telefono || null,
    fechaRegistro: new Date().toISOString()
  };

  req.db.estudiantes.push(nuevoEstudiante);

  // No devolver el password
  const { password: _, ...estudianteSinPassword } = nuevoEstudiante;
  res.status(201).json(estudianteSinPassword);
});

// PUT /api/estudiantes/:id - Actualizar perfil completo
router.put('/:id', (req, res) => {
  const estudianteIndex = req.db.estudiantes.findIndex(e => e.id === parseInt(req.params.id));

  if (estudianteIndex === -1) {
    return res.status(404).json({ error: 'Estudiante no encontrado' });
  }

  const { nombre, email, telefono, direccion } = req.body;

  if (!nombre || !email) {
    return res.status(400).json({ error: 'Faltan campos requeridos: nombre, email' });
  }

  // Validar email único (excepto para el propio estudiante)
  const emailEnUso = req.db.estudiantes.some(e => e.email === email && e.id !== parseInt(req.params.id));
  if (emailEnUso) {
    return res.status(400).json({ error: 'El email ya está en uso por otro estudiante' });
  }

  const estudianteActual = req.db.estudiantes[estudianteIndex];
  req.db.estudiantes[estudianteIndex] = {
    ...estudianteActual,
    nombre,
    email,
    telefono: telefono || estudianteActual.telefono,
    direccion: direccion || estudianteActual.direccion
  };

  const { password: _, ...estudianteSinPassword } = req.db.estudiantes[estudianteIndex];
  res.json(estudianteSinPassword);
});

// PATCH /api/estudiantes/:id - Actualizar parcialmente
router.patch('/:id', (req, res) => {
  const estudianteIndex = req.db.estudiantes.findIndex(e => e.id === parseInt(req.params.id));

  if (estudianteIndex === -1) {
    return res.status(404).json({ error: 'Estudiante no encontrado' });
  }

  const camposPermitidos = ['nombre', 'email', 'telefono', 'direccion'];
  const actualizaciones = {};

  camposPermitidos.forEach(campo => {
    if (req.body[campo] !== undefined) {
      actualizaciones[campo] = req.body[campo];
    }
  });

  // Validar email si se está actualizando
  if (actualizaciones.email) {
    const emailEnUso = req.db.estudiantes.some(e => e.email === actualizaciones.email && e.id !== parseInt(req.params.id));
    if (emailEnUso) {
      return res.status(400).json({ error: 'El email ya está en uso por otro estudiante' });
    }
  }

  req.db.estudiantes[estudianteIndex] = { ...req.db.estudiantes[estudianteIndex], ...actualizaciones };

  const { password: _, ...estudianteSinPassword } = req.db.estudiantes[estudianteIndex];
  res.json(estudianteSinPassword);
});

// DELETE /api/estudiantes/:id - Eliminar cuenta
router.delete('/:id', (req, res) => {
  const estudianteIndex = req.db.estudiantes.findIndex(e => e.id === parseInt(req.params.id));

  if (estudianteIndex === -1) {
    return res.status(404).json({ error: 'Estudiante no encontrado' });
  }

  // Verificar que no tenga inscripciones activas
  const tieneInscripcionesActivas = req.db.inscripciones.some(i =>
    i.estudianteId === parseInt(req.params.id) && i.estado === 'activo'
  );

  if (tieneInscripcionesActivas) {
    return res.status(400).json({ error: 'No se puede eliminar un estudiante con inscripciones activas' });
  }

  req.db.estudiantes.splice(estudianteIndex, 1);
  res.status(204).send();
});

module.exports = router;
