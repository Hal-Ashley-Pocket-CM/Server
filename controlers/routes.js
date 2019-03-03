"use strict"

module.exports=function(db){

  const My_Secret = "my secret";

  const Client = db.Client;
  const CaseManager = db.CaseManager;
  const CourtDate = db.CourtDate;
  const CheckIn = db.CheckIn;
  const Message = db.Message;
  
  const jwt = require('jsonwebtoken');
  const bcrypt = require('bcryptjs');
  const express = require('express');
  const app = express();
  app.use(express.json());

  app.get('/index/', function (req, res) {
    res.send('Hello World Index');
  });

  /* --------------------------------------------------------------------------------------------------
  // Expects a email and password in request body
  // Validates the password and returns a JWT
  ---------------------------------------------------------------------------------------------------- */
  app.get('/dash/login', function(req,res){
    if (req.body.email == null || req.body.password == null){
      res.send("Invalid Input");
    } else {
      CaseManager.findOne({
        where : {email : req.body.email}
      })
      .catch(err => {
        res.send(err + " Failed to find case manager");
      })
      .then (casemgr => {
        var pwdValid = bcrypt.compareSync(req.body.password, casemgr.password);
        if (!pwdValid) {
          return res.status(401).send({ auth: false, token: null });
        }
        const expiration = 86400; // expires in 24 hours
        var token = jwt.sign({ id: casemgr.id }, My_Secret, { expiresIn: expiration});
        res.status(200).send({ auth: true, token: token });
      })
    }
  })

  /* --------------------------------------------------------------------------------------------------
  // Expects a email, current password, and new password in request body
  // Validates the current password and set the new password as the detabase password 
  ---------------------------------------------------------------------------------------------------- */
  app.get('/dash/change-password', function(req,res){
    if (req.body.email == null || req.body.password == null || req.body.newPassword == null){
      res.send("Invalid Input");
    } else {
      CaseManager.findOne({
        where : {email : req.body.email}
      })
      .catch(err => {
        res.send(err + " Failed to find case manager");
      })
      .then (casemgr => {
        var pwdValid = bcrypt.compareSync(req.body.password, casemgr.password);
        if (!pwdValid) {
          res.status(401).send({ auth: false, token: null });
        } else {
          var hashedPassword = bcrypt.hashSync(req.body.newPassword, 8);
          casemgr.update({
            password: hashedPassword
          })
          .catch (err => {
            res.send(err + " Failed to change password");
          })
          .then(() => {
            res.send("Password Changed");
          });
        } 
      })
    }
  })

  /* --------------------------------------------------------------------------------------------------
  // Doesn't do anything 
  ---------------------------------------------------------------------------------------------------- */
  app.get('/dash/logout', function(req, res) {
    res.status(200).send({ auth: false, token: null });
  });

  /* --------------------------------------------------------------------------------------------------
  // Expects a JWT for  a case manager in the header field x-access-token
  // Returns all of the specified case manager's clients with their court dates, checkins, and messages
  ---------------------------------------------------------------------------------------------------- */
  app.get('/dash/all-clients', function(req, res){
    var token = req.headers['x-access-token'];
    if (!token) {
      res.send("No token sent");
    } else {
      jwt.verify(token, My_Secret, function(err, decoded) {
        if (err) {
          res.send('Failed to authenticate token.');
        }
        else {
          CaseManager.findOne({
            where : {id : decoded.id},
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
          .catch(err => {
            res.send(err + " Failed to find clients");
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
      })
    } 
  })

  /* --------------------------------------------------------------------------------------------------
  // Expects first name and last name of a case manager in the get request body
  // Returns all of the specified case manager's clients with their court dates, checkins, and messages
  ---------------------------------------------------------------------------------------------------- */
  app.get('/dash/all-clients-old', function(req,res){
    if (req.body.firstName == null || req.body.lastName == null){
      res.send("Invalid Input");
    } else {
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
      .catch(err => {
        res.send(err + " Failed to find clients");
      })
      .then(clients => {
        if (clients != null){
          res.send(clients);
        }
        else{
          res.send("Case manager: " + req.body.firstName + " " + req.body.lastName + " not found");
        }
      })
  }});

  /* --------------------------------------------------------------------------------------------------
  // Expects first name and last name of a client in the get request body
  // Returns the specified client's information, court dates, checkins, and messages
  ---------------------------------------------------------------------------------------------------- */
  app.get('/dash/get-client', function(req,res){
    if (req.body.firstName == null || req.body.lastName == null){
      res.send("Invalid Input");
    } else {
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
      .catch(err => {
        res.send(err + " Failed to find client ");
      })
      .then(client => {
        if (client == null) {
          res.send("Failed to find client " + req.body.firstName + " " + req.body.lastName);
        } else {
          res.send(client);
        }
      })
    }});

  /* --------------------------------------------------------------------------------------------------
  // Returns all of the case manangers with phone and email
  ---------------------------------------------------------------------------------------------------- */
  app.get('/dash/all-casemgrs', function(req,res){
    CaseManager.findAll({
      attributes:['firstName', 'lastName', 'phone', 'email','id'], // Return CaseManager name, phone, & email
    })
  .catch(err => {
    res.send(err + " Failed to find client " + req.body.firstName + " " + req.body.lastName);
  })
  .then(caseManagers => {
      res.send(caseManagers);
    });
  });

/* --------------------------------------------------------------------------------------------------
  // Creates a new client
  ---------------------------------------------------------------------------------------------------- */
  app.post('/dash/create-client', (req, res) => {
    if (req.body.firstName == null || req.body.lastName == null|| req.body.phone == null  || req.body.caseManagerFirstName == null || req.body.caseManagerLastName == null){
      res.send("Invalid Input");
    } else {
      CaseManager.findOne({
        where : {
          firstName : req.body.caseManagerFirstName,
          lastName : req.body.caseManagerLastName,
        },
        attributes:['id']
      })
      .catch(err => {
        res.send(err + " Failed to find Case Manager")
      })
      .then (caseManager => {
          if (caseManager != null){
            var hashedPassword = bcrypt.hashSync(req.body.password, 8);
            Client.create({
              firstName: req.body.firstName,
              lastName: req.body.lastName,
              phone: req.body.phone,
              password : hashedPassword,
              CaseManagerId : caseManager.id,
            })
            .catch(err => {
              res.send(err + " Failed to create client " + req.body.firstName + " " + req.body.lastName);            
            })
            .then(() => {
              res.send("Client " + req.body.firstName + " " + req.body.lastName + " Added");
            });
          } else {
            res.send("Failed to find case manager " + req.body.caseManagerFirstName + " " + req.body.caseManagerLastName);
          }
        });
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
      Client.findOne({
        where : {
          firstName : req.body.firstName,
          lastName : req.body.lastName,
        },
        attributes:['id']
      })
      .catch( err => {
        res.send(err + " Failed to find client " + req.body.firstName + " " + req.body.lastName);
      })
      .then (client => {
        if (client != null){
          CheckIn.create({
            time : req.body.time,
            lattitude: req.body.lattitude,
            longitude: req.body.longitude,
            ClientId : client.id
          })
          .catch(err => {
            res.send(err + " failed check in for " + req.body.firstName + " " + req.body.lastName)
          })
          .then(() => {
            res.send("Check in for  " + req.body.firstName + " " + req.body.lastName + " added");
          });
        } else {
          res.send("Failed to find client " + req.body.firstName + " " + req.body.lastName);
        }
      });
    }
  });

/* --------------------------------------------------------------------------------------------------
// Add a new Court Date
---------------------------------------------------------------------------------------------------- */
  app.post('/dash/add-courtdate', (req, res) => {
    if (req.body.firstName == null || req.body.lastName == null || req.body.time == null|| req.body.place == null){
      res.send("Invalid Input");
    } else {
      Client.findOne({
        where : {
          firstName : req.body.firstName,
          lastName : req.body.lastName,
        },
        attributes:['id']
      })
      .catch( err => {
        res.send(err + " Failed to find client " + req.body.firstName + " " + req.body.lastName);
      })
      .then (client => {
        if (client != null){
          CourtDate.create({
            time: req.body.time,
            place: req.body.place,
            ClientId : client.id
          })
          .catch(err => {
            res.send(err + " failed court date for " + req.body.firstName + " " + req.body.lastName)
          })
          .then(() => {
            res.send("Court Date for  " + req.body.firstName + " " + req.body.lastName + " added");
          });
        } else {
          res.send("Failed to find client " + req.body.firstName + " " + req.body.lastName);
        }
      });
    }
  });

  /* --------------------------------------------------------------------------------------------------
  // Creates a new case manager
  ---------------------------------------------------------------------------------------------------- */
  app.post('/dash/create-casemgr', (req, res) => {
    if (req.body.firstName == null || req.body.lastName == null || req.body.email == null || req.body.phone == null) {
      res.send("Invalid Input");
    } else {
      var hashedPassword = bcrypt.hashSync(req.body.password, 8);
      CaseManager.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        phone: req.body.phone,
        email: req.body.email,
        password: hashedPassword
      })
      .catch(err => {
        res.send(err + " failed create case manager " + req.body.firstName + " " + req.body.lastName)
      })
      .then(() => {
        res.send("Case anager " +req.body.firstName + " " + req.body.lastName + " Added");
      });
    }
  });

  /* --------------------------------------------------------------------------------------------------
  // Creates fake clients and case managers
  ---------------------------------------------------------------------------------------------------- */
  app.post('/dash/fakeData', (req, res) => {
    var hashedPassword = bcrypt.hashSync('password', 8);
    CaseManager.create({
      firstName: 'Earl', lastName: 'Campbell', email: "tyrose34@cpu.com", phone: "555-343-3434", password : hashedPassword,
    });
    CaseManager.create({
        firstName: 'Dan', lastName: 'Pastorini', email: "dan@cpu.com", phone: "555-777-7777", password : hashedPassword,
    });

    // Client Billy Sims
    Client.create({
      firstName: 'Billy', lastName: 'Sims', phone:"555-200-2020", password : hashedPassword,
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
      firstName: 'Billy', lastName: 'Johnson', phone:"555-200-2121", password : hashedPassword,
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

} // export function end
