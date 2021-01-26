// 1.1 获取裁剪区域的 DOM 元素
let  $image = $('#image')

// 1.2 配置选项
const options = {
    // 纵横比
    aspectRatio: 1,
    // 指定预览区域
    preview: '.img-preview'
}

// 1.3 创建裁剪区域
$image.cropper(options)
// 第一次进入更换头像页面或更换头像之后 让画布加载成最新的头像
function tou(){
    axios.get("/my/userinfo").then(res => {
    if(res.data.data.user_pic){
            // console.log(res);
           $image.cropper('destroy').attr("src",res.data.data.user_pic).cropper(options)
        }
})
}
tou()
$("#imgBtn").on("click",function(){
    $("#fileBtn").click()
    //getImg()
})
// 文件与改变就会触发 change事件
$("#fileBtn").on("change",function(){
    // 1 获取用户选择的图片
    // console.log(this.files);
    let file = this.files[0]
    // 2 把用户选择的图片设置到裁剪区域
    if(!file){  // 如果没有选择图片 后面代码不执行
        return
    }
       // 2.1 根据选择的文件，创建一个对应的 URL 地址：
    let newImgURL = URL.createObjectURL(file)
    // console.log(newImgURL);
        // 2.2 先`销毁`旧的裁剪区域，再`重新设置图片路径`，之后再`创建新的裁剪区域`：
    $image
   .cropper('destroy')      // 销毁旧的裁剪区域
   .attr('src', newImgURL)  // 重新设置图片路径
   .cropper(options)        // 重新初始化裁剪区域
})
$("#sureBtn").on("click",function(){
    let dataURL = $image
        .cropper('getCroppedCanvas', { // 创建一个 Canvas 画布
            width: 100,
            height: 100
        })
        .toDataURL('image/png')       // 将 Canvas 画布上的内容，转化为 base64 格式的字符串
    // console.log(dataURL);
    axios.post("/my/update/avatar","avatar="+ encodeURIComponent(dataURL)).then(res => {
        // console.log(res);
        if(res.data.status !== 0){
            return layer.msg("更换头像失败")
        }
        layer.msg(res.data.message)
        window.parent.getUserInfo()
        tou()
    })
})