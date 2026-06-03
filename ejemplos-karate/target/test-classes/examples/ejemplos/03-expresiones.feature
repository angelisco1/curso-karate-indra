Feature: Expresiones y embedded expressions

  Background:
    * def nombre = 'Charly'
    * def apellido = 'Falco'
    # * def fechaBaja = null
    * def fechaBaja = '12/12/2023'


  Scenario: String Interpolation y llamadas a métodos de los objetos JS
    * def nombreCompleto = `${nombre} ${apellido}`
    * match nombreCompleto == 'Charly Falco'

    * def username = `${nombre[0]}${apellido}`.toLowerCase()
    * match username == 'cfalco'


  Scenario: Operador ternario
    * def activo = fechaBaja == null ? true : false
    * match activo == false


  