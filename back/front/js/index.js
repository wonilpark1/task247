setHeader();

async function setHeader(){
    //로컬스토리지 토큰 존재 검사
    const token = localStorage.getItem("x-access-token");

    //토큰 없을 시 signed 에 hidden 붙이기
    if(!token){
        const signed = document.querySelector(".signed");
        signed.classList.add("hidden");
        return;
    }



//토큰검증 API 요청
const config ={
    method: "get",
    url: url+ "/jwt",
    headers: {
        "x-access-token": token,
    },
};

    const res = await axios(config);
        //console.log(res);

        if(res.data.code !== 200){
            //alert(res.data.message);
            console.log("잘못된 접근입니다.");
            return;
        }
        
    const nickname = res.data.result.nickname;
    const spanNickname = document.querySelector("span#nickname"); //class는 .으로 잡아야 함. id는 #으로 잡아옴
    //console.log(spanNickname);
    //console.log(nickname);
    spanNickname.innerText= nickname; // 여기가 문제인듯??? html도 다시 볼것 거기서 안잡히는 거 같암


    //토큰 있을 시 unsigned 에 hidden 붙이기 
    const unsigned = document.querySelector(".unsigned");
    unsigned.classList.add("hidden");


};



//로그아웃 기능

const buttonSignout  = document.getElementById("sign-out");
buttonSignout.addEventListener("click",signout);

function signout(){
    localStorage.removeItem("x-access-token");
    location.reload();
}