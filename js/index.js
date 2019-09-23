/*
 * @Author: li_x
 * @LastEditors: Do not edit
 * @Date: 2019-09-20 10:03:57
 * @LastEditTime: 2019-09-23 14:42:15
 * @Version: 1.0
 * @Description: 描述
 * @Company: 济南广域软件
 * @Copyright: Copyright (c) Jnwat Soft
 * @Remarks: 备注
 */
/**
 * 拖拽的方法
 * 
 */

var boxEdit = document.getElementById("rightBox")
var flag = false

/* 右侧nav */
var btn = document.querySelector("nav .btn")
var nav = document.querySelector("nav")


/**
 *  获取input
 */
var inpBjputh = document.querySelector("#bjputh")
var inpName = document.querySelector("#name")
var inpX = document.querySelector("#x")
var inpY = document.querySelector("#y")
var inpW = document.querySelector("#w")
var inpH = document.querySelector("#h")
var inpData = document.querySelector("#data")
var bjp = getStyle(boxEdit, 'backgroundImage')
inpBjputh.value = bjp

var acitveDom;

function allowDrop(ev) {
    ev.preventDefault();
}



function drag(ev) {
    if (ev.cancelBubble) {
        ev.cancelBubble = true;//IE8一下阻止事件冒泡
    } else {
        ev.stopPropagation();//其它浏览器阻止事件冒泡
    }
    ev.dataTransfer.setData("Text", ev.target.id);

}

function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("Text");
    /* 解决原元素消失的问题  克隆节点而不是直接追加节点 */
    var dom = document.getElementById(data).cloneNode(true)
    /* 解决box2中元素可以自己复制自己 */
    dom.setAttribute('draggable', false)
    dom.classList.add("posa")
    // 添加移动事件
    dom.onclick = toggleClass
    dom.onmousedown = down
    dom.onmousemove = move
    ev.target.appendChild(dom);
}
// 事件委派
boxEdit.onclick = function (ev) {
    var ev = ev || window.event;//做event兼容
    var target = event.target || event.srcElement;//做事件源兼容
    // 必须触发一次才能绑定事件 想想办法
    if (target === boxEdit) {
        var tems = document.querySelectorAll(".tem")
        for (var i = 0; i < tems.length; i++) {
            tems[i].classList.remove("border")
            tems[i].style.cursor = 'auto'
        }
    } else {
        // target.parentNode.addEventListener("click", toggleClass, true)
        // target.click()
    }

}
// boxEdit.onmousedown = function (ev) {
//     var ev = ev || window.event;//做event兼容
//     var target = event.target || event.srcElement;//做事件源兼容

//     if (target === boxEdit) {
//         return false
//     } else {
//         target.parentNode.addEventListener("mousedown", down, true)
//     }
// }
// boxEdit.onmousemove = function (ev) {
//     var ev = ev || window.event;//做event兼容
//     var target = event.target || event.srcElement;//做事件源兼容

//     if (target === boxEdit) {
//         return false
//     } else {
//         target.parentNode.addEventListener("mousemove", move, true)
//     }

// }
// 点击事件
function toggleClass(ev) {
    ev.stopPropagation()
    if (flag === false) {
        acitveDom = this
        var tems = document.querySelectorAll(".tem")
        for (var i = 0; i < tems.length; i++) {
            tems[i].style.cursor = 'auto'
            if (tems[i] === this) {
                continue;
            }
            tems[i].classList.remove("border")
        }
        this.classList.toggle("border")
        if (this.classList.contains('border')) {
            if (getStyle(nav, "right") !== "0px") {
                btn.click()
            }
            inpName.value = this.getAttribute("id")
            inpX.value = getStyle(this, 'left')
            inpY.value = getStyle(this, 'top')
            inpW.value = getStyle(this, 'width')
            inpH.value = getStyle(this, 'height')
            inpData.value = this.getAttribute("data")
        }
    }

}

