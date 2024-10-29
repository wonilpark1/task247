const {pool}= require("../../database");

exports.getUserRows = async function() {
    try {
        const connection = await pool.getConnection(async (conn) => conn);
        try{
            const selectUserQuery = "SELECT * FROM Users;";
            const[row]=await connection.query(selectUserQuery);
            connection.release();

            return row;

        } catch(err){
            console.error('##getUserRows Querys error##');
            return false;
        }
    } catch(err){
        console.error('##getUserRows DB error##');
        return false;
    }
};
exports.insertTodo = async function(userIdx, contents, type){
    try {
    //DB연결검사
    const connection = await pool.getConnection(async (conn) => conn);
        try{
            //쿼리
            const insertTodoQuery = "insert into Todos (userIdx, contents, type) values (?,?,?);";
            const insertTodoPrams = [userIdx, contents, type];
            const[row]=await connection.query(insertTodoQuery,insertTodoPrams);
            connection.release();
    
            return row;
    
        } catch(err){
            console.error('##insertTodo Querys error## \n ${err}');
            connection.release();
            return false;
        }
    } catch(err){
        console.error('##insertTodo DB error## \n ${err}');
        return false;
    }
    
};

exports.selectTodoByType = async function (userIdx, type) {
    try {
        //DB연결검사
        const connection = await pool.getConnection(async (conn) => conn);
            try{
                //쿼리 (D는 제외)
                const selectTodoQuery = "SELECT todoIdx, contents, status FROM task247db.Todos where userIdx = ? and type = ? and not(status = 'D');";
                const selectTodoParams = [userIdx, type];
                const[row]=await connection.query(selectTodoQuery,selectTodoParams);
                connection.release();
        
                return row;
        
            } catch(err){
                console.error('##selectTodo Querys error## \n ${err}');
                connection.release();
                return false;
            }
        } catch(err){
            console.error('##selectTodo DB error## \n ${err}');
            return false;
        }
};

exports.selectValidTodo = async function(userIdx, todoIdx){
    try {
        //DB연결검사
        const connection = await pool.getConnection(async (conn) => conn);
            try{
                //쿼리
                const selectValideTodoQuery = "SELECT * FROM task247db.Todos where userIdx = ? and todoIdx = ? and not(status = 'D');";
                const selectValideTodoParams = [userIdx, todoIdx];
                const[row]=await connection.query(selectValideTodoQuery,selectValideTodoParams);
                connection.release();   
        
                return row;
        
            } catch(err){
                console.error('##selectValideTodoTodo Querys error## \n ${err}');
                connection.release();
                return false;
            }
        } catch(err){
            console.error('##selectValideTodoTodo DB error## \n ${err}');
            return false;
        }    
 
};

exports.updateTodo = async function (userIdx, todoIdx, contents, status) {
    try {
        //DB연결검사
        const connection = await pool.getConnection(async (conn) => conn);
            try{
                //쿼리
                const updateTodoQuery = "update task247db.Todos set status = ifnull(?,status), contents = ifnull(?,contents)  where userIdx = ? and todoIdx = ?;";
                const updateTodoParams = [status,contents,userIdx, todoIdx ];
                const[row]=await connection.query(updateTodoQuery,updateTodoParams);
                connection.release();
        
                return row;
        
            } catch(err){
                console.error('##updateTodo Querys error## \n ${err}');
                connection.release();
                return false;
            }
        } catch(err){
            console.error('##updateTodo DB error## \n ${err}');
            return false;
        }    
    
};

exports.deleteTodo = async function (userIdx, todoIdx) {
    try {
        //DB연결검사
        const connection = await pool.getConnection(async (conn) => conn);
            try{
                //쿼리
                const updateTodoQuery = "update task247db.Todos set status= 'D' where userIdx = ? and todoIdx = ?;";
                const updateTodoParams = [userIdx, todoIdx ];
                const[row]=await connection.query(updateTodoQuery,updateTodoParams);
                connection.release();
        
                return row;
        
            } catch(err){
                console.error('##deleteTodo Querys error## \n ${err}');
                connection.release();
                return false;
            }
        } catch(err){
            console.error('##deleteTodo DB error## \n ${err}');
            return false;
        }    
    
};