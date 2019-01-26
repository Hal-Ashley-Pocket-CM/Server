module.exports=function(app){

app.get('/index/', function (req, res) {
  res.send('Hello World Index');
});

app.get('/dash/all-clients', function(req,res){
  res.send('Get All Clients OK');
})
}
