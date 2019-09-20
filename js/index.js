/*
 * @Author: li_x
 * @LastEditors: Do not edit
 * @Date: 2019-09-20 10:03:57
 * @LastEditTime: 2019-09-20 15:24:38
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
    // 添加点击事件 点击切换class
    dom.onclick = toggleClass
    // 添加移动事件
    dom.onmousedown = down
    dom.onmousemove = move
    ev.target.appendChild(dom);
}

function toggleClass() {
    if (flag === false) {
        var tems = document.querySelectorAll(".tem")
        for (var i = 0; i < tems.length; i++) {
            if (tems[i] === this) {
                continue;
            }
            tems[i].classList.remove("border")
        }
        this.classList.toggle("border")
    }

}

function down(ev) {
    flag = false

    var timeout = setTimeout(function () {
        flag = true
    }, 100)
    var that = this
    var ev = ev || event;

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
        var setX = ev.clientX - oLeft
        var setY = ev.clientY - oTop
        // 利用 mouseElX  mouseElY  进行判断是否在范围内
        // 如果在放大缩小的范围之内
        if (mouseElX >= disW - 15 && mouseElY >= disH - 15 && that.classList.contains('border')) {
            // 这时候等比例放大
            var set = setX >= setY ? setX : setY
            that.style.width = disW + set - disL + "px"
            that.style.height = disH + set - disT + "px"
        } else if (mouseElX >= disW - 15 && that.classList.contains('border')) {
            // 这时候放大缩小x轴
            that.style.width = disW + setX - disL + "px"

        } else if (mouseElY >= disH - 15 && that.classList.contains('border')) {
            // 这时候放大缩小Y轴
            that.style.height = disH + setY - disT + "px"

        }
        else {
            // 如果不在放大缩小的范围之内

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
        }

    }

    boxEdit.onmouseup = function (ev) {
        clearTimeout(timeout)
        boxEdit.onmousemove = boxEdit.onmouseup = null;
    }
}
function move(ev) {
    if (this.classList.contains('border')) {
        var disW = this.offsetWidth;   //元素  的宽度
        var disH = this.offsetHeight;  //元素  的高度
        var mouseElX = ev.offsetX;     //鼠标  距离 元素 左侧 的距离
        var mouseElY = ev.offsetY;     //鼠标  距离 元素 顶部 的距离
        if (mouseElX >= disW - 15 && mouseElY >= disH - 15) {
            // 这时候等比例放大
            this.style.cursor = 'se-resize '
        } else if (mouseElX >= disW - 15) {
            // 这时候放大缩小x轴
            this.style.cursor = 'w-resize '

        } else if (mouseElY >= disH - 15) {
            // 这时候放大缩小Y轴
            this.style.cursor = 's-resize '
        } else {
            this.style.cursor = 'auto'
        }
    }
}