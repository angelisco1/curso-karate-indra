const express = require('express');
const router = express.Router();

// GET /api/cursos - Listar todos los cursos con filtros opcionales
router.get('/', (req, res) => {
  const { categoria, nivel, precioMax } = req.query;
  let cursos = req.db.cursos;

  if (categoria) {
    cursos = cursos.filter(c => c.categoria === categoria);
  }
  if (nivel) {
    cursos = cursos.filter(c => c.nivel === nivel);
  }
  if (precioMax) {
    cursos = cursos.filter(c => c.precio <= parseFloat(precioMax));
  }

  res.json(cursos);
});

// GET /api/cursos/:id - Obtener detalle de un curso
router.get('/:id', (req, res) => {
  const curso = req.db.cursos.find(c => c.id === parseInt(req.params.id));

  if (!curso) {
    return res.status(404).json({ error: 'Curso no encontrado' });
  }

  res.json(curso);
});

// POST /api/cursos - Crear nuevo curso
router.post('/', (req, res) => {
  const { titulo, descripcion, categoria, nivel, precio, maxEstudiantes, fechaInicio, fechaFin } = req.body;

  // Validaciones
  if (!titulo || !descripcion || !categoria || !nivel || precio === undefined || !maxEstudiantes) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  if (precio <= 0) {
    return res.status(400).json({ error: 'El precio debe ser mayor a 0' });
  }

  if (new Date(fechaInicio) >= new Date(fechaFin)) {
    return res.status(400).json({ error: 'La fecha de inicio debe ser anterior a la fecha de fin' });
  }

  const nuevoCurso = {
    id: req.db.nextCursoId++,
    titulo,
    descripcion,
    categoria,
    nivel,
    precio: parseFloat(precio),
    maxEstudiantes: parseInt(maxEstudiantes),
    fechaInicio,
    fechaFin,
    inscritosCount: 0
  };

  req.db.cursos.push(nuevoCurso);
  res.status(201).json(nuevoCurso);
});

// PUT /api/cursos/:id - Actualizar curso completo
router.put('/:id', (req, res) => {
  const cursoIndex = req.db.cursos.findIndex(c => c.id === parseInt(req.params.id));

  if (cursoIndex === -1) {
    return res.status(404).json({ error: 'Curso no encontrado' });
  }

  const { titulo, descripcion, categoria, nivel, precio, maxEstudiantes, fechaInicio, fechaFin } = req.body;

  // Validaciones
  if (!titulo || !descripcion || !categoria || !nivel || precio === undefined || !maxEstudiantes) {
    return res.status(400).json({ error: 'Faltan campos requeridos' });
  }

  if (new Date(fechaInicio) >= new Date(fechaFin)) {
    return res.status(400).json({ error: 'La fecha de inicio debe ser anterior a la fecha de fin' });
  }

  req.db.cursos[cursoIndex] = {
    ...req.db.cursos[cursoIndex],
    titulo,
    descripcion,
    categoria,
    nivel,
    precio: parseFloat(precio),
    maxEstudiantes: parseInt(maxEstudiantes),
    fechaInicio,
    fechaFin
  };

  res.json(req.db.cursos[cursoIndex]);
});

// PATCH /api/cursos/:id - Actualizar curso parcialmente
router.patch('/:id', (req, res) => {
  const cursoIndex = req.db.cursos.findIndex(c => c.id === parseInt(req.params.id));

  if (cursoIndex === -1) {
    return res.status(404).json({ error: 'Curso no encontrado' });
  }

  const camposPermitidos = ['titulo', 'descripcion', 'precio', 'maxEstudiantes', 'fechaInicio', 'fechaFin'];
  const actualizaciones = {};

  camposPermitidos.forEach(campo => {
    if (req.body[campo] !== undefined) {
      actualizaciones[campo] = req.body[campo];
    }
  });

  // Validar fechas si están presentes
  const curso = req.db.cursos[cursoIndex];
  const fechaInicio = actualizaciones.fechaInicio || curso.fechaInicio;
  const fechaFin = actualizaciones.fechaFin || curso.fechaFin;

  if (new Date(fechaInicio) >= new Date(fechaFin)) {
    return res.status(400).json({ error: 'La fecha de inicio debe ser anterior a la fecha de fin' });
  }

  req.db.cursos[cursoIndex] = { ...curso, ...actualizaciones };
  res.json(req.db.cursos[cursoIndex]);
});

// DELETE /api/cursos/:id - Eliminar curso
router.delete('/:id', (req, res) => {
  const cursoIndex = req.db.cursos.findIndex(c => c.id === parseInt(req.params.id));

  if (cursoIndex === -1) {
    return res.status(404).json({ error: 'Curso no encontrado' });
  }

  // Verificar que no tenga inscripciones
  const tieneInscripciones = req.db.inscripciones.some(i => i.cursoId === parseInt(req.params.id));
  if (tieneInscripciones) {
    return res.status(400).json({ error: 'No se puede eliminar un curso con inscripciones' });
  }

  req.db.cursos.splice(cursoIndex, 1);
  res.status(204).send();
});

module.exports = router;
