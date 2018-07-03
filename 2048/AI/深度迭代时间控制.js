// performs iterative deepening over the alpha-beta search
// 在αβ搜索上执行迭代深度搜索
//作者说每一步的计算不超过100毫秒
//用时间来控制计算的深度
AI.prototype.iterativeDeep = function() {
  var start = (new Date()).getTime();
  var depth = 0;
  var best;
  do {
    var newBest = this.search(depth, -10000, 10000, 0 ,0);
    if (newBest.move == -1) {
      break;
    } else {
      best = newBest;
    }
    depth++;
  } while ( (new Date()).getTime() - start < minSearchTime);
  return best
}
