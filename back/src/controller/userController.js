const userDao = require("../dao/userDao");
const jwt = require("jsonwebtoken");
const{jwtSecret} = require("../../secret")


exports.signin = async function (req, res) {
    const {email, password} = req.body;


    if(!email || !password){
        return res.send({
            isSuccess: false,
            code: 400,
            message: "회원정보를 입력해주세요.",
        })
       };

    //회원여부검사

    const isValidUser = await userDao.selectUser(email, password);
       
    if(isValidUser.length < 1){
        return res.send({
            isSuccess: false,
            code: 400,
            message: "회원정보가 없습니다.",
        })
       };
       
       if(!isValidUser){
        return res.send({
            isSuccess: false,
            code: 400,
            message: "DB에러입니다.",
        })
       };
       
const [userinfo] = isValidUser;
const userIdx = userinfo.userIdx;
    //jwt토큰 발급
       const token = jwt.sign(
        {userIdx:userIdx}, //페이로드
        jwtSecret  //시크릿키
       );

       return res.send({
        result: token,
        isSuccess: true,
        code: 200,
        message: "로그인 성공!",
    })

};

exports.signup = async function (req, res) {
   const {email, password, nickname} = req.body;
   
   


   if(!email || !password || !nickname){
    return res.send({
        isSuccess: false,
        code: 400,
        message: "회원가입 입력값을 확인해주세요.",
    })
   };

   const isEmailValid = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;
   if(!isEmailValid.test(email)){
    return res.send({
        isSuccess: false,
        code: 400,
        message: "이메일 형식을 확인해주세요.",
    })
   };

   const isPasswordValid = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,100}$/; //영문,숫자,특문, 8자 이상
   if(!isPasswordValid.test(password)){
    return res.send({
        isSuccess: false,
        code: 400,
        message: "페스워드 형식(영문,숫자,특문, 8자 이상)을 확인해주세요.",
    })
   };


   if(nickname.length<2 || nickname.length>10){
    return res.send({
        isSuccess: false,
        code: 400,
        message: "닉네임 길이를 확인해주세요(2자 이상 10자 이하)",
    })
   };

   const isDuplicatedEmail = await userDao.SelectUserByEmail(email);
  
   if(isDuplicatedEmail.length>0){
    return res.send({
        isSuccess: false,
        code: 400,
        message: "이메일이 중복됩니다.",
    })
   };


const insertUserRow = await userDao.insertUser(email, password, nickname);

if(!insertUserRow){
    return res.send({
        isSuccess: false,
        code: 400,
        message: "회원정보가 생성되지 않았습니다. 관리자에게 문의하세요.",
    })
   };

   return res.send({
    isSuccess: true,
    code: 200,
    message: "회원가입 성공!",
})
};

exports.getNicknameByToken = async function (req, res) {
    const {userIdx} = req.verifiedToken;
    
    const [userInfo] = await userDao.selectNicknameByUserIdx(userIdx);
    
    const nickname= userInfo.nickname;

    return res.send({
        result: {nickname: nickname},
        isSuccess: true,
        code: 200,
        message: "token검증 성공!",
    })
 };