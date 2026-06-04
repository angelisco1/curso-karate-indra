Feature: Validaciones de listas y JSONs complejos

  Background:
    * def agentes = read('classpath:datos/agentes.json')
    * def maquina = read('classpath:datos/maquina-expendedora.json')

  Scenario: Comprobar que Charles tiene "Mongols MC" en organizaciones
    * def primerAgente = agentes[0]
    * match primerAgente.organizaciones contains "Mongols MC"
    * match primerAgente.organizaciones == ["Vagos MC", "Mongols MC"]


  Scenario: Comprobar que todos los agentes tienen una agencia
    * match each agentes contains { agencia: '#string', email: '#string' }


  Scenario: Comprobar que "Jay Dobyns" está en activo
    * def emailJay = 'dobyns@atf.gov'
    # Find devuelve el primer item que cumple una condición
    * def agente = agentes.find((agente) => agente.email == emailJay)
    * karate.log("Jay: ", agente)
    * match agente.activo == true


  Scenario: Comprobar que hay 3 agentes que han pertenecido a la "ATF"
    * def agencia = "ATF"
    # Filter devuelve una lista con los items que cumplen una condición
    * def agentesDeATF = agentes.filter((agente) => agente.agencia == agencia)
    * match agentesDeATF == '#[3]'
    * match each agentesDeATF contains { agencia: '#string' }

  Scenario: Comprobar que todos los agentes tienen un schema concreto
    * match each agentes == 
      """
      {
        "id": '#number',
        "nombre": '#string',
        "email": '#string',
        "edad": '#number',
        "activo": '#boolean',
        "organizaciones": '#[] #string',
        "añosServicio": '#number',
        "agencia": '#string',
        "identidadEncubierta": '#string',
        "casosPrincipales": '#array'
      }
      """

  Scenario: Comprobar que hay 3 agentes que tienen más de 60 años (usando funciones de JS)
    * def agentesMayores60 = agentes.filter((agente) => agente.edad > 60)
    * match agentesMayores60 == '#[3]'

    * def nombresAgentesMayores60 = agentesMayores60.map(agente => agente.nombre)
    * karate.log("nombresAgentesMayores60: ", nombresAgentesMayores60)

    # Con el == tienen que estar en el mismo orden
    * match nombresAgentesMayores60 == ['Joseph Pistone', 'William Queen', 'Alex Caine']

    # Con el contains no se tiene en cuenta el orden
    * match nombresAgentesMayores60 contains ['Joseph Pistone', 'Alex Caine', 'William Queen']
  

  Scenario: Comprobar los nombres de los agentes mayores de 60 años (usando JSONPath)
    * def agentesMayores60 = agentes.filter((agente) => agente.edad > 60)
    * match agentesMayores60[*].nombre == ['Joseph Pistone', 'William Queen', 'Alex Caine']
    * match agentesMayores60[*].nombre contains ['Alex Caine', 'Joseph Pistone', 'William Queen']


  Scenario: Las luces están parcialmente fundidas (JSONPath directo)
    * match maquina.estado.luces_incandescentes == 'FUNDIDAS_PARCIAL'


  Scenario: El primer producto de consolación con es el "Perrito que mueve la cabeza" (JSONPath directo)
    * match maquina.inventario.secciones[2].productos[0].nombre == 'Perrito que mueve la cabeza'


  Scenario: El producto de consolación con id "C-501". es el "Perrito que mueve la cabeza" (JSONPath con filtros)
    # El get se usa para hacer la búsqueda con JSONPath cuando va a la derecha del "="
    * def productosId501 = get maquina.inventario.secciones[?(@.tipo=='Consolación')].productos[?(@.id_prod=='C-501')].nombre
    * match productosId501[0] == 'Perrito que mueve la cabeza'
    * match productosId501 == ['Perrito que mueve la cabeza']
    * match productosId501 contains only 'Perrito que mueve la cabeza'

  
  Scenario: Entre todos los productos, está el "Perrito piloto con gafas" (JSONPath deep scan)
    # ⚠️ Cuidado con los ".." porque buscar cualquier propiedad que tenga "nombre" (incluye el nombre de la maquina)
    * def nombresProductos = get maquina..nombre
    * karate.log('Lista nombres productos: ', nombresProductos)
    * match nombresProductos == '#[7]'
    * match nombresProductos contains 'Perrito piloto con gafas'

    # ℹ️ Evitamos obtener el nombre de la maquina accediendo primero al inventario
    * def nombresProductos2 = get maquina.inventario..nombre
    * karate.log('Lista nombres productos: ', nombresProductos2)
    * match nombresProductos2 == '#[6]'
    * match nombresProductos2 contains 'Perrito piloto con gafas'


  Scenario: Los productos tienen que tener el schema correcto
    * def productos = get maquina..productos[*]
    * karate.log("Productos: ", productos)
    * match each productos ==
      """
      {
        "codigo": "#string",
        "id_prod": "#string",
        "nombre": "#string",
        "precio": "#number",
        "stock": '#number'
      }
      """
