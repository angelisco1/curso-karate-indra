Feature: Introducción

  Background:
    * def urlAPI = 'http://localhost:3000'


  # mvn test -Dkarate.options="classpath:examples/ejemplos/01-introduccion.feature"
  # mvn test "-Dkarate.options='classpath:examples/ejemplos/01-introduccion.feature'"
  Scenario: Hola mundo
    Given def texto = 'Hola mundo'
    Then print texto


  Scenario: Hola mundo con el logger
    * def texto = 'Hola mundo'
    * karate.log(texto)

  
  Scenario: Traza de error
    * def recurso = '/productos/1309'
    * karate.logger.error("No se ha encontrado el recurso: " + recurso)


  Scenario: Traza de warning y debug
    * def tiempoRespuesta = '20s'
    * karate.logger.warn("El tiempo de respuesta es demasiado alto: " + tiempoRespuesta)
    * def token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiYWRtaW4iOnRydWUsImlhdCI6MTUxNjIzOTAyMn0.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30'
    * karate.logger.debug("Token: " + token)

    # ERROR
    # WARN
    # INFO
    # DEBUG
    

  Scenario: Variables
    Given def nombre = 'Charly'
    And def apellido = 'Falco'
    And def edad = 39
    And def activo = false
    And def hobbies = ['leer', 'motos', 'escalada']
    And def direccion = { calle: 'C/ Norte', numero: 27, ciudad: 'Inventada' }
    And def usuario = { nombreCompleto: '#(nombre + " " + apellido)', edad: '#(edad)', activo: '#(activo)', hobbies: '#(hobbies)', direccion: '#(direccion)' }
    And def telefonoFijo = null
    Then karate.log("Usuario: ", usuario)
    And match usuario.edad == 39
    And match usuario.nombreCompleto == 'Charly Falco'
    # And match hobbies.length == 3
    # And match parseInt(hobbies.length) == 3
    And assert hobbies.length == 3
    And assert usuario.activo == false
    And match usuario.activo == false
    And match usuario.hobbies == ['leer', 'motos', 'escalada']
    And match karate.typeOf(usuario.activo) == 'boolean'
    # And match karate.sizeOf(usuario.hobbies) == 3


  Scenario: Usar variable de Background
    * print "URL de la API: ", urlAPI

    * def urlAPI = 'http://localhost:4000'
    * print "URL de la API: ", urlAPI

    * print "URL de la API 2: ", urlAPI2
    * def urlAPI2 = 'https://devel.jsonplaceholder.typicode.com/'
    * print "URL de la API 2: ", urlAPI


  Scenario: Validar XML
    * def tarjetaDeVisita = 
    """
    <tarjeta-visita>
      <nombre>Charly Falco</nombre>
      <email>cfalco@gmail.com</email>
    </tarjeta-visita>
    """
    * match tarjetaDeVisita/tarjeta-visita/email == "cfalco@gmail.com"
    * print "Tipo tarjeta de visita: ", karate.typeOf(tarjetaDeVisita)


  Scenario: Marcadores de tipos
    Given def nombre = 'Charly'
    And def apellido = 'Falco'
    And def edad = 39
    And def activo = false
    And def hobbies = ['leer', 'motos', 'escalada']
    And def direccion = { calle: 'C/ Norte', numero: 27, ciudad: 'Inventada' }
    And def telefonoFijo = null
    Then match nombre == '#string'
    And match edad == '#number'
    And match activo == '#boolean'
    And match hobbies == '#array'
    And match hobbies == '#[] #string'
    # ℹ️ Comprueba que hobbies es un array de 3 posiciones
    And match hobbies == '#[3]'
    # ℹ️ El _ es un placeholder que hace referencia a lo que hay a la izq del ==. Al ponerlo en el marcador entre [], estamos comparando con la longitud de la lista.
    And match hobbies == '#[_ > 0]'
    And match direccion == '#object'
    And match direccion.calle == '#present'
    And match direccion.pais == '#notpresent'
    And match direccion == {calle: '#string', numero: '#number', ciudad: '#string'}
    And match edad == '#notnull'
    And match telefonoFijo == '#null'

  Scenario: Marcadores de predicados
    Given def hobbies = ['leer', 'motos', 'escalada']
    And def direccion = { calle: 'C/ Norte', numero: 27, ciudad: 'Inventada' }
    Then match direccion.numero == '#? _ > 0 && _ < 200'
    And match hobbies == '#? _.length == 3'

  Scenario: Marcador de regexp
    Given def colorHexadecimal = '#FABADA'
    Then match colorHexadecimal == '#regex ^#[A-Fa-f0-9]{6}$'

  