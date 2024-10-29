readTodo();

//일정R
async function readTodo() {
  //토큰 없으면 리턴
  const token = localStorage.getItem("x-access-token");
  if (!token) {
    return;
  }

  //일정조회 api 호출
  const config = {
    method: "get",
    url: url + "/todos",
    headers: { "x-access-token": token },
  };

  try {
    const res = await axios(config);
    //console.log(res);
    if (res.data.code !== 200) {
      alert(res.data.message);
      return false;
    }

    const todoDataSet = res.data.result;
    //console.log(todoDataSet);

    //const section;

    for (let section in todoDataSet) {
      //console.log(section);
      //섹션별 ul테그 선택
      const sectionUl = document.querySelector(`#${section} ul`);

      //섹션별 데이터
      const arrayForEachSection = todoDataSet[section];
      //console.log(arrayForEachSection);

      let result = "";
      for (let todo of arrayForEachSection) {
        let element = `
    <li class="list-item" id=${todo.todoIdx}>
        <div class="done-text-container">
          <input type="checkbox" class="todo-done" ${todo.status==='C' ? "checked" : ""}>
          <p class="todo-text">${todo.contents}</p>
        </div>
    <!-- done-text-container -->
        <div class="update-delete-container"> 
          <i class="todo-update fa-solid fa-pencil"></i>
          <i class="todo-delete fa-solid fa-eraser"></i>
        </div>
    </li> `;
    result += element;
      }

      sectionUl.innerHTML = result;
    }
  } catch (err) {
    console.error(err);
  }
}


//일정 CUD
const matrixContainer = document.querySelector(".matrix-container");
matrixContainer.addEventListener("keypress", cudController);
matrixContainer.addEventListener("click", cudController);


function cudController(event){
    const token = localStorage.getItem("x-access-token");
    if(!token){
        return;
    }

    //console.log(event);

    const target = event.target;
    const targetTagName = target.tagName;
    const eventType = event.type;
    const key = event.key;

//create 이벤트 처리
    if (targetTagName ==="INPUT" && key ==="Enter"){
        createTodo(event, token);
        return;
    }

//update 이벤트 처리

//체크박스 업데이트
    if (target.className ==="todo-done" && eventType ==="click"){
        updateTodoDone(event, token);        
        return;
    }

//컨텐츠 업데이트
const firstClassName = target.className.split(" ")[0];
if (firstClassName === "todo-update" && eventType === "click"){
  updateTodoContents(event, token);
  return;
} 

//delete 이벤트 처리
if (firstClassName === "todo-delete" && eventType === "click"){
  
  deleteTodoContents(event, token);
  return;
}
}

//일정 생성하기 post
async function createTodo(event,token){
    const contents = event.target.value;
    const type = event.target.closest(".matrix-item").id;

    //console.log(contents, type);
    if (!contents){
        alert("내용을 입력해주세요.")
        return false;
    }

    const config ={
        method: "post",
        url: url+"/todo",
        headers: {"x-access-token": token},
        data: {
            contents: contents, 
            type: type,
        },
    };

    try {    
        const res = await axios(config); 
        if(res.data.code !== 200){
            alert(res.data.message);
            return false;
        }
        //DOM 업데이트
        readTodo();
        event.target.value = "";
        return true;

    } catch (err){
        console.log(err);
        return false;
    }

}

//일정 업데이트 하기
async function updateTodoDone(event, token){
    
    const status = event.target.checked ? "C" : "A";
    const todoIdx = event.target.closest(".list-item").id;

    //console.log(todoIdx);

    const config ={
      method: "patch",
      url: url+"/todo",
      headers: {"x-access-token": token},
      data: {
          todoIdx: todoIdx, 
          status: status,
      },
  };

  //console.log(config);
  //const res = await axios(config); 
  try {    
      const res = await axios(config); 
      if(res.data.code !== 200){
          alert(res.data.message);
          return false;
      }
      //DOM 업데이트
      readTodo();
      //event.target.value = "";
      return true;

  } catch (err){
      console.log(err);
      return false;
  }
}

async function updateTodoContents(event, token) {

  const contents = prompt("내용을 입력해주세요");
  const todoIdx = event.target.closest(".list-item").id;

  //console.log(todoIdx);

  const config ={
    method: "patch",
    url: url+"/todo",
    headers: {"x-access-token": token},
    data: {
        todoIdx: todoIdx, 
        contents: contents,
    },
};

//console.log(config);
//const res = await axios(config); 
try {    
    const res = await axios(config); 
    if(res.data.code !== 200){
        alert(res.data.message);
        return false;
    }
    //DOM 업데이트
    readTodo();
    //event.target.value = "";
    return true;

} catch (err){
    console.log(err);
    return false;
}
}

async function deleteTodoContents(event, token) {

  const isValidReq = confirm("삭제하시겠습니까? 삭제 후에는 복구가 어렵습니다.");
  if(!isValidReq) {
    return false;
  }

  const todoIdx = event.target.closest(".list-item").id;

  //console.log(todoIdx);

  const config ={
    method: "delete",
    url: url+"/todo/"+todoIdx,  //`/todo/${todoIdx}` 이거도 가능(문자 리터럴 방식)
    headers: {"x-access-token": token},

};

//console.log(config);
//const res = await axios(config); 
try {    
    const res = await axios(config); 
    if(res.data.code !== 200){
        alert(res.data.message);
        return false;
    }
    //DOM 업데이트
    readTodo();
    //event.target.value = "";
    return true;

} catch (err){
    console.log(err);
    return false;
}
}