const indexDao = require("../dao/indexDao");

exports.dummy = function(req,res){
    return res.send("it works");
};

exports.postLogic = function(req,res){
    const {name} = req.body;
    return res.send(name);
};

exports.getUsers = async function(req,res){
    const[userRows] = await indexDao.getUserRows();
    return res.send(userRows);
};

exports.createTodo = async function(req,res) {

    const {userIdx} = req.verifiedToken;
    const{ contents, type }  = req.body;

    if (!userIdx || !contents || !type){
        return res.send({
            isSuccess: false,
            code: 400,
            message:"입력값이 누락되었습니다."
        })
    }

    //콘텐츠 20글자 이하
    if (contents.length >20){
        return res.send({
            isSuccess: false,
            code: 401,
            message: "콘텐츠는 20글자 이하로 설정해주세요.",
        })
    }
    //type: do, decide, delete, delegate 중 하나로만
    const validTypes = ["do", "decide", "delete", "delegate"];
    if(!validTypes.includes(type)){
        return res.send({
            isSuccess: false,
            code:400,
            message:"유효한 타입이 아닙니다.",
        });
    }

    const insertTodoRow = await indexDao.insertTodo(userIdx, contents, type);
     if(!insertTodoRow){
        return res.send({
            isSuccess: false,
            code: 403,
            message: "요청에 실패했습니다. 관리자에게 문의하세요.",
        });
        }
        return res.send({
            isSuccess: true,
            code: 200,
            message: "일정 생성 성공!",
        });
        
};

exports.readTodo = async function(req,res) {
    const {userIdx} = req.verifiedToken;
    const todos = {};
    const types = ["do", "decide", "delegate", "delete"];

    for(let type of types){
        let selectTodoByTypeRows = await indexDao.selectTodoByType(userIdx, type);

        todos[type]= selectTodoByTypeRows;

        if(!selectTodoByTypeRows){
            return res.send({
                isSuccess: false,
                code: 403,
                message: "일정조회 요청에 실패했습니다. 관리자에게 문의하세요.",
            });
            }

    }
            
    return res.send({
        result: todos,
        isSuccess: true,
        code: 200,
        message: "유저 일정 목록 조회 성공"
    })



};


exports.updateTodo = async function(req,res) {
    const {userIdx} = req.verifiedToken;
    let { todoIdx, contents, status }  = req.body;

    if (!userIdx || !todoIdx ){
        return res.send({
            isSuccess: false,
            code: 400,
            message:"user 또는 todo 입력값이 누락되었습니다."
        })
    }

    if(!contents){
        contents=null;
    }
    if(!status){
        status=null;
    }
    //콘텐츠 20글자 이하 (컨텐츠 null인 경우 렝쓰를 딸 수 업어서 에러남 null이 아닌경우에만 발동)
    if (contents != null && contents.length >20 ){
        return res.send({
            isSuccess: false,
            code: 401,
            message: "콘텐츠는 20글자 이하로 설정해주세요.",
        })
    }    
    
    const isValidTodoRow = await indexDao.selectValidTodo(userIdx, todoIdx);
    if(!isValidTodoRow || isValidTodoRow<1){
        return res.send({
            isSuccess: false,
            code: 403,
            message: "해당 todo 검색을 실패했습니다. 관리자에게 문의하세요.",
        });
        }
    
    const updateTodoRow = await indexDao.updateTodo(userIdx, todoIdx, contents, status);
    if(!updateTodoRow){
       return res.send({
           isSuccess: false,
           code: 403,
           message: "갱신 요청에 실패했습니다. 관리자에게 문의하세요.",
       });
       }
       return res.send({
        result: updateTodoRow,
        isSuccess: true,
        code: 200,
        message: "일정 갱신 성공!",
       });
};

//todo 삭제
exports.deleteTodo = async function(req,res) {
    const {userIdx} = req.verifiedToken;
    const {todoIdx} = req.params;

    if (!userIdx || !todoIdx ){
        return res.send({
            isSuccess: false,
            code: 400,
            message:"user 또는 todo 입력값이 누락되었습니다."
        })
    }
    
    const isValidTodoRow = await indexDao.selectValidTodo(userIdx, todoIdx);
    if(!isValidTodoRow || isValidTodoRow<1){
        return res.send({
            isSuccess: false,
            code: 403,
            message: "해당 todo 검색을 실패했습니다. 관리자에게 문의하세요.",
        });
        }
    
    const deleteTodoRow = await indexDao.deleteTodo(userIdx, todoIdx);
    if(!deleteTodoRow){
       return res.send({
           isSuccess: false,
           code: 403,
           message: "삭제 요청에 실패했습니다. 관리자에게 문의하세요.",
       });
       }
       return res.send({
        result: deleteTodoRow,
        isSuccess: true,
        code: 200,
        message: "일정 삭제 성공!",
       });
};