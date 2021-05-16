var throttle = function (func, freq) {
  var last, timer;

  return function () {
    var now = +new Date();
    if (now - last < freq) {
      clearTimeout(timer);
      timer = setTimeout(func.bind(this, arguments), freq - (now - last));
    } else {
      last = now;
      timer = setTimeout(func.bind(this, arguments), freq);
    }
  };
};

var i = 0,
  j = 0;
var test = {
  count: 0,
  t: throttle(function () {
    console.log(this, ++this.count, j);
  }, 250),
};

var timer = setInterval(function () {
  j++;
  test.t();
}, 1000 / 120);

setTimeout(() => clearInterval(timer), 1000);
console.log("last", i, j);