function down(ev) {
    ev.stopPropagation()

    flag = false

    var timeout = setTimeout(function () {
        flag = true
    }, 150)
    var that = this
    var ev = ev || event;
    that.style.zIndex = 1
    var disW = that.offsetWidth;   //元素  的宽度
    var disH = that.offsetHeight;  //元素  的高度
    var disL = that.offsetLeft;    //元素  左侧距离 父级 左侧 的距离
    var disT = that.offsetTop;     //元素  顶部距离 父级 顶部 的距离

    var disX = ev.clientX;         //鼠标  距离 屏幕 左侧 的距离
    var disY = ev.clientY;         //鼠标  距离 屏幕 顶部 的距离
    var mouseElX = ev.offsetX;     //鼠标  距离 元素 左侧 的距离
    var mouseElY = ev.offsetY;     //鼠标  距离 元素 顶部 的距离

    var eidtW = boxEdit.offsetWidth // 父元素 的宽度
    var eidtH = boxEdit.offsetHeight // 父元素 的高度

    var oLeft = disX - disL;  // 算出鼠标距离元素左侧的距离
    var oTop = disY - disT; // 算出鼠标距离元素顶部的距离

    boxEdit.onmousemove = function (ev) {
        var ev = ev || event;
        // 鼠标移动的x轴和Y轴
        var setX = ev.clientX - oLeft
        var setY = ev.clientY - oTop
        // 利用 mouseElX  mouseElY  进行判断是否在范围内
        // 如果在放大缩小的范围之内
        if (mouseElX >= disW - 15 && mouseElY >= disH - 15 && that.classList.contains('border')) {
            // 这时候等比例放大

            that.style.width = disW + setX - disL + "px"
            that.style.height = disH + setY - disT + "px"
            inpW.value = getStyle(that, 'width')
            inpH.value = getStyle(that, 'height')

        } else if (mouseElX <= 15 && mouseElY <= 15 && that.classList.contains('border')) {
            // 这时候 等比例放大
            // x轴加多少,left减多少
            // y轴加多少,top减多少
            that.style.width = disW - setX + disL + "px"
            that.style.height = disH - setY + disT + "px"
            that.style.top = disT + setY - disT + "px"
            that.style.left = disL + setX - disL + "px"
            inpW.value = getStyle(that, 'width')
            inpH.value = getStyle(that, 'height')
            inpX.value = getStyle(that, 'left')
            inpY.value = getStyle(that, 'top')
        } else if (mouseElX <= 15 && that.classList.contains('border')) {
            that.style.width = disW - setX + disL + "px"
            that.style.left = disL + setX - disL + "px"
            inpW.value = getStyle(that, 'width')
            inpH.value = getStyle(that, 'height')
            inpX.value = getStyle(that, 'left')
            inpY.value = getStyle(that, 'top')
        } else if (mouseElX >= disW - 15 && that.classList.contains('border')) {
            // 这时候放大缩小x轴
            console.log(setX, setY, "---", disW, disH, "---", disL, disT)
            console.log(setX - disL)
            that.style.width = disW + setX - disL + "px"
            inpW.value = getStyle(that, 'width')
            inpH.value = getStyle(that, 'height')
        } else if (mouseElY <= 15 && that.classList.contains('border')) {
            console.log(setY, disT)
            that.style.height = disH - setY + disT + "px"
            that.style.top = disT + setY - disT + "px"
            inpW.value = getStyle(that, 'width')
            inpH.value = getStyle(that, 'height')
            inpX.value = getStyle(that, 'left')
            inpY.value = getStyle(that, 'top')
        } else if (mouseElY >= disH - 15 && that.classList.contains('border')) {
            // 这时候放大缩小Y轴
            that.style.height = disH + setY - disT + "px"
            inpW.value = getStyle(that, 'width')
            inpH.value = getStyle(that, 'height')
        }
        else {
            // 如果不在放大缩小的范围之内 就认为是移动

            if (setX <= -1) {
                setX = 0
            }
            if (setY <= -1) {
                setY = 0
            }
            if (setX >= eidtW - disW - 1) {
                setX = eidtW - disW
            }
            if (setY >= eidtH - disH - 1) {
                setY = eidtH - disH

            }
            that.style.left = setX + 'px';

            that.style.top = setY + 'px';
            inpX.value = getStyle(that, 'left')
            inpY.value = getStyle(that, 'top')
        }

    }

    boxEdit.onmouseup = function (ev) {
        clearTimeout(timeout)
        that.style.zIndex = 0
        boxEdit.onmousemove = boxEdit.onmouseup = null;
    }
}
function move(ev) {
    // 此处阻止事件流会卡顿
    // ev.stopPropagation()

    if (this.classList.contains('border')) {
        var disW = this.offsetWidth;   //元素  的宽度
        var disH = this.offsetHeight;  //元素  的高度
        var mouseElX = ev.offsetX;     //鼠标  距离 元素 左侧 的距离
        var mouseElY = ev.offsetY;     //鼠标  距离 元素 顶部 的距离
        if ((mouseElX >= disW - 15 && mouseElY >= disH - 15) || (mouseElX <= 15 && mouseElY <= 15)) {
            // 这时候改变鼠标样式为 \ 的
            this.style.cursor = 'se-resize '
        } else if (mouseElX >= disW - 15 || mouseElX <= 15) {
            // 这时候改变鼠标样式为  - 的
            this.style.cursor = 'w-resize '

        } else if (mouseElY >= disH - 15 || mouseElY <= 15) {
            // 这时候改变鼠标样式为 | 
            this.style.cursor = 's-resize '
        } else {
            // 这时候让鼠标样式还原
            this.style.cursor = 'auto'
        }
    }
}






