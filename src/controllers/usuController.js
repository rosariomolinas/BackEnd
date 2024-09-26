

const usuarios = require("../db/usuarios")


const validar =  (req, res) =>
        {
    
            console.log("Validar usuario...");
                        
            let  record = { ...req.body }
            console.log('req.body', record)

            usuarios.findOne({"user" : record.user, "password" : record.password} ).then((resultado) => 
                { if (resultado==null) 
                    { 
                       res.status(200).json({ "data" : false, "message": "Usuario o Clave incorrectos" })
                    } 
                    else 
                    { 
                        console.log("usuario sesión:",  req.session.sessuser );
                        console.log("usuario resultado:",  resultado.user);
                        req.session.sessuser = resultado.user;
                        req.session.sessprofile = resultado.profile;
                        console.log("perfil",  resultado.profile);
                        res.status(200).json({ "data" : true, "message": "Usuario válido" })
                    } 
                });
                
                
        } 
const pwdUpdate =  (req, res) =>
    {

        console.log("Cambio contraseña");
                    
        let  record = { ...req.body }
        console.log('req.body', record)

        usuarios.findOne({"user" : record.user, "password" : record.passwordold} ).then((resultado) => 
            { if (resultado==null) 
                { 
                    res.status(200).json({ "data" : false, "message": "Usuario o Clave incorrectos" })
                } 
                else 
                { 
                    const filter = { "user" : record.user };
                    const updatev = { "password" : record.passwordnew } ;
                    usuarios.updateOne (filter, updatev ).then((result) => 
                   {
                       console.log("usuario sesión:",  req.session.sessuser );                 
                       res.status(200).json({ "data" : true, "message": "Contraseña actualizada" })
                   });
                } 
            });
            
            
    } 
const logout =  (req, res) =>
    {

        console.log("Log out usuario...");
                    
                    console.log("usuario sesión:",  req.session.sessuser );
                    
                   // res.status(200).json({ "data" : true, "message": "Usuario válido" })
                
                    req.session.destroy((err) => {
                        if (err) {
                          console.log(err);
                          res.status(200).json({ "data" : false, "message": "Ocurrió un error: " + err })
                        } else 
                        {
                            res.status(200).json({ "data" : true, "message": "Logout exitoso" })
                            //res.redirect('./');
                        }
                      });
    } 


const datos =  (req, res) =>
{

    console.log("datos de sesión:",  req.session.sessuser );
    res.status(200).json({ "data" : {"user" : req.session.sessuser, "profile" : req.session.sessprofile}})

} 


module.exports = {
    validar, pwdUpdate, logout, datos
    }
    