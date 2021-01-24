$(function(){
    // 去注册账号
    $('#gotoRegi').click(function(){
        // 显示注册界面
        $(".regiBox").show()
        // 隐藏登录界面
        $(".loginBox").hide()
    })

    // 去登陆
    $('#gotoLogin').click(function(){
        // 显示登录界面
        $(".loginBox").show()
        // 隐藏注册界面
        $(".regiBox").hide()
    })

    // 从layui中获取到form相关功能(表单校验) , 以下代码必须写,否则报错
    let form = layui.form;  
    // 表单自定义校验规则
    form.verify({
        //我们既支持上述函数式的方式，也支持下述数组的形式
        //数组的两个值分别代表：[正则匹配、匹配不符时的提示文字]
        // pass 是我们自己定义的规则
        pass: [
            /^[\S]{6,12}$/
            ,'密码必须6到12位，且不能出现空格'
        ],
        //要求确认密码框的内容和密码框的内容保持一致
        // 1,获取确认密码框的内容
        // 2,获取密码框的内容
        // 3,比较
        repass: function(value,item){
            // console.log(value,item);  // value 确认密码框的值  item 确认密码框的DOM元素
            // 细节: 获取密码框的内容一定是注册form表单中的密码框,不是登录的
            let pwd = $('#pwd').val()
            if(value !== pwd){
                return "两次密码不一致"
            }
        }
    });    
    
    // 注册的   ajax =====================================================================
    $(".regiBox form").on("submit",function(e){
        e.preventDefault();
        let data = $(this).serialize() // 收集表单数据
        console.log(data);
        // axios
         axios.post("/api/reguser",data).then(res => {
            console.log(res);
            if(res.data.status !== 0){
                //注册失败
                return layer.msg(res.data.message)  //layer.msg  实现弹框
            }
            layer.msg("注册成功,请登录")
            $("#gotoLogin").click()
        }) 
    })
    //  登录的 ajax =====================================================================
   $(".loginBox form").on('submit',function(e){
        e.preventDefault()
        let data = $(this).serialize()
        axios.post("/api/login",data).then(res=>{
            console.log(res);
            if(res.data.status !== 0){
                //注册失败
                return layer.msg(res.data.message)  //layer.msg  实现弹框
            }
            // 存储 token身份认证信息
            localStorage.setItem("token",res.data.token)
            // layer.msg("登录成功,即将跳转至首页")
            // location.href = "/home/index.html" 
           layer.msg("登录成功",function(){  // 跳转之后做一写事
                location.href = "/home/index.html"
            })
        })
    }) 
})