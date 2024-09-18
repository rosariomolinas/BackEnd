const medicacion = require("../db/medicacion")

    

        
const traertodos =  (req, res) =>
{

    console.log("todos los medicamentos..." );
    medicacion.find({}).then((resultado) => 
            {  
                res.status(200).json(resultado)

            });
    
   
}

module.exports = {
     traertodos
    }
    