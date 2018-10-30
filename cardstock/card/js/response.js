/*
 * @Author: 徐横峰 
 * @Date: 2018-05-22 09:28:35 
 * @Last Modified by: 564297479@qq.com
 * @Last Modified time: 2018-05-22 14:56:50
 */
window.onload=window.onresize=window.onpageshow=function() {
    var wWidth = window.innerWidth;
    if(wWidth>=414) wWidth = 414;
    document.getElementsByTagName("html")[0].style.fontSize = wWidth/750 * 100 + 'px';
}
