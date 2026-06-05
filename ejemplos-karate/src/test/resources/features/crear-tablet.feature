Feature: Crear tablet

  Background:
    # ℹ️ Ahora nos la llevamos al karate-config.js
    # * def urlTienda3000 = 'http://localhost:3000'

  Scenario: Crear tablet
    Given url urlTienda3000
    And path 'productos'
    And header Content-Type = 'application/json'
    And request
    """
    {
      "nombre": "Tablet 13 pulgadas",
      "precio": 249.99,
      "imageUrl": "",
      "stock": 7,
      "categorias": [
        "tablets",
        "computación"
      ]
    }
    """
    When method POST
    Then status 201
    And karate.log("Producto creado: ", response)
    And def producto = response
