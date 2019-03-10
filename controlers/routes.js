"use strict"

module.exports=function(db){

  const MY_SECRET = "my secret";
  const CASE_MANAGER_TOKEN = "CaseManager";
  const CLIENT_TOKEN = "Client";

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

  function verifyToken(headers, expectedType)
  {
    var authzId = 0;

    var token = headers['x-access-token'];
    if (token == null){
      token = headers['authorization'];
      if (token != null && token.startsWith('Bearer ')) {
        // Remove Bearer from string
        token = token.slice(7, token.length);
      }
    }
       
    if (token != null) {
      jwt.verify(token, MY_SECRET, function(err, decoded) {
        if (!err && decoded.type == expectedType) {
          authzId = decoded.id
        }
      })
    }

    return authzId;
  }

  /* --------------------------------------------------------------------------------------------------
  // Expects a email and password in request body
  // Validates the password and returns a JWT
  ---------------------------------------------------------------------------------------------------- */
  app.get('/dash/login', function(req, res){
    if (req.body.email == null || req.body.password == null){
      return res.sendStatus(400);
    }

    // Find Case Manager using email
    CaseManager.findOne({
      where : {email : req.body.email}
    })
    .then (casemgr => {   

      // If email not found or password doesn't match send Unauthorized respose
      if (casemgr == null || bcrypt.compareSync(req.body.password, casemgr.password) == false){
        return res.sendStatus(401);
      }
    
      // Generate and return JWT
      const expiration = 86400; // expires in 24 hours
      var token = jwt.sign({ id: casemgr.id, type: CASE_MANAGER_TOKEN}, MY_SECRET, { expiresIn: expiration});
      res.send({ auth: true, token: token });
    })
  })

  /* --------------------------------------------------------------------------------------------------
  // Expects a phone number and password in request body
  // Validates the password and returns a JWT
  ---------------------------------------------------------------------------------------------------- */
  app.get('/dash/client-login', function(req, res){
    if (req.body.phone == null || req.body.password == null){
      return res.sendStatus(400);
    }
    
    // Find Client using phone
    Client.findOne({
      where : {phone : req.body.phone}
    })
    .then (client => {

      // If phone not found or password doesn't match send Unauthorized respose
      if (client == null || bcrypt.compareSync(req.body.password, client.password) == false){
        return res.sendStatus(401);
      }
    
      // Generate and return JWT
      const expiration = 86400; // expires in 24 hours
      var token = jwt.sign({ id: client.id, type: CLIENT_TOKEN}, MY_SECRET, { expiresIn: expiration});
      res.send({ auth: true, token: token });
    })
  })

/* --------------------------------------------------------------------------------------------------
  // Expects a email, current password, and new password in request body
  // Validates the current password and set the new password as the detabase password 
  ---------------------------------------------------------------------------------------------------- */
  app.get('/dash/change-password', function(req, res){
    if (req.body.email == null || req.body.password == null || req.body.newPassword == null){
      return res.sendStatus(400);
    }

    // Find email
    CaseManager.findOne({
      where : {email : req.body.email}
    })
    .then (casemgr => {

      // If email not found or password doesn't match send Unauthorized respose
      if (casemgr == null || bcrypt.compareSync(req.body.password, casemgr.password) == false){
        return res.sendStatus(401);
      }
      
      var hashedPassword = bcrypt.hashSync(req.body.newPassword, 8);
      casemgr.update({
        password: hashedPassword
      })
      .catch (err => {
        return(err);
      })
      .then(() => {
        return res.sendStatus(200);
      });
    }) 
  })

/* --------------------------------------------------------------------------------------------------
  // Expects a email, current password, and new password in request body
  // Validates the current password and set the new password as the detabase password 
  ---------------------------------------------------------------------------------------------------- */
  app.get('/dash/client-change-password', function(req, res){
    if (req.body.phone == null || req.body.password == null || req.body.newPassword == null){
      return res.sendStatus(400);
    }

    // Find phone
    Client.findOne({
      where : {phone : req.body.phone}
    })
    .then (client => {

      // If phone not found or password doesn't match send Unauthorized respose
      if (client == null || bcrypt.compareSync(req.body.password, client.password) == false){
        return res.sendStatus(401);
      }

      var hashedPassword = bcrypt.hashSync(req.body.newPassword, 8);
      client.update({
        password: hashedPassword
      })
      .catch (err => {
        return(err);
      })
      .then(() => {
        return res.sendStatus(200);
      });
    })
  }) 

  /* --------------------------------------------------------------------------------------------------
  // Doesn't do anything 
  ---------------------------------------------------------------------------------------------------- */
  app.get('/dash/logout', function(req, res) {
    return res.sendStatus(200);
  });

  /* --------------------------------------------------------------------------------------------------
  // Returns all of the specified case manager's clients with their court dates, checkins, and messages
  // Expects a JWT for a case manager in the header field x-access-token
  ---------------------------------------------------------------------------------------------------- */
  app.get('/dash/all-clients', function(req, res){
    const authzId = verifyToken(req.headers, CASE_MANAGER_TOKEN);
    if (authzId == 0){
      return res.sendStatus(401); // not authorized 
    }

    // Find case manager and associated clients
    CaseManager.findOne({
      where : {id : authzId},
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
      }]
    })
    .catch(err => {
      return res.sendStatus(err);
    })
    .then(clients => {
      if (clients == null){
        return res.sendStatus(204); // No content
      }
      else{
        return res.send(clients);
      }
    })
  })

  
  /* --------------------------------------------------------------------------------------------------
  // Returns the specified client's information, court dates, checkins, and messages
  // Expects case manager JWT, first name and last name of a client in the get request body
  ---------------------------------------------------------------------------------------------------- */
  app.get('/dash/get-client', function(req, res){
    if (req.body.firstName == null || req.body.lastName == null){
      return res.sendStatus(400); // bad request
    }

    const authzId = verifyToken(req.headers, CASE_MANAGER_TOKEN);
    if (authzId == 0){
      return res.sendStatus(401); // not authorized 
    }

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
      return res.sendStatus(err);
    })
    .then(client => {
      if (client == null){
        return res.sendStatus(204); // No content
      }
      else{
        return res.send(client);
      }
    })
  })

  /* --------------------------------------------------------------------------------------------------
  // Returns all of the case manangers with phone and email.  Expects the JWT of a case manager. 
  ---------------------------------------------------------------------------------------------------- */
  app.get('/dash/all-casemgrs', function(req, res){
    const authzId = verifyToken(req.headers, CASE_MANAGER_TOKEN);
    if (authzId == 0){
      return res.sendStatus(401); // not authorized 
    }

    CaseManager.findAll({
      attributes:['firstName', 'lastName', 'phone', 'email'], // Return CaseManager name, phone, & email
    })
    .catch(err => {
      return res.sendStatus(err);
    })
    .then(caseManagers => {
      res.send(caseManagers);
    });
  });
 
