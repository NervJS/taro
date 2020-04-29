var _hmt = _hmt || [];
(function() {
    if(location.hostname === '127.0.0.1' || location.hostname === 'localhost') return
    if(location.hash === '#public') return
    let img = new Image()
    img.src = 'http://xcx.jd.com/static/images/taro.png'
    img.onload = () => {
      if (window.location.hostname !== 'taro-docs-in.jd.com') {
        window.location.href = 'http://taro-docs-in.jd.com' + window.location.pathname
      }
    }
})();

// baidu report
(function() {
  var hm = document.createElement("script")
  hm.src = "https://hm.baidu.com/hm.js?ecddb5104158a28f667cf0f3f347a7c9"
  var s = document.getElementsByTagName("script")[0]
  s.parentNode.insertBefore(hm, s)
})();

// baidu seo
 (function(){
    var bp = document.createElement('script');
    var curProtocol = window.location.protocol.split(':')[0];
    if (curProtocol === 'https') {
        bp.src = 'https://zz.bdstatic.com/linksubmit/push.js';
    }
    else {
        bp.src = 'http://push.zhanzhang.baidu.com/push.js';
    }
    var s = document.getElementsByTagName("script")[0];
    s.parentNode.insertBefore(bp, s);
})();
