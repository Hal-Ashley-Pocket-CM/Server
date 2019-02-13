module.exports=function(db){

  Sequelize = require("sequelize");
  const path = require('path');

  // const connection = db.connection;
  const Client = db.client;
  const CaseManager = db.caseManager;
  const CourtDate = db.courtDate;
  const CheckIn = db.checkIn;
  const Message = db.message;
  
  const express = require('express');
  const app = express();
  app.use(express.json());

  if (process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'));
  };

  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, '/.client/build/index.html'));
  })

  app.get('/index/', function (req, res) {
    res.send('Hello World Index');
  });

  app.get('/dash/all-clients', function(req,res){
    try{
      CaseManager.findOne({
        where : {
          firstName : req.body.firstName,
          lastName : req.body.lastName,
        }
      })
      .then(caseManager => {
        try {
          Client.findAll({
            where: {
              caseMgrId : caseManager.caseMgrId,  
            }
          })
          .then(clients => {
            for (i in clients){
              CourtDate.findAll({
                where: {
                  clientId : clients[i].clientId,
                }
              })
              .then (courtDates => {
                console.log(i + ":" + clients[i].lastName + " " + clients[i].firstName)
                for (j in courtDates){
                  console.log(courtDates[j].time + " " + courtDates[j].place);
                }
              })
            }
            
            res.send(clients);
          })
        }
        catch(err){
          res.send(err + " Failed to find clients");
        }
      });
    }
    catch(err){
      res.send(err + " Failed to find case manager");
    }
  });

  app.get('/dash/get-client', function(req,res){
    try{
      Client.findAll()
      .then(myTablesRows => {
        res.send(myTablesRows);
      });
    }
    catch(err){
      res.send(err + " Failed to find clients");
    }
  });

  app.get('/dash/all-casemgrs', function(req,res){
      CaseManager.findAll()
      .then(myTablesRows => {
        res.send(myTablesRows);
      });
  });

  app.post('/dash/create-client', (req, res) => {
    Client.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      active: req.body.active
    })
    .then(() => {
      var fullName = req.body.firstName + " " + req.body.lastName;
      console.log("Client " + fullName + " Added");
      res.json("Client " + fullName + " Added");
    });
  });

  app.post('/dash/create-casemgr', (req, res) => {
    CaseManager.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      email: req.body.email,
    })
    .then(() => {
      var fullName = req.body.firstName + " " + req.body.lastName;
      console.log("Case Manager " + fullName + " Added");
      res.json("Case Manager " + fullName + " Added");
    });
  });

  app.post('/dash/fakeData', (req, res) => {
    CaseManager.create({
      firstName: 'Earl', lastName: 'Campbell', email: "tyrose34@cpu.com", phone: "555-343-3434",
      caseMgrId : 10000,
    });
    CaseManager.create({
        firstName: 'Dan', lastName: 'Pastorini', email: "dan@cpu.com", phone: "555-777-7777",
        caseMgrId: 20000,
    });

    // Client Billy Sims
    Client.create({
      firstName: 'Billy', lastName: 'Sims', phone:"555-200-2020",
      clientId : 1,
      caseMgrId : 10000,
    });
    CourtDate.create({
      time : '2011-01-11 11:30:00', place : '1111 Someplace, Somewhere, UT',
      clientId : 1,
    });
    CourtDate.create({
      time : '2011-11-11 11:30:00', place : '1111 Someplace, Somewhere, UT',
      clientId : 1,
    });
    CheckIn.create({
      lattitude: 'lat1', longitude: 'lng1',
      clientId : 1,
    });
    CheckIn.create({
      lattitude: 'lat2', longitude: 'lng2',
      clientId : 1,
    });
    CheckIn.create({
      lattitude: 'lat3', longitude: 'lng3',
      clientId : 1,
    });
    Message.create({
      clientId : 1,
      caseMgrId : 100000,
      message : "Hello from Billy Sims",
    })

    // Client Billy "White Shoes" Johnson
    Client.create({
      firstName: 'Billy', lastName: 'Johnson', phone:"555-200-2121",
      clientId : 2,
      caseMgrId : 10000,
    });
    CourtDate.create({
      time : '2019-02-28 10:30:00', place : '2222 Someplace, Somewhere, UT',
      clientId : 2,
    });
    CourtDate.create({
      time : '2019-03-14 10:30:00', place : '2222 Someplace, Somewhere, UT',
      clientId : 2,
    });
    CheckIn.create({
      lattitude: 'lat2-1', longitude: 'lng2-1',
      clientId : 2,
    });
    CheckIn.create({
      lattitude: 'lat2-2', longitude: 'lng2-2',
      clientId : 2,
    });
    CheckIn.create({
      lattitude: 'lat2-3', longitude: 'lng2-3',
      clientId : 2,
    });
    Message.create({
      clientId : 2,
      caseMgrId : 100000,
      message : 'Hello from Billy "White Shoes" Johnson',
    })

    console.log("Fake Clients & Case Managers Added");
    res.json("Fake Clients & Case Managers Added");
});

  app.use(express.static('./public'))
  app.listen(4200, function(){ console.log('Server listening on 4200')});

}
