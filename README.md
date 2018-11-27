# Proyecto 2018: BattleCards

Este repositorio tiene los elementos de la arquitectura base del proyecto 2018: BattleCards

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
