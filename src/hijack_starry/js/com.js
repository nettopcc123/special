(function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        cls = 'is_pc',
        recalc    = function () {
            var clientWidth = docEl.clientWidth>=1920?1920:docEl.clientWidth;
            cls = clientWidth<=800?'is_mob':'is_pc';
            if (!clientWidth) return;
            docEl.style.fontSize = 100 * (clientWidth / 960) + 'px';
            docEl.className = cls;
        };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);

(function(){
    var ysCommon = {
        url:'https://x999.club/',
        api:'https://api.xpjjiekou.com/',
        imgCdn:'https://xpj.imagebei.com/',
        kefu: 'https://e-136970.chatnow.meiqia.com/dist/standalone.html',
        // api:'http://192.168.50.249:8080',
        flag: false,
        yzmdjs: null,
        downlaodUrl: 'https://x999app.com/'

        // url:'http://192.168.50.118/'
        // url:'http://192.168.50.232:8060/'
    };
    //通用正则表达式

    // 上面是他们的用户名验证，下面是我这注册用的验证，比他们的严格一些,但是登录处需要用上面的避免web端注册的用户无法登录
    ysCommon.regName = function (d) {
        return !isEmpty(d) && /^(?![0-9]+$)[0-9a-zA-Z]{6,12}$/.test(d);
    };
    ysCommon.regMobile = function (d) {
        return !isEmpty(d) && /^1[23456789][0-9]{9}$/.test(d);
    };
    ysCommon.regPass = function (d) {
        return !isEmpty(d) && /^[A-Za-z\d||#@!$^&~`]{6,12}$/.test(d);
    };
    ysCommon.regCode = function (d) {
        return !isEmpty(d) && /^[\d]{4,6}$/.test(d);
    };

    ysCommon.animate = function (o,c) {
        // var dx = $(o+':visible').length<1? true:false;
        // if(dx){
        //     $(o).show()
        // }
        $(o).addClass('animated').addClass(c);
        setTimeout(function() {
            $(o).removeClass(c).removeClass('animated');
            // if(dx){
            //     $(o).hide();
            // }
        }, 1200);
    };
    ysCommon.ajax= function(url,type,data,call){
        if(ys.flag){
            return false
        }
        ys.flag = true;
        $(".tips").text('');
        $.ajax(ys.api+ '' + url,{
            headers: {
                channel:1
            },
            type:  type,
            cache:  false,
            data: data,
            crossDomain:true,
            dataType: 'json',
            contentType: "application/x-www-form-urlencoded",
            timeout: 8000,
            success: function (data, textStatus, jqXHR) {
                ys.flag= false;
                call(data)
            },
            error: function (XMLHttpRequest, textStatus) {
                $('.wait').removeClass('wait');
                alert('啊！网络通讯故障了～');
                ys.flag = false;
            }
        });
    };
    window.ys = window.ysCommon = ysCommon;
})();



//判断是否为空
function isEmpty(data) {
    if (isEmpty1(data) || isEmpty2(data)) {
        return true;
    }
    return false;
}

function isEmpty1(data) {
    if (data == 'undefined' || data == undefined || data == null || data == "" || data == 'NULL' || data == false || data == 'false') {
        return true;
    }
    return false;
}

function isEmpty2(v) {
    switch (typeof v) {
        case 'undefined' :
            return true;
        case 'string' :
            if (v.trim().length == 0)
                return true;
            break;
        case 'boolean' :
            if (!v)
                return true;
            break;
        case 'number' :
            if (0 === v)
                return true;
            break;
        case 'object' :
            if (null === v)
                return true;
            if (undefined !== v.length && v.length == 0)
                return true;
            for (var k in v) {
                return false;
            }
            return true;
            break;
    }
    return false;
}



var sur = location.hostname+'&am=1';

function goo(u,t) {
    // window.open(ys.url+''+u+'?rst='+sur);
    // location.href = ys.url+''+u+'?rst='+sur;
    var ur = '';
    if((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
        switch (u){
            case "zc":
                ur = 'm/index.html#/register';
                break;
            case "yh":
                ur = 'm/#/discounts/10';
                break;
            default:
                ur = 'm/';
                break;
        }

    }else {
        switch (u){

            case "zc":
                ur = 'indexk.html#/mainpage/register';
                break;
            case "yh":
                ur = '#/discounts/10';
                break;
            default:
                ur = '';
                break;
        }

    }
    setTimeout(function () {
        if(t){
            window.open(ys.url+''+ur+'?rst='+sur);
        }else {
            location.href = ys.url+''+ur+'?rst='+sur;
        }
    },120)
}
function sendMsgOk(t){
    clearInterval(ys.yzmdjs);
    var _dom = $('#input'+t).find('.btn');
    _dom.text('验证码已发送');
    var tmtm = 60;
    ys.yzmdjs = setInterval(function () {
        tmtm -= 1;
        if(tmtm>0){
            _dom.text(tmtm+'秒后可再次发送')
        }else {
            _dom.text('获取短信验证码').removeClass('wait');
            clearInterval(ys.yzmdjs);
        }
    },1000)
};

function sendCode(o) {
    if($(o).hasClass('wait')){
        return false
    }

    var t = $(o).parents('.input_box').attr('id').replace('input','');
    var c = $('#input'+t + ' .tel').val();

    if(!ys.regMobile(c)){
        ys.animate('#input'+t + ' .tel','shake');
        $('#input'+t).find('.tel').focus();
    }else {
        $('#input'+t).find('.btn').text('正在发送...').addClass('wait');
        ys.ajax('/api/user/sendLoginSms','post',{
            userPhone:c
        },function (res) {
            if(res.resCode==1){
                sendMsgOk(t)
            }else {
                $(".tips").text(res.msg?res.msg:'');
            }
        })
    }
}
function sign(t) {

    var a = $('#input'+t + ' .unm').val().trim().toLowerCase();
    var b = $('#input'+t + ' .pwd').val().trim().toLowerCase();
    var c = $('#input'+t + ' .tel').val();
    var d = $('#input'+t + ' .yzm').val();
    var e = $('#input'+t + ' .yzt').val();
    // var b = $('#pw').val();
    // var c = $('#ph').val();
    // localStorage.setItem('rega',a);
    // localStorage.setItem('regc',c);

    if(!ys.regName(a)){
        ys.animate('.unm','shake');
        $('#input'+t).find('.unm').focus();

    }else if(!ys.regPass(b)){
        ys.animate('#input'+t + ' .pwd','shake');
        $('#input'+t).find('.pwd').focus();
    }else if(!ys.regMobile(c)){
        ys.animate('#input'+t + ' .tel','shake');
        $('#input'+t).find('.tel').focus();
    }else if(!e && captcha){
        ys.animate('#input'+t + ' .yzt','shake');
        $('#input'+t).find('.yzt').focus();
    }else {
        if($('.inp').attr('type') == '0'){
            if($('#input'+t).find('.hd-btn').hasClass('wait')){
                return false
            }
            $('#input'+t).find('.hd-btn').addClass('wait');
            var par = {
                userName: a,
                passWord: $.md5(b),
                userPhone: c,
                regitstType: 1,
                registUrl: location.hostname
            };
            console.log(par)
            if(captcha){
                par.passcode=e;
                par.loginToken=loginToken
            }
            ys.ajax('/api/user/channelRegist','post',par,function (res) {
                $('#input'+t).find('.hd-btn').removeClass('wait');
                if(res.resCode == 888){
                    $('ul.inp').attr('type',1);
                    alert('请获取并输入手机验证码继续激活领奖。');
                }else if(res.resCode == 1){
                    location.href = ys.url+'reg.html?rst='+sur+'&wgtk='+ JSON.stringify(res.resObj) +'&ir=0' ;
                }else {
                    $(".tips").text(res.msg?res.msg:'');
                }
            });
        }else if(!ys.regCode(d)){
            ys.animate('#input'+t + ' .yzm','shake');
            $('#input'+t).find('.yzm').focus();
        }else {
            if($('#input'+t).find('.hd-btn').hasClass('wait')){
                return false
            }
            $('#input'+t).find('.hd-btn').addClass('wait');
            ys.ajax('/api/user/phoneLogin','post',{
                userName: a,
                passWord: $.md5(b),
                userPhone: c,
                smsCode: d,
                registUrl: location.hostname
            },function (res) {
                $('#input'+t).find('.hd-btn').removeClass('wait');
                if(res.resCode == 1){
                    location.href = ys.url+'reg.html?rst='+sur+'&wgtk='+ JSON.stringify(res.resObj) +'&ir=0' ;
                }else {
                    $(".tips").text(res.msg?res.msg:'');
                }
            });
        }

    }
}



function getConfig(){
    ys.ajax('/api/config/listSysConfig','get',{},function (data){
        if(data && data.resCode==1 && parseInt(data.resObj.registCodeEnable)==1){
            getCapt()
        }
    });
}
var captcha= null,
    loginToken=null;
function getCapt() {
    ys.ajax("/api/user/getCaptcha", "get",{},function(data){
        if(data.resCode==1){
            captcha=data.resObj.captcha;
            loginToken=data.resObj.loginToken;
            $('.yzmtp').attr('src',captcha);
            $('ul.inp').attr('yzm',1);
        }else {
            getCapt();
        }
    });
}

function play(){
    var u = "#/game/1/AG/12/5?rst="+sur;
    if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
        u = 'm'+u;
    }
    window.open(  ys.url + u);
}

function downlaod(){
    window.location.href = ysCommon.downlaodUrl;
}


$(function () {
    getConfig();

});