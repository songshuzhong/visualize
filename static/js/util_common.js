var uuid = 0;
//数组移除指定元素
function removeByValue(arr, val) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i] == val || JSON.stringify(arr[i]) == JSON.stringify(val)) {
            arr.splice(i, 1);
            break;
        }
    }
}
//生成uuid
function getuuid() {
    var s, uuid;
    s = [];
    var hexDigits = "0123456789abcdef";
    for (var i = 0; i < 36; i++) s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
    s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
    s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
    s[8] = s[13] = s[18] = s[23] = "-";
    uuid = s.join("").replace(/\-/g, "");
    return uuid;
}
//根据给定值获值
function getQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) {
        return decodeURI(r[2]);
    } else {
        return null;
    }
}
//校验名称
function checkName(name) {
    var result = true;
    if (name == '') {
        layer.msg('请填写接口名称', {time: 2000, icon: 5});
        result = false;
        return result;
    }
  /*  var fa = checkInvaildName(name);
    if (fa == false) {
        layer.msg('请勿包含非法字符如[#%&"/",;:=!^]', {icon: 2, time: 2000});
        result = false;
        return result;
    }*/
    return result;
}
//检验非法字符
function checkInvaildName(name) {
    var szMsg = '[#_%&"/",;:=!^]';
    var alertStr = "";
    for (var i = 1; i < szMsg.length + 1; i++) {
        if (name.indexOf(szMsg.substring(i - 1, i)) > -1) {
            alertStr = '请勿包含非法字符如[#%&"/",;:=!^]';
            break;
        }
    }
    if (alertStr != "") {
        return false;
    }
    return true;
}

//获取当前时间
function getDate(){
  var mydate = new Date();
  var str = "" + mydate.getFullYear();
  if(mydate.getMonth()<9){
      str += 0;
      str += (mydate.getMonth()+1);
  }else{
      str += (mydate.getMonth()+1);
  }
  str += mydate.getDate() + "/";
  return str;
}

function formatDate(date, format) {   
    if (!date) return;   
    if (!format) format = "yyyy-MM-dd";   
    switch(typeof date) {   
        case "string":   
            date = new Date(date.replace(/-/, "/"));   
            break;   
        case "number":   
            date = new Date(date);   
            break;   
    }    
    if (!date instanceof Date) return;   
    var dict = {   
        "yyyy": date.getFullYear(),   
        "M": date.getMonth() + 1,   
        "d": date.getDate(),   
        "H": date.getHours(),   
        "m": date.getMinutes(),   
        "s": date.getSeconds(),   
        "MM": ("" + (date.getMonth() + 101)).substr(1),   
        "dd": ("" + (date.getDate() + 100)).substr(1),   
        "HH": ("" + (date.getHours() + 100)).substr(1),   
        "mm": ("" + (date.getMinutes() + 100)).substr(1),   
        "ss": ("" + (date.getSeconds() + 100)).substr(1)   
    };     
    return format.replace(/(yyyy|MM?|dd?|HH?|ss?|mm?)/g, function() {  
        return dict[arguments[0]];   
    });  
    
}
//时间戳转换
function timestampToTime(timestamp) {
	var date = new Date(timestamp);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    Y = date.getFullYear() + '-';
    M = (date.getMonth()+1 < 10 ? '0'+(date.getMonth()+1) : date.getMonth()+1) + '-';
    D = (date.getDate() < 10 ? '0'+date.getDate() : date.getDate()) + ' ';
    h = (date.getHours() < 10 ? '0'+date.getHours() : date.getHours()) + ':';
    m = (date.getMinutes() < 10 ? '0'+date.getMinutes() : date.getMinutes()) + ':';
    s = (date.getSeconds() < 10 ? '0'+date.getSeconds() : date.getSeconds());
    return Y+M+D+h+m+s;
}
