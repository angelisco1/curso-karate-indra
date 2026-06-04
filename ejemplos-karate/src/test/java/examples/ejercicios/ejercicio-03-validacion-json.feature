Feature: Ejercicio 3: comprobar las posibles ganancias del producto "Cigarrillos de chocolate"

  Background:
    * def maquina = read('classpath:datos/maquina-expendedora.json')
    * def getGananciasPosibles =
      """
      function(productos) {
        let ganancias = 0
        for (let i = 0; i < productos.length; i++) {
          ganancias = ganancias + (productos[i].precio * productos[i].stock)
        }
        return ganancias
      }
      """

  Scenario: Comprobar que las posibles ganancias del producto "Cigarrillos de chocolate" son 250
    * def producto = get maquina..productos[?(@.nombre == "Cigarrillos de chocolate")]
    * karate.log("Producto: ", producto)
    * def ganancias = producto[0].precio * producto[0].stock
    * match ganancias == 250

  Scenario: Comprobar las posibles ganancias al vender todos los productos
    * def productos = get maquina..productos[*]
    * def gananciasPorProducto = productos.map(producto => producto.precio * producto.stock)
    * karate.log("gananciasPorProducto: ", gananciasPorProducto)
  
    * def gananciasTotales = gananciasPorProducto.reduce((sumGanancias, gananciaProducto) => sumGanancias + gananciaProducto, 0)
    # 0, 1000 -> 1000
    # 1000, 350 -> 1350
    # 1350, 900 -> ...
    * match gananciasTotales == 2900

    * def gananciasPosibles = getGananciasPosibles(productos)
    * match gananciasPosibles == 2900