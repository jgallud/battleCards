function ComSrv(){
	this.enviarRemitente=function(socket,mens,datos){
        socket.emit(mens,datos);
    }
    this.enviarATodos=function(io,nombre,mens,datos){
        io.sockets.in(nombre).emit(mens,datos);
    }
    this.enviarATodosMenosRemitente=function(socket,nombre,mens,datos){
        socket.broadcast.to(nombre).emit(mens,datos)
    };
	this.lanzarSocketSrv=function(io,juego){
		var cli=this;
		io.on('connection',function(socket){
		    socket.on('crearPartida', function(usrid,nombrePartida) {
		        console.log('usuario id: '+usrid+" crea partida: "+nombrePartida);
		        var usr=juego.obtenerUsuario(usrid); //usuarios[usrid];
		        var partidaId;
				if (usr){
					console.log("usuario "+usrid+" crea partida "+nombrePartida);
					partidaId=usr.crearPartida(nombrePartida);				
		        	socket.join(nombrePartida);
		        	//io.sockets.in(nombrePartida).emit("partidaCreada",partidaId);
		        	cli.enviarRemitente(socket,"partidaCreada",partidaId)
		        }		        
		    });
		    socket.on('elegirPartida',function(usrid,nombrePartida){
		        var usr=juego.obtenerUsuario(usrid); //.usuarios[usrid]; 
		        var partidaId;
				if (usr){
					partidaId=usr.eligePartida(nombrePartida);
					if (partidaId<0){
						console.log("usuario "+usrid+" NO se pudo unir a la partida "+nombrePartida);
						//socket.emit("noUnido",partidaId);
						cli.enviarRemitente(socket,"noUnido",partidaId);
					}
					else{
						console.log("usuario "+usrid+" se une a la partida "+nombrePartida);
						//var mano=usr.obtenerCartasMano();
				     	socket.join(nombrePartida);
   			        	//socket.emit("unidoAPartida",partidaId,mano);
   			        	cli.enviarRemitente(socket,"unidoAPartida",partidaId);
   			        	cli.enviarATodos(io,nombrePartida,"aJugar",partidaId);
			     	}
				}
			});
			socket.on('retomarPartida',function(usrid,nombrePartida){
				var usr=juego.obtenerUsuario(usrid); //usuarios[usrid]; 
		        var partidaId;
				if (usr){
					partidaId=usr.eligePartida(nombrePartida);
					if (partidaId<0){
						socket.join(nombrePartida);
						cli.enviarRemitente(socket,"aJugar",partidaId);
						cli.enviarATodosMenosRemitente(socket,nombrePartida,"meToca",usr.rivalTeToca());
					}
				}
			});
			socket.on("meToca",function(usrid,nombrePartida){
				var usr=juego.obtenerUsuario(usrid); //usuarios[usrid];
				if (usr){
					//socket.emit("mano",usr.obtenerCartasMano());
					cli.enviarRemitente(socket,"meToca",usr.meToca());
				}
			});
			socket.on('obtenerCartasMano',function(usrid,nombrePartida){
				var usr=juego.obtenerUsuario(usrid); //.usuarios[usrid];
				if (usr){
					//socket.emit("mano",usr.obtenerCartasMano());
					cli.enviarRemitente(socket,"mano",{"mano":usr.obtenerCartasMano(),"turno":usr.meToca(),"elixir":usr.elixir,"vidas":usr.vidas});
				}
			});
			socket.on('obtenerCartasAtaque',function(usrid,nombrePartida){
				var usr=juego.obtenerUsuario(usrid); //.usuarios[usrid];
				if (usr){
					//socket.emit("mano",usr.obtenerCartasMano());
					cli.enviarRemitente(socket,"cartasAtaque",{"ataque":usr.obtenerCartasAtaque()});
				}
			});
			socket.on('jugarCarta', function(usrid,nombrePartida,nombreCarta) { 
				var usr=juego.obtenerUsuario(usrid); //.usuarios[usrid]; 
				var carta;
				if (usr){ 
					carta=usr.obtenerCartaMano(nombreCarta);
					if (carta){
						usr.jugarCarta(carta);
						if(carta.posicion=="ataque"){
							console.log("usuario "+usrid+" juega la carta con coste: "+carta.coste);
							//io.sockets.in(nombrePartida).emit("juegaCarta",usrid,carta,usr.elixir);
							cli.enviarATodos(io,nombrePartida,"juegaCarta",{"usrid":usrid,"carta":carta,"elixir":usr.elixir});
						 }
						else{
							console.log("usuario "+usrid+" NO pudo jugar la carta con coste: "+carta.coste);
							cli.enviarRemitente(socket,"noJugada",carta);
						 }
					}
					else{
						console.log("usuario "+usrid+" NO pudo jugar la carta, no existe");
						cli.enviarRemitente(socket,"noJugada",nombreCarta);
					}
				} 
			});
			socket.on('obtenerDatosRival',function(usrid,nombrePartida){
				var usr = juego.obtenerUsuario(usrid); //.usuarios[usrid];
                if (usr){
                	cli.enviarRemitente(socket,"datosRival",usr.obtenerDatosRival());
                }
			});
			socket.on('atacar',function(usrid,nombrePartida,idCarta1,idCarta2){
				var usr = juego.obtenerUsuario(usrid); //.usuarios[usrid];
                if (usr){
                	var json=usr.ataqueConNombre(idCarta1,idCarta2);
                	cli.enviarATodos(io,nombrePartida,"respuestaAtaque",json);
                }
			});
			socket.on('atacarRival',function(usrid,nombrePartida,idCarta1){
				var usr = juego.obtenerUsuario(usrid); //.usuarios[usrid];
                if (usr){
                	var json=usr.atacarRivalConNombre(idCarta1);
                	cli.enviarATodos(io,nombrePartida,"respuestaAtaqueRival",json);
                }
			});
			socket.on('pasarTurno', function(usrid, nombrePartida) {
                var usr = juego.obtenerUsuario(usrid); //.usuarios[usrid];
                if (usr) {
                   usr.pasarTurno();
                   console.log(usr.nombre + " ha pasado el turno");
                   cli.enviarRemitente(socket,"pasarTurno",{"mano":usr.obtenerCartasMano(),"turno":usr.meToca(),"elixir":usr.elixir,"vidas":usr.vidas});
                   cli.enviarATodosMenosRemitente(socket,nombrePartida,"meToca",usr.rivalTeToca());
                } 
           	});
           	socket.on('abandonarPartida',function(usrid,nombrePartida){
           		var usr=juego.obtenerUsuario(usrid); //.usuarios[usrid];
           		if (usr){
           			usr.abandonarPartida();
					cli.enviarATodosMenosRemitente(socket,nombrePartida,"rivalAbandona");
					//cli.enviarATodos(io,nombrePartida,"rivalAbandona");        			
           		}
           	});
		});
	};
}

module.exports.ComSrv=ComSrv;