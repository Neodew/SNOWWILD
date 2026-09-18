DOCUMENTACIÓN GENERAL

# DESCRIPCIÓN DEL PROYECTO

SnowWild es un juego 2D basado en la naturaleza y la vida salvaje.

El proyecto representa un entorno natural en el que diferentes animales pueden desplazarse e interactuar con los elementos que los rodean. La idea principal es que el mundo tenga una buena autonomía, de manera que los animales no realicen siempre las mismas acciones, sino que reaccionen según sus necesidades y las condiciones del entorno.

El proyecto está pensado para ser sencillo de utilizar y ejecutarse directamente desde un navegador web.

# OBJETIVO

El objetivo principal de SnowWild es desarrollar un juego 2D que represente un pequeño ecosistema natural y permita observar cómo diferentes elementos pueden interactuar entre sí.

Se busca que el jugador pueda explorar el entorno y encontrarse con situaciones que ocurren de manera natural, como animales buscando alimento, desplazándose por el mapa, descansando o alejándose de algún peligro.

El proyecto también está diseñado para poder crecer posteriormente mediante la incorporación de nuevos animales, zonas y comportamientos.

# CONCEPTO DEL JUEGO

SnowWild se basa en la idea de una naturaleza parcialmente autónoma.

Los animales cuentan con diferentes necesidades y comportamientos. Dependiendo de la situación, pueden realizar distintas acciones.

Por ejemplo:

* Un animal puede buscar comida cuando tiene hambre.
* Puede buscar agua cuando la necesita.
* Puede descansar cuando tiene poca energía.
* Puede alejarse cuando detecta un peligro.
* Puede desplazarse por diferentes zonas.
* Puede interactuar con otros animales.
* Puede permanecer en una zona cuando encuentra condiciones adecuadas.

De esta manera, el entorno no depende completamente de las acciones del jugador.

# JUGABILIDAD

La jugabilidad está orientada a la exploración y observación del entorno natural.

El jugador puede desplazarse por el mundo y conocer las diferentes zonas disponibles. Durante la partida puede encontrarse con diferentes animales y observar sus comportamientos.

La intención es mantener una experiencia sencilla, evitando una cantidad innecesaria de controles o mecánicas complicadas.

El juego puede ampliarse posteriormente con nuevas formas de interacción dependiendo de la evolución del proyecto.

# MUNDO

El mundo está construido en 2D y representa un entorno natural.

Dentro del mapa pueden existir diferentes elementos como:

* Suelo.
* Vegetación.
* Árboles.
* Agua.
* Recursos.
* Zonas naturales.
* Animales.
* Obstáculos.

Estos elementos permiten construir un entorno donde los animales puedan desplazarse y desarrollar sus comportamientos.

# VIDA SALVAJE

La vida salvaje es uno de los elementos principales de SnowWild.

Los animales tienen comportamientos que les permiten actuar de acuerdo con determinadas condiciones.

Un animal puede tener estados como:

* Explorando.
* Buscando alimento.
* Comiendo.
* Buscando agua.
* Descansando.
* Huyendo.
* Siguiendo a otro animal.
* Interactuando.
* Sin actividad.

El comportamiento puede variar dependiendo de las necesidades del animal y de los elementos cercanos.

# AUTONOMÍA

La autonomía es una de las características principales del proyecto.

Los animales deben poder tomar decisiones básicas sin que el jugador tenga que controlar cada movimiento.

El sistema puede considerar factores como:

* Hambre.
* Energía.
* Peligro.
* Distancia.
* Recursos cercanos.
* Otros animales.
* Condiciones del entorno.

Por ejemplo, si un animal necesita alimento, puede buscar una fuente cercana en lugar de permanecer quieto. Si detecta un depredador, puede intentar alejarse.

Esto permite que el mundo tenga comportamientos diferentes durante cada partida.

# ENTORNO

El entorno tiene como función proporcionar los elementos necesarios para que exista la vida salvaje.

Los recursos naturales pueden aparecer en diferentes zonas y pueden ser utilizados por los animales.

