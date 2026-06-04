@ignore
Feature: Reset base de datos Pagalo 3000

  Scenario: Resetear
    Given url 'http://localhost:3006'
    And path '/reset'
    When method POST
    Then status 200
