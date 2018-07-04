//-----------------滑动动作------------------------------------------
function 滑动(direction){
  switch(direction)
  {
    case 'up':
      上滑()
      break;
    case 'down':
      下滑()
      break;
    case 'left':
      左滑()
      break;
    case 'right':
      右滑()
      break;
    default:
    log('不存在这个滑动方向maxNum,',direction)
  }
}
t=0.1
function 上滑(){
  let duration=t
  let xy=[461,1084,487,512]
  swipe(xy[0],xy[1],xy[2],xy[3],duration);
}
function 下滑(){
  let duration=t
  let xy=[487,512,461,1084]
  swipe(xy[0],xy[1],xy[2],xy[3],duration);
}
function 左滑(){
  let duration=t
  let xy=[972,527,109,525]
  swipe(xy[0],xy[1],xy[2],xy[3],duration);
}
function 右滑(){
  let duration=t
  let xy=[309,525,972,527]
  swipe(xy[0],xy[1],xy[2],xy[3],duration);
}

// s="up"
// s="down"
s="left"
// s="right"
滑动(s)