La distribución del entorno también puede afectar el comportamiento. Una zona con abundante alimento puede atraer más animales, mientras que una zona sin recursos puede ser abandonada.

# REQUISITOS FUNCIONALES

El sistema debe permitir:

* Iniciar el juego desde un navegador.
* Mostrar el mundo en 2D.
* Permitir el movimiento del jugador.
* Mostrar diferentes elementos naturales.
* Mostrar animales dentro del entorno.
* Permitir que los animales se desplacen.
* Implementar comportamientos autónomos básicos.
* Permitir que los animales reaccionen a determinadas situaciones.
* Mostrar correctamente las interacciones principales.
* Mantener una experiencia jugable durante la ejecución.

# REQUISITOS NO FUNCIONALES

El proyecto debe buscar las siguientes características:

* Interfaz sencilla.
* Controles fáciles de entender.
* Carga razonablemente rápida.
* Funcionamiento estable.
* Código organizado.
* Diseño adaptable a diferentes tamaños de pantalla.
* Compatibilidad con navegadores modernos.
* Bajo nivel de complejidad para el usuario.

# REQUISITOS DEL USUARIO

Para utilizar SnowWild se necesita:

Dispositivo:
Computadora, laptop, tablet o teléfono móvil compatible.

Navegador:
Un navegador web moderno y actualizado.

Internet:
Se requiere conexión a Internet para acceder al proyecto cuando este se encuentre alojado en un servidor o plataforma web.

Configuración:
JavaScript debe estar habilitado en el navegador.

No se requiere instalar un programa específico para jugar desde la versión web.

# COMPATIBILIDAD

SnowWild está planteado para funcionar en diferentes dispositivos.

Se considera como objetivo la compatibilidad con:

* Computadoras de escritorio.
* Laptops.
* Tablets.
* Teléfonos móviles.

También se busca compatibilidad con los principales navegadores modernos:

* Google Chrome.
* Microsoft Edge.
* Mozilla Firefox.
* Safari.

El funcionamiento exacto puede variar dependiendo del dispositivo, navegador y rendimiento disponible.

# DISEÑO

El diseño busca mantener una apariencia sencilla y relacionada con la naturaleza.

La interfaz debe evitar elementos innecesarios y permitir que el usuario pueda concentrarse en el mundo del juego.

La información importante debe mostrarse de manera clara y fácil de comprender.

# RENDIMIENTO

El juego debe intentar mantener un funcionamiento fluido incluso cuando existan varios animales dentro del entorno.

Para esto se debe evitar realizar procesos innecesarios constantemente.

A medida que el proyecto crezca, pueden aplicarse mejoras como:

* Reducir cálculos innecesarios.
* Limitar la cantidad de animales activos simultáneamente.
* Actualizar comportamientos según la distancia.
* Evitar cargar elementos que no sean necesarios.
* Optimizar imágenes y recursos.

# ESTRUCTURA GENERAL DEL PROYECTO

La estructura puede organizarse de forma sencilla:

SnowWild/ 
    index.html
    styles.css
    script.js
    img/
      general/..
      [animal]/..
    music/
      general/..
      [animal]/..

=> puedes verlo en carpetas de este github
    
# FUTURAS MEJORAS

El proyecto puede continuar creciendo mediante diferentes mejoras.

Entre ellas:

* Agregar más especies de animales.
* Crear nuevos mapas.
* Agregar diferentes biomas.
* Mejorar la inteligencia de los animales.
* Incorporar cambios climáticos.
* Incorporar ciclo día y noche.
* Agregar sonidos ambientales.
* Mejorar las animaciones.
* Agregar más interacciones.
* Crear eventos naturales.
* Mejorar la optimización para dispositivos móviles.

# CONCLUSIÓN

SnowWild busca crear un juego 2D sencillo basado en la naturaleza y la vida salvaje.

Su principal característica es la autonomía de los animales y la intención de construir un entorno que pueda sentirse vivo.

El proyecto parte de una idea simple y puede crecer progresivamente sin necesidad de complicar la experiencia del usuario. La base permite agregar nuevas especies, comportamientos y elementos naturales conforme avance el desarrollo.
