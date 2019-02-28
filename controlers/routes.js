"use strict"

module.exports=function(db){

  const Client = db.Client;
  const CaseManager = db.CaseManager;
  const CourtDate = db.CourtDate;
  const CheckIn = db.CheckIn;
  const Message = db.Message;
  
  const express = require('express');
  const app = express();
  app.use(express.json());

  app.get('/index/', function (req, res) {
    res.send('Hello World Index');
  });

  /* --------------------------------------------------------------------------------------------------
  // Expects first name and last name of a case manager in the get request body
  // Returns all of the specified case manager's clients with their court dates, checkins, and messages
  ---------------------------------------------------------------------------------------------------- */
  app.get('/dash/all-clients', function(req,res){
    if (req.body.firstName == null || req.body.lastName == null){
      res.send("Invalid Input");
    } else {
    try{
      CaseManager.findOne({
        where : {
          firstName : req.body.firstName,
          lastName : req.body.lastName,
        },
        attributes:['firstName', 'lastName', 'phone', 'email'], // Return CaseManager name, phone, & email
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
        if (clients != null){
          res.send(clients);
        }
        else{
          res.send("Case manager: " + req.body.firstName + " " + req.body.lastName + " not found");
        }
      })
    }
    catch(err){
      res.send(err + " Failed to find clients");
    }
  }});

  /* --------------------------------------------------------------------------------------------------
  // Expects first name and last name of a client  in the get request body
  // Returns the specified client's information, court dates, checkins, and messages
  ---------------------------------------------------------------------------------------------------- */
  app.get('/dash/get-client', function(req,res){
    if (req.body.firstName == null || req.body.lastName == null){
      res.send("Invalid Input");
    } else {
    console.log('Get Client info for ' + req.body.firstName, req.body.lastName);
    try{
      Client.findAll({
        where : {
          firstName : req.body.firstName,
          lastName : req.body.lastName,
        },
        attributes:['firstName', 'lastName', 'phone', 'CaseManagerId'], // Return Client name & phone
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
          },
        ]
      })
      .then(client => {
        if (client == null) {
          console.log("Failed to find client " + req.body.firstName + " " + req.body.lastName);
          res.send("Failed to find client " + req.body.firstName + " " + req.body.lastName);
        } else {
          res.send(client);
        }
      })
    }
    catch(err){
      console.log(err + " Failed to find client ");
      res.send(err + " Failed to find client ");
    }
  }});

  /* --------------------------------------------------------------------------------------------------
  // Returns all of the case manangers with phone and email
  ---------------------------------------------------------------------------------------------------- */
  app.get('/dash/all-casemgrs', function(req,res){
    try{
      CaseManager.findAll({
        attributes:['firstName', 'lastName', 'phone', 'email','id'], // Return CaseManager name, phone, & email
      })
      .then(caseManagers => {
        res.send(caseManagers);
      });
    }
    catch(err){
      res.send(err + " Failed to find client " + req.body.firstName + " " + req.body.lastName);
    }
  });

/* --------------------------------------------------------------------------------------------------
  // Creates a new client - TBD should this be a put 
  ---------------------------------------------------------------------------------------------------- */
  app.post('/dash/create-client', (req, res) => {
    if (req.body.firstName == null || req.body.lastName == null|| req.body.phone == null  || req.body.caseManagerFirstName == null || req.body.caseManagerLastName == null){
      res.send("Invalid Input");
    } else {
      try {
        CaseManager.findOne({
          where : {
            firstName : req.body.caseManagerFirstName,
            lastName : req.body.caseManagerLastName,
          },
          attributes:['id']
        })
        .then (caseManager => {
          if (caseManager != null){
            try{
              Client.create({
                firstName: req.body.firstName,
                lastName: req.body.lastName,
                phone: req.body.phone,
                CaseManagerId : caseManager.id
              })
              .then(() => {
                res.send("Client " +req.body.firstName + " " + req.body.lastName + " Added");
              });
            }
            catch(err){
              res.send(err)
            }
          } else {
            res.send("Failed to find case manager " + req.body.caseManagerFirstName + " " + req.body.caseManagerLastName);
          }
        });
      }
      catch(err){
        res.send(err + " Failed to create client");
      }
    }
  });

/* --------------------------------------------------------------------------------------------------
// Add a new Checkin
---------------------------------------------------------------------------------------------------- */
  app.post('/dash/add-checkin', (req, res) => {
    console.log(req.body)
    if (req.body.firstName == null || req.body.lastName == null|| req.body.time == null || req.body.lattitude == null || req.body.longitude == null){
      res.send("Invalid Input");
    } else {
      try {
        Client.findOne({
          where : {
            firstName : req.body.firstName,
            lastName : req.body.lastName,
          },
          attributes:['id']
        })
        .then (client => {
          if (client != null){
            try{
              CheckIn.create({
                time : req.body.time,
                lattitude: req.body.lattitude,
                longitude: req.body.longitude,
                ClientId : client.id
              })
              .then(() => {
                res.send("Check in for  " + req.body.firstName + " " + req.body.lastName + " added");
              });
            }
            catch(err){
              res.send(err)
            }
          } else {
            res.send("Failed to find client " + req.body.firstName + " " + req.body.lastName);
          }
        });
      }
      catch(err){
        res.send(err + " Failed to add checkin");
      }
    }
  });

/* --------------------------------------------------------------------------------------------------
// Add a new Court Date
---------------------------------------------------------------------------------------------------- */
  app.post('/dash/add-courtdate', (req, res) => {
    if (req.body.firstName == null || req.body.lastName == null || req.body.time == null|| req.body.place == null){
      res.send("Invalid Input");
    } else {
      try {
        Client.findOne({
          where : {
            firstName : req.body.firstName,
            lastName : req.body.lastName,
          },
          attributes:['id']
        })
        .then (client => {
          if (client != null){
            try{
              CourtDate.create({
                time: req.body.time,
                place: req.body.place,
                ClientId : client.id
              })
              .then(() => {
                res.send("Court Date for  " + req.body.firstName + " " + req.body.lastName + " added");
              });
            }
            catch(err){
              res.send(err)
            }
          } else {
            res.send("Failed to find client " + req.body.firstName + " " + req.body.lastName);
          }
        });
      }
      catch(err){
        res.send(err + " Failed to add court date");
      }
    }
  });

  /* --------------------------------------------------------------------------------------------------
  // Creates a new case manager - TBD should this be a put 
  ---------------------------------------------------------------------------------------------------- */
  app.post('/dash/create-casemgr', (req, res) => {
    if (req.body.firstName == null || req.body.lastName == null || req.body.email == null || req.body.phone == null) {
      res.send("Invalid Input");
    } else {
    try{
        CaseManager.create({
          firstName: req.body.firstName,
          lastName: req.body.lastName,
          phone: req.body.phone,
          email: req.body.email,
      })
      .then(() => {
        console.log("Case Manager " + req.body.firstName + " " + req.body.lastName + " Added");
        res.send("Case Manager " +req.body.firstName + " " + req.body.lastName + " Added");
      });
    }
    catch(err){
      res.send(err + " Failed to create Case Manager");
    }
  }});

  /* --------------------------------------------------------------------------------------------------
  // Creates fake clients and case managers
  ---------------------------------------------------------------------------------------------------- */
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
