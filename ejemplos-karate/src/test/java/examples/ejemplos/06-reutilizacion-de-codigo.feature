Feature: Reutilización de scenarios, funcioenes, schemas...

  Background:
    * def agentes = read('classpath:datos/agentes.json')
    * def agenteSchema = read('classpath:schemas/agente.schema.json')
    * def usuarioSchema = read('classpath:schemas/usuario.schema.json')
    * def utils = read('classpath:utils/utils.js')
    # ℹ️ Ahora nos la llevamos al karate-config.js
    # * def urlTienda3000 = 'http://localhost:3000'


  Scenario: Reutilizando un schema
    * match each agentes == agenteSchema


  Scenario: Funciones JS - utils.crearUsuario
    * def usuario = utils.crearUsuario('Charly')
    * karate.log("Usuario: ", usuario)
    * match usuario.email == 'charly@undercover.com'
    * match usuario == usuarioSchema


  Scenario: Eliminar un producto

    * def resultadoCrearProducto = call read('classpath:features/crear-tablet.feature')
    * karate.log("Resultado: ", resultadoCrearProducto.producto)

    Given url urlTienda3000
    And path 'productos', resultadoCrearProducto.producto.id
    When method DELETE
    Then status 200

    # Given url resultadoCrearProducto.urlTienda3000
    Given url urlTienda3000
    And path 'productos', resultadoCrearProducto.producto.id
    When method GET
    Then status 404

  Scenario: Obtener un producto creado

    * def resultadoCrearProducto = call read('classpath:features/crear-producto.feature') { nombre: 'Xiaomi TV', precio: 60 }
    * karate.log("Resultado: ", resultadoCrearProducto.producto)

    # Given url resultadoCrearProducto.urlTienda3000
    Given url urlTienda3000
    And path 'productos', resultadoCrearProducto.producto.id
    When method GET
    Then status 200
    And match response.nombre == 'Xiaomi TV'
    And match response.precio == 60


  Scenario: Hay 4 productos de la categoria accesorios
    * def resultadoToken = call read('classpath:features/get-token.feature') { credenciales: {email: "cfalco@gmail.com", password: "cfalco@gmail.com"} }
  
    Given url urlTienda3333
    And path 'productos'
    And header Authorization = "Bearer " + resultadoToken.response.token
    And param categorias_like = "accesorios"
    When method GET
    Then status 200
    And match response == '#[4]'
    And def categorias = get response..categorias
    And karate.log('Categorias: ', categorias)
    And match each categorias contains 'accesorios'

  Scenario: Obtenemos un error al pasar unas credenciales invalidas
    * def resultadoToken = call read('classpath:features/get-error-credenciales.feature') { credenciales: {email: "cfalco@gmail.com", password: "cfalco1@gmail.com"} }
    * match resultadoToken.response.message contains 'Credenciales inválidas'