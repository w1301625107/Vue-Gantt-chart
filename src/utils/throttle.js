export default function throttle(fn, interval = 100) {
  //fn为要执行的函数，interval为延迟时间
  var _self = fn, //保存需要被延迟执行的函数引用
    timer, //定时器
    firstTime = true; //是否第一次调用
  return function() {
    //返回一个函数，形成闭包，持久化变量
    var args = arguments, //缓存变量
      _me = this;
    if (firstTime) {
      //如果是第一次调用，不用延迟执行
      _self.apply(_me, args);
      return (firstTime = false);
    }
    if (timer) {
      //如果定时器还在，说明上一次延迟执行还没有完成
      return false;
    }
    timer = setTimeout(function() {
      //延迟一段时间执行
      clearTimeout(timer);
      timer = null;
      _self.apply(_me, args);
    }, interval);
  };
}
