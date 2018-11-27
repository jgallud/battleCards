
function limpiar(){
	//inicializa la página
	$('#formInicio').remove();
  $('#formCrearPartida').remove();
  $('#mostrarListaPartidas').remove();
  $('#granCabecera').remove();
  $('#mostrarCabeceraJuego').remove();
  $('#mostrarAtaqueRival').remove()
  $('#mostrarAtaque').remove();
  $('#mostrarRival').remove();
  $('#mostrarElixir').remove();
  $('#mostrarMano').remove()
  $('#mostrarEsperando').remove();
  $('#login').remove();
  $('#cabeceraP').remove();
  $('#nombreBtn').remove(); 
  $('#logo').remove();
  $('#refRecordar').remove();
  $('#info').remove();
}

function comprobarUsuario(){
  if ($.cookie("usr")){
    var usr=JSON.parse($.cookie("usr"));
    rest.comprobarUsuario(usr._id);
  }
  else{
    //mostrarFormularioNombre();
    mostrarLogin();
  }
}
function abandonarPartida(){
  if ($.cookie("usr")){
      //com.abandonarPartida();
      $.removeCookie("usr");
      location.reload();
  }
}

function abandonarPartidaYAvisar(){
  if ($.cookie("usr")){
      com.abandonarPartida();
      $.removeCookie("usr");
      location.reload();
  }
}

function mostrarFormularioNombre(){
	var cadena='<div id="formInicio">';
	cadena=cadena+'<h3>Iniciar sesión</h3>';
	cadena=cadena+'<input id="nombre" type="text" class="form-control" name="nombre" placeholder="Nombre usuario">';
	cadena=cadena+'<button type="button" id="inicioBtn" class="btn btn-primary btn-md">Iniciar Usuario</button>';
	cadena=cadena+'</div>';
	
	$('#inicio').append(cadena);

	$('#inicioBtn').on('click',function(){
        var nombre=$('#nombre').val();
        if (nombre==""){
        	nombre="Loli";
        }
        $('#formInicio').remove();
        rest.agregarUsuario(nombre);
     });
}

function mostrarLogin(){
  //borrarLogin();
  limpiar();
  //asociarEnter('#nombreBtn');
  //mostrarIntro();
  var cadena="<div id='logo'><h1>BattleCards</h1>"
  cadena=cadena+"<img src='cliente/img/cardSet.jpg' style='width:30%' class='img-circle' alt='logo'></div>";
  $('#cabecera').append(cadena);

  var cadena='<div id="cabeceraP">';
  cadena=cadena+'<h2>Inicio de sesión</h2><div id="ig1" class="input-group" style="margin-bottom:25px">';
  cadena=cadena+'<span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>';
  cadena=cadena+'<input id="email" type="text" class="form-control" name="email" placeholder="Escribe tu email"></div>';
  cadena=cadena+'<div id="ig2" class="input-group" style="margin-bottom:25px">';
  cadena=cadena+'<span class="input-group-addon" ><i class="glyphicon glyphicon-lock"></i></span>';
  cadena=cadena+'<input id="clave" type="password" class="form-control" name="password" placeholder="Escribe tu clave"></div></div>';
  $('#cabecera').append(cadena);
  $('#cabecera').append('<p id="nombreBtn"><button type="button" id="nombreBtn" class="btn btn-primary btn-md">Iniciar partida</button></p><a href="#" id="refRecordar">Recordar clave</a>');//' <a href="#" id="refRegistro" onclick="mostrarRegistro();">Registrar usuario</a>');
  $('#cabecera').append('<h4 id="info"><span class="label label-warning"></span></h4>');
  $('#email').blur(function() {
    var testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
    if (testEmail.test(this.value) ) 
    {
      $('#nombreBtn').unbind("click").on('click',function(){
        var nombre=$('#email').val();
        var clave=$('#clave').val();
        rest.loginUsuario(nombre,clave);
        $('#cabeceraP').remove();
      });
      $('#refRecordar').on('click',function(){
        var nombre=$('#email').val();        
        rest.enviarClave(nombre);
        //mostrarRegistro();
      });
    }
    else {
      mostrarAviso("Debe ser una dirección de email");
      //$("#info span").text("Debe ser una dirección de email");
      //alert('failed');
    }
  });
}

