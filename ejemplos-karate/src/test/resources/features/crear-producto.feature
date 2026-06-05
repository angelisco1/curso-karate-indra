Feature: Crear Producto

  Background:
    # ℹ️ Ahora nos la llevamos al karate-config.js
    # * def urlTienda3000 = 'http://localhost:3000'

  Scenario: Crear producto
    Given url urlTienda3000
    And path 'productos'
    And header Content-Type = 'application/json'
    And request
    """
    {
      "nombre": '#(nombre)',
      "precio": '#(precio)',
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
