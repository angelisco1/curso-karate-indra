Feature: Peticiones HTTP

  Background:
    * def urlApiSaludos = 'http://localhost:4001'

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
    And headers { 'Authorization': 'Bearer 1234', 'Otra': 'otra-header' }
    When method GET
    Then status 200

  Scenario: Get - enviando query params
    Given url urlApiSaludos
    And def nombre = 'Mike'
    And path 'api', 'saludar', nombre
    And param mayusculas = true
    When method GET
    Then status 200
