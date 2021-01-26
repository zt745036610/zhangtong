let form = layui.form
form.verify({
    newpwd:function(value, item){ //value：表单的值、item：表单的DOM对象
      if(value === $("[name=oldPwd]").val()){
          return "不能与原密码相同"
      }
    },
    repwd : function(value,item){
        if(value !== $("[name=newPwd]").val()){
            return "两次新密码不一致"
        }
    },
    //我们既支持上述函数式的方式，也支持下述数组的形式
    //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
    pass: [
      /^[\S]{6,12}$/
      ,'密码必须6到12位，且不能出现空格'
    ] 
});      
$("#pwdform").on("submit",function(e){
    e.preventDefault()
    let data = $(this).serialize()
    axios.post("/my/updatepwd",data).then(res => {
        // console.log(res);
        if(res.data.status !== 0){
            return layer.msg(res.data.message)
        }
        layer.msg(res.data.message,function(){
            localStorage.removeItem("token")
            window.parent.location.href = "/home/login.html"
        })
    })
})