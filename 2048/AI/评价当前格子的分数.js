// 单调性(Monotonicity)
// 这个概念保证方块的值沿着上下左右方向的，要么增加，要么减少。
// 倾向于构造值递减的结构  64 32 16 8 4 2

// 平滑性(Smoothness)
// 如要合并，相邻的方格值必须相同。因此，平滑性衡量相邻方格值的差，并尝试减少差。
//  1024 1024 1024 1024 1024 1024 1024 1024 1024

// 空闲方块(Free Tiles)
// 针对空闲格子过少的惩罚。毕竟面板过于拥挤的时候，选择受限且很快会被用完。


// static evaluation function
//静态评价函数
AI.prototype.eval = function() {
  //空格子
  var emptyCells = this.grid.availableCells().length;
  //平滑性
  // 各个评价参数的权重
  var smoothWeight = 0.1,//平滑性
      //monoWeight   = 0.0,
      //islandWeight = 0.0,
      mono2Weight  = 1.0,//单调性
      emptyWeight  = 2.7,//空格子
      maxWeight    = 1.0;//这个是啥?格子中的最大数字?


  return this.grid.smoothness() * smoothWeight //平滑性
       //+ this.grid.monotonicity() * monoWeight
       //- this.grid.islands() * islandWeight
       + this.grid.monotonicity2() * mono2Weight  //单调性
       + Math.log(emptyCells) * emptyWeight   //空格子
       + this.grid.maxValue() * maxWeight;   //格子中的最大数字
};
