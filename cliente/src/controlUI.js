function mostrarFormularioNombre(){
	var cadena='<div id="formInicio">';
	cadena=cadena+'<input id="nombre" type="text" class="form-control" name="nombre" placeholder="Nombre usuario">';
	cadena=cadena+'<button type="button" id="inicioBtn" class="btn btn-primary btn-md">Iniciar Usuario</button>';
	cadena=cadena+'</div>';
	$('#inicio').append(cadena);
	$('#inicioBtn').on('click',function(){
        var nombre=$('#enombre').val();
        $('#formInicio').remove();
        rest.agregarUsuario(nombre);
      });
}