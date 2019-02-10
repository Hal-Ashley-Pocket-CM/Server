module.exports=function(db){

  const connection = db.connection;
  const Client = db.client;
  const CaseManager = db.caseManager;

  
  const express = require('express');
  const app = express();
  app.use(express.json());

  app.get('/index/', function (req, res) {
    res.send('Hello World Index');
  });

  app.get('/dash/all-clients', function(req,res){
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
      lastCheckIn: req.body.checkIn,
      nextCourtDate: req.body.courtDate,
      lastMessage: req.body.message,
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
    Client.create({
      firstName: 'Billy',
      lastName: 'Sims',
      phone:"555-200-2020",
      lastCheckIn: '2019-02-07 21:34:00',
      nextCourtDate: '2019-02-28 10:30:00',
      lastMessage: "You are Back!"
    });
    Client.create({
        firstName: 'Billy',
        lastName: 'Johnson',
        phone:"555-200-2121",
        lastCheckIn: '2019-02-07 21:34:00',
        nextCourtDate: '2019-02-28 10:30:00',
        lastMessage: "You are Back!"
    });
    CaseManager.create({
        firstName: 'Earl',
        lastName: 'Campbell',
        email: "tyrose34@cpu.com",
        phone: "555-343-3434",
    });
    CaseManager.create({
        firstName: 'Dan',
        lastName: 'Pastorini',
        email: "dan@cpu.com",
        phone: "555-777-7777",
    });

    console.log("Fake Clients & Case Managers Added");
    res.json("Fake Clients & Case Managers Added");
});

  app.use(express.static('./public'))
  app.listen(4200, function(){ console.log('Server listening on 4200')});

}