function mostrarRegistro(){
  //borrarLogin();
  limpiar();
  var cadena="<div id='logo'><h1>BattleCards</h1>"
  cadena=cadena+"<img src='cliente/img/cardSet.jpg' style='width:30%' class='img-circle' alt='logo'></div>";
  $('#cabecera').append(cadena);
  //asociarEnter('#regBtn');
  //  $('#home').append('<p id="cabecera"><h2 id="cabeceraP">Registro de usuarios</h2><input type="email" id="email" class="form-control" placeholder="introduce tu email"><input type="password" id="clave" class="form-control" placeholder="introduce tu clave"></p>');
  var cadena='<div id="cabeceraP">';
  cadena=cadena+'<h2>Crear usuario nuevo</h2><div id="ig1" class="input-group" style="margin-bottom:25px">';
  cadena=cadena+'<span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>';
  cadena=cadena+'<input id="email" type="text" class="form-control" name="email" placeholder="Escribe tu email"></div>';
  cadena=cadena+'<div id="ig12" class="input-group" style="margin-bottom:25px">';
  cadena=cadena+'<span class="input-group-addon"><i class="glyphicon glyphicon-user"></i></span>';
  cadena=cadena+'<input id="email2" type="text" class="form-control" name="email" placeholder="Repite el email"></div>';
  cadena=cadena+'<div id="ig2" class="input-group" style="margin-bottom:25px">';
  cadena=cadena+'<span class="input-group-addon"><i class="glyphicon glyphicon-lock"></i></span>';
  cadena=cadena+'<input id="clave" type="password" class="form-control" placeholder="Escribe tu clave"></div></div>';

  //$('#control').append('<p id="login"><h2 id="cabeceraP">Inicio de sesión</h2><input type="email" id="email" class="form-control" placeholder="introduce tu email" required><input type="password" id="clave" class="form-control" placeholder="introduce tu clave" required></p>');
  $('#cabecera').append(cadena);
 
  $('#cabecera').append('<button type="button" id="regBtn" class="btn btn-primary btn-md">Registrar usuario</button>');
  $('#cabecera').append('<h4 id="info"><span class="label label-warning"></span></h4>');
  $('#email2').blur(function() {
    var testEmail = /^[A-Z0-9._%+-]+@([A-Z0-9-]+\.)+[A-Z]{2,4}$/i;
    var nombre=$('#email').val();
    var nombre2=$('#email2').val();
    if (testEmail.test(this.value)&&comprobarEmail(nombre,nombre2)) 
    {
        $('#regBtn').on('click',function(){  
          var clave=$('#clave').val();      
          $('#nombre').remove();
          $('#regBtn').remove();   
          rest.registroUsuario(nombre,clave);
        });
    }
    else {
      mostrarAviso("Debe ser una dirección de email o las direcciones no coinciden");
      //$("#info span").text("Debe ser una dirección de email");
      //alert('failed');
    }
  });
}

function mostrarAviso(cadena){
  $("#info span").text(cadena);
}

function mostrarCrearPartida(){
  limpiar();
  //$('#formInicio').remove();
	var cadena='<div id="formCrearPartida">';
	cadena=cadena+'<h3>Crear partida</h3>';
	cadena=cadena+'<input id="nombre" type="text" class="form-control" name="nombre" placeholder="Nombre partida">';
	cadena=cadena+'<button type="button" id="inicioBtn" class="btn btn-primary btn-md">Crear partida</button>';
	cadena=cadena+'</div>';
	
	$('#inicio').append(cadena);

	$('#inicioBtn').on('click',function(){
        var nombrePartida=$('#nombre').val();
        if (nombrePartida==""){
        	nombrePartida="prueba";
        }
        $('#formCrearPartida').remove();
        com.crearPartida(nombrePartida);
    });
}

function mostrarInicio(){
  //mostrarListaPartidas();
  limpiar();
  mostrarCabecera();
  mostrarCrearPartida();
  rest.obtenerPartidas();
}

function mostrarCabecera(){
  $("#granCabecera").remove();
  var cadena='<div class="jumbotron text-center" id="granCabecera">';
  cadena=cadena+'<h1>BattleCards Game</h1>';
  cadena=cadena+'<p>El juego de cartas</p></div>';
  $("#cabecera").append(cadena);
}

function mostrarListaPartidas(datos){

	$('#mostrarListaPartidas').remove();
	var cadena='<div id="mostrarListaPartidas"><h3>Elegir partida</h3>';
	cadena=cadena+'<div class="dropdown">';
  cadena=cadena+'<button class="btn btn-primary dropdown-toggle" id="mostrarListaBtn" type="button" data-toggle="dropdown">Elegir partida ';
	cadena=cadena+'<span class="caret"></span></button>';
  cadena=cadena+'<ul id="dropdown" class="dropdown-menu">';
  cadena=cadena+'<li><a href="#">-</a></li>';
  for(var i=0;i<datos.length;i++){
  		cadena=cadena+'<li><a href="#">'+datos[i].nombre+'</a></li>';
  	}
  cadena=cadena+'</ul>';
	cadena=cadena+'</div></div>';

	$('#listaPartidas').append(cadena);

	$('.dropdown-menu li a').click(function(){
        var nombrePartida=$(this).text();
        if (nombrePartida!=""){
        	$('#mostrarListaPartidas').remove();
        	com.elegirPartida(nombrePartida);
        }
  });
}

