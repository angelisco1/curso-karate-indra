Feature: Ejercicio de variables, tipos y marcadores

  Background:
    * def reqBody =
      """
      {
          "nombre": "Charly Falco",
          "email": "cfalco@gmail.com",
          "password": "3sto-3s-un-s3cr3to"
      }
      """

    * def respBody =
      """
      {
          "nombre": "Charly Falco",
          "email": "cfalco@gmail.com",
          "id": 123
      }
      """

    * def producto =
      """
      {
        "id": 1,
        "nombre": "Perrito piloto",
        "precio": 49.90,
        "descuento": 15,
        "stock": 10,
        "valoracion": 4.8
      }
      """

  Scenario: Validar que el reqBody lleva los campos correctos (nombre, email y password)
    # nombre tiene que tener un valor, no puede ser null
    * match reqBody.nombre == '#string'
    * match reqBody.nombre == '#notnull'
    * match reqBody.nombre != null
    * match reqBody.nombre == '#? _.length > 0'
    * match reqBody.nombre != ''
    * match reqBody.nombre == '#? _.length > 0 && _ != null'

    # email tiene formato de email 
    * match reqBody.email == '#regex ^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]{2,4}$'

    # password tiene una longitud minima de 8
    * match reqBody.password == '#? _.length >= 8'


  Scenario: Validar que el respBody lleva los campos correctos
    # nombre tiene que tener un valor, no puede ser null
    * match respBody.nombre == '#string'
    * match respBody.nombre == '#notnull'
    * match respBody.nombre != null
    * match respBody.nombre == '#? _.length > 0'
    * match respBody.nombre != ''
    * match respBody.nombre == '#? _.length > 0 && _ != null'

    # email tiene formato de email 
    * match respBody.email == '#regex ^[a-zA-Z0-9]+@[a-zA-Z0-9]+\.[a-zA-Z0-9]{2,4}$'

    # password no tiene que venir en la respuesta
    * match respBody.password == '#notpresent'

    # id tiene que venir en la respuesta, es un número
    * match respBody.id == '#present'
    * match respBody.id == '#number'


  Scenario: Validar identificador tipo UUID
    * def usuarioId = '55ba7278-0876-41f6-a8c3-e69b4acab769'
    * match usuarioId == '#uuid'


  Scenario: Validar que el producto cumple con las reglas de negocio
    # No puede tener precio ni stock negativo
    * match producto.precio == '#? _ >= 0'
    * match producto.stock == '#? _ >= 0'

    # El descuento está entre 0 y 100
    * match producto.descuento == '#? _ >= 0 && _ <= 100'

    # La valoración está entre 0 y 5
    * match producto.valoracion == '#? _ >= 0 && _ <= 5'

    # Mostrar el valor total de comprarlo 5 veces
    * def total = producto.precio * 5
    * karate.log(`${producto.nombre}: 5 x ${producto.precio.toFixed(2)}€ = ${total.toFixed(2)}€`)
    * karate.log(producto.nombre + ": 5 x " + producto.precio.toFixed(2) + "€ = " + total.toFixed(2) + "€")