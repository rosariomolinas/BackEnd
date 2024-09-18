const organos = require("../db/organos")

const addnew =  (req, res) =>
    {

        console.log("Nuevo organo..." + req.body.nombre + " - " + req.body.edad);
        organos.findOne({} ).sort({ code : -1}).then((resultado) => 
             { if (resultado==null) 
                 { 
                    organos.create({code: 1, nombre :  req.body.nombre , edad:  req.body.edad} )

                 } 
                 else 
                 { 
                    let newcod = resultado.code + 1;
                    organos.create({code: newcod, nombre :  req.body.nombre , edad:  req.body.edad} )
                 } 
    
              });
        
        res.status(200).json({ status: "success" })
    }
const findone =  (req, res) =>
        {
    
            console.log("Buscar organo...");
            console.log("1",req.body.code);
            console.log("2", req.body);
            console.log("fin buscar organo...");
            organos.findOne({"code" : req.body.code} ).then((resultado) => 
                { if (resultado==null) 
                    { 
                       // not found organos.create({code: 1, nombre :  req.body.nombre , edad:  req.body.edad} )
                       res.status(200).json({ status: "not found" })
                    } 
                    else 
                    { 
                        console.log(resultado.nombre);
                        res.status(200).json({ status: "success" })
                    } 
                });
                
                
        } 
    

        
const traertodos =  (req, res) =>
{

    console.log("todos los órganos..." );
    organos.find({}).then((resultado) => 
            {  
                res.status(200).json(resultado)

            });
    
   
}

module.exports = {
    addnew, findone, traertodos
    }
    