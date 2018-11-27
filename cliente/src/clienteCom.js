function ClienteCom(){
	this.socket=undefined;
	this.nombrePartida=undefined;
	this.usrId=undefined;
	this.ini=function(usrid){
		this.socket=io.connect();
		this.usrId=usrid;
		this.lanzarSocketSrv();
	}
	this.crearPartida=function(nombre){
		this.nombrePartida=nombre;
		this.socket.emit('crearPartida', this.usrId,nombre);
   			console.log("usuario "+this.usrId+" crea partida "+nombre);
	}
	this.elegirPartida = function(nombre){	
		this.nombrePartida=nombre;	
    	this.socket.emit('elegirPartida',this.usrId,nombre);
	};
	this.retomarPartida=function(){
		this.socket.emit("retomarPartida",this.usrId,this.nombrePartida);
	}
	this.meToca=function(){
		this.socket.emit("meToca",this.usrId,this.nombrePartida);
	}
	this.obtenerCartasMano=function(){
		this.socket.emit("obtenerCartasMano",this.usrId,this.nombrePartida);
	}
	this.obtenerCartasAtaque=function(){
		this.socket.emit("obtenerCartasAtaque",this.usrId,this.nombrePartida);
	}
	this.jugarCarta = function(nombreCarta){
		this.socket.emit('jugarCarta',this.usrId,this.nombrePartida,nombreCarta);
	}
	this.pasarTurno=function(){
		if (usr.turno){
	       	this.socket.emit('pasarTurno', this.usrId, this.nombrePartida);
   		}
   	}
   	this.obtenerDatosRival=function(){
   		this.socket.emit('obtenerDatosRival',this.usrId,this.nombrePartida);
   	}
   	this.atacarUsr=function(){
   		if (usr.cartaAtaque && usr.cartaRival && usr.turno){
   			this.atacar(usr.cartaAtaque,usr.cartaRival);
   		}
   	}
   	this.atacar=function(idCarta1,idCarta2){
   		this.socket.emit('atacar',this.usrId,this.nombrePartida,idCarta1,idCarta2);
   	}
   	this.atacarRival=function(idCarta1){
   		this.socket.emit('atacarRival',this.usrId,this.nombrePartida,idCarta1);
   	}
   	this.abandonarPartida=function(){
   		this.socket.emit('abandonarPartida',this.usrId,this.nombrePartida);
   	}
	this.lanzarSocketSrv=function(){
		var cli=this;
		this.socket.on('connect', function(){   						
   			console.log("Usuario conectado al servidor de WebSockets");
		});
		this.socket.on('partidaCreada', function(partidaId){   						
   			console.log("Usuario crea partida con id: "+partidaId);
   			//rest.obtenerPartidas();
   			mostrarEsperandoRival();
   			//console.log("Mano: "+mano);
		});
		this.socket.on('unidoAPartida', function(partidaId){   						
   			console.log("Usuario unido a partida id: "+partidaId);   			
		});
		this.socket.on('noUnido', function(partidaId){   						
   			console.log("El usuario no pudo unirse a la partida id: "+partidaId);
		});
		this.socket.on("aJugar",function(partidaId){
			console.log("La partida "+partidaId+" esta en fase Jugando");
			eliminarGif();
			cli.meToca();
		});
		this.socket.on("meToca",function(turno){	
			console.log("Mi turno está a: "+turno);
			limpiar();
			usr.turno=turno;
			cli.obtenerCartasMano();
			cli.obtenerCartasAtaque();
			cli.obtenerDatosRival();
		});
		this.socket.on('mano',function(datos){
			console.log(datos);
			usr.turno=datos.turno;
			mostrarElixir(datos);
			mostrarMano(datos.mano);
		});
		this.socket.on("cartasAtaque",function(datos){
			console.log(datos);
			mostrarAtaque(datos.ataque);
		});
		this.socket.on('datosRival',function(datos){
			console.log(datos);
			//usr.datosRival=datos;
			mostrarRival(datos);
			mostrarAtaqueRival(datos.cartas);
		});
		this.socket.on('noJugada', function(carta){ 
			console.log("El usuario no pudo jugar la carta con coste: "+carta.coste);
		});
		this.socket.on('juegaCarta', function(datos) { 
			console.log("Usuario " + datos.usrid + " juega la carta con coste: "+datos.carta.coste+" elixir: "+datos.elixir);
			//limpiar();
			cli.obtenerCartasMano();
			cli.obtenerCartasAtaque();
			cli.obtenerDatosRival();
			//usr.elixir=datos.elixir;
			//usr.cartasAtaque.push(datos.carta);
			//mostrarAtaque(datos.carta);
		});
		this.socket.on('pasarTurno', function(datos){
           console.log("El usuario tiene turno: "+datos.turno);
           //cli.meToca();
           usr.turno=datos.turno;
           mostrarElixir(datos);
       	});
       	this.socket.on("respuestaAtaque",function(datos){
       		console.log(datos);
       		usr.cartaAtaque=undefined;
       		usr.cartaRival=undefined;
       		comprobarFin(datos.fase);
       		cli.meToca();
       	});
       	this.socket.on("respuestaAtaqueRival",function(datos){
       		console.log(datos);
       		comprobarFin(datos.fase);
       		cli.meToca();
       	});
       	this.socket.on("rivalAbandona",function(data){
       		console.log("rival abandona");
       		//mostrarInicio();
       		abandonarPartida();
       	});
	}
}