let form= layui.form
let laypage = layui.laypage;
//定义查询参数  方便传送数据
let query = {
    pagenum : 1,  // 页码值
    pagesize : 5, // 每页显示多少条数据
    cate_id : "", // 文章分类的id
    state : "",  // 文章的状态 可选值:已发布/草稿
}
//================================获取文章列表============
getList()
function getList(){
    axios.get("/my/article/list",{
        params : query,
    }).then(res => {
        //  console.log(res);
        let htmlStr = template("alTpl",res.data)
        $("#tb").html(htmlStr)
        renderPage(res.data.total)
    })
}
// 处理时间
const padZero = n => n < 10 ? "0"+n : n
template.defaults.imports.getTime = function(time){
    let date = new Date()
    let year = date.getFullYear()
    let mon = padZero(date.getMonth()+1)
    let day = padZero(date.getDate())
    let h = padZero(date.getHours())
    let m = padZero(date.getMinutes())
    let s = padZero(date.getSeconds())
    return `${year}-${mon}-${day} ${h}:${m}:${s}`
}
//=======================筛选区域===================
// 获取分类数据
axios.get("/my/article/cates").then(res => {
    // console.log(res);
    res.data.data.forEach(item => {
        // console.log(item);
        $(`<option value="${item.Id}">${item.name}</option>`).appendTo("#sele")
    });
    form.render() // 更新渲染  不然看不到option
})
// 实现筛选功能
$("#form").on("submit",function(e){
    e.preventDefault()
    query.state = $("#stateSelect").val()  // 将下拉框选择好的值 赋值给query对象的文章的状态的属性
    query.cate_id = $("#sele").val()    // 将下拉框选择好的值 赋值给query对象的文章分类的id的属性
    query.pagenum = 1  // 让筛选好的从第一页显示
    getList()
})
// ========================分页区域========================
//分页处理函数
function renderPage(total){
    //执行一个laypage实例
    laypage.render({
      elem: 'page', //注意，这里的 page 是 ID，不用加 # 号
      count: total, //数据总数，从服务端得到
      curr : query.pagenum, // 起始页,从query对象中获取到
      limit : query.pagesize,  // limit 每页多少条
      limits :[2,3,4,5,10],
      jump: function(obj, first){
         //obj包含了当前分页的所有参数，比如：
         //console.log(obj.curr); //得到当前页，以便向服务端请求对应页的数据。
         query.pagenum = obj.curr  //query.pagenum 页码值
         //console.log(obj.limit); //得到每页显示的条数
         query.pagesize = obj.limit // 赋值每页显示的条数给pagesize
         //首次不执行,就是初始化不执行
           if(!first){
             //点击分页才执行
             getList()
           }
      },
      layout : ['count','limit','prev', 'page', 'next','skip']
    });
}
// ====================================实现删除功能==========================
$("#tb").on("click",".delBtn",function(){
    if($(".delBtn").length === 1){
        query.pagenum = query.pagenum === 1 ? 1 : query.pagenum -1
    }
    let id = $(this).attr("data-id")
    layer.confirm("确定删除?",{icon : 3 , title : "提示"},function(index){
        axios.get("/my/article/delete/" + id).then(res => {
            // console.log(res);
            if(res.data.status !== 0){
                return layer.msg(res.data.message)
            }
            layer.msg(res.data.message)
             layer.close(index);
             // 重新发送ajax获取最新数据 加载页面
            getList()
        })
    })
})
// ==================================编辑功能===============
$("#tb").on("click",".editBtn",function(){
    let id = $(this).attr("data-id")
    localStorage.setItem("editId",id)
    location.href = "/article/art_edit.html"
})