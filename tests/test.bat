rem curl -i -X POST http://localhost:4200/dash/fakeData
rem curl http://localhost:4200/dash/all-casemgrs
curl -X GET http://localhost:4200/dash/all-clients -H 'Content-Type: application/json' -H 'Postman-Token: a0d92f1b-342b-49da-9213-27ae23a68d23' -H 'cache-control: no-cache' -d '{"firstName" : "Earl","lastName" : "Campbell"}'
