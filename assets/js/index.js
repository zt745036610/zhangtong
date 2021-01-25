function getUserInfo(){
    axios.get("/my/userinfo",{
       /*  headers : {
            Authorization : localStorage.getItem("token")
        } */
    }).then(res => {
        // console.log(res);
        nameAddtou(res.data)  //调用下面写好的处理数据的函数
    })
}
getUserInfo()
function nameAddtou(ddd){
    let name = ddd.data.nickname || ddd.data.username  // 有昵称就显示昵称,没有就显示用户名
    // console.log(name[0]);
    $("#welcome").text("欢迎 " + name)
    if(ddd.data.user_pic){   // 如果头像图片有地址  就显示图片头像,没有就显示文字头像
        $(".layui-nav-img").attr("src",ddd.data.user_pic).show()
        $(".text_tou").hide()
    }else {
        $(".text_tou").text(name[0].toUpperCase()).show()
        $(".layui-nav-img").hide()
    }
}
$("#logoutBtn").click(function(){
    layer.confirm('确定退出登录?', {icon: 3, title:'提示'}, function(index){  //confirm 提示框
        localStorage.removeItem("token")  //删除token
        location.href = "/home/login.html"  // 返回登陆页面
        layer.close(index);
});
})