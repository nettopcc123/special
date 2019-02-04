(function() {
    function sideBar(opt) {
        this.version = '?v=' + (String(Date.now()).substring(0,8)); //版本号
        this.common(); //公共配置
        this.initDom(); //dom构建
        this.i = 0; // 请求次数
    }

    //公共配置
    sideBar.prototype.common = function() {
        //this.baseUrl = 'https://88yh.shop/';
        //this.baseUrl = 'https://web88yh.cksvk.com';
        //this.baseUrl = 'https://image88yh1d.wg74.com/';
        this.baseUrl = 'https://api.xpjjiekou.com'; // API接口地址
        this.kefuUrl = 'https://e-136970.chatnow.meiqia.com/dist/standalone.html'; //客服URL连接
        this.wechatEwm = 'https://xpj.imagebei.com/hd/service_bar/img/x999_wechat.png'; //微信二维码图片
        this.time = (new Date()).valueOf();
    }

    //创建dom
    sideBar.prototype.initDom = function() {
        var temp =
            '<link rel="stylesheet" href="https://xpj.imagebei.com/hd/service_bar/css/app.css' + this.version + '">' +
            '<div class="fix-menu" id="fixmenu"><a id="skefuShow"><span class="kfh24">在线<br>客服</span><i class="ic-kefu"></i></a>' +
            '<a id="lxwxewm"><span class="kfh24">客服<br>微信</span><i class="ic-wx"></i></a>' +
            '<a id="sCallBack"><span class="kfh24">电话<br>回拨</span><i class="ic-tel"></i></a>' +
            '</div>' +
            '<div class="wxewm" id="wximg"><i class="ic-close2 wecico" id="hidWX"></i><img src="' + this.wechatEwm + this.version + '"></div>' +
            '<div id="lxkefu" style="display: none;">' +
            '<i id="kefuHid" class="ic-close"></i> ' +
            '<iframe src="" id="slxkefu"></iframe> ' +
            '</div> ' +
            '<div id="xmTel" class="fix-menu-xs"> ' +
            '<div class="backdrop" id="hidTel"></div> ' +
            '<div class="container"> ' +
            '<div class="box"> ' +
            '<i class="ic-close" id="hidTel"></i> ' +
            '<div class="cont"> ' +
            '<div class="avatar"></div> ' +
            '<h2>服务热线</h2> ' +
            '<h6> 4001201749</h6>' +
            '<p>每个手机号码</p><p>一天只能回拨3次哦</p> ' +
            '<input id="arim" type="tel" maxlength="11" placeholder="您的手机号">' +
            '<div class="sidebtn" id="callBackTo">立即免费回拨</div>' +
            '<div class="rem" id="crem"></div>' +
            '</div>' +
            '</div>' +
            '</div>' +
            '</div>';
        this.el = temp;
    };

    // hasClass封装
    sideBar.prototype.hasClass = function(element, className) {
        var aSameClassEle = document.getElementsByClassName(className);
        for (var i = 0; i < aSameClassEle.length; i++) {
            if (aSameClassEle[i] === element) {
                return true;
            }
        }
        return false;
    }

    //ajax封装网络请求
    sideBar.prototype.ajax = function() {
        var ajaxData = {
            type: arguments[0].type || "GET",
            url: arguments[0].url || "",
            async: arguments[0].async || "true",
            data: arguments[0].data || null,
            dataType: arguments[0].dataType || "text",
            contentType: arguments[0].contentType || "application/x-www-form-urlencoded",
            beforeSend: arguments[0].beforeSend || function() {},
            success: arguments[0].success || function() {},
            error: arguments[0].error || function() {}
        }
        ajaxData.beforeSend()
        var xhr = this.createxmlHttpRequest();
        xhr.responseType = ajaxData.dataType;
        xhr.open(ajaxData.type, ajaxData.url, ajaxData.async);
        xhr.setRequestHeader("Content-Type", ajaxData.contentType);
        xhr.send(this.convertData(ajaxData.data));
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

    sideBar.prototype.createxmlHttpRequest = function() {
        if (window.ActiveXObject) {
            return new ActiveXObject("Microsoft.XMLHTTP");
        } else if (window.XMLHttpRequest) {
            return new XMLHttpRequest();
        }
    }

    sideBar.prototype.convertData = function(data) {
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
        //获取dom
    sideBar.prototype.getDom = function() {
        return this.el;
    };

    //显示客服
    sideBar.prototype.showKf = function() {
        if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
            location.href = this.kefuUrl;
        } else {
            document.getElementById('slxkefu').src = this.kefuUrl;
            document.getElementById('lxkefu').style.display = 'block';
        }
    };

    //隐藏客服
    sideBar.prototype.hidKf = function() {
        document.getElementById('slxkefu').src = '';
        document.getElementById('lxkefu').style.display = 'none';
    };

    //显示电话客服
    sideBar.prototype.showCB = function() {
        document.getElementById('xmTel').style.display = 'block';
    }

    //隐藏电话客服
    sideBar.prototype.hidCB = function() {
        document.getElementById('xmTel').style.display = 'none';
    }

    //显示微信二维码
    sideBar.prototype.showWX = function() {
        document.getElementById('wximg').style.display = 'block';
    }

    //隐藏微信二维码
    sideBar.prototype.hidWX = function() {
        document.getElementById('wximg').style.display = 'none';
    }

    //电话回拔
    sideBar.prototype.callBackto = function(e) {
        that = this;
        var arim = document.getElementById('arim').value; //获取输入框内容
        var butval = e.innerText; //获取按扭文字
        if (butval.indexOf('上限') > 0 && this.i > 0) {
            return;
        }
        if (arim && /^1[23456789][0-9]{9}$/.test(arim)) {
            var callId = document.getElementById('callBackTo');
            var callHasDis = this.hasClass(callId, 'butdisable');
            document.getElementById('callBackTo').innerHTML = '正在发送...';
            if (callHasDis == true) {
                document.getElementById('crem').innerHTML = '正在发送中，请稍后再试'
                return;
            }
            document.getElementById('callBackTo').setAttribute('class', 'sidebtn butdisable');
            this.ajax({
                type: "POST",
                url: this.baseUrl + '/api/home/phoneCallback',
                dataType: "json",
                data: { phone: arim },
                beforeSend: function() {
                    console.log('请求前');
                },
                success: function(res) {
                    that.i++;
                    if (res.msg.indexOf('上限') > 0) {
                        document.getElementById('callBackTo').innerHTML = '已达上限，请明天再来';
                        document.getElementById('crem').innerHTML = res.msg;
                        return;
                    }
                    document.getElementById('crem').innerHTML = res.msg;
                    document.getElementById('callBackTo').setAttribute('class', 'sidebtn');
                    document.getElementById('callBackTo').innerHTML = '立即免费回拨';
                },
                error: function(error) {
                    document.getElementById('crem').innerHTML = error;
                    document.getElementById('callBackTo').setAttribute('class', 'sidebtn');
                    document.getElementById('callBackTo').innerHTML = '立即免费回拨';
                }
            })
        } else {
            document.getElementById('crem').innerHTML = '请输入正确的电话号码'
        }
    };

    //事件绑定
    sideBar.prototype.bindEvents = function() {
        that = this;
        //客服显示
        document.getElementById('skefuShow').onclick = function() {
            that.showKf();
        }

        //客服隐藏
        document.getElementById('kefuHid').onclick = function() {
            that.hidKf();
        }

        //电话客服显示
        document.getElementById('sCallBack').onclick = function() {
            that.showCB();
        }

        //电话客服隐藏
        document.getElementById('hidTel').onclick = function() {
            that.hidCB();
        }

        //请求回拨电话
        document.getElementById('callBackTo').onclick = function() {
            that.callBackto(this);
        }

        //微信二维码显示
        document.getElementById('lxwxewm').onclick = function() {
            that.showWX();
        }

        //微信二维码隐藏
        document.getElementById('wximg').onclick = function() {
            that.hidWX();
        }
        document.getElementById('hidWX').onclick = function() {
            that.hidWX();
        }

    };

    window.sideBar = sideBar;
}());


//实例化js
sideBarShow = new sideBar({});
var div = document.createElement("div");
var str = sideBarShow.getDom();
div.style.display = "none";
div.setAttribute('id', 'showSide');
div.innerHTML = str;
document.getElementById("wgServiceBar").appendChild(div);
sideBarShow.bindEvents();


//判断是否加载完
document.onreadystatechange = loadingChange; //当页面加载状态改变的时候执行这个方法.
function loadingChange() {
    switch (document.readyState) {
        case "loading": // 文件正在加载中
            break;
        case "interactive": // 文件已装完 可以访问dom
            break;
        case "complete": // dom已满完
            document.getElementById("showSide").style.display = 'block';
            break;
    }
}