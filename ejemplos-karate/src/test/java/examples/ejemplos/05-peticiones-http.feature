Feature: Peticiones HTTP

  Background:
    * def urlApiSaludos = 'http://localhost:4001'
    * def urlTypicode = 'https://jsonplaceholder.typicode.com'
    * def urlTienda3000 = 'http://localhost:3333'
    * def tokenTienda3000 = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJjZmFsY29AZ21haWwuY29tIiwicm9sIjoiYWRtaW4iLCJpYXQiOjE3ODA2NTAxNjUsImV4cCI6MTc4MDY1Mzc2NX0.ev-ogL4tmC_t4y3RBPGRdCp8s4Pgqlm4tw8362UOGho"

  Scenario: Get - Hola mundo
    # url -> definimos la url a la que hacer la petición
    Given url urlApiSaludos + '/api/hola'
    # method -> definimos el tipo de petición (GET, POST, PUT, PATCH, HEAD, DELETE...)
    When method GET
    # status -> recibimos el código de estado de la respuesta (2xx, 4xx, 5xx)
    Then status 200
    # response -> recibimos el cuerpo de la respuesta
    And response.mensaje == 'Hola Mundo desde Karate!!!'

  Scenario: Get - saludar a Charly
    Given url urlApiSaludos
    # path -> definimos el path que va detrás de la URL
    And path '/api/saludar/Charly'
    When method GET
    Then status 200
    And karate.log("response charly: ", response)
    And match response.mensaje == 'Hola Charly!'
    And match response.nombre == 'Charly'

  Scenario: Get - saludar a Mike
    Given url urlApiSaludos
    And def nombre = 'Mike'
    # path -> definimos el path que va detrás de la URL
    And path 'api', 'saludar', nombre
    When method GET
    Then status 200
    And karate.log("response mike: ", response)
    And match response.mensaje == 'Hola ' + nombre + '!'
    And match response.nombre == nombre

  Scenario: Get - enviando cabecera
    Given url urlApiSaludos
    And def nombre = 'Mike'
    And path 'api', 'saludar', nombre
    # And header 'Authorization' = 'Bearer 1234'
    # And header 'Otra' = 'otra-header'
    And headers { 'Authorization': 'Bearer 1234', 'Otra': 'otra-header' }
    When method GET
    Then status 200

  Scenario: Get - enviando query params
    Given url urlApiSaludos
    And def nombre = 'Mike'
    And path 'api', 'saludar', nombre
    And param mayusculas = true
    And param lang = 'en'
    When method GET
    Then status 200

  Scenario: Get - enviando query params
    Given url urlApiSaludos
    And def nombre = 'Mike'
    And path 'api', 'saludar', nombre
    And params { mayusculas: true, lang: 'en' }
    When method GET
    Then status 200

  Scenario: Enviar cookie
    Given url urlApiSaludos
    And path 'api', 'saludar', 'Charly'
    And cookie galletita = 'oreo'
    And cookie sessionId = '1234'
    When method GET
    Then status 200

    
  Scenario: Basic authentication
    * def Base64 = Java.type('java.util.Base64')
    * def usuario = "cfalco"
    * def password = "1234"
    * def token = Base64.encoder.encodeToString((usuario + ':' + password).getBytes())
    Given url urlApiSaludos
    And path 'api', 'saludar', 'Charly'
    And header Authorization = "Basic " + token
    When method GET
    Then status 200


  Scenario: Petición POST
    Given url urlTypicode
    And path 'posts'
    And request
      """
      {
        "userId": 3,
        "title": "Nueva IA aparece",
        "body": "Después de que ayer 4 empresas sacaran nuevos modelos de IA, hoy otra más..."
      }
      """
    When method POST
    Then status 201
    And match response contains { id: '#present' }


  Scenario: Petición al post 101
    * def postId = 101
    Given url urlTypicode
    And path 'posts', postId
    When method GET
    Then status 404


  Scenario: Get token
    Given url urlTienda3000
    And path 'auth/login'
    And request
    """
    {
      email: "cfalco@gmail.com",
      password: "cfalco@gmail.com"
    }
    """
    When method POST
    Then status 200
    And match response.token == '#present'
    And match response.token == '#string'
    And match response.user == { id: '#number', email: '#string', nombre: '#string', rol: '#string' }

  Scenario: Hay 4 productos de la categoria accesorios
    Given url urlTienda3000
    And path 'productos'
    And header Authorization = "Bearer " + tokenTienda3000
    And param categorias_like = "accesorios"
    When method GET
    Then status 200
    And match response == '#[4]'
    And def categorias = get response..categorias
    And karate.log('Categorias: ', categorias)
    And match each categorias contains 'accesorios'

