var express = require("express");
var session = require('express-session');
var bodyParser = require("body-parser");
var path = require('path');
var app = express(); 

require('dotenv').config();

app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: false,
}));



 const allRoutes = require("./src/routes/index.js")

const dbMongo = require("./src/db/dbconnect")
class DBServer {
  constructor()
    { 
       this.dbConn()
    }
    async dbConn()
    {
      await dbMongo()
    }

}

const dbServ = new DBServer()

dbServ.connectDB;


app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));



app.use('/robiotics', allRoutes);


app.use('/public', express.static(path.join(__dirname, 'public')))


var server = app.listen(process.env.PORT || process.env.port, function () {
    var port = server.address().port;
    console.log("App now running on port", port);
 });

 
 app.get('/', function(req, res) {
    console.log("usuario loggeado ", req.session.sessuser );
    
    if (req.session.sessuser )
    {
      res.sendFile(path.join(__dirname, '/src/views/main.html'));
    }
    else 
    {
      res.sendFile(path.join(__dirname, '/src/views/login.html'));
    }
  });
  app.get('/chglogin', function(req, res) {
    console.log("cambio de password", req.session.sessuser );
   res.sendFile(path.join(__dirname, '/src/views/chglogin.html'));
 });
  app.get('/pacientes', function(req, res) {
    console.log("usuario loggeado pacientes", req.session.sessuser );
   res.sendFile(path.join(__dirname, '/src/views/pacientes.html'));
 });
 app.get('/doctores', function(req, res) {
   res.sendFile(path.join(__dirname, '/src/views/doctores.html'));
 });
 app.get('/organos', function(req, res) {
   res.sendFile(path.join(__dirname, '/src/views/organos.html'));
 });
 app.get('/intervenciones', function(req, res) {
   res.sendFile(path.join(__dirname, '/src/views/intervenciones.html'));
 });

  app.get('/header', function(req, res) {
   res.sendFile(path.join(__dirname, '/src/views/header.html'));
 });
 app.get('/menu', function(req, res) {
  console.log("menu=>", req.session.sessprofile)
  if (req.session.sessprofile != null)
  {
    if (  !  req.session.sessprofile.localeCompare('admin')  )
      { 
        console.log("ADMIN");
          res.sendFile(path.join(__dirname, '/src/views/menu-admin.html'));
      } 
      if (! req.session.sessprofile.localeCompare('user') )
        {  
          console.log("USER");
            res.sendFile(path.join(__dirname, '/src/views/menu-user.html'));
        } 
    } 
});




