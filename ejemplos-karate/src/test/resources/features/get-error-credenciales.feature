Feature: Get token

  Scenario: Get token
    Given url urlTienda3333
    And path 'auth/login'
    And request credenciales
    When method POST