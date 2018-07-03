let xxz=10
function 上滑(){
  let duration=10
  let xy=[461,1084,487,512]
  swipe(xy[0],xy[1],xy[2],xy[3],duration)
  sleep(xxz)
}
function 下滑(){
  let duration=10
  let xy=[487,512,461,1084]
  swipe(xy[0],xy[1],xy[2],xy[3],duration)
  sleep(xxz)

}
function 左滑(){
  let duration=10
  let xy=[972,527,109,525]
  swipe(xy[0],xy[1],xy[2],xy[3],duration)
  sleep(xxz)

}
function 右滑(){
  let duration=10
  let xy=[309,525,972,527]
  swipe(xy[0],xy[1],xy[2],xy[3],duration)
  sleep(xxz)

}


上滑()
