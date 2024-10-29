//토큰 검사 후 로그인 시 못들어오게 막기
const token = localStorage.getItem("x-access-token");
if(token){
    alert("로그아웃 후 이용해주세요");
    location.href= "index.html";
}


//이메일 
const inputEmail = document.getElementById("email");
const emailMessage = document.querySelector("div.email-message");
inputEmail.addEventListener("input", isValidEmail);
//비번
const inputPassword = document.getElementById("password");
const passwordMessage = document.querySelector("div.password-message");
inputPassword.addEventListener("input", isValidPassword);
//비번확인
const inputPasswordConfirm = document.getElementById("password-confirm");
const passwordConfirmMessage = document.querySelector("div.password-confirm-message");
inputPasswordConfirm.addEventListener("input", isValidPasswordConfirm);

//닉네임 확인
const inputNickname = document.getElementById("nickname");
const nicknameMessage = document.querySelector("div.nickname-message");
inputNickname.addEventListener("input", isValidNickname);
console.log(inputNickname);

//이메일 형식 검사
function isValidEmail(event) {
    const currentEmail = inputEmail.value;
    // console.log(currentEmail.length);
    const emailReg = /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*\.[a-zA-Z]{2,3}$/i;

    if(!emailReg.test(currentEmail) && currentEmail.length !== 0){
        emailMessage.style.visibility = "visible";
        return false;
    } 

    if(currentEmail.length == 0){
        return false;
    } 
    
    emailMessage.style.visibility = "hidden";
    return true;

}


//비번 형식 검사
function isValidPassword (event) {
    const currentPassword = inputPassword.value;
    // console.log(currentPassword.length);
    const passwordReg = /^(?=.*[a-zA-Z])(?=.*[!@#$%^*+=-])(?=.*[0-9]).{8,100}$/;

    if( (!passwordReg.test(currentPassword) || currentPassword.length < 8 )&& currentPassword.length !== 0){
        passwordMessage.style.visibility = "visible";
        return false;
    } 

    if(currentPassword.length == 0){
        return false;
    } 
    
    passwordMessage.style.visibility = "hidden";
    return true;

}

//비번 확인 검사
function isValidPasswordConfirm (event) {
    const currentPasswordConfirm = inputPasswordConfirm.value;
    const currentPassword = inputPassword.value;
    //console.log(currentPasswordConfirm.length);

    if( currentPassword !== currentPasswordConfirm && currentPasswordConfirm.length !== 0){
        passwordConfirmMessage.style.visibility = "visible";
        return false;
    } 

    if(currentPasswordConfirm.length == 0){
        return false;
    } 
    
    passwordConfirmMessage.style.visibility = "hidden";
    return true;

}

//닉네임 검사
function isValidNickname (event) {
    const currentNickname = inputNickname.value;
    console.log(currentNickname);

    if( (currentNickname.length > 10 || currentNickname.length <2) && currentNickname.length !== 0){
        nicknameMessage.style.visibility = "visible";
        return false;
    } 
    
    if(currentNickname.length == 0){
        return false;
    } 

    nicknameMessage.style.visibility = "hidden";
    return true;

}

//회원가입 API요청
const buttonSignup = document.getElementById("signup");
buttonSignup.addEventListener("click", signup)

async function signup(event){
    const isValidReq = isValidPassword()&&isValidNickname()&&isValidPasswordConfirm()&&isValidEmail();
    //console.log(isValidPassword()&&isValidNickname()&&isValidPasswordConfirm()&&isValidEmail());    
    if(!isValidReq){
        alert("회원정보를 확인해주세요.");
        return false;
    }

    const currentEmail = inputEmail.value;
    const currentPassword = inputPassword.value;
    const currentNickname = inputNickname.value;

    const config ={
        method: "post",
        url: url+ "/user",
        data: {
            email: currentEmail,
            password: currentPassword,
            nickname: currentNickname,
        },
    };

    try {
    const res= await axios(config);
        console.log(res);
        if(res.data.code=== 400){
            alert(res.data.message);
            location.reload();
            return false;

        }

        if(res.data.code=== 200){
            alert(res.data.message);
            location.href = "signin.html";
            return true;

        }


    }catch(err){
        console.error(err);
    }

}