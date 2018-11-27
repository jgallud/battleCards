var _=require("underscore");
var cf=require("./cifrado.js");
var dao=require("./dao.js");
var moduloEmail=require("./email.js");

function Juego(){
	this.cartas=[];
	this.usuarios=[];
	this.partidas=[];
	this.dao=new dao.Dao();
	this.agregarCarta=function(carta){
		this.cartas.push(carta);
	}
	this.obtenerUsuario=function(id){
		return _.find(this.usuarios,function(usu){
			return usu.id==id
		});
	}
	this.registrarUsuario=function(email,clave,callback){
		var ju=this;
		var claveCifrada=cf.encrypt(clave);
		var key=(new Date().valueOf()).toString();
		this.dao.encontrarUsuarioCriterio({email:email},function(usr){
			if(!usr){
				ju.dao.insertarUsuario({email:email,clave:claveCifrada,key:key,confirmada:false},function(usu){
	       			moduloEmail.enviarEmail(email,key,"Haz click aqui para confirmar la cuenta");         
	                callback({email:'ok'});
	 	        });
	        }
	        else{
	        	callback({email:undefined});
	        }
    	});

	}
	this.confirmarUsuario=function(email,key,callback){
		var ju=this;
		this.dao.encontrarUsuarioCriterio({email:email,key:key,confirmada:false},function(usr){
			if(usr){
				usr.confirmada=true;
				//actualizar la coleccion
				ju.dao.modificarColeccionUsuarios(usr,function(data){
					callback({res:"ok"});
				});
			}
			else{
				callback({res:"nook"});
			}
		});
	}
	this.enviarClave=function(email,callback){
		var ju=this;
		this.dao.encontrarUsuarioCriterio({email:email},function(usr){
			if(usr){
				var key=(new Date().valueOf()).toString();
				usr.confirmada=false;
				usr.key=key;
				usr.clave=cf.encrypt('');
				ju.dao.modificarColeccionUsuarios(usr,function(usu){
	       			moduloEmail.enviarEmail(email,key,"Haz click aqui para confirmar la cuenta");         
	                callback({email:'ok'});
	 	        });
	        }
	        else{
	        	callback({email:undefined});
	        }
    	});
	}
	this.loginUsuario=function(email,pass,callback){
		var ju=this;
		var passCifrada=cf.encrypt(pass);
	    this.dao.encontrarUsuarioCriterio({email:email,clave:passCifrada,confirmada:true},function(usr){
		    if (usr){
	        	//ju.agregarUsuario(usr);   	        	
	            callback(usr);
	            ju.agregarUsuario(new Usuario(usr.email,usr._id));    	
	            }
            else{
	            callback({'email':''});
	        }
	    });
	}
	this.agregarUsuario=function(usuario){
		usuario.mazo=_.shuffle(this.crearColeccion());
		usuario.juego=this;
		this.usuarios.push(usuario);
		//usuario.id=this.usuarios.length-1;
	}
	this.eliminarUsuario=function(uid,callback){
		var json={'resultados':-1};
		//if (ObjectID.isValid(uid)){
			this.dao.eliminarUsuario(uid,function(result){
	            if (result.result.n==0){
	                console.log("No se pudo eliminar de usuarios");
	            }
	            else{
	                json={"resultados":1};
	                console.log("Usuario eliminado de usuarios");
	                callback(json);
	            }
	        }); 
		//}
	    //else{
	    //	callback(json);
	    //}
	}
	this.crearColeccion=function(){
		var mazo=[];
		//10 ataque 5 coste 3 vida 5
		for (var i=0;i<5;i++){
			mazo.push(new Carta("Dragon"+i, 5, 5,3));
		}
		//10 ataque 3 coste 2 vida 3
		for (var i=0;i<5;i++){
			mazo.push(new Carta("Guerrero"+i, 3, 3,2));
		}
		//10 ataque 2 coste 1 vida 2
		for (var i=0;i<5;i++){
			mazo.push(new Carta("Esbirro"+i, 2, 2,1));
		}
		return mazo;
	}
	this.agregarPartida=function(partida){
		this.partidas.push(partida);
	}
	this.crearPartida=function(nombre,usuario){
		var partida=new Partida(nombre);
		this.agregarPartida(partida);
		partida.asignarUsuario(usuario);
		partida.id=this.partidas.length-1;
		return partida.id;
	}	
	this.asignarPartida=function(nombre, usuario){
		var idPartida=-1;
		for (var i=0;i<this.partidas.length;i++){
			if (this.partidas[i].nombre==nombre && this.partidas[i].fase.nombre=="inicial"){
				this.partidas[i].asignarUsuario(usuario);
				idPartida=i;				
			}
		}
		return idPartida;
	}
	this.obtenerPartidas=function(){
		return this.partidas;
	}
	this.eliminarPartida=function(partida){
		//this.partida.eliminarPartida();
		this.partidas.splice(this.partidas.indexOf(partida),1);
	}
	this.dao.conectar(function(db){
		console.log("conectado a la base de datos");
	});	
}