function mostrarEsperandoRival(){
  limpiar();
  $('#mostrarEsperando').remove();
  var cadena='<div id="mostrarEsperando"><h3>Esperando rival</h3>';
  cadena=cadena+'<img id="gif" src="cliente/img/download.gif"></div>';
  $('#cabecera').append(cadena);
}

function eliminarGif(){
  $('#gif').remove();
}

function mostrarRival(datos){
  $('#mostrarRival').remove();
  var cadena='<div id="mostrarRival" class="panel panel-default"><div class="panel-body">';
  cadena=cadena+'<h4><div class="col-md-4"><span class="label label-default btn-block">Nombre: '+datos.nombre+'</span></div>';
  cadena=cadena+'<div class="col-md-4"><img src="cliente/img/rival.png" name="imgRival" class="img-circle" width="100"></div>';
  cadena=cadena+'<div class="col-md-4"><span class="label label-info">Elixir:'+datos.elixir+' Vidas:'+datos.vidas+'</span></div></h4>';
  cadena=cadena+'</div></div>';
  $('#rival').append(cadena);
   $('[name=imgRival]').click(function(){
    var nombre=$(this).attr("id");
    console.log(nombre);
    atacarAlRival();
    //com.jugarCarta(nombreCarta);
  });
}

function atacarAlRival(){
  if (usr.cartaAtaque){
    com.atacarRival(usr.cartaAtaque);
  }
}

function mostrarAtaqueRival(datos){
  $('#mostrarAtaqueRival').remove();
  var cadena='<div id="mostrarAtaqueRival">';
  for(var i=0;i<(6-datos.length);i++){
    cadena=cadena+'<div class="col-md-1">';
    cadena=cadena+'<div class="thumbnail">';
    cadena=cadena+'<img src="cliente/img/nocartaataque.png" class="img-rounded" alt="carta" style="width:100%">';
    cadena=cadena+'</div></div>'
  }
  for(var i=0;i<datos.length;i++){    
    cadena=cadena+'<div class="col-md-1">';
    cadena=cadena+'<div class="thumbnail">';
    cadena=cadena+'<img src="cliente/img/'+datos[i].nombre+'.png" title="coste:'+datos[i].coste+' ataque:'+datos[i].ataque+' vidas:'+datos[i].vidas+'" class="img-rounded" name="rival" id="'+datos[i].nombre+'" alt="carta" style="width:100%">';    
    cadena=cadena+'</div></div>'
  }
  for(var i=0;i<(6-datos.length);i++){
    cadena=cadena+'<div class="col-md-1">';
    cadena=cadena+'<div class="thumbnail">';
    cadena=cadena+'<img src="cliente/img/nocartaataque.png" class="img-rounded" alt="carta" style="width:100%">';
    cadena=cadena+'</div></div>'
  }
  cadena=cadena+'</div>';
  $('#ataqueRival').append(cadena);

  $('[name=rival]').click(function(){
    var nombreCarta=$(this).attr("id");
    console.log(nombreCarta);
    seleccionarCartaRival(nombreCarta);
    //com.jugarCarta(nombreCarta);
  });
}

function mostrarAtaque(datos){
  var numCol;
  $('#mostrarAtaque').remove();
  var cadena='<div id="mostrarAtaque"><h3>Zona de Ataque</h3>'; 
  for(var i=0;i<(6-datos.length);i++){
    cadena=cadena+'<div class="col-md-1">';
    cadena=cadena+'<div class="thumbnail">';
    cadena=cadena+'<img src="cliente/img/nocartaataque.png" class="img-rounded" alt="carta" style="width:100%">';
    cadena=cadena+'</div></div>'
  }
  for(var i=0;i<datos.length;i++){   
    cadena=cadena+'<div class="col-md-1">';
    cadena=cadena+'<div class="thumbnail">';
    cadena=cadena+'<img src="cliente/img/'+datos[i].nombre+'.png" ';
    cadena=cadena+'title="coste:'+datos[i].coste+' ataque:'+datos[i].ataque+' vidas:'+datos[i].vidas+'" class="img-rounded" name="ataque" id="'+datos[i].nombre+'" alt="carta" style="width:100%">';
    cadena=cadena+'</div></div>'
  }
  for(var i=0;i<(6-datos.length);i++){
    cadena=cadena+'<div class="col-md-1">';
    cadena=cadena+'<div class="thumbnail">';
    cadena=cadena+'<img src="cliente/img/nocartaataque.png" class="img-rounded" alt="carta" style="width:100%">';
    cadena=cadena+'</div></div>'
  }
  cadena=cadena+'</div>';
  $('#ataque').append(cadena);

  $('[name=ataque]').click(function(){
    var nombreCarta=$(this).attr("id");
    console.log(nombreCarta);
    seleccionarCarta(nombreCarta);
    //com.jugarCarta(nombreCarta);
  });

}

