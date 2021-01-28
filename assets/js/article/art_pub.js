//创建option添加到select下
axios.get("/my/article/cates").then(res => {
    // console.log(res);
    res.data.data.forEach(item => {
        $(`<option value="${item.Id}">${item.name}</option>`).appendTo("#select")
    });
    form.render() // 更新渲染  不然看不到option
})
let form = layui.form
// 初始化富文本编辑器
initEditor()


// 图片插件
// 1.1 获取裁剪区域的 DOM 元素
let  $image = $('#image')
// 1.2 配置选项
const options = {
    // 纵横比
    aspectRatio: 400 / 280,
    // 指定预览区域
    preview: '.img-preview'
}

// 1.3 创建裁剪区域
$image.cropper(options)



// =========================================选择封面============
$(".fileBtn").on('click',function(){
    $("#fileBtn").click()
})
//文件域的操作
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
//==========================发布==============
let state
$("#btn1").on("click",function(){
    state = "已发布"
})
$("#btn2").on("click",function(){ 
    state = "草稿"
})
$("#sendForm").on("submit",function(e){
    e.preventDefault()
    $image.cropper("getCroppedCanvas",{
        width : 400,
        height : 280,
    }).toBlob( blob => {
        // 将Canvas 画布上的内容 转为文件对象
        // 得到文件对象后 进行后续的操作
        // console.log(blob);
        // console.log(state);
        let fd = new FormData(this)
        //console.log(fd); // fd 打印是看不到的
        // fd.forEach((value,key) => {
        //     console.log(value,key);
        // })
        fd.append("cover_img",blob)
        fd.append("state",state)
        pubArt(fd)
    })
})
function pubArt(data){
     axios.post("/my/article/add",data).then(res => {
            // console.log(res);
            if(res.data.status !== 0){
                return layer.msg(res.data.message)
            }
            layer.msg(res.data.message)
            location.href = "/article/art_list.html"
        })
}

