const express = require('express');
const router = express.Router();
const axios = require('axios');

const PAGALO3000_URL = 'http://localhost:3006/api/pagos';

// GET /api/inscripciones/:id - Obtener detalle de inscripción
router.get('/:id', (req, res) => {
  const inscripcion = req.db.inscripciones.find(i => i.id === parseInt(req.params.id));

  if (!inscripcion) {
    return res.status(404).json({ error: 'Inscripción no encontrada' });
  }

  // Enriquecer con datos del curso y estudiante
  const curso = req.db.cursos.find(c => c.id === inscripcion.cursoId);
  const estudiante = req.db.estudiantes.find(e => e.id === inscripcion.estudianteId);

  res.json({
    ...inscripcion,
    curso: curso ? { id: curso.id, titulo: curso.titulo, precio: curso.precio } : null,
    estudiante: estudiante ? { id: estudiante.id, nombre: estudiante.nombre, email: estudiante.email } : null
  });
});

// GET /api/cursos/:cursoId/inscripciones - Inscripciones de un curso
router.get('/cursos/:cursoId/inscripciones', (req, res) => {
  const curso = req.db.cursos.find(c => c.id === parseInt(req.params.cursoId));

  if (!curso) {
    return res.status(404).json({ error: 'Curso no encontrado' });
  }

  const inscripciones = req.db.inscripciones.filter(i => i.cursoId === parseInt(req.params.cursoId));

  // Enriquecer con datos del estudiante
  const inscripcionesDetalle = inscripciones.map(insc => {
    const estudiante = req.db.estudiantes.find(e => e.id === insc.estudianteId);
    return {
      ...insc,
      estudiante: estudiante ? { id: estudiante.id, nombre: estudiante.nombre, email: estudiante.email } : null
    };
  });

  res.json(inscripcionesDetalle);
});

// POST /api/inscripciones - Crear inscripción (matricularse)
router.post('/', async (req, res) => {
  const { estudianteId, cursoId, datosPago } = req.body;

  // Validaciones
  if (!estudianteId || !cursoId || !datosPago) {
    return res.status(400).json({ error: 'Faltan campos requeridos: estudianteId, cursoId, datosPago' });
  }

  const estudiante = req.db.estudiantes.find(e => e.id === estudianteId);
  if (!estudiante) {
    return res.status(404).json({ error: 'Estudiante no encontrado' });
  }

  const curso = req.db.cursos.find(c => c.id === cursoId);
  if (!curso) {
    return res.status(404).json({ error: 'Curso no encontrado' });
  }

  // Verificar que el curso no esté lleno
  if (curso.inscritosCount >= curso.maxEstudiantes) {
    return res.status(400).json({ error: 'El curso ha alcanzado la capacidad máxima' });
  }

  // Verificar que el estudiante no esté ya inscrito
  const yaInscrito = req.db.inscripciones.some(i =>
    i.estudianteId === estudianteId && i.cursoId === cursoId && i.estado !== 'cancelado'
  );
  if (yaInscrito) {
    return res.status(400).json({ error: 'El estudiante ya está inscrito en este curso' });
  }

  // Procesar pago con Pagalo 3000
  try {
    const pagoResponse = await axios.post(PAGALO3000_URL, {
      cantidad: curso.precio,
      moneda: 'EUR',
      tarjeta: datosPago,
      referencia: `CURSO-${cursoId}-EST-${estudianteId}`
    });

    const pagoData = pagoResponse.data;

    if (pagoData.estado === 'rechazado') {
      return res.status(402).json({
        error: 'Pago rechazado',
        detalle: pagoData.mensaje,
        codigoError: pagoData.codigoError
      });
    }

    // Crear inscripción
    const nuevaInscripcion = {
      id: req.db.nextInscripcionId++,
      estudianteId,
      cursoId,
      estado: 'activo',
      fechaInscripcion: new Date().toISOString(),
      cantidadAbonada: curso.precio,
      transaccionId: pagoData.transaccionId
    };

    req.db.inscripciones.push(nuevaInscripcion);

    // Actualizar contador del curso
    const cursoIndex = req.db.cursos.findIndex(c => c.id === curso.id);
    req.db.cursos[cursoIndex].inscritosCount++;

    // Enriquecer respuesta
    res.status(201).json({
      ...nuevaInscripcion,
      curso: { id: curso.id, titulo: curso.titulo },
      pago: {
        transaccionId: pagoData.transaccionId,
        estado: pagoData.estado,
        autorizacion: pagoData.autorizacion
      }
    });

  } catch (error) {
    console.error('Error al procesar pago:', error.message);
    return res.status(503).json({
      error: 'Error al conectar con el servicio de pagos',
      detalle: 'Por favor intenta nuevamente más tarde'
    });
  }
});

// PATCH /api/inscripciones/:id - Actualizar estado
router.patch('/:id', (req, res) => {
  const inscripcionIndex = req.db.inscripciones.findIndex(i => i.id === parseInt(req.params.id));

  if (inscripcionIndex === -1) {
    return res.status(404).json({ error: 'Inscripción no encontrada' });
  }

  const { estado } = req.body;

  if (!estado) {
    return res.status(400).json({ error: 'Falta el campo: estado' });
  }

  const estadosValidos = ['pendiente_pago', 'activo', 'completado', 'cancelado'];
  if (!estadosValidos.includes(estado)) {
    return res.status(400).json({ error: 'Estado inválido. Estados válidos: ' + estadosValidos.join(', ') });
  }

  const estadoAnterior = req.db.inscripciones[inscripcionIndex].estado;
  req.db.inscripciones[inscripcionIndex].estado = estado;

  // Si se cancela, decrementar contador del curso
  if (estadoAnterior !== 'cancelado' && estado === 'cancelado') {
    const inscripcion = req.db.inscripciones[inscripcionIndex];
    const cursoIndex = req.db.cursos.findIndex(c => c.id === inscripcion.cursoId);
    if (cursoIndex !== -1) {
      req.db.cursos[cursoIndex].inscritosCount--;
    }
  }

  res.json(req.db.inscripciones[inscripcionIndex]);
});

// DELETE /api/inscripciones/:id - Cancelar inscripción
router.delete('/:id', (req, res) => {
  const inscripcionIndex = req.db.inscripciones.findIndex(i => i.id === parseInt(req.params.id));

  if (inscripcionIndex === -1) {
    return res.status(404).json({ error: 'Inscripción no encontrada' });
  }

  const inscripcion = req.db.inscripciones[inscripcionIndex];

  // Cambiar estado a cancelado en lugar de eliminar
  req.db.inscripciones[inscripcionIndex].estado = 'cancelado';
  req.db.inscripciones[inscripcionIndex].fechaCancelacion = new Date().toISOString();

  // Decrementar contador del curso
  const cursoIndex = req.db.cursos.findIndex(c => c.id === inscripcion.cursoId);
  if (cursoIndex !== -1) {
    req.db.cursos[cursoIndex].inscritosCount--;
  }

  res.status(204).send();
});

module.exports = router;
