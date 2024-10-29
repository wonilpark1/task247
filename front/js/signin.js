//토큰 검사 후 로그인 시 못들어오게 막기
const token = localStorage.getItem("x-access-token");
if(token){
    alert("로그아웃 후 이용해주세요");
    location.href= "index.html";
}

// //로컬스토리지 아이템 생성
// localStorage.setItem("x-access-token", "dummy token");


// //로컬 스토리지 아이템 불러오기
// localStorage.getItem("x-access-token");

// //로컬 스토리지 아이템 삭제
// localStorage.removeItem("x-access-token");

const buttonSignin = document.getElementById("signin");
const inputEmail= document.getElementById("email");
const inputPassword= document.getElementById("password");

buttonSignin.addEventListener("click",signin);

//로그인 처리 함수
async function signin(event){
    const currentEmail = inputEmail.value;
    const currentPassword = inputPassword.value;

    if(!currentEmail || !currentPassword){
        alert("입력값이 누락되었습니다.");
        return false;
       };

//로그인 API 요청
const config ={
    method: "post",
    url: url+ "/signin",
    data: {
        email: currentEmail,
        password: currentPassword,
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
        localStorage.setItem("x-access-token", res.data.result);
        //console.log( res.data.result);
        location.href = "index.html";
        return true;
    }


}catch(err){
    console.error(err);
}

}