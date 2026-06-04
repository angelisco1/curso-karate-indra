const path = require('path');
const express = require('express');
const jsonServer = require('json-server');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

const app = express();
const router = jsonServer.router(path.join(__dirname, 'db.json'));
const middlewares = jsonServer.defaults();

const JWT_SECRET = process.env.JWT_SECRET || 'mi_secreto_local';
const TOKEN_EXPIRES_IN = '1h';

app.use(express.json());
app.use(middlewares);

// Al arrancar: hashear contraseñas almacenadas en claro (si existen)
(() => {
  const db = router.db; // lowdb
  const usuarios = db.get('usuarios').value() || [];
  usuarios.forEach((u) => {
    const pass = u.password || u.email || '';
    // si ya parece un hash bcrypt, saltar
    if (typeof pass === 'string' && pass.startsWith('$2')) return;

    const plaintext = pass || u.email;
    const hash = bcrypt.hashSync(plaintext, 10);
    db.get('usuarios').find({ id: u.id }).assign({ password: hash }).write();
    console.log(`Hasheada contraseña del usuario ${u.email}`);
  });
})();

// Ruta de login: recibe { email, password }
app.post('/auth/login', (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: 'email y password requeridos' });
  }

  const db = router.db; // lowdb instance
  const user = db.get('usuarios').find({ email }).value();
  if (!user) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }

  const valid = bcrypt.compareSync(password, user.password);
  if (!valid) {
    return res.status(401).json({ message: 'Credenciales inválidas' });
  }

  const token = jwt.sign({ id: user.id, email: user.email, rol: user.rol }, JWT_SECRET, { expiresIn: TOKEN_EXPIRES_IN });

  return res.json({ token, user: { id: user.id, email: user.email, nombre: user.nombre, rol: user.rol } });
});

// Middleware para proteger rutas (excepto las que empiecen por /auth)
app.use((req, res, next) => {
  if (req.path.startsWith('/auth')) return next();

  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token requerido' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Token inválido' });
  }
});

app.get('/productos', (req, res) => {
  const { categorias_like: categoria, ...rest } = req.query
  const db = router.db
  let productos = db.get('productos').value()

  if (categoria) {
    productos = productos.filter(p =>
      Array.isArray(p.categorias) && p.categorias.includes(categoria)
    )
  }

  res.json(productos)
})

// Montar el router de json-server para recursos REST
app.use(router);

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => console.log(`JSON Server con auth escuchando en http://localhost:${PORT}`));
