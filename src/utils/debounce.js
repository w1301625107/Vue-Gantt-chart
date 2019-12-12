export default function debounce(fn, interval = 500, immediate = false) {
  //fn为要执行的函数
  //interval为等待的时间
  //immediate判断是否立即执行
  var timeout; //定时器

  return function() {
    //返回一个闭包
    var context = this,
      args = arguments; //先把变量缓存
    var later = function() {
      //把稍后要执行的代码封装起来
      timeout = null; //成功调用后清除定时器
      if (!immediate) fn.apply(context, args); //不立即执行时才可以调用
    };

    var callNow = immediate && !timeout; //判断是否立即调用，并且如果定时器存在，则不立即调用
    clearTimeout(timeout); //不管什么情况，先清除定时器，这是最稳妥的
    timeout = setTimeout(later, interval); //延迟执行
    if (callNow) fn.apply(context, args); //如果是第一次触发，并且immediate为true，则立即执行
  };
}
