function getInfo(){
    axios.get("/my/userinfo").then(res => {
    // console.log(res);
    let form = layui.form
    //给表单赋值
   /*  form.val("form", { //form 即 class="layui-form" 所在元素属性 lay-filter="" 对应的值
        "username" : res.data.data.username,
        "nickname" : res.data.data.nickname,
        "email" : res.data.data.email
    }); */
    // 一行代码赋值
    form.val("form",res.data.data)
})
}
getInfo()
$("#infoform").on("submit",function(e){
    //阻止默认行为
    e.preventDefault()
    // 收集表单数据
    let data = $(this).serialize()
    // console.log(data);
    // 发送请求,完成更新
    axios.post("/my/userinfo",data).then(res => {
        // console.log(res);
        if(res.data.status === 0) {
            window.parent.getUserInfo()
        }
    })
})
$("#infoform").on("reset",function(e){
    e.preventDefault()
    getInfo()
})