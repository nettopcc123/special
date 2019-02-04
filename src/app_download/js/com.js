(function (doc, win) {
    var docEl = doc.documentElement,
        resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize',
        recalc    = function () {
            var clientWidth = docEl.clientWidth,clientHeight=docEl.clientHeight;
            // console.log(clientWidth/clientHeight);
            if (clientWidth>=750) {
                clientWidth = 750;
            };
            if (!clientWidth) return;
            docEl.style.fontSize = 100 * (clientWidth / 750)*(0.56/(clientWidth/clientHeight)) + 'px';
            // docEl.style.fontSize = 100 * (clientWidth / 750) + 'px';
        };
    if (!doc.addEventListener) return;
    win.addEventListener(resizeEvt, recalc, false);
    doc.addEventListener('DOMContentLoaded', recalc, false);
})(document, window);


var qudao = null;
// var qudao = 'KFHGD6';

var vCont = {
    cdn:'https://images.slaxc.com/',
    type:0,
    hz:['ipa','apk'],
    system:['ios','android'],
    item:null,
    isPc:false

}


function appCallback(k) {
    $('.butterbar').removeClass('active');
    if(qudao){
        if(k.qudao&&k.qudao[qudao]){
            vCont.item=k.qudao[qudao];
        }
    }else{
        vCont.item=k;
    }
}


function getData(){
    $('.butterbar').addClass('active');
    $.ajax(vCont.cdn+'app/api/x999_'+vCont.system[vCont.type]+'.js',{
        type:  'get',
        cache:  false,
        crossDomain:true,
        dataType: 'jsonp',
        contentType: "application/x-www-form-urlencoded"
    })
};


$(function () {
    setTimeout(function () {
        if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent)) {
            vCont.type=0;
            getData();
            $('.ios_btn').fadeIn(2000);
            $('.ios_pop').html('<div onclick="$(\'body\').removeClass(\'show_pop\')" class="close"></div><h3>安装步骤</h3><h5>第一步：打开【设置】</h5><img src="https://xpj.imagebei.com/hd/app_download/img/01.png"><h4>第二步：打开【通用】</h4><img src="https://xpj.imagebei.com/hd/app_download/img/02.png"><h4>第三步：进入【描述文件与设备管理】</h4><img src="https://xpj.imagebei.com/hd/app_download/img/03.png"><h4>第四步：找到相应的选项并进入</h4><h6>【an regent, ooo】</h6><img src="https://xpj.imagebei.com/hd/app_download/img/04.png"><h4>第五步：点开【信任“an regent, ooo”】</h4><img src="https://xpj.imagebei.com/hd/app_download/img/05.png"><h4>第六步：点击【信任】</h4><h6>回到桌面重新打开澳门新葡京APP，即可畅玩</h6><img src="https://xpj.imagebei.com/hd/app_download/img/06.png"><a href="https://x999.club/m/" target="_blank" class="logo"></a>');

        } else if (/(Android)/i.test(navigator.userAgent)) {
            vCont.type=1;
            getData();

        }else {
            $('.code_box').fadeIn(3000);
            $('.update').fadeOut();
        }
        $('body').addClass('show');
    },500)
});


function down() {
    if(vCont.item&&vCont.item.url){
        $('.butterbar').addClass('active');
        location.href= vCont.item.url
    }else{
        getData();
    }
}