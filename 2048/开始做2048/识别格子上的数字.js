
auto();
//请求截图
if(!requestScreenCapture()){
    toast("请求截图失败");
    exit();
}


firstGridLeftTopCorner={x:34,y:242}
//挨着第一个格子
rightGrid={x:317,y:242}
downGrid={x:34,y:522}

leftRightDistance=rightGrid.x-firstGridLeftTopCorner.x
upDownDistance=downGrid.y-firstGridLeftTopCorner.y

lightScreen();

//初始化十六个格子数字都是0
grids = new Array(16);
let k=0
let j=0
for(var i=0;i<grids.length;i++){
  if(i==4 || i==8 || i==12){
    k=0
  }
  if(i==4 || i==8 || i==12){
    j++
  }
  let x=firstGridLeftTopCorner.x+k*leftRightDistance
  let y=firstGridLeftTopCorner.y+j*upDownDistance
  grids[i] = {num:0,x:x,y:y};
  k++;
}
NumberColors={
  2:"#EEE4DA",
  4:"#EDE0C8",
  8:"#F2B179",
  16:"#F59563",
  32:"#F67C5F",
  64:"#F65E3B",
  128:"#EDCF72",
  256:"#EDCC61",
  512:"#EDC850",
  1024:"#EDC53F"
}

grids=recogniseGrid()
gridsLog()
grids=oordinateTransformationIntoSequenceNumber(grids)
log("\n",grids)


function oordinateTransformationIntoSequenceNumber(grids){
  let newGrids=[]
  for(let i=0;i<4;i++){
    for(let j=0;j<4;j++){
      let x=i
      let y=j
      let num=grids[i*4+j].num
      let item={x:x,y:y,num:num}
      newGrids.push(item)
    }
  }
  return newGrids
}

//从这里开始,识别格子上的数字
function recogniseGrid(){
  img=captureScreen()
  for(var i=0;i<16;i++){
    let color=images.pixel(img, grids[i].x, grids[i].y)
    color=colors.toString(color)
    try{
      Object.keys(NumberColors).forEach(function(key){
        if(colors.isSimilar(color,NumberColors[key])){
          grids[i].num=parseInt(key)
          throw err = new Error("\n第"+i+"个格子是"+key);
        }
      });
    }catch( e ) {
    }
  }
  return grids
}




function lightScreen(){
  let isScreenOn=device.isScreenOn()
  if(isScreenOn){
  }else{
    device.wakeUpIfNeeded()
    sleep(1000)
    //解锁屏幕
    unlockingScreen()
    sleep(1000)
  }
}

function unlockingScreen(){
  //log("开始上滑")
  swipe(520,1361, 547,335, 300)
  sleep(100)
  //log("九宫格解锁")
  gesture(300, [253,1058], [541,1054], [536,1342],[537,1627])
}

function gridsLog(){
  let gridNums="\n"
  for(var i=0;i<16;i++){
    if(i==4 || i==8 || i==12){
      gridNums=gridNums+"\n"
    }
    gridNums=gridNums+grids[i]["num"]+","
  }
  log(gridNums)
}
