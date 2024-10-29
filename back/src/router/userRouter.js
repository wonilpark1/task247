const userController = require("../controller/userController");
const {jwtMiddleware}= require("../../jwtMiddleware");


exports.userRouter = function(app){
// 회원가입
    app.post("/user", userController.signup);
    app.post("/signin", userController.signin);
    app.get("/jwt",jwtMiddleware,userController.getNicknameByToken);
};