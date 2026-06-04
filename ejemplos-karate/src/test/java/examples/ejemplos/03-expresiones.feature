Feature: Expresiones y embedded expressions

  Background:
    * def nombre = 'Charly'
    * def apellido = 'Falco'
    # * def fechaBaja = null
    * def fechaBaja = '12/12/2023'

    # * def crearUsuario = function(nombre) { return { nombre, email: `${nombre.toLowerCase()}@undercover.com`, timestamp: Date.now() } }
    * def crearUsuario = 
      """
      function(nombre) {
        return {
          nombre,
          email: `${nombre.toLowerCase()}@undercover.com`,
          timestamp: Date.now()
        }
      }
      """


  Scenario: String Interpolation y llamadas a métodos de los objetos JS
    * def nombreCompleto = `${nombre} ${apellido}`
    * match nombreCompleto == 'Charly Falco'

    * def username = `${nombre[0]}${apellido}`.toLowerCase()
    * match username == 'cfalco'


  Scenario: Operador ternario
    * def activo = fechaBaja == null ? true : false
    * match activo == false


  Scenario: Embedded expressions
    * def nombre = 'Charly'
    * def body = { nombre: '#(nombre)', email: '#(nombre.toLowerCase() + "@undercover.com")' }
    * print body
    * match body.nombre == 'Charly'
    * match body.email == 'charly@undercover.com'


  Scenario: Embedded expressions JSON multilinea
    * def nombre = 'Charly'
    * def salarioBase = 3500
    * def plusAportarPruebas = 1000
    * def body =
      """
      {
        nombre: '#(nombre)',
        email: '#(nombre.toLowerCase() + "@undercover.com")',
        sueldoDeMayo: '#((salarioBase + plusAportarPruebas) + "€")'
      }
      """
    * print body
    * match body.nombre == 'Charly'
    * match body.email == 'charly@undercover.com'

  
  Scenario: Funciones JS - sumar
    * def sumar = (n1, n2) => n1 + n2
    * def resultado = sumar(1, 10)
    * match resultado == 11
    * assert resultado == 11

  Scenario: Funciones JS - crearUsuario
    * def usuario = crearUsuario('Charly')
    * karate.log("Usuario: ", usuario)
    * match usuario.email == 'charly@undercover.com'
    * match usuario.timestamp == '#number'
