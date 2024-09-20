var express = require("express");
var bodyParser = require("body-parser");
var path = require('path');
var app = express(); 

require('dotenv').config();


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
    res.sendFile(path.join(__dirname, '/src/views/main.html'));
  });
  app.get('/pacientes', function(req, res) {
   res.sendFile(path.join(__dirname, '/src/views/pacientes.html'));
 });
 app.get('/medicos', function(req, res) {
   res.sendFile(path.join(__dirname, '/src/views/medicos.html'));
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


