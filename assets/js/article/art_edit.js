let form = layui.form
// console.log(form);
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

//创建option添加到select下
axios.get("/my/article/cates").then(res => {
    // console.log(res);
    res.data.data.forEach(item => {
        $(`<option value="${item.Id}">${item.name}</option>`).appendTo("#select")
    });
    form.render() // 更新渲染  不然看不到option
})
// 给表单赋值
let id = localStorage.getItem("editId")
axios.get("/my/article/"+id).then(res => {
    console.log(res);
     // $("#select").val(res.data.data.cate_id)
     // $("#content").val(res.data.data.content)
    // form.val("aeForm",res.data.data)
    form.val("aeForm",{
        //"Id": res.data.data.Id,
        //"author_id": res.data.data.author_id,
        "cate_id": res.data.data.cate_id,
        "content": res.data.data.content,
        // "cover_img": res.data.data.cover_img,
       // "is_delete": res.data.data.is_delete,
       // "pub_date": res.data.data.pub_date,
        //"state": res.data.data.state,
        "title": res.data.data.title,
    })
})


//==========================更新  未完成==============
let state
$("#btn1").on("click",function(){
    state = "已发布"
})
$("#btn2").on("click",function(){ 
    state = "草稿"
})
$("#aeForm").on("submit",function(e){
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
        fd.append("Id",id)
        fd.append("cover_img",blob)
        fd.append("state",state)
        pubArt(fd)
    })
})
function pubArt(data){
     axios.post("/my/article/edit",data).then(res => {
            // console.log(res);
            if(res.data.status !== 0){
                return layer.msg(res.data.message)
            }
            layer.msg(res.data.message,function(){
                localStorage.removeItem("editId")
                location.href = "/article/art_list.html"
            })
        })
}