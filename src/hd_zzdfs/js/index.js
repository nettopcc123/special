var imgCdn = 'https://xpj.imagebei.com/';
var API_ROOT = 'http://192.168.50.237:8080';


// 判断是否登入
function hd_isLogin(){
    var but = document.getElementById('hd-but');
    if(!localStorage.getItem('token')){
        but.onclick = to_login //调登入方法
        return false
    }
    to_login() //调登入方法
}

// 用户登入
to_login = function() {
    // 跳登入
    if(location.href.indexOf('file://')<0){
            to_login();
        }else {
            //app弹出框
            var yhhdhybId = document.getElementById("yhhd-hby");
            var hdbg1 = document.createElement('div');
            hdbg1.id = 'hd-cover1';
            hdbg1.className = 'hby-cover';
            var hdpop1 = document.createElement('div');
            hdpop1.id = 'hd-pop1';
            hdpop1.innerHTML = "<p>请先登入，再来抢红包！</p> <div class='hd-butLogin hd-cbut' id='hby-goDisp1'>确定</div>";
            hdpop1.className = 'hd-pop';
            yhhdhybId.appendChild(hdbg1);
            yhhdhybId.appendChild(hdpop1);
            //去掉提示框
            var goDisp1 = document.getElementById('hby-goDisp1')
            var hdPop1 = document.getElementById('hd-pop1')
            var hdCover1 = document.getElementById('hd-cover1')
            goDisp1.onclick = function(e){
                document.getElementById('yhhd-hby').removeChild(hdPop1)
                document.getElementById('yhhd-hby').removeChild(hdCover1)
            }
            hdCover1.onclick = function(e){
                document.getElementById('yhhd-hby').removeChild(hdPop1)
                document.getElementById('yhhd-hby').removeChild(hdCover1)
            }
        }
},


// // 用户登入
// function to_login() {
//     ajax({
//         type: "POST",
//         url: API_ROOT + '/api/user/login',
//         dataType: "json",
//         channel:'1',
//         data: {
//             userName: 'denny321',
//             passWord: '34814f45c5b89ee4ea7e77662747a0e6',
//             passcode: '',
//             loginToken: ''
//         },
//         beforeSend: function() {
//             console.log('正在获取数据...');
//         },
//         success: function(res) {
//             localStorage.setItem('token',res.resObj.token)
//             getList();// 调取例表
//         },
//         error: function(error) {
//             console.log(error)
//         }
//     })
// }

// ajax封装网络请求
function ajax() {
    var ajaxData = {
        type: arguments[0].type || "GET",
        url: arguments[0].url || "",
        async: arguments[0].async || "true",
        data: arguments[0].data || null,
        dataType: arguments[0].dataType || "text",
        contentType: arguments[0].contentType || "application/x-www-form-urlencoded",
        channel: arguments[0].channel || "0",
        Authorization: arguments[0].Authorization || "",
        beforeSend: arguments[0].beforeSend || function() {},
        success: arguments[0].success || function() {},
        error: arguments[0].error || function() {}
    }
    ajaxData.beforeSend()
    var xhr = createxmlHttpRequest();
    xhr.responseType = ajaxData.dataType;
    xhr.open(ajaxData.type, ajaxData.url, ajaxData.async);
    xhr.setRequestHeader("Content-Type", ajaxData.contentType);
    if(ajaxData.channel != ""){
        xhr.setRequestHeader("channel", ajaxData.channel);
    }
    if(ajaxData.Authorization != ""){
        xhr.setRequestHeader("Authorization", ajaxData.Authorization);
    }
    xhr.send(convertData(ajaxData.data));
    xhr.onreadystatechange = function() {
        if (xhr.readyState == 4) {
            if (xhr.status == 200 || xhr.status == 304) {
                ajaxData.success(xhr.response)
            } else {
                ajaxData.error('啊，网络通讯故障了~');
            }
        } else {
            console.log('请求未完成，请检查您的请求连接是否正确')
        }
    }
}
function createxmlHttpRequest() {
    if (window.ActiveXObject) {
        return new ActiveXObject("Microsoft.XMLHTTP");
    } else if (window.XMLHttpRequest) {
        return new XMLHttpRequest();
    }
}
function convertData(data) {
    if (typeof data === 'object') {
        var convertResult = "";
        for (var c in data) {
            convertResult += c + "=" + data[c] + "&";
        }
        convertResult = convertResult.substring(0, convertResult.length - 1)
        return convertResult;
    } else {
        return data;
    }
}

//获取优惠进度
function getList(){
    var token = localStorage.getItem('token');
    ajax({
        type: "get",
        url: API_ROOT + '/api/activity/weekActivity',
        dataType: "json",
        channel:'1',
        Authorization:token,
        beforeSend: function() {
            console.log('正在获取数据...');
        },
        success: function(res) {
            console.log(res)
            var dom =  '<ul class="hd-ulCon1 hd-ucw5">' +
                            '<li>&nbsp;</li>' +
                            '<li>当日存款</li>' +
                            '<li>当日有效投注额</li>' +
                       '</ul>' +
                       '<ul class="hd-ulCon1">' +
                            '<li>周一</li>' +
                            '<li>' + res.resObj[0].monday + '</li>' +
                            '<li>' + res.resObj[1].monday + '</li>' +
                        '</ul>' +
                        '<ul class="hd-ulCon1">' +
                                '<li>周二</li>' +
                                '<li>' + res.resObj[0].muesday + '</li>' +
                                '<li>' + res.resObj[1].muesday + '</li>' +
                        '</ul>' +
                        '<ul class="hd-ulCon1">' +
                                '<li>周三</li>' +
                                '<li>' + res.resObj[0].wednesday + '</li>' +
                                '<li>' + res.resObj[1].wednesday + '</li>' +
                        '</ul>' +
                        '<ul class="hd-ulCon1">' +
                                '<li>周四</li>' +
                                '<li>' + res.resObj[0].thursday + '</li>' +
                                '<li>' + res.resObj[1].thursday + '</li>' +
                        '</ul>' +
                        '<ul class="hd-ulCon1">' +
                                '<li>周五</li>' +
                                '<li>' + res.resObj[0].friday + '</li>' +
                                '<li>' + res.resObj[0].friday + '</li>' +
                        '</ul>' +
                        '<ul class="hd-ulCon1">' +
                                '<li>周六</li>' +
                                ' <li>' + res.resObj[0].saturday + '</li>' +
                                '<li>' + res.resObj[1].saturday + '</li>' +
                        '</ul>' +
                        '<ul class="hd-ulCon1">' +
                                '<li>周日</li>' +
                                '<li>' + res.resObj[0].sunday + '</li>' +
                                '<li>' + res.resObj[1].sunday + '</li>' +
                        '</ul>' +
                        '<ul class="hd-ulCon1">' +
                                '<li>等级</li>' +
                                '<li>' + res.resObj[0].grade + '</li>' +
                        '</ul>'
            var deposit = document.getElementById('hd-deposit');
            deposit.innerHTML = dom;
        },
        error: function(error) {
            console.log(error)
        }
    })
}

hd_isLogin()