function mostrarElixir(datos){
  $('#mostrarElixir').remove();
  var cadena='<div id="mostrarElixir">';
  cadena=cadena+'<div class="panel panel-default"><div class="panel-body"><h3><div class="row"><div class="col-md-2"><div class="row">';
  cadena=cadena+'<div class="col-md-3"><img src="cliente/img/jaina.png" name="imgRival" class="img-circle" width="50"></div>';
  cadena=cadena+'<div class="col-md-9"><h4>'
  if (datos.turno){
    cadena=cadena+'<span class="label label-success">ME TOCA</span>';
  }
  else{
    cadena=cadena+'<span class="label label-danger">NO ME TOCA</span>';
  }
  cadena=cadena+'</h4></div></div></div>';
  cadena=cadena+'<div class="col-md-10"><div class="row">';
  cadena=cadena+'<div class="col-md-3"><button type="button" class="btn btn-success btn-block" onclick="com.pasarTurno();">Pasar turno</button></div>';
  cadena=cadena+'<div class="col-md-3"><button type="button" class="btn btn-primary btn-block" onclick="com.atacarUsr();">Atacar</button></div>'; 
  cadena=cadena+'<div class="col-md-3"><span class="label label-default">Elixir: '+datos.elixir+' Vidas: '+datos.vidas+'</span></div>';
  cadena=cadena+'<div class="col-md-3"><button type="button" class="btn btn-warning btn-block" onclick="abandonarPartidaYAvisar()">Abandonar partida</button></div>';
  cadena=cadena+'</div></div></div></h3></div></div></div>';
  $('#elixir').append(cadena);
}

function mostrarMano(datos){
  $('#mostrarMano').remove();
  var numCol=2;
  $('#mostrarMano').remove();
  var cadena='<div id="mostrarMano" class="panel panel-default"><div class="panel-body">';
  //cadena=cadena+'<div class="col-md-'+numCol+'"></div>';
  for(var i=0;i<datos.length;i++){
    cadena=cadena+'<div class="col-md-'+numCol+'">';
    cadena=cadena+'<div class="thumbnail">';
    cadena=cadena+'<img src="cliente/img/'+datos[i].nombre+'.png" name="mano" title="coste '+datos[i].coste+' ataque '+datos[i].ataque+'" class="img-rounded" id="'+datos[i].nombre+'" style="width:100%">';
    cadena=cadena+'</div></div>'
  }
  cadena=cadena+'</div></div>';
  $('#mano').append(cadena);

  $('[name=mano]').dblclick(function(){
    var nombreCarta=$(this).attr("id");
    console.log(nombreCarta);
    //seleccionarCarta(nombreCarta);
    com.jugarCarta(nombreCarta);
  });
}

function seleccionarCarta(nombre){
  console.log(nombre);
  if (nombre && usr.turno){
    borrarSeleccionAtaque(usr.cartaAtaque);
    borrarSeleccionAtaque(nombre);
    $('#'+nombre).css("border","3px solid green");
    usr.cartaAtaque=nombre;
  }
}

function seleccionarCartaRival(nombre){
  console.log(nombre);
  if (nombre && usr.turno){
    borrarSeleccionRival(usr.cartaRival);
    borrarSeleccionRival(nombre);
    $('#'+nombre).css("border","3px solid green");
    usr.cartaRival=nombre;
  }
}

function borrarSeleccionAtaque(nombre){
  if (nombre){
    $('[id='+nombre+'][name=ataque]').css("border","3px solid white");
  }
}

function borrarSeleccionRival(nombre){
  if (nombre){
    $('[id='+nombre+'][name=rival]').css("border","3px solid white");
  }
}

function comprobarFin(msg){
  if (msg=="final"){
    $('#msgFinal').modal();
    $('#modalBtn').on('click',function(){
      abandonarPartida();
    })
  }
}