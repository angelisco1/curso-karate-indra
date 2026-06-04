function fn() {
  var env = karate.env; // get java system property 'karate.env'
  karate.log('karate.env =', env);

  if (!env) {
    env = 'dev';
  }

  var config = {
    urlCursos: 'http://localhost:3005',
    urlPagos: 'http://localhost:3006'
  };

  // Resetear bases de datos antes de ejecutar los tests
  karate.log('Reseteando bases de datos...');

  // Reset de Cursos 3000
  var resetCursos = karate.call('classpath:karate/reset-cursos.feature');
  karate.log('Reset Cursos 3000:', resetCursos.response ? 'OK' : 'ERROR');

  // Reset de Pagalo 3000
  var resetPagos = karate.call('classpath:karate/reset-pagos.feature');
  karate.log('Reset Pagalo 3000:', resetPagos.response ? 'OK' : 'ERROR');

  return config;
}