function Partida(nombre){
	this.nombre=nombre;
	this.id=undefined;
	this.usuariosPartida=[];
	this.fase=new Inicial();
	//this.tablero=undefined;
	// this.crearTablero=function(){
	// 	this.tablero=new Tablero();
	// }
	this.asignarUsuario=function(usuario){
		// usuario.asignarPartida(this);
		// this.usuariosPartida.push(usuario);
		// this.tablero.asignarUsuario(usuario);
		// this.comprobarInicio();
		this.fase.asignarUsuario(usuario,this);
	}
	this.puedeAsignarUsuario=function(usuario){
		usuario.asignarPartida(this);
		this.usuariosPartida.push(usuario);
		//this.tablero.asignarUsuario(usuario);
		this.comprobarInicio();
	}
	this.comprobarInicio=function(){
		if (this.usuariosPartida.length==2){
			this.turnoInicial();
			this.asignarManoInicial();
			this.fase=new Jugando();
		}
	}
	this.asignarManoInicial=function(){
		for(var i=0;i<this.usuariosPartida.length;i++){
			this.usuariosPartida[i].manoInicial();
		}
	}
	this.turnoInicial=function(){
		var num=Math.round(Math.random());
		this.usuariosPartida[num].esMiTurno();

	}
	this.cambiarTurno=function(){
		for(var i=0;i<this.usuariosPartida.length;i++){
			this.usuariosPartida[i].cambiarTurno();
			//this.usuariosPartida[i].cartasFinTurno();
		}
	}
	this.quitarTurno=function(){
		for(var i=0;i<this.usuariosPartida.length;i++){
			this.usuariosPartida[i].turno=new NoMiTurno();
		}
	}
	this.finPartida=function(usr){
		console.log("La partida ha terminado");
		this.fase=new Final();
		this.quitarTurno();
		//this.eliminarPartida();
		usr.juego.eliminarPartida(this);
	}
	this.obtenerRival=function(usr){
		var i=this.usuariosPartida.indexOf(usr);
		var j=(i+1)%2;
		return this.usuariosPartida[j];
	}
	this.abandonarPartida=function(usr){
		this.fase.abandonarPartida(usr,this);
	}
	//this.crearTablero();
}

function Inicial(){
	this.nombre="inicial";
	this.asignarUsuario=function(usr,partida){
		partida.puedeAsignarUsuario(usr);
	}
	this.usrPasaTurno=function(usuario){
		console.log("La partida no ha comenzado");
	}
	this.usrAtaca=function(carta,obj,usuario){
		console.log("La partida no ha comenzado");
	}
	this.usrJugarCarta=function(carta,usuario){
		console.log("La partida no ha comenzado");
	}
	this.abandonarPartida=function(usr,partida){
		partida.finPartida(usr);
	}
}

function Jugando(){
	this.nombre="jugando";
	this.asignarUsuario=function(usr,partida){
		console.log("La partida ya tiene 2 jugadores");
	}
	this.usrPasaTurno=function(usuario){
		usuario.puedePasarTurno();
	}
	this.usrJugarCarta=function(carta,usuario){
		usuario.fasePuedeJugarCarta(carta);
	}
	this.usrAtaca=function(carta,objetivo,usuario){
		usuario.puedeAtacar(carta,objetivo);
	}
	this.abandonarPartida=function(usr,partida){
		partida.finPartida(usr);
	}
}

function Final(){
	this.nombre="final";
	this.asignarUsuario=function(usr,partida){
		console.log("La partida ha terminado");
	}	
	this.usrPasaTurno=function(usuario){
		console.log("La partida ya ha terminado");
	}
	this.usrAtaca=function(carta,obj,usuario){
		console.log("La partida ha terminado");
	}
	this.abandonarPartida=function(usr,partida){
		console.log('No se puede abandonar un partida que ha terminado');
	}
}


// function Tablero(){
// 	this.zonas=[];
// 	this.agregarZona=function(zona){
// 		this.zonas.push(zona);
// 	}
// 	this.crearZonas=function(){
// 		this.agregarZona(new Zona("arriba"));
// 		this.agregarZona(new Zona("abajo"));
// 	}
// 	this.asignarUsuario=function(usuario){
// 		for(var i=0;i<this.zonas.length;i++){
// 			if(this.zonas[i].libre){
// 				usuario.agregarZona(this.zonas[i]);
// 				this.zonas[i].libre=false;
// 				break;
// 			}
// 		}
// 	}
// 	this.crearZonas();
// }

