var mongo=require("mongodb").MongoClient;
var ObjectID=require("mongodb").ObjectID;

function Dao(){
	this.usuarios=undefined;

	this.encontrarUsuario=function(email,callback){
        encontrar(this.usuarios,{email:email},callback);
    };

    this.encontrarUsuarioCriterio=function(criterio,callback){
        encontrar(this.usuarios,criterio,callback);
    };
	
	function encontrar(coleccion,criterio,callback){
        coleccion.find(criterio).toArray(function(error,usr){
            if (usr.length==0){
                callback(undefined);
            }
            else{
                callback(usr[0]);
            }
        });
    };

    this.insertarUsuario=function(usu,callback){
        insertar(this.usuarios,usu,callback);
    }

    function insertar(coleccion,usu,callback){
        coleccion.insertOne(usu,function(err,result){
            if(err){
                console.log("error");
            }
            else{
                console.log("Nuevo elemento creado: "+usu.email);
                callback(usu);
            }
        });
    }

    this.modificarColeccionUsuarios=function(usr,callback){
        modificarColeccion(this.usuarios,usr,callback);
    }

	function modificarColeccion(coleccion,usr,callback){
        coleccion.findAndModify({_id:ObjectID(usr._id)},{},usr,{},function(err,result){
            if (err){
                console.log("No se pudo actualizar (método genérico)");
            }
            else{     
                console.log("Usuario actualizado"); 
            }
            callback(result);
        });
    }
    this.eliminarUsuario=function(uid,callback){
       eliminar(this.usuarios,{_id:ObjectID(uid)},callback);
    }

    function eliminar(coleccion,criterio,callback){
        coleccion.remove(criterio,function(err,result){
            if(!err){
                callback(result);
            }
        });
    }


	this.conectar=function(callback){
        var dao=this;
        mongo.connect("mongodb://xxxx:xxxx@xxxxx/xxxx",{useNewUrlParser:true},function(err, database){
            if (err){
                console.log("No pudo conectar a la base de datos")
            }
            else{
                console.log("conectado a Mongo: usuarios");
                database.db("battlecards").collection("usuarios",function(err,col){
                    if (err){
                        console.log("No pude obtener la coleccion")
                    }
                    else{       
                        console.log("tenemos la colección usuarios");                                 
                        dao.usuarios=col;   
                    }
                    //db.close();
                });
                database.close();
                callback(database);
            }
        });
    }
}

module.exports.Dao=Dao;