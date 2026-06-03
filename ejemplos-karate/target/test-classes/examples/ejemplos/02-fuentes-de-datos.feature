Feature: Fuentes de datos (csv, yaml, tablas, json)

  Scenario: Tabla con datos
    * table cursos
    | id | titulo    | precio |
    | 1  | 'Python'  | 150    |
    | 2  | 'Node JS' | 165.50 |
    | 3  | 'Claude'  | 350.95 |

    * match cursos == '#[3]'
    * match cursos[0].titulo == 'Python'
    * match cursos[2].precio == 350.95

  Scenario: CSV con datos
    * csv cursos =
    """
    id,titulo,precio
    1,Python,150
    2,Node JS,165.50
    3,Claude,350.95
    """

    * match cursos == '#[3]'
    * match cursos[0].titulo == 'Python'
    * match parseFloat(cursos[2].precio) == 350.95

  Scenario: YAML con datos
    * yaml cursos =
    """
    - id: 1
      titulo: 'Python'
      precio: 150
    - id: 2
      titulo: 'Node JS'
      precio: 165.50
    - id: 3
      titulo: 'Claude'
      precio: 350.95
    """

    * match cursos == '#[3]'
    * match cursos[0].titulo == 'Python'
    * match cursos[2].precio == 350.95
  

  Scenario: Cargar datos de un archivo
    * def cursos = read('classpath:datos/cursos.json')

    * match cursos == '#[3]'
    * match cursos[0].titulo == 'Python'
    * match cursos[2].precio == 350.95