// function Zona(nombre){
// 	this.nombre=nombre;
// 	this.ataque=[];
// 	this.mano=[];
// 	this.mazo=[];
// 	this.libre=true;
// 	this.agregarAtaque=function(carta){
// 		this.ataque.push(carta);
// 	}
// 	this.agregarMano=function(carta){
// 		this.mano.push(carta);
// 	}
// 	this.agregarMazo=function(mazo){
// 		this.mazo=mazo;
// 	}
// }

function MiTurno(){
	this.pasarTurno=function(usr){
		usr.partida.cambiarTurno();
	}
	this.jugarCarta=function(carta,usr){
		usr.puedeJugarCarta(carta);
	}
	this.cambiarTurno=function(usr){
		usr.turno=new NoMiTurno();
		usr.elixir=usr.elixir+usr.consumido+1;
		usr.consumido=0;
		usr.cartasFinTurno();
	}
	this.meToca=function(){
		return true;
	}
	this.esMiTurno=function(usr){
		//usr.turno=new MiTurno();
		usr.cogerCarta();
	}
	this.obtenerCartaMano=function(nombre,usr){
		return usr.puedeObtenerCartaMano(nombre);
	}
}

function NoMiTurno(){
	this.esMiTurno=function(usr){
		console.log("Ahora te toca");
		usr.turno=new MiTurno();
		usr.cogerCarta();
	}
	this.pasarTurno=function(usr){
		console.log("No se puede pasar el turno si no se tiene");
	}
	this.jugarCarta=function(carta,usr){
		console.log("No es tu turno");
	}
	this.cambiarTurno=function(usr){
		//usr.turno=new MiTurno();
		this.esMiTurno(usr);
	}
	this.meToca=function(){
		return false;
	}
	this.obtenerCartaMano=function(nombre,usr){
		console.log("No te toca, no puedes jugar carta");
	}
}

