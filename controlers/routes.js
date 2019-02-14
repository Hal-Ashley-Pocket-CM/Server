module.exports=function(db){

  Sequelize = require("sequelize");
  //const path = require('path');

  const Client = db.Client;
  const CaseManager = db.CaseManager;
  const CourtDate = db.CourtDate;
  const CheckIn = db.CheckIn;
  const Message = db.Message;
  
  const express = require('express');
  const app = express();
  app.use(express.json());

  // if (process.env.NODE_ENV === 'production'){
  //   app.use(express.static('client/build'));
  // };

  // app.get("*", (req, res) => {
  //   res.sendFile(path.join(__dirname, '/.client/build/index.html'));
  // })

  app.get('/index/', function (req, res) {
    res.send('Hello World Index');
  });

  app.get('/dash/all-clients', function(req,res){
    try{
      CaseManager.findOne({
        where : {
          firstName : req.body.firstName,
          lastName : req.body.lastName,
        },
        attributes:['firstName', 'lastName', 'phone', 'email'], // Return CaseManager name, phone, & email
//        attributes:[], // Don't return CaseManager attributes
        include: [{
          model: Client,
          attributes:['firstName', 'lastName', "phone"], // Return Client name & phone
          include: [
            {
              model: CourtDate,
              attributes:['time', 'place']  // Return Array of Client Court Dates
            },
            {
              model: CheckIn,
              attributes:['time', 'lattitude', 'longitude'] // Return Array of Client CheckIn
            },
            {
              model: Message,
              attributes:['message', 'timeStamp'] // Return Array of Client Messages
            }
          ]
        },]
      })
      .then(clients => {
        res.send(clients);
      })
    }
    catch(err){
      res.send(err + " Failed to find clients");
    }
  });

  app.get('/dash/get-client', function(req,res){
    try{
      Client.findOne({
        where : {
          firstName : req.body.firstName,
          lastName : req.body.lastName,
        },
        attributes:['firstName', 'lastName', 'phone'], // Return Client name & phone
      })
      .then(client => {
          res.send(client);
      })
    }
    catch(err){
      res.send(err + " Failed to find client " + req.body.firstName + " " + req.body.lastName);
    }
  });

  app.get('/dash/all-casemgrs', function(req,res){
    try{
      CaseManager.findAll({
        attributes:['firstName', 'lastName', 'phone', 'email'], // Return CaseManager name, phone, & email
      })
      .then(caseManagers => {
        res.send(caseManagers);
      });
    }
    catch(err){
      res.send(err + " Failed to find client " + req.body.firstName + " " + req.body.lastName);
    }
  });

  // app.post('/dash/create-client', (req, res) => {
  //   try{
  //     Client.create({
  //       firstName: req.body.firstName,
  //       lastName: req.body.lastName,
  //       phone: req.body.phone,
  //       active: req.body.active
  //     })
  //     .then(() => {
  //       var fullName = req.body.firstName + " " + req.body.lastName;
  //       console.log("Client " + fullName + " Added");
  //       res.json("Client " + fullName + " Added");
  //     });
  //   }
  //   catch(err){
  //     res.send(err + " Failed to create client");
  //   }
  // });

  // app.post('/dash/create-casemgr', (req, res) => {
  //   CaseManager.create({
  //     firstName: req.body.firstName,
  //     lastName: req.body.lastName,
  //     phone: req.body.phone,
  //     email: req.body.email,
  //   })
  //   .then(() => {
  //     var fullName = req.body.firstName + " " + req.body.lastName;
  //     console.log("Case Manager " + fullName + " Added");
  //     res.json("Case Manager " + fullName + " Added");
  //   });
  // });

  app.post('/dash/fakeData', (req, res) => {
    CaseManager.create({
      firstName: 'Earl', lastName: 'Campbell', email: "tyrose34@cpu.com", phone: "555-343-3434",
    });
    CaseManager.create({
        firstName: 'Dan', lastName: 'Pastorini', email: "dan@cpu.com", phone: "555-777-7777",
    });

    // Client Billy Sims
    Client.create({
      firstName: 'Billy', lastName: 'Sims', phone:"555-200-2020",
      CaseManagerId : 1,
    });
    CourtDate.create({
      time : '2011-01-11 11:30:00', place : '1111 Someplace, Somewhere, UT',
      ClientId : 1,
    });
    CourtDate.create({
      time : '2011-11-11 11:30:00', place : '1111 Someplace, Somewhere, UT',
      ClientId : 1,
    });
    CheckIn.create({
      lattitude: 'lat1', longitude: 'lng1',
      ClientId : 1,
    });
    CheckIn.create({
      lattitude: 'lat2', longitude: 'lng2',
      ClientId : 1,
    });
    CheckIn.create({
      lattitude: 'lat3', longitude: 'lng3',
      ClientId : 1,
    });
    Message.create({
      ClientId : 1,
      message : "Hello from Billy Sims",
    })

    // Client Billy "White Shoes" Johnson
    Client.create({
      firstName: 'Billy', lastName: 'Johnson', phone:"555-200-2121",
      CaseManagerId : 1,
    });
    CourtDate.create({
      time : '2019-02-28 10:30:00', place : '2222 Someplace, Somewhere, UT',
      ClientId : 2,
    });
    CourtDate.create({
      time : '2019-03-14 10:30:00', place : '2222 Someplace, Somewhere, UT',
      ClientId : 2,
    });
    CheckIn.create({
      lattitude: 'lat2-1', longitude: 'lng2-1',
      ClientId : 2,
    });
    CheckIn.create({
      lattitude: 'lat2-2', longitude: 'lng2-2',
      ClientId : 2,
    });
    CheckIn.create({
      lattitude: 'lat2-3', longitude: 'lng2-3',
      ClientId : 2,
    });
    Message.create({
      ClientId : 2,
      message : 'Hello from Billy "White Shoes" Johnson',
    })

    console.log("Fake Clients & Case Managers Added");
    res.json("Fake Clients & Case Managers Added");
});

  app.use(express.static('./public'))
  app.listen(4200, function(){ console.log('Server listening on 4200')});

}
