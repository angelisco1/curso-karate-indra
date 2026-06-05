Feature: DDT

  Background:
    * def urlApiSaludos = 'http://localhost:4001'

  # Scenario: Saludar a una persona en diferentes idiomas
  #   Given url urlApiSaludos
  #   And path 'api', 'saludo'
  #   And request
  #   """
  #   {
  #     "nombre": "Ángel",
  #     "idioma": "en"
  #   }
  #   """
  #   When method POST
  #   Then status 201
  #   And response.message == 'Hello Ángel!'

  Scenario Outline: Saludar a una persona en diferentes idiomas
    Given url urlApiSaludos
    And path 'api', 'saludo'
    And request
    """
    {
      "nombre": <nombre>,
      "idioma": <idioma>
    }
    """
    When method POST
    Then status 201
    And match response.mensaje == '<resultado>'

  Examples:
    | read('classpath:datos/saludos.json') |