/* --------------------------------------------------------------------------------------------------
  // Creates a new client. Expects a case manager JWT
  ---------------------------------------------------------------------------------------------------- */
  app.post('/dash/create-client', (req, res) => {
    if (req.body.firstName == null || req.body.lastName == null|| req.body.phone == null || req.body.password == null){
      return res.sendStatus(400); // bad request
    }

    const authzId = verifyToken(req.headers, CASE_MANAGER_TOKEN);
    if (authzId == 0){
      return res.sendStatus(401); // not authorized 
    }
     
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
    Client.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      password : hashedPassword,
      CaseManagerId : authzId,
    })
    .catch(err => {
      return res.sendStatus(err);
    })
    .then(() => {
      return res.sendStatus(200);
    })
  });

/* --------------------------------------------------------------------------------------------------
// Add a new Checkin. Expects a client JWT
---------------------------------------------------------------------------------------------------- */
  app.post('/dash/add-checkin', (req, res) => {
    if (req.body.time == null || req.body.lattitude == null || req.body.longitude == null){
      return res.sendStatus(400); // bad request
    }

    const authzId = verifyToken(req.headers, CLIENT_TOKEN);
    if (authzId == 0){
      return res.sendStatus(401); // not authorized 
    }

    CheckIn.create({
      time : req.body.time,
      lattitude: req.body.lattitude,
      longitude: req.body.longitude,
      ClientId : authzId
    })
    .catch(err => {
      return res.sendStatus(err);
    })
    .then(() => {
      return res.sendStatus(200);
    });
  });

/* --------------------------------------------------------------------------------------------------
// Add a new Court Date. Expects a client JWT
---------------------------------------------------------------------------------------------------- */
  app.post('/dash/add-courtdate', (req, res) => {
    if (req.body.time == null|| req.body.place == null){
      return res.sendStatus(400); // bad request
    }

    const authzId = verifyToken(req.headers, CLIENT_TOKEN);
    if (authzId == 0){
      return res.sendStatus(401); // not authorized 
    }

    CourtDate.create({
      time: req.body.time,
      place: req.body.place,
      ClientId :authzId
    })
    .catch(err => {
      return res.sendStatus(err);
    })
    .then(() => {
      return res.sendStatus(200);
    });
  });

  /* --------------------------------------------------------------------------------------------------
  // Creates a new case manager.  Expects a case manager JWT
  ---------------------------------------------------------------------------------------------------- */
  app.post('/dash/create-casemgr', (req, res) => {
    if (req.body.firstName == null || req.body.lastName == null || req.body.phone == null || req.body.email == null || req.body.password == null) {
      return res.sendStatus(400); // bad request
    }

    const authzId = verifyToken(req.headers, CASE_MANAGER_TOKEN);
    if (authzId == 0){
      return res.sendStatus(401); // not authorized 
    }

    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
    CaseManager.create({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      phone: req.body.phone,
      email: req.body.email,
      password: hashedPassword
    })
    .catch(err => {
      return res.sendStatus(err);
    })
    .then(() => {
      return res.sendStatus(200);
    });
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