function Usuario(nombre,id){
	this.nombre=nombre;
	this.id=id;
	this.juego=undefined;
	this.vidas=20;
	this.mazo=[];
	//this.mano=[];
	//this.ataque=[];
	this.elixir=1;
	this.turno=new NoMiTurno();
	//this.zona=undefined;
	this.partida=undefined;
	this.consumido=0;
	this.asignarPartida=function(partida){
		this.partida=partida;
	}
	// this.agregarZona=function(zona){
	// 	this.zona=zona;
	// }
	this.crearPartida=function(nombre){
		return this.juego.crearPartida(nombre,this);
	}
	this.eligePartida=function(nombre){
		return this.juego.asignarPartida(nombre,this);
	}
	this.cambiarTurno=function(){
		this.turno.cambiarTurno(this);
	}
	this.pasarTurno=function(){
		this.partida.fase.usrPasaTurno(this);
		//this.turno.pasarTurno(this);
	}
	this.puedePasarTurno=function(){
		this.turno.pasarTurno(this);	
	}
	this.meToca=function(){
		return this.turno.meToca();
	}
	this.esMiTurno=function(){
		this.turno.esMiTurno(this);
		// this.turno=true;
		// this.cogerCarta();
		// this.elixir=this.consumido+1;
		// this.consumido=0;
	}
	this.cogerCarta=function(){
		var carta;
		carta= this.mazo.find(function(each){
			return each.posicion=="mazo";
		});
		if (carta){
			carta.posicion="mano";
		}
		else
		{
			this.partida.finPartida(this);
		}
	}
	this.fasePuedeJugarCarta=function(carta){
		this.turno.jugarCarta(carta,this);
	}
	this.jugarCarta=function(carta){
		this.partida.fase.usrJugarCarta(carta,this);
		//this.turno.jugarCarta(this,carta);
	}
	this.puedeJugarCarta=function(carta){
		if (this.elixir>=carta.coste){
			carta.posicion="ataque";
			this.elixir=this.elixir-carta.coste;
			this.consumido=this.consumido+carta.coste;
		}
		else
			console.log("No tienes suficiente elixir");
	}
	this.puedeAtacar=function(carta,objetivo){
		if(!carta.haAtacado){
			objetivo.esAtacado(carta);
			carta.haAtacado=true;
			this.comprobarCartasAtaque();
		}else{
			console.log("Esta carta ya ha atacado");
			this.comprobarCartasAtaque();
		}
	}
	this.ataque=function(carta,objetivo){
		this.partida.fase.usrAtaca(carta,objetivo,this);
	}
	this.esAtacado=function(carta){
		this.vidas=this.vidas-carta.ataque;
		this.comprobarVidas();
	}
	this.comprobarVidas=function(){
		if (this.vidas<=0){
			this.partida.finPartida(this);
		}
	}
	this.manoInicial=function(){
		for(var i=0;i<5;i++){
			this.cogerCarta();
		}
	}
	this.localizarCarta=function(coste){
		return this.mazo.find(function(each){
			return each.posicion=="mano" && each.coste==coste;
		});
	}
	this.obtenerUnaCarta=function(){
		return this.mazo.find(function(each){
			return each.posicion=="mano";
		});	
	}
	this.obtenerCartasAtaque=function(){
		return this.mazo.filter(function(each){
			return each.posicion=="ataque";
		});
	}
	this.obtenerCartaAtaqueNombre=function(nombre){
		return this.mazo.find(function(each){
			return each.posicion=="ataque" && each.nombre==nombre;
		});
	}
	this.comprobarCartasAtaque=function(){
		var carta;
		var cartasAtaque;
		cartasAtaque= this.obtenerCartasAtaque();
		if (cartasAtaque){
			carta=cartasAtaque.find(function(each){
				return !each.haAtacado;
			});
			// if (carta==undefined){
			// 	this.pasarTurno();
			// 	this.ponerNoHaAtacado();
			// }
		}
	}
	this.ponerNoHaAtacado=function(){
		_.each(this.obtenerCartasAtaque(),function(item){
			item.haAtacado=false;
		})
	}
	this.obtenerCartasMano=function(){
		return this.mazo.filter(function(each){
			return each.posicion=="mano";
		});
	}
	this.cartasFinTurno=function(){
		var cartasMano;
		cartasMano=this.obtenerCartasMano();
		if(cartasMano.length>10){
			for(var i=0;i<cartasMano.length-10;i++){
				this.descartarCarta(cartasMano[i]);
			}
		}
	}
	this.descartarCarta=function(carta){
		carta.posicion="cementerio";
	}
	this.obtenerCartaMano=function(nombre){
		return this.turno.obtenerCartaMano(nombre,this);
	}
	this.puedeObtenerCartaMano = function(nombre){
        return carta=this.mazo.find(function(each){
			return each.posicion=="mano" && each.nombre==nombre;
		});	
    }
    this.obtenerDatosRival=function(){
    	var rival=this.partida.obtenerRival(this);
    	var json={"elixir":-1,"cartas":[],"vidas":-1};
    	if (rival){
    		json={"elixir":rival.elixir,"cartas":rival.obtenerCartasAtaque(),"vidas":rival.vidas,"nombre":rival.nombre};
    	}
    	return json;
    }
    this.rivalTeToca=function(){
    	var rival=this.partida.obtenerRival(this);
    	return rival.meToca();
    }
    this.ataqueConNombre=function(idCarta1,idCarta2){
    	var carta=this.obtenerCartaAtaqueNombre(idCarta1);
    	var rival=this.partida.obtenerRival(this);
    	var objetivo=rival.obtenerCartaAtaqueNombre(idCarta2);
    	this.ataque(carta,objetivo);
    	var json={"carta":carta,"objetivo":objetivo,"fase":this.partida.fase.nombre};
    	return json;
    }
    this.atacarRivalConNombre=function(idCarta1){
    	var carta=this.obtenerCartaAtaqueNombre(idCarta1);
    	var rival=this.partida.obtenerRival(this);
    	this.ataque(carta,rival);
    	var json={"carta":carta,"vidas":rival.vidas,"fase":this.partida.fase.nombre};
    	return json;
    }
    this.abandonarPartida=function(){
    	this.partida.abandonarPartida(this);
    }
}

function Carta(nombre,vidas,ataque,coste){
	this.vidas=vidas;
	this.ataque=ataque;
	this.nombre=nombre;
	this.coste=coste;
	this.posicion="mazo";
	this.haAtacado=false;
	this.esAtacado=function(carta){
		this.vidas=this.vidas-carta.ataque;
		carta.vidas=carta.vidas-this.ataque;
		this.comprobarVidas();
		carta.comprobarVidas();
	}
	this.comprobarVidas=function(){
		if (this.vidas<=0){
			this.posicion="cementerio";
		}
	}
}



module.exports.Juego=Juego;
module.exports.Usuario=Usuario;
module.exports.MiTurno=MiTurno;
module.exports.NoMiTurno=NoMiTurno;