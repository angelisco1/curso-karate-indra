@ignore
Feature: Reset base de datos Cursos 3000

  Scenario: Resetear
    Given url 'http://localhost:3005'
    And path '/reset'
    When method POST
    Then status 200
