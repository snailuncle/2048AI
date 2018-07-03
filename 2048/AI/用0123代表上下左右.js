
// AI .原型属性 .翻译属性  是一个函数,有一个参数move
// move是做什么的

AI.prototype.translate = function(move) {
  return {
     0: 'up',
     1: 'right',
     2: 'down',
     3: 'left'
   }[move];
 }
