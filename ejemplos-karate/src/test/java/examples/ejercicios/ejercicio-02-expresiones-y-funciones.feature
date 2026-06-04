Feature: Ejercicio 2: validar tickets loteria

  Background:
    * def generarTicketLoteria =
      """
      function(tipo) {
        const sorteos = {
          primitiva:  { numeros: 6, max: 49, reintegro: true,  estrellas: 0 },
          bonoloto:   { numeros: 6, max: 49, reintegro: true,  estrellas: 0 },
          euromillon: { numeros: 5, max: 50, reintegro: false, estrellas: 2, maxEstrella: 12 }
        }

        const config = sorteos[tipo]
        if (!config) {
          return { error: 'Sorteo no valido: ' + tipo }
        }

        const numeros = []
        while (numeros.length < config.numeros) {
          const n = Math.floor(Math.random() * config.max) + 1
          if (numeros.indexOf(n) === -1) {
            numeros.push(n)
          }
        }
        numeros.sort(function(a, b) { return a - b })

        const resultado = { sorteo: tipo, numeros: numeros }

        if (config.reintegro) {
          resultado.reintegro = Math.floor(Math.random() * 10)
        }

        if (config.estrellas > 0) {
          const estrellas = []
          while (estrellas.length < config.estrellas) {
            const e = Math.floor(Math.random() * config.maxEstrella) + 1
            if (estrellas.indexOf(e) === -1) {
              estrellas.push(e)
            }
          }
          estrellas.sort(function(a, b) { return a - b })
          resultado.estrellas = estrellas
        }

        return resultado
      }
      """

  
  Scenario: La bonoloto tiene 6 números y reintegro, pero no tiene estrellas
    * def ticketBonoloto = generarTicketLoteria('bonoloto')
    * karate.log("Ticket bonoloto: ", ticketBonoloto)
    * match ticketBonoloto.reintegro == '#present'
    * match ticketBonoloto.reintegro == '#number'
    * match ticketBonoloto.reintegro == '#? _ >= 0 && _ < 10'
    * match ticketBonoloto.estrellas == '#notpresent'
    * match ticketBonoloto.numeros == '#[6]'
    # * match ticketBonoloto.numeros.length == 6
    # * match parseInt(ticketBonoloto.numeros.length) == 6
    * assert ticketBonoloto.numeros.length == 6
    * match each ticketBonoloto.numeros == '#? _ > 0 && _ < 50'


  Scenario: El euromillón tiene 5 números, no tiene reintegro y tiene 2 estrellas (entre 1 y 12)
    * def ticketEuromillon = generarTicketLoteria('euromillon')
    * karate.log("Ticket euromillón: ", ticketEuromillon)
    * match ticketEuromillon.reintegro == '#notpresent'
    * match ticketEuromillon.estrellas == '#present'
    * match each ticketEuromillon.estrellas == '#number'
    * match each ticketEuromillon.estrellas == '#? _ > 0 && _ <= 12'
    * match ticketEuromillon.numeros == '#[5]'
    * match each ticketEuromillon.numeros == '#? _ > 0 && _ <= 50'
  

  Scenario: La primitiva tiene 6 números, tiene reintegro y no tiene estrellas
    * def ticketPrimitiva = generarTicketLoteria('primitiva')
    * karate.log("Ticket primitiva: ", ticketPrimitiva)
    * match ticketPrimitiva.reintegro == '#present'
    * match ticketPrimitiva.reintegro == '#number'
    * match ticketPrimitiva.reintegro == '#? _ >= 0 && _ < 10'
    * match ticketPrimitiva.estrellas == '#notpresent'
    * match ticketPrimitiva.numeros == '#[6]'
    * match each ticketPrimitiva.numeros == '#? _ > 0 && _ < 50'


  Scenario: Debería dar un error si pasamos un sorteo que no reconoce la función (ej. quiniela)
    * def ticketQuiniela = generarTicketLoteria('quiniela')
    * karate.log("Ticket quiniela: ", ticketQuiniela)
    * match ticketQuiniela.error == 'Sorteo no valido: quiniela'