let form = layui.form
// ajax请求 获取文章列表
getCates()
function getCates(){
    axios.get("/my/article/cates").then(res => {
    // console.log(res);
    let htmlStr = template("tpl",res.data)
    $('tbody').html(htmlStr)
})
}
let index; // 在这里声明,方便后面关闭弹窗
// 添加文章
$("#addBtn").on('click',function(){
    // layer.open()创建弹窗
        index = layer.open({  
        type: 1,
        title : "添加分类信息",
        area : "500px",
        content: $("#addFormTpl").html(), //没有数据,不需要使用template函数
        });
})
// form是动态创建出来的,不能绑定
// $("form").on("submit",function(){})

// 需要用事件委托来给form绑定事件
$("body").on("submit","#addForm",function(e){
    e.preventDefault()
    // console.log('11');
    // 获取form表单数据
    let data = $(this).serialize()
    axios.post("/my/article/addcates",data).then(res => {
        // console.log(res);
        if(res.data.status !== 0){
            return layer.msg(res.data.message)
        }
        layer.msg(res.data.message)
        //layer.close()关闭弹框
        layer.close(index)
        getCates()
    })
})
// ========================================编辑======================
let editIndex;
$("tbody").on("click",".editBtn",function(){
    let id = $(this).attr("data-id")
    axios.get("/my/article/cates/"+id).then(res => {
        console.log(res);
        form.val("editForm",res.data.data)
    })
        editIndex = layer.open({  
        type: 1,
        title : "编辑分类信息",
        area : "500px",
        content: $("#editFormTpl").html(), 
        });
})
$("body").on("submit","#editForm",function(e){
    e.preventDefault()
    // 获取form表单数据
    let data = $(this).serialize()
    axios.post("/my/article/updatecate",data).then(res => {
        //  console.log(res);
        if(res.data.status !== 0){
            return layer.msg(res.data.message)
        }
        layer.msg(res.data.message)
        //layer.close()关闭弹框
        layer.close(editIndex)
        // 重新发送ajax获取最新数据 加载页面
        getCates()
    })
})
//=========================================删除============================
$("tbody").on("click",".delBtn",function(){
    let id = $(this).attr("data-id")
    // 询问框
    layer.confirm('确定删除?', {icon: 3, title:'删除'}, function(index){
        axios.get("/my/article/deletecate/" + id).then(res => {
            // console.log(res);
            if(res.data.status !== 0){
                return layer.msg(res.data.message)
            }
            layer.msg(res.data.message)
            layer.close(index)
             // 重新发送ajax获取最新数据 加载页面
            getCates()
        })
    });
})