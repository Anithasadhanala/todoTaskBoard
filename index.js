const express = require('express');
const app = express();
const phpmyadmin = require('mysql')
const bodyParser = require('body-parser')
const cors = require("cors")
const path = require('path')
const { v4: uuidv4 } = require('uuid');



app.use(express.static(path.join(__dirname+'/public/dist')))


app.use(cors())
app.use(express.json())
app.use(bodyParser.urlencoded({extended: true}))


//Database connection
const db = phpmyadmin.createPool({
    host: "sql12.freesqldatabase.com",
    user: "sql12673622",
    port: "3306",
    password: "4YtUInQKuv",
    database: "sql12673622",
    insecureAuth : true
})



// GET API for all projects
app.get('/projects', function (request, response) {
    const q = "select * from projects";
    db.query(q,(err,res)=>{
        response.send(res)  
    })
});


// GET API for all todos
app.get('/todos', function (request, response) {
    const q = "select * from todo"
    db.query(q,(err,res)=>{
    response.send(res);
  })
});


// GET API for getting todos of a specific projectId
app.get('/todo/:projectId', function (request, response) {
  const { projectId } = request.params;
  const q = `select * from todo where project_id = "${projectId}";`
  db.query(q,(err,res)=>{
  response.send(res);
})
});


// POST API that adds the projects
app.post('/project-add',function(request,response){
    const uuid = uuidv4()
    const {projectName} = request.body;
    const q = `insert into projects values("${uuid}","${projectName}")`;
    db.query(q,(err,res)=>{
        response.send(res)
    })
});


// POST API that adds the todo into the table
app.post('/todo-add',function(request,response){
  const uuid = uuidv4()
  const {taskName,startDate,endDate,taskStatus,projectId} = request.body;
  const q = `insert into todo values("${projectId}","${uuid}","${taskName}","${startDate}","${endDate}","${taskStatus}");`
  db.query(q,(err,res)=>{
      response.send(res)
  })
});


// PUT API that edits the changes in todo
app.put('/todo-edit',function(request,response){
  const uuid = uuidv4()
  let {taskName,startDate,endDate,taskStatus,todoId} = request.body;
  startDate = startDate.slice(0,10)
  endDate = endDate.slice(0,10)
  const q = `update  todo set task_name = "${taskName}", start_time = "${startDate}", end_time = "${endDate}",task_status = "${taskStatus}" where 
             todo_id = "${todoId}" ;`
  db.query(q,(err,res)=>{
   response.send(res)
  })
});



// DELETE API that deletes a project with specific projectId
app.delete('/project-delete/:projectId', function (request, response) {
  const { projectId } = request.params;
  const q = `delete from projects where project_id="${projectId}" ;`
  const q2 = `delete from todo where project_id="${projectId}" ;`
  db.query(q,(err,res)=>{
    console.log(res)
  })
  db.query(q2,(err,res)=>{
    console.log(res)
  })
  response.send("done")
});



// DELETE API that deletes a todo with a specific todoId
app.delete('/todo-delete/:todoId', function (request, response) {
  const { todoId } = request.params;
  const q = `delete from todo where todo_id="${todoId}" ;`
  db.query(q,(err,res)=>{
    console.log(res)
  })
  response.send("done")
});




// PORT of this server running
app.listen(3000, function () {
  console.log('Example app listening on port 3000!');
});