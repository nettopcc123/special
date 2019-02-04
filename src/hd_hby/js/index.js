(function() {
    function redPacket(opt) {
        this.getToken = this.getTokenFun();
        this.isChannel = this.getChannel(); //获取来源
        this.version = '?v=' + (String(Date.now()).substring(0,8)); //版本号
        this.but = document.getElementById('hd-butLogin'); //登入按扭
        this.redListId = {};  // 红包雨ID
        this.tn = 0;  // 红包提示初始位移
        this.oRedNum = 0;  // 初点中红包个数
        this.redList = {}; // 派奖记录
        this.common(); // 公共配置
        this.hd_isLogin(); // 判断是否登入
        this.bindEvents(); // 点击事件
        this.getRedList(); // 获取派奖记录
        this.totWin = 0;// 中奖总金额
        this.isMobile = this.isMobil();//是否是手机端
        this.isClick = true; // 按扭可以点击
        this.isHbyA = false;//是否抽过红包
    }

    //判断是否有token
    redPacket.prototype.getTokenFun = function(){
        if(location.href.indexOf('file://')> -1){
            return this.getToken = $api.getStorage('token');
        }else{
            return this.getToken = localStorage.getItem('token');
        }
    },

    //判断端口来源
    redPacket.prototype.getChannel = function(){
        if(location.href.indexOf('file://')<0){
            if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
                return this.isChannel = 1;//来源
                }
                return this.isChannel = 0;//来源
            }else {
                return this.isChannel = 2;//来源
        }
    },

    //判断今天是否已领过
    redPacket.prototype.isGetRed = function(){
        this.but.innerHTML = '请明天再来';
        this.but.className = 'hd-butLogin hd-butDis'
    },

    //判断是否手机端
    redPacket.prototype.isMobil = function() {
        if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
            return true;
        } else {
            return false;
        }
    },

    //公共配置
    redPacket.prototype.common = function() {
        //this.imgCdn = 'https://xpj.imagebei.com/';
        //this.imgCdn = 'http://192.168.50.122/';
        this.imgCdn = 'https://xpj.imagebei.com/';
        this.API_ROOT = 'https://api.xpjjiekou.com';
    },

    //获取派奖记录
    redPacket.prototype.getRedList = function(){
        that = this;
        this.ajax({
            type: "GET",
            url: this.API_ROOT + '/api/activity/getRedCording',
            dataType: "json",
            channel:this.isChannel,
            data: {
                passcode: '',
                loginToken: ''
            },
            beforeSend: function() {
                console.log('正在获取数据...');
            },
            success: function(res) {
                if(res.resCode != 1){
                    console.log(res.msg);
                    return;
                }
                var dom = '';
                var dom1 = '';
                var dom2 = '';
                var dom3 = '';
                that.redList = res.resObj;
                for (var i=0;i<that.redList.length;i++)
                {
                   dom1 += '<li>' + that.redList[i].time + '</li>';
                   dom2 += '<li>￥' + that.redList[i].amount + '</li>';
                   dom3 += '<li>' + that.redList[i].count + '</li>';
                }
                dom =　'<div class="hd-conw">'+ 
                        　'<ul class="hd-ulCon hd-ucw1">'+ 
                            '<li>时间</li>'+ dom1 + 
                            '</ul>'+ 
                            '<ul class="hd-ulCon hd-ucw2">'+ 
                            '<li>送出金额<span>（元）</span></li>'+ dom2 + 
                            '</ul>'+ 
                            '<ul class="hd-ulCon hd-ucw3">'+ 
                            '<li>领取人数</li>'+ dom3 + 
                            '</ul>'+ 
                        '</div>';
                document.getElementById('hd-record').innerHTML = dom;
            },
            error: function(error) {
                console.log(error)
            }
        })
    },

    // 判断是否登入
    redPacket.prototype.hd_isLogin = function(e) {
        that = this;
        // getToken = localStorage.getItem('token') || '';
        // if(location.href.indexOf('file://')> -1){
        //     getToken = $api.getStorage('token');
        // }
        
        isHby = sessionStorage.getItem('isHby'); //判断是否有条件
        if(!this.getToken){
            that.but.innerHTML = "请先登入 抢红包"
            // 定时查找是否有token
            hsToken = setInterval(function(){
                that.getTokenFun();//获取token
                if(!that.getToken){
                    that.but.innerHTML = "请先登入 抢红包"
                    that.but.onclick = function(){
                        that.to_login();
                    } //调登入方法
                    return false
                }
                clearInterval(hsToken)
                if(isHby == 'true' || that.isHbyA == true){
                    that.isGetRed();//按扭置灰
                }else{
                    that.but.innerHTML = '点我 有红包雨 哦';
                }
                that.but.onclick = function(){
                    if(that.isClick == false){
                        return;
                    }
                    that.isClick = false; //按扭处于不可点状态
                    that.getRedPacketId()// 获取红包ID
                }
                return false
            },1000);

             //调登入方法
            that.but.onclick = function(){
                that.to_login();
            }
            return
        }

        if(isHby == 'true' || this.isHbyA == true){
            this.isGetRed();//按扭置灰
        }else{
            this.but.innerHTML = '点我 有红包雨 哦';
        }
        this.but.onclick = function(){
            if(that.isClick == false){
                return;
            }
            that.isClick = false; //按扭处于不可点状态
            that.getRedPacketId()// 获取红包ID
        }
    },
    //siblings封装
    redPacket.prototype.siblings = function (callback){
        var siblingElement = [];
        var parentAllElement = [];
        if( ! this.parentNode ){
            return siblingElement;
        };
        parentAllElement = this.parentNode.getElementsByTagName(this.tagName);
        for( var i = 0; i < parentAllElement.length ; i++ ){
            if( parentAllElement[i] != this ){
                siblingElement.push(parentAllElement[i]);
                typeof callback == "function" && callback.call(parentAllElement[i]);
            }
        }
        return siblingElement;
    },
    
    // 菜单切换
    redPacket.prototype.hdTabMenu = function(show,hid,tabBut){
        var show = document.getElementById(show);
        var hid = document.getElementById(hid);
        var tabBut = document.getElementById(tabBut);
        //获取ul下面的li个数数
        var ul=document.getElementById('hd-ftit');
        var lis=ul.childNodes; 
        for(var i=0;i<lis.length;i++){ 
            lis.item(i).setAttribute("class", "")
        }  
        hid.setAttribute("class", "hd-wrap hd-hid")
        show.setAttribute("class", "hd-wrap")
        tabBut.setAttribute("class", "hd-cur")
    },

    // 用户登入
    redPacket.prototype.to_login = function() {
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

    // hasClass
    redPacket.prototype.hasClass = function(elem, cls) {
        cls = cls || '';
        if (cls.replace(/\s/g, '').length == 0) return false; //当cls没有参数时，返回false
        return new RegExp(' ' + cls + ' ').test(' ' + elem.className + ' ');
    },

    // 向后台拿红包雨的Id
    redPacket.prototype.getRedPacketId = function() {
        that = this;
      //  token = localStorage.getItem('token');
        this.ajax({
            type: "POST",
            url: this.API_ROOT + '/api/activity/getRedEnvelope',
            dataType: "json",
            channel:this.isChannel,
            Authorization:this.getToken,
            data: {
            },
            beforeSend: function() {
                console.log('正在获取数据...');
            },
            success: function(res) {
                that.isClick = true; //按扭处于可点状态
                //正式线需开通
                if(res.resCode != 1){
                        //报错提示
                        var yhhdhybId = document.getElementById("yhhd-hby");
                        var hdbg = document.createElement('div');
                        hdbg.id = 'hd-cover';
                        hdbg.className = 'hby-cover';
                        var hdpop = document.createElement('div');
                        hdpop.id = 'hd-pop';
                        hdpop.innerHTML = "<p>" + res.msg + "</p> <div class='hd-butLogin hd-cbut' id='hby-goDisp'>确定</div>";
                        hdpop.className = 'hd-pop';
                        yhhdhybId.appendChild(hdbg);
                        yhhdhybId.appendChild(hdpop);
                        //去掉提示框
                        var hdPop = document.getElementById('hd-pop')
                        var hdCover = document.getElementById('hd-cover')
                        hdPop.onclick = function(e){
                            document.getElementById('yhhd-hby').removeChild(hdPop)
                            document.getElementById('yhhd-hby').removeChild(hdCover)
                        }
                        hdCover.onclick = function(e){
                            document.getElementById('yhhd-hby').removeChild(hdPop)
                            document.getElementById('yhhd-hby').removeChild(hdCover)
                        }

                    //    跳到充值
                    //     if(res.resCode == 2){
                    //         var hbydis = document.getElementById('hby-goDisp');
                    //         hbydis.onclick = function(){
                    //             if(location.href.indexOf('file://')<0){
                    //                 var u = "/#/center/deposit";
                    //                 if ((navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i))) {
                    //                     u = '/m/#/deposit';
                    //                 }
                    //                 top.location.href = u;
                    //             }else {
                    //                 toZj(0);
                    //             }
                    //         }
                    //     return;
                    //    }


                    return
                }
                sessionStorage.removeItem("isHby"); 
                that.redListId = res.resObj;
                that.startPacket(that.redListId);//调红包雨
            },
            error: function(error) {
                that.isClick = true; //按扭处于可点状态
                console.log(error)
            }
        })
    },

    //开始下红包雨
    redPacket.prototype.startPacket =  function(redListId){
        // 是否已经下过红包雨
        var isHby = sessionStorage.getItem('isHby');
        if(isHby == 'true' || that.isHbyA == true){
            this.isGetRed();//按扭置灰
        }
        if(this.hasClass(this.but,'hd-butDis') == false){
            this.hby(redListId);//调红包雨
            var hbtime = 30;// 倒计时
            var djs = 4;
            cdown = setInterval(function(){
                djs--;
                if(djs > 0){
                    that.but.innerHTML = '开始倒计时 ' + djs;
                }else{
                    that.but.innerHTML = '距离雨停还有 ' + hbtime + ' 秒';
                    hbtime-- ;
                }
                if(hbtime <=0){
                    that.but.innerHTML = '雨停了，明天继续来哦';
                    that.but.className = 'hd-butLogin hd-butDis'
                    clearInterval(cdown);
                    return;
                }
            },1000)
        }
    },

    // 领红包
    redPacket.prototype.getBonus = function(redNo,id) {
        that = this;
        //token = localStorage.getItem('token')
        this.ajax({
            type: "POST",
            url: this.API_ROOT + '/api/activity/redEnvelope',
            dataType: "json",
            channel:this.isChannel,
            async:false,
            Authorization:this.getToken,
            data: {
                redNo:redNo
            },
            beforeSend: function() {
                console.log('正在获取数据...');
            },
            success: function(res) {
                if(res.resCode != 1){
                    console.log(res.msg);
                    return
                }
                var yhhdhybId = document.getElementById("yhhd-hby");
                var hdHbyId = document.getElementById("hd_hdHby");//获取红包宽度
                var open = document.createElement('div');
                open.className = 'hb-open';
                open.id = 'hd_open' + id;
                open.innerHTML = '+ ￥' + res.resObj;
                yhhdhybId.appendChild(open);
                document.getElementById('hd_open' + id).setAttribute("style","left:0.1rem ;animation: winTip 2s; top:" + (that.tn + 0) +'rem');
                hdHbyId.removeChild(document.getElementById(id));
                if(that.isMobil == false){
                    that.tn += 0.3;
                }else{
                    that.tn += 0.4;
                }
                that.totWin += res.resObj;
            },
            error: function(error) {
                console.log(error)
            }
        })
    },

    // 获取对像的x,y查对屏幕的值
    redPacket.prototype.getElementPosition = function(e) {
        var x = 0, y = 0;
        while(e != null) {
            x += e.offsetLeft;
            y += e.offsetTop;
            e = e.offsetParent;
        }
        return { x: x, y: y };
    },

    // 红包雨
    redPacket.prototype.hby = function(redPId){
        //判断是否可以下红包雨    
        that = this;
        var hdHbyId = document.getElementById("hd_hdHby");//获取红包宽度
        var num = 0;//红包开始ID
        var numid = 0;//后台的红包
        hdHbyId.style.display = 'block';
        var yhhdhybId = document.getElementById("yhhd-hby");
        var win = hdHbyId.offsetWidth - 60;//获取红包宽度
        var screenHeight = window.screen.availHeight ; //获取屏幕高度
        hdHbyId.style.height = screenHeight;
        var del = function(){
            nums++;
            //hdHbyId.removeChild()
            setTimeout(del,200)
        }
        var add = function() {
            yhhdhybId = document.getElementById("yhhd-hby");
            if(numid >= 100 || num >= 199 ){ //100个红包
                //num = 0;
                //红包雨下完后回调 时间到了
                var winEnd = setTimeout(function(){
                    hdHbyId.style.display = 'none';
                    objOpen= document.getElementsByClassName('hb-open');
                    arr = new Array()
                    for(var i = 0; i<objOpen.length; i++){
                        objOpen[i].setAttribute("style","left:50% ;animation: winTipEnd 2s; top:50%; margin-left:-0.5rem;margin-top:-0.2rem");
                        arr[i] = objOpen[i].getAttribute('id');
                    }
                    clearTimeout(winEnd);
                    //删除单个红包金额
                    var rem = setTimeout(function(){
                        for(var j = 0; j<arr.length; j++){
                            yhhdhybId.removeChild(document.getElementById(arr[j]));
                        }
                            //清除定时器
                            clearTimeout(rem); 
                            //中奖提示
                            var totbg = document.createElement('div');
                            totbg.id = 'hby-cover';
                            totbg.className = 'hby-cover';
                            var totWin = document.createElement('div');
                            totWin.id = 'hby-totWin';
                            totWin.innerHTML = that.totWin + ' 元';
                            totWin.className = 'totWin';
                            yhhdhybId.appendChild(totbg);
                            yhhdhybId.appendChild(totWin);
                            //去掉提示框
                            var totWin = document.getElementById('hby-totWin')
                            var totCave = document.getElementById('hby-cover')
                            totWin.onclick = function(e){
                                document.getElementById('yhhd-hby').removeChild(totWin)
                                document.getElementById('yhhd-hby').removeChild(totCave)
                            }
                            totCave.onclick = function(e){
                                document.getElementById('yhhd-hby').removeChild(totWin)
                                document.getElementById('yhhd-hby').removeChild(totCave)
                            }
                    },2000)  
                },3000)
                sessionStorage.setItem('isHby','true');
                this.isHbyA = true;//已经抽过红包
                clearTimeout(remLisetTime);//清除定时器
                clearTimeout(addPacks);//清除定时器
                clearTimeout(addPackd);//清除定时器
                return
            }
            window.onresize=function(){ //屏幕改变时红包的Left的值
                win = hdHbyId.offsetWidth - 60;//获取红包宽度
            }
            var hb = parseInt(Math.random() * (5 - 1) + 1);
            var Wh = parseInt(Math.random() * (70 - 30) + 20);
            var hh = 0.4;
            var Left = parseInt(Math.random() * (win - 0) + 0);
            var li = document.createElement('li');
            li.id = 'hby_li' + num;
            dom = "<span style='background:url(" + that.imgCdn + "hd/hd_hby/img/hb_2.png) center bottom no-repeat;background-size: contain'></span>";
            switch(hb)
            {
                case 1:
                    li.className = 'hd-hby';
                    Wh = 0.4;
                    hh = 0.58;
                    dom = "<span style='background:url(" + that.imgCdn + "hd/hd_hby/img/hb_1.png) center bottom no-repeat;background-size: contain'></span>";
                    li.setAttribute('data-id',redPId[numid]); //后台传值ID
                    numid++;
                break;
                case 2:
                    li.className = 'hd-hby';
                    Wh = 0.7;
                    hh = 1.05;
                    dom = "<span style='background:url(" + that.imgCdn + "hd/hd_hby/img/hb_1.png) center bottom no-repeat;background-size: contain'></span>";
                    li.setAttribute('data-id',redPId[numid]); //后台传值ID
                    numid++;
                break;
                case 3:
                    Wh = 0.2;
                    hh = 0.2;
                    dom = "<span style='background:url(" + that.imgCdn + "hd/hd_hby/img/hb_2.png) center bottom no-repeat;background-size: contain'></span>";
                break;
                default:
                    Wh = 0.35;
                    hh = 0.35;
                    dom = "<span style='background:url(" + that.imgCdn + "hd/hd_hby/img/hb_2.png) center bottom no-repeat;background-size: contain'></span>";
            }
            li.innerHTML = dom;
            hdHbyId.appendChild(li)
            var liId = document.getElementById("hby_li" + num); //获取每个红包的id值
            liId.style.left = Left + 'px';
            var liimg = liId.children[0]
            liimg.style.width = Wh + 'rem';
            var s = 5;
            // 如果是手机端
            if(that.isMobile == false){
                s = 7;
            }
            var sh = window.screen.height + 200;
            liId.setAttribute("style","top:"+ sh +"px ;animation: retPack "+ s +"s; left:" + Left +'px; width:' + Wh + 'rem; height:' + hh + 'rem');
            remLisetTime = setTimeout(function(){
               hdHbyId.removeChild(liId);
            },3000)
            num++;
            //点击红包的时候弹出模态层
            liId.onclick = function(e){
                if(that.hasClass(this,'hd-hby') == false){
                    return;
                }
                // 控制数量
                that.oRedNum ++;
                var curId = this.getAttribute('id').substring(6) ;//当前点中的ID数值号
                // 如果是手机端
                if(that.isMobile == true){
                    if(that.oRedNum >= 10){
                        if((that.oRedNum % 2 == 0)){
                            return false;
                        }
                        if(curId % 2 == 0){
                            return false;
                        }
                    }
                }
                // 最多点60个
                if (that.oRedNum > 60){
                    return false
                }
                var dataId = this.getAttribute('data-id'); //获取红包ID
                var id = this.getAttribute('id'); //获取LiID
                that.getBonus(dataId,id);//领取红包
                //开红包
            }
            addPacks = setTimeout(add,150)
        }
        //增加红包
        var num = 0;
        var numid = 0;
        addPackd = setTimeout(add,3000);
    },  

    //ajax封装网络请求
    redPacket.prototype.ajax = function() {
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
        var xhr = this.createxmlHttpRequest();
        xhr.responseType = ajaxData.dataType;
        xhr.open(ajaxData.type, ajaxData.url, ajaxData.async);
        xhr.setRequestHeader("Content-Type", ajaxData.contentType);
        if(ajaxData.channel != ""){
            xhr.setRequestHeader("channel", ajaxData.channel);
        }
        if(ajaxData.Authorization != ""){
            xhr.setRequestHeader("Authorization", ajaxData.Authorization);
        }
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
    },

    redPacket.prototype.createxmlHttpRequest = function() {
        if (window.ActiveXObject) {
            return new ActiveXObject("Microsoft.XMLHTTP");
        } else if (window.XMLHttpRequest) {
            return new XMLHttpRequest();
        }
    },

    redPacket.prototype.convertData = function(data) {
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
    },

    //事件绑定
    redPacket.prototype.bindEvents = function() {
        that = this;
        //派奖记录
        document.getElementById('hd-fli1').onclick = function() {
            that.hdTabMenu('hd-record','hd-rule','hd-fli1');
        }
        //详细规则
        document.getElementById('hd-fli2').onclick = function() {
            that.hdTabMenu('hd-rule','hd-record','hd-fli2');
        }
    };
    window.redPacket = redPacket;
}());


//实例化js
redPacketShow = new redPacket({});
//调登入方法