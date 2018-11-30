# Proyecto 2018: BattleCards

Este repositorio recoge el desarrollo ágil del proyecto de la asignatura Procesos de Ingeniería del Software (ESIIAB-Universidad de Castilla-La Mancha) del curso 2018-2019: BattleCards.

La versión desplegada de este proyecto se puede encontrar en el siguiente enlace: [BattleCardsApp](https://battlecardsapp.herokuapp.com/)

### Sprint 1: Definición del proyecto y herramientas
El objetivo es implementar una solución SaaS.
Se decide implementar un juego de cartas tipo HearthStone
Herramientas: NodeJS, Sublime Text 3, Kunagi, Jasmine (cliente y servidor), GitHub

### Sprint 2: Diseño del juego (modelo) y arquitectura base SaaS
Diseño del juego BattelCards: 
- definición de las entidades (Juego, Usuario, Partida, Tablero, Zona, Carta)
- El juego tiene una colección de partidas y una colección de usuarios
- La partida tiene dos jugadres, un tablero
- Cada jugador tiene un mazo (colección de cartas), mano (hasta 10 cartas), y una zona de ataque

Primer diseño de la arquitectura SaaS, definir la estructura de carpetas de la solución

### Sprint 3: Implementar el API REST y el API WebSocket de BattleCards
- Agregar usuario
- Crear partida
- Elegir partida
- Jugar carta
- Atacar
- Ver resultados
