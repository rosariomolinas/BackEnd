const pacientes = require("../db/pacientes")

const addnew =  (req, res) =>
    {

        let  record = { ...req.body }
        console.log("Nuevo paciente..." + record.nombre + " - " + record.edad);
        pacientes.findOne({} ).sort({ code : -1}).then((resultado) => 
             { if (resultado==null) 
                 { 
                    pacientes.create({code: 1, nombre :  req.body.nombre , apellido :  req.body.apellido , edad:  req.body.edad, activo: true} ).then((result) => {
                        res.status(200).json(result)
                    })

                 } 
                 else 
                 { 
                    let newcod = resultado.code + 1;
                    pacientes.create({code: newcod, nombre :  record.nombre , apellido :  record.apellido , edad:  record.edad, activo: true} ).then((result) => {
                        res.status(200).json(result)
                    })
                 } 
    
              });
        
    }

 

const update =  (req, res) =>

    {

        let mensaje = '';
        console.log("Modificar paciente..." + req.body);

        
        const filter = { code : req.body.code, activo : true };
        const updatev = req.body;
        pacientes.updateOne (filter, updatev ).then((result) => 
            {
                console.log("resultado modificación ", result);
                if (result.modifiedCount)
                {
                    res.status(200).json({"data" : result, "message" : "Paciente actualizado" })
                    mensaje = "Paciente actualizado";
                }
                else
                {
                    res.status(200).json(result)
                    mensaje = "Paciente no actualizado";

                }
                
                
            })
    }

const remove =  (req, res) =>
{

    let mensaje = '';
    console.log("Eliminar (desactivar) paciente..." + req.body.nombre + " - " + req.body.edad);

    console.log("Paciente deactivado" , req.body.code);
    const filter = { code : req.body.code };
    const updatev = {activo :  false};
    pacientes.updateOne (filter, updatev ).then((result) => 
        {

            res.status(200).json({"data" : {}, "message" : "Paciente eliminado" })
        })
    

    
    
}
const findCode =  (req, res) =>
        {
    
            console.log("Buscar paciente...");
                        
            let  record = { ...req.body }
            console.log('req.body', record)
            if ( record.activo)
            {
              cadactivo = {"code" : record.code, "activo" : true}
            }
            else {
                cadactivo = {"code" : record.code}
            }
            

//            console.log("1",req.body.code);
            console.log("fin buscar paciente...");
            pacientes.findOne(cadactivo ).then((resultado) => 
                { if (resultado==null) 
                    { 
                       // not found pacientes.create({code: 1, nombre :  req.body.nombre , edad:  req.body.edad} )
                       res.status(200).json({ "data" : {},  "message": "No hay coincidencias" })
                    } 
                    else 
                    { 
                        console.log(resultado.nombre);
                        res.status(200).json({"data" : [resultado], "message" : ""})
                    } 
                });
                
                
        } 
    

const findName =  (req, res) =>
{

    console.log("Find by name...");
    let  record = { ...req.body }
    if ( record.activo)
    {
      cadactivo = { "nombre": { $regex: '.*' + req.body.nombre + '.*' }, "activo" : true }
    }
    else {
        cadactivo = { "nombre": { $regex: '.*' + req.body.nombre + '.*' } }
    }
    
    pacientes.find(cadactivo ).then((resultado) => 
        { 
            if (resultado.length == 0) 
            { 
                // not found pacientes.create({code: 1, nombre :  req.body.nombre , edad:  req.body.edad} )
                
                console.log("Not found");
                res.status(200).json({ "data" : {},  "message": "No hay coincidencias" })
            } 
            else 
            { 
                console.log(resultado);
                res.status(200).json({"data" : resultado, "message" : ""})
            } 
        });
        
        
} 
    
const findAll =  (req, res) =>
    {
    
        console.log("Find all...");
        let  record = { ...req.body }
        if ( record.activo)
        {
          cadactivo = {"activo" : true }
        }
        else {
            cadactivo = {}
        }
        
        // console.log(jstring);
        pacientes.find(cadactivo  ).then((resultado) => 
            { 
                if (resultado.length == 0) 
                { 
                    // not found pacientes.create({code: 1, nombre :  req.body.nombre , edad:  req.body.edad} )
                    
                    console.log("Not found");
                    res.status(200).json({ "data" : {},  "message": "No hay coincidencias" })
                } 
                else 
                { 
                    console.log(resultado);
                    res.status(200).json({"data" : resultado, "message" : ""})
                } 
            });
            
            
    } 

const next =  (req, res) =>
    {

        console.log("Siguiente paciente...");
                    
        console.log("actual=>",req.body.code);
        
        pacientes.find({code: {$gt: req.body.code}, activo : true}).sort({code: 1 }).limit(1).then((resultado) => 
            {  console.log(resultado, "--", resultado.length);
                 if (resultado.length) 
                { 
                    console.log();
                    res.status(200).json({"data" : resultado, "message" : "" })                   
                } 
                else 
                { 
                     // not found pacientes.create({code: 1, nombre :  req.body.nombre , edad:  req.body.edad} )
                     res.status(200).json({"data" : resultado, "message" : "Paciente no encontrado" })   
                } 
            });
            
            
    } 
  
const previous =  (req, res) =>
    {

        console.log("Anterior paciente...");
                    
        //            console.log("1",req.body.code);
        
        pacientes.find({code: {$lt: req.body.code} , activo : true}).sort({code: -1 }).limit(1).then((resultado) => 
            {  if (resultado.length) 
                { 
                    console.log();
                    res.status(200).json({"data" : resultado, "message" : "" })                   
                } 
                else 
                { 
                     // not found pacientes.create({code: 1, nombre :  req.body.nombre , edad:  req.body.edad} )
                     res.status(200).json({"data" : resultado, "message" : "Paciente no encontrado" })   
                } 
            });
            
            
    } 
      
       

module.exports = {
    addnew, findCode, findName, findAll, update, remove, next, previous
    }
    