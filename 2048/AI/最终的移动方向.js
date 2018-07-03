// performs a search and returns the best move
//返回价值最大的移动方向
AI.prototype.getBest = function() {
  return this.iterativeDeep();
}
