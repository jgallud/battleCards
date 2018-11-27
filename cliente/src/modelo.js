function Juego(){
	this.cartas=[];
	this.usuarios=[];
	this.partidas=[];
	this.agregarCarta=function(carta){
		this.cartas.push(carta);
	}
	this.agregarUsuario=function(usuario){
		usuario.mazo=_.shuffle(this.crearColeccion());
		usuario.juego=this;
		this.usuarios.push(usuario);
		usuario.id=this.usuarios.length-1;
	}
	this.crearColeccion=function(){
		var mazo=[];
		//10 ataque 5 coste 3 vida 5
		for (var i=0;i<10;i++){
			mazo.push(new Carta("Dragon"+i, 5, 5,3));
		}
		//10 ataque 3 coste 2 vida 3
		for (var i=0;i<10;i++){
			mazo.push(new Carta("Guerrero"+i, 3, 3,2));
		}
		//10 ataque 2 coste 1 vida 2
		for (var i=0;i<10;i++){
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
	}	
	this.asignarPartida=function(nombre, usuario){
		for (var i=0;i<this.partidas.length;i++){
			if (this.partidas[i].nombre==nombre){
				this.partidas[i].asignarUsuario(usuario);
			}
		}
	}
	//aquí se construye el Juego
	//this.crearColeccion();
}

function Partida(nombre){
	this.nombre=nombre;
	this.usuariosPartida=[];
	this.fase=new Inicial();
	this.tablero=undefined;
	this.crearTablero=function(){
		this.tablero=new Tablero();
	}
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
		this.tablero.asignarUsuario(usuario);
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
	this.finPartida=function(){
		console.log("La partida ha terminado");
		this.fase=new Final();
		this.quitarTurno();
	}
	this.crearTablero();
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
}


function Tablero(){
	this.zonas=[];
	this.agregarZona=function(zona){
		this.zonas.push(zona);
	}
	this.crearZonas=function(){
		this.agregarZona(new Zona("arriba"));
		this.agregarZona(new Zona("abajo"));
	}
	this.asignarUsuario=function(usuario){
		for(var i=0;i<this.zonas.length;i++){
			if(this.zonas[i].libre){
				usuario.agregarZona(this.zonas[i]);
				this.zonas[i].libre=false;
				break;
			}
		}
	}
	this.crearZonas();
}

function Zona(nombre){
	this.nombre=nombre;
	this.ataque=[];
	this.mano=[];
	this.mazo=[];
	this.libre=true;
	this.agregarAtaque=function(carta){
		this.ataque.push(carta);
	}
	this.agregarMano=function(carta){
		this.mano.push(carta);
	}
	this.agregarMazo=function(mazo){
		this.mazo=mazo;
	}
}

function MiTurno(){
	this.pasarTurno=function(usr){
		usr.partida.cambiarTurno();
	}
	this.jugarCarta=function(usr,carta){
		usr.puedeJugarCarta(carta);
	}
	this.cambiarTurno=function(usr){
		usr.turno=new NoMiTurno();
		usr.elixir=usr.consumido+1;
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
}

function Usuario(nombre){
	this.nombre=nombre;
	this.id=undefined;
	this.juego=undefined;
	this.vidas=20;
	this.mazo=[];
	//this.mano=[];
	//this.ataque=[];
	this.elixir=1;
	this.turno=new NoMiTurno();
	this.zona=undefined;
	this.partida=undefined;
	this.consumido=0;
	this.asignarPartida=function(partida){
		this.partida=partida;
	}
	this.agregarZona=function(zona){
		this.zona=zona;
	}
	this.crearPartida=function(nombre){
		this.juego.crearPartida(nombre,this);
	}
	this.eligePartida=function(nombre){
		this.juego.asignarPartida(nombre,this);
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
			this.partida.finPartida();
		}
	}
	this.fasePuedeJugarCarta=function(carta){
		this.turno.jugarCarta(this,carta);
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
			this.partida.finPartida();
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
	this.comprobarCartasAtaque=function(){
		var carta;
		var cartasAtaque;
		cartasAtaque= this.obtenerCartasAtaque();
		if (cartasAtaque){
			carta=cartasAtaque.find(function(each){
				return !each.haAtacado;
			});
			if (carta==undefined){
				this.pasarTurno();
				this.ponerNoHaAtacado();
			}
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
