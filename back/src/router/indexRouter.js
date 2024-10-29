const indexController = require("../controller/indexController");
const {jwtMiddleware}= require("../../jwtMiddleware");

exports.indexRouter = function(app){
    // app.get("/users", indexController.getUsers);
    // app.post("/user", indexController.postLogic);
    //일정 CRUD API
    app.post("/todo", jwtMiddleware, indexController.createTodo); //create
    app.get("/todos", jwtMiddleware, indexController.readTodo); // read /usuer/1/todos
    app.patch("/todo", jwtMiddleware, indexController.updateTodo); // update /user/1/updateTodo
    app.delete("/todo/:todoIdx", jwtMiddleware, indexController.deleteTodo); // delete /user/1/todo/1


};
