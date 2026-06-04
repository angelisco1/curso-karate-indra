@ignore
Feature: Reset de bases de datos

  Scenario: Resetear base de datos de Cursos 3000
    Given url 'http://localhost:3005'
    And path '/reset'
    When method POST
    Then status 200
    And match response.status == 'OK'

  Scenario: Resetear base de datos de Pagalo 3000
    Given url 'http://localhost:3006'
    And path '/reset'
    When method POST
    Then status 200
    And match response.status == 'OK'