/**
 * 右侧交互事件
 */


btn.onclick = function () {
    if (getStyle(nav, "right") === "0px") {
        nav.style.right = -244 + "px"
        btn.innerText = "<"
    } else {
        nav.style.right = 0 + "px"
        btn.innerText = ">"
    }
    // console.log(getComputedStyle(nav)['right'])
}

function getStyle(obj, attr) {
    return obj.currentStyle !== undefined ? obj.currentStyle[attr] : getComputedStyle(obj)[attr];
}

// 提交按钮点击事件
var saveBtn = document.querySelector("nav button")
saveBtn.onclick = function () {

    var x = parseFloat(inpX.value)
    var y = parseFloat(inpY.value)
    var w = parseFloat(inpW.value)
    var h = parseFloat(inpH.value)
    var name = inpName.value
    var data = inpData.value
    var bjputh = inpBjputh.value
    if (acitveDom) {
        acitveDom.setAttribute("id", name)
        acitveDom.setAttribute("data", data)
        acitveDom.style.top = y + "px"
        acitveDom.style.left = x + "px"
        acitveDom.style.width = w + "px"
        acitveDom.style.height = h + "px"
    }

    if (bjp != bjputh) {
        boxEdit.style.backgroundImage = bjputh
        bjp = bjputh
    }
}



// 循环元素 绑定事件
function init() {
    var allem = boxEdit.querySelectorAll(".tem")
    for (var i = 0; i < allem.length; i++) {
        allem[i].onclick = toggleClass
        allem[i].onmousedown = down
        allem[i].onmousemove = move
    }
}
init();


var saveBtn = document.querySelector(".savebtn")
var saveText = document.querySelector(".saveText")
var saveBox = document.querySelector(".saveBox")
var saveShow = document.querySelector(".saveShow")
var flieName = document.querySelector(".flieName")
var saveFlag = false
var objAll = {}
// 点击复制按钮
saveBtn.onclick = function () {
    saveFlag = true;
    console.log(saveBtn)
    var val = saveText.value
    handleCopyDDL(val)
}
// 复制文本
function handleCopyDDL(val) {
    if (saveFlag) {
        // 创建input标签存放需要复制的文字
        var oInput = document.createElement('input');
        // 把文字放进input中，供复制
        oInput.value = val;
        oInput.style.height = "0px"
        document.body.appendChild(oInput);
        // 选中创建的input
        oInput.select();
        // 执行复制方法， 该方法返回bool类型的结果，告诉我们是否复制成功
        var copyResult = document.execCommand('copy')
        // 操作中完成后 从Dom中删除创建的input
        document.body.removeChild(oInput)
        // 根据返回的复制结果 给用户不同的提示
        if (copyResult) {
            layer.msg('已复制到粘贴板,请新建文件并保存,后缀名为.json,上传到服务器')
        } else {
            layer.msg('复制失败')
        }
        saveFlag = false
    }

}
// 监听用户手动复制
saveText.addEventListener('copy', function (event) {
    layer.msg('已复制到粘贴板,请新建文件并保存,后缀名为.json,上传到服务器,请确保已全部复制')
})
// 保存弹出层关闭
saveBox.onclick = function (e) {
    if (e.target === saveBox) {
        this.style.display = "none"
    }
}
// 保存文件点击
saveShow.onclick = function () {
    var temDoms = document.querySelectorAll("#rightBox .tem")
    objAll = {
        name: "",
        background: getStyle(boxEdit, 'backgroundImage'),
        width: getStyle(boxEdit, 'width'),
        height: getStyle(boxEdit, 'height'),
        domdata: []
    }
    for (let i = 0; i < temDoms.length; i++) {
        var obj = {}
        obj.id = temDoms[i].getAttribute("id")
        obj.x = getStyle(temDoms[i], 'left')
        obj.y = getStyle(temDoms[i], 'top')
        obj.w = getStyle(temDoms[i], 'width')
        obj.h = getStyle(temDoms[i], 'height')
        obj.data = temDoms[i].getAttribute("data")
        obj.innerHtml = temDoms[i].innerHTML
        objAll.domdata.push(obj)
    }
    saveText.value = JSON.stringify(objAll)
    // 弹出弹出层
    saveBox.style.display = "block"
}
flieName.oninput = function () {
    objAll.name = this.value
    console.log(objAll)
    saveText.value = JSON.stringify(objAll)
}