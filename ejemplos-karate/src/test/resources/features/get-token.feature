Feature: Get token

  Scenario: Get token
    Given url urlTienda3333
    And path 'auth/login'
    And request credenciales
    When method POST
    Then status 200
    And match response.token == '#present'
    And match response.token == '#string'
    And match response.user == { id: '#number', email: '#string', nombre: '#string', rol: '#string' }
    And def token = response.token