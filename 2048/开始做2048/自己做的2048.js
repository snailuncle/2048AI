// 快手小游戏   2048   脚本
// 作者QQ203118908
// 更新日期0701

// 目标 制作2048自动玩的脚本
// 思路 采取打分制,四个方向的操作,谁的分数最高,就用谁
// 打分标准:那个方向的数字最大,他的分值就最高
// 优先  向左  向下  向右 向上

// 第一步先识别数字
// 用一个颜色来识别数字,格子的左上角和右下角
// 可能截图时,拖动格子还没完成,需要加合适的延迟,等待格子操作完毕


auto();
//请求截图
if(!requestScreenCapture()){
    toast("请求截图失败");
    exit();
}

imgPath="/sdcard/快手小游戏截图/";
files.ensureDir(imgPath);

firstGridLeftTopCorner={x:34,y:242}
//挨着第一个格子
rightGrid={x:317,y:242}
downGrid={x:34,y:522}

leftRightDistance=rightGrid.x-firstGridLeftTopCorner.x
upDownDistance=downGrid.y-firstGridLeftTopCorner.y


lightScreen();

for(let i=0;i<1;i++){
// while(1){
  sleep(50)
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
  //log('初始化十六个格子: \n',grids)

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

  //log("NumberColors=\n",NumberColors)
  //log("NumberColors[1024]=",NumberColors[1024])


  img=captureScreen()
  // for(var i=0;i<16;i++){
  for(var i=0;i<16;i++){
    //log("**************************************** i=",i)
    let color=images.pixel(img, grids[i].x, grids[i].y)
    // //log(color)

    color=colors.toString(color)
    // //log("\n第"+i+"个格子的坐标=("+grids[i].x+","+grids[i].y+")\n颜色="+color)

    try{
      Object.keys(NumberColors).forEach(function(key){
        //log(key,NumberColors[key]);
        if(colors.isSimilar(color,NumberColors[key])){
          grids[i].num=parseInt(key)
          // //log("\n第"+i+"个格子是"+key)
          throw err = new Error("\n第"+i+"个格子是"+key);
        }

      });
    }catch( e ) {
      //log(e);
    }
  }

  gridsLog()
  // exit()
  // gridNumsCurrent=[
  //   4,2,4,2,
  //   2,64,8,32,
  //   16,32,16,4,
  //   2,8,4,2,
  //               ]

  gridNumsCurrent=[]
  for(let i=0;i<16;i++){
    gridNumsCurrent[i]=grids[i].num
  }
  // log("108行gridNumsCurrent=",gridNumsCurrent)

  gridRows=new Array()
  gridRows[0]=[gridNumsCurrent[0],gridNumsCurrent[1],gridNumsCurrent[2],gridNumsCurrent[3]]
  gridRows[1]=[gridNumsCurrent[4],gridNumsCurrent[5],gridNumsCurrent[6],gridNumsCurrent[7]]
  gridRows[2]=[gridNumsCurrent[8],gridNumsCurrent[9],gridNumsCurrent[10],gridNumsCurrent[11]]
  gridRows[3]=[gridNumsCurrent[12],gridNumsCurrent[13],gridNumsCurrent[14],gridNumsCurrent[15]]

  gridColumns=new Array()
  gridColumns[0]=[gridNumsCurrent[0],gridNumsCurrent[4],gridNumsCurrent[8],gridNumsCurrent[12]]

  log("123行gridColumns[0]=",gridColumns[0])


  gridColumns[1]=[gridNumsCurrent[1],gridNumsCurrent[5],gridNumsCurrent[9],gridNumsCurrent[13]]
  gridColumns[2]=[gridNumsCurrent[2],gridNumsCurrent[6],gridNumsCurrent[10],gridNumsCurrent[14]]
  gridColumns[3]=[gridNumsCurrent[3],gridNumsCurrent[7],gridNumsCurrent[11],gridNumsCurrent[15]]



  //*********************控制中心*********************************************
  //********************************************************************

  //可以滑动的方向
  //需要满足两个条件之一
  //第一种 在滑动的方向上有相同的紧挨着的数字
  //第二种 在滑动的方向上存在数字,并且数字的滑动方向有空格
  directions=directionCanSwipe()
  log("可滑动的方向=",directions)

  let maxNum={num:0,direction:'left'}
  let compareNum=[]
  let maxNum2={num:0,direction:'left'}
  for(var i=0;i<directions.length;i++){
    log("循环开始前compareNum=",compareNum)
    switch(directions[i])
    {

      case 'down':
        maxNum2.direction='down'
        maxNum2.num=swipeDown(gridNumsCurrent)
        break;
      case 'left':
        log("left循环开始前compareNum=",compareNum)

        maxNum2.direction='left'
        maxNum2.num=swipeLeft(gridNumsCurrent)

        break;
      case 'right':
        log("right循环开始前compareNum=",compareNum)

        maxNum2.direction='right'
        maxNum2.num=swipeRight(gridNumsCurrent)
        break;
      case 'up':
        log("up循环开始前compareNum=",compareNum)

        maxNum2.direction='up'
        maxNum2.num=swipeUp(gridNumsCurrent)
        break;
      default:
        log('不存在这个滑动方向maxNum2,',maxNum2.direction)
    }
    // log("比较前","maxNum2=",maxNum2,"\ncompareNum=",compareNum)
    // if(maxNum2.num>compareNum[0]){
    //   compareNum[0]=maxNum2.num
    //   compareNum[1]=maxNum2.direction
    // }
    // log("比较后","maxNum2=",maxNum2,"\ncompareNum=",compareNum)
    compareNum.push({
      direction:directions[i],
      maxNumSum:maxNum2.num[0],
      manhattanDistance:maxNum2.num[1],
      swipeResult:maxNum2.num[2]
    })

  }

  log("187行compareNum=",compareNum)
  scoreResult=Score(compareNum)



  // log('当前可合并的最大数是maxNum.num=',maxNum.num)
  log("最终选择=",scoreResult)
  switch(scoreResult.direction)
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
      log('不存在这个滑动方向maxNum,',scoreResult.direction)
  }


}
function 上滑(){
  let duration=10
  let xy=[461,1084,487,512]
  swipe(xy[0],xy[1],xy[2],xy[3],duration)
}
function 下滑(){
  let duration=10
  let xy=[487,512,461,1084]
  swipe(xy[0],xy[1],xy[2],xy[3],duration)
}
function 左滑(){
  let duration=10
  let xy=[972,527,109,525]
  swipe(xy[0],xy[1],xy[2],xy[3],duration)
}
function 右滑(){
  let duration=10
  let xy=[109,525,972,527]
  swipe(xy[0],xy[1],xy[2],xy[3],duration)
}




function directionCanSwipe(){
  let direction=[]

  if(canSwipeDown()){
    // log("可向下滑动")

    direction.push('down')
  }
  if(canSwipeLeft()){
    // log("可向左滑动")

    direction.push('left')
  }
  if(canSwipeRight()){
    // log("可向右滑动")

    direction.push('right')
  }

  if(canSwipeUp()){
    // log("可向上滑动")
    direction.push('up')
  }
  return direction
}




function canSwipeUp(){
  if(hasSpace(gridNumsCurrent,"up")){
    return true;
  }
  for(var i=0;i<4;i++){
    if(hasSameNum(gridColumns[i])){
      return true;
    }
  }
  return false
}
function canSwipeDown(){
  // log("canSwipeDown()hasSpace(gridNumsCurrent,down)=",hasSpace(gridNumsCurrent,"down"))
  // log("canSwipeDown,gridNumsCurrent=",gridNumsCurrent)
  if(hasSpace(gridNumsCurrent,"down")){
    return true;
  }
  for(var i=0;i<4;i++){
    if(hasSameNum(gridColumns[i])){
      return true;
    }
  }
  return false
}
function canSwipeLeft(){
  if(hasSpace(gridNumsCurrent,"left")){
    return true;
  }
  for(var i=0;i<4;i++){
    if(hasSameNum(gridRows[i])){
      return true;
    }
  }
  return false
}
function canSwipeRight(){
  if(hasSpace(gridNumsCurrent,"right")){
    // log("右侧有空格")
    return true;
  }else{
    // log("右侧无空格")

  }
  for(var i=0;i<4;i++){
    if(hasSameNum(gridRows[i])){
      return true;
    }
  }
  return false
}


//第一种 在滑动的方向上有相同的紧挨着的数字
function hasSameNum(numArr){
  let count=0
  let nums=[]
  for(var i=0;i<4;i++){
    if(numArr[i]!=0){
      nums.push(numArr[i])
      count++;
    }
  }
  let numCase=numArr.length
  switch(count)
  {
    case 0:
      return false;
      break;
    case 1:
      return false;
      break;
    case 2:
      if(nums[0]==nums[1]){
        return true;
      }else{
        return false;
      }
      break;
    case 3:
      if(nums[0]==nums[1] || nums[1]==nums[2]){
        return true;
      }else{
        return false;
      }
      break;
    case 4:
      if(nums[0]==nums[1] || nums[1]==nums[2] || nums[2]==nums[3]){
        return true;
      }else{
        return false;
      }
      break;
    default:
      return false;
  }
}


//第二种 在滑动的方向上存在数字,并且数字的滑动方向有空格
function hasSpace(gridNumsCurrent,direction){
  // log("hasSpace(gridNumsCurrent,direction)",gridNumsCurrent,direction)
  let zeros=[]
  let count=0
  for(let i=0;i<16;i++){
    if(gridNumsCurrent[i]==0){
      zeros.push(i)
      count++;
    }
  }
  log('zeros=',zeros)
  if(count==0){
    return false;
  }

  switch(direction)
  {
    case "up":
      for(let i=0;i<count;i++){
        for(let k=0;k<3;k++){

          if(zeros[i]+4*k<16 && gridNumsCurrent[zeros[i]+4*k]!=0){
            return true;
          }
        }
      }
      return false;
      break;
    case "down":
      // log("针对下侧空格的判断")

      for(let i=0;i<count;i++){
        for(let k=0;k<3;k++){

          if(zeros[i]-4*k>=0 && gridNumsCurrent[zeros[i]-4*k]!=0){
            // log("zeros[i]=",zeros[i],"zeros[i]-4*k=",zeros[i]-4*k,"i=",i)
            // log("针对下侧空格的判断","可以向下滑动")
            return true;
          }
        }
      }
      return false;

      break;
    case "left":
      // log("针对左侧空格的判断")
      // log("zeros=",zeros)
      for(let i=0;i<count;i++){
        for(let k=0;k<3;k++){

          if(zeros[i]+1+k<16&& Math.floor((zeros[i]+1+k)/4)==Math.floor((zeros[i])/4) && gridNumsCurrent[zeros[i]+1+k]!=0){
            // log("zeros[i]=",zeros[i],"Math.floor((zeros[i]+1+k)/4)",Math.floor((zeros[i]+1+k)/4),"i=",i)
            // log("针对左侧空格的判断","可以向左滑动")
            return true;
          }
        }
      }
      return false;

      break;
    case "right":
      // log("针对右侧空格的判断")
      for(let i=0;i<count;i++){
        for(let k=0;k<3;k++){
          // log("zeros[i]=",zeros[i],"Math.floor((zeros[i]-1-k)/4)=",Math.floor((zeros[i]-1-k)/4),"i=",i)

          if(zeros[i]-1-k>=0 && Math.floor((zeros[i]-1-k)/4)==Math.floor((zeros[i])/4) && gridNumsCurrent[zeros[i]-1-k]!=0){
            return true;
          }else{
            // log((zeros[i]-1-k),Math.floor((zeros[i]-1-k)/4),gridNumsCurrent[zeros[i]-1-k]!=0)
          }
        }
      }
      return false;

      break;
    default:
      log("针对空格的判断发生错误direction=",direction)

      return false;
  }
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
function gridsLogNumsArr(numsArr){
  let gridNums="\n"
  for(var i=0;i<16;i++){
    if(i==4 || i==8 || i==12){
      gridNums=gridNums+"\n"
    }
    gridNums=gridNums+numsArr[i]+","
  }
  log(gridNums)
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









function swipeUp(){

  log("513行gridColumns[0]=",gridColumns[0])
  let gridColumns1=mergeNumsUp(gridColumns[0])
  let gridColumns2=mergeNumsUp(gridColumns[1])
  let gridColumns3=mergeNumsUp(gridColumns[2])
  let gridColumns4=mergeNumsUp(gridColumns[3])


  log("向上滑动\ngridColumns1=",gridColumns1,"\ngridColumns2=",gridColumns2,"\ngridColumns3=",gridColumns3,"\ngridColumns4=",gridColumns4)




  // log("swipeUp,gridColumns1=",gridColumns1)
  let result=[]
  for(let i=0;i<4;i++){
  result.push(gridColumns1[i])
  result.push(gridColumns2[i])
  result.push(gridColumns3[i])
  result.push(gridColumns4[i])
  }
  log("上滑结果四列添加=",result)
  let resultMeta=result.slice(0)





  log("上滑结果四列添加Meta=",resultMeta)

  let manhattanDistanceResult=manhattanDistanceGrid(result)
  log("上滑结果四列添加Meta2=",resultMeta)

  var compare = function (x, y) {
    if (x < y) {
        return 1;
    } else if (x > y) {
        return -1;
    } else {
        return 0;
    }
  }
  gridsLogNumsArr(result)
  // log("排序前=",result)
  result.sort(compare)
  // log("排序后=",result)


  log("上滑结果=",resultMeta)

  log("上滑",result[0],result[1],result[2],result[3],result[4],result[5],"总和=",result[0]+result[1]+result[2]+result[3]+result[4]+result[5])
  return [result[0]+result[1]+result[2]+result[3]+result[4]+result[5],manhattanDistanceResult,resultMeta]

  // return Math.max.apply(null,result)
}
function swipeDown(gridNumsCurrent){

  log("573行gridColumns[0]=",gridColumns[0])

  let gridColumns1=mergeNumsDown(gridColumns[0])
  let gridColumns2=mergeNumsDown(gridColumns[1])
  let gridColumns3=mergeNumsDown(gridColumns[2])
  let gridColumns4=mergeNumsDown(gridColumns[3])

  let result=[]
  for(let i=0;i<4;i++){
  result.push(gridColumns1[i])
  result.push(gridColumns2[i])
  result.push(gridColumns3[i])
  result.push(gridColumns4[i])
  }
  let resultMeta=result.slice(0)

  let manhattanDistanceResult=manhattanDistanceGrid(result)

  var compare = function (x, y) {
    if (x < y) {
        return 1;
    } else if (x > y) {
        return -1;
    } else {
        return 0;
    }
  }
  gridsLogNumsArr(result)

  result.sort(compare)
  log("下滑",result[0],result[1],result[2],result[3],result[4],result[5],"总和=",result[0]+result[1]+result[2]+result[3]+result[4]+result[5])
  return [result[0]+result[1]+result[2]+result[3]+result[4]+result[5],manhattanDistanceResult,resultMeta]


}

function swipeLeft(gridNumsCurrent){


  let gridRows1=mergeNumsLeft(gridRows[0])
  let gridRows2=mergeNumsLeft(gridRows[1])
  let gridRows3=mergeNumsLeft(gridRows[2])
  let gridRows4=mergeNumsLeft(gridRows[3])

  let result=[].concat(gridRows1,gridRows2,gridRows3,gridRows4)
  let resultMeta=result.slice(0)

  log("588行swipeLeft result=",result)
//计算曼哈顿距离,重点都是左下角号码12
//取前6位数字
//加权系数分别为1,2,3,4,5,6,越小,距离越短,越好
  let manhattanDistanceResult=manhattanDistanceGrid(result)



  var compare = function (x, y) {
    if (x < y) {
        return 1;
    } else if (x > y) {
        return -1;
    } else {
        return 0;
    }
  }
  gridsLogNumsArr(result)

  result.sort(compare)
  log("左滑",result[0],result[1],result[2],result[3],result[4],result[5],"总和=",result[0]+result[1]+result[2]+result[3]+result[4]+result[5])
  return [result[0]+result[1]+result[2]+result[3]+result[4]+result[5],manhattanDistanceResult,resultMeta]

}
function swipeRight(gridNumsCurrent){

  let gridRows1=mergeNumsRight(gridRows[0])
  let gridRows2=mergeNumsRight(gridRows[1])
  let gridRows3=mergeNumsRight(gridRows[2])
  let gridRows4=mergeNumsRight(gridRows[3])

  let result=[].concat(gridRows1,gridRows2,gridRows3,gridRows4)
  let resultMeta=result.slice(0)

  let manhattanDistanceResult=manhattanDistanceGrid(result)

  var compare = function (x, y) {
    if (x < y) {
        return 1;
    } else if (x > y) {
        return -1;
    } else {
        return 0;
    }
  }
  gridsLogNumsArr(result)

  result.sort(compare)
  log("右滑",result[0],result[1],result[2],result[3],result[4],result[5],"总和=",result[0]+result[1]+result[2]+result[3]+result[4]+result[5])
  return [result[0]+result[1]+result[2]+result[3]+result[4]+result[5],manhattanDistanceResult,resultMeta]


}


function mergeNumsLeft(numsMeta){
  let nums=numsMeta.slice(0)
  //判断有几位有效数字
  let count=0
  for(var i=0;i<4;i++){
    if(nums[i]!=0){
      count++;
    }
  }
  // log("有"+count+"位有效数字")
  switch(count)
  {
    case 0:
      numMerge=[0,0,0,0]
      break;
    case 1:
      for(var i=0;i<4;i++){
        if(nums[i]!=0){
          numMerge=[nums[i],0,0,0]
          break;
        }
      }
      break;
    case 2:
      numMerge=[]
      for(var i=0;i<4;i++){
        if(nums[i]!=0){
          numMerge.push(nums[i])
        }
        if(numMerge.length==2){
          break;
        }
      }
      if(numMerge[0]==numMerge[1]){
        numMerge=[numMerge[0]*2,0,0,0]
      }else{
        numMerge=[numMerge[0],numMerge[1],0,0]
      }
      break;
    case 3:
      numMerge=[]
      for(var i=0;i<4;i++){
        if(nums[i]==0){
          nums.splice(i,1);
          break;
        }
      }

      if(nums[0]==nums[1]){
        // log("case 3 nums[0]==nums[1]=",nums[0])
        numMerge=[nums[0]*2,nums[2],0,0]
        // log(numMerge)
      }else if(nums[1]==nums[2]){
        numMerge=[nums[0],nums[1]*2,0,0]
      }else{
        numMerge=[nums[0],nums[1],nums[2],0]
      }
      break;
    case 4:
      if(nums[0]==nums[1]){
        if(nums[2]==nums[3]){
          numMerge=[nums[0]*2,nums[2]*2,0,0]
        }else{
          numMerge=[nums[0]*2,nums[2],nums[3],0]
        }
      }else if(nums[2]==nums[1]){
        numMerge=[nums[0],nums[1]*2,nums[3],0]
      }else{
        if(nums[2]==nums[3]){
          numMerge=[nums[0],nums[1],nums[2]*2]
        }else{
          numMerge=nums
        }
      }
      break;
    default:
      log("有效数字个数错误,必须是0,1,2,3,4的其中一种")
  }
  return numMerge;
}

function mergeNumsRight(numsMeta){
  let nums=numsMeta.slice(0)

  //判断有几位有效数字
  let count=0
  for(var i=0;i<4;i++){
    if(nums[i]!=0){
      count++;
    }
  }
  // log("有"+count+"位有效数字")
  switch(count)
  {
    case 0:
      numMerge=[0,0,0,0]
      break;
    case 1:
      for(var i=0;i<4;i++){
        if(nums[i]!=0){
          numMerge=[0,0,0,nums[i]]
          break;
        }
      }
      break;
    case 2:
      numMerge=[]
      for(var i=0;i<4;i++){
        if(nums[i]!=0){
          numMerge.push(nums[i])
        }
        if(numMerge.length==2){
          break;
        }
      }
      if(numMerge[0]==numMerge[1]){
        numMerge=[0,0,0,numMerge[0]*2]
      }else{
        numMerge=[0,0,numMerge[0],numMerge[1]]
      }
      break;
    case 3:
      numMerge=[]
      for(var i=0;i<4;i++){
        if(nums[i]==0){
          nums.splice(i,1);
          break;
        }
      }

      if(nums[2]==nums[1]){
        // log("case 3 nums[0]==nums[1]=",nums[0])
        numMerge=[0,0,nums[0],nums[2]*2]
        // log(numMerge)
      }else if(nums[1]==nums[0]){
        numMerge=[0,0,nums[0]*2,nums[2]]
      }else{
        numMerge=[0,nums[0],nums[1],nums[2]]
      }
      break;
    case 4:
      if(nums[2]==nums[3]){
        if(nums[0]==nums[1]){
          numMerge=[0,0,nums[0]*2,nums[2]*2]
        }else{
          numMerge=[0,nums[0],nums[1],nums[3]*2]
        }
      }else if(nums[2]==nums[1]){
        numMerge=[0,nums[0],nums[1]*2,nums[3]]
      }else{
        if(nums[0]==nums[1]){
          numMerge=[0,nums[0]*2,nums[1],nums[2]]
        }else{
          numMerge=nums
        }
      }
      break;
    default:
      log("有效数字个数错误,必须是0,1,2,3,4的其中一种")
  }
  return numMerge;
}

function mergeNumsUp(numsMeta){
  let nums=numsMeta.slice(0)

  return mergeNumsLeft(nums)
}
function mergeNumsDown(numsMeta){
  let nums=numsMeta.slice(0)


  return mergeNumsRight(nums)
}












function manhattanDistanceGrid(result){
  var compareObj = function (prop) {
    return function (obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
            val1 = Number(val1);
            val2 = Number(val2);
        }
        if (val1 > val2) {
            return -1;
        } else if (val1 < val2) {
            return 1;
        } else {
            return 0;
        }
    }
  }

  let resultWithPositon=[]
  for(let i=0;i<16;i++){
    let serialNumber=i
    let value=result[i]
    resultWithPositon.push({serialNumber:serialNumber,value:value})
  }
  log("\n",resultWithPositon)

  resultWithPositon.sort(compareObj("value"))
  let manhattanDistance=0
  for(let i=0;i<6;i++){
    manhattanDistance=manhattanDistance+manhattanDistanceP(resultWithPositon[i])*(i+1)
    log("manhattanDistance=",manhattanDistance)

  }
  return manhattanDistance

}


function manhattanDistanceP(p2){
  log("63行manhattanDistanceP的参数p2=",p2)
  if(p2.value==0){
    return 0
  }
// |x1-x2|+|y1-y2|
  let p1=12
  let x1=3
  let y1=0
  let x2=Math.floor(p2.serialNumber/4)
  let y2=p2.serialNumber%4
  log("x1=",x1,"y1=",y1,"x2=",x2,"y2=",y2)
  let distance=Math.abs(x1-x2)+Math.abs(y1-y2)
  log("71行distance=",distance)
  return distance
}
function manhattanDistanceP1P2(p1,p2){
// |x1-x2|+|y1-y2|
  let x1=Math.floor(p1.serialNumber/4)
  let y1=p1.serialNumber%4
  let x2=Math.floor(p2.serialNumber/4)
  let y2=p2.serialNumber%4
  let distance=Math.abs(x1-x2)+Math.abs(y1-y2)
  return distance
}








function Score(compareNum){


  // compareNum= [ { direction: 'left', maxNumSum: 6, manhattanDistance: 2 },
  // { direction: 'right', maxNumSum: 6, manhattanDistance: 4 },
  // { direction: 'up', maxNumSum: 6, manhattanDistance: 29 } ]






  let sixNumScoreTemp=0
  let manhattanDistanceScoreTemp=0
  let sixNumScore=0
  let maxNumSumTest=0
  let threeSpaceTest=0
  let eightNoSpaceTest=0
  let firstRowSpaceTest=0
  let secondRowSpaceTest=0



  let scoreDetail={
    "up":{
      sixNumScoreTemp:0,
      manhattanDistanceScoreTemp:0,

      maxNumSumTest:0,
      threeSpaceTest:0,
      eightNoSpaceTest:0,
      firstRowSpaceTest:0,
      secondRowSpaceTest:0
    },
    "down":{
      sixNumScoreTemp:0,
      manhattanDistanceScoreTemp:0,

      maxNumSumTest:0,
      threeSpaceTest:0,
      eightNoSpaceTest:0,
      firstRowSpaceTest:0,
      secondRowSpaceTest:0
    },
    "left":{
      sixNumScoreTemp:0,
      manhattanDistanceScoreTemp:0,

      maxNumSumTest:0,
      threeSpaceTest:0,
      eightNoSpaceTest:0,
      firstRowSpaceTest:0,
      secondRowSpaceTest:0
    },
    "right":{
      sixNumScoreTemp:0,
      manhattanDistanceScoreTemp:0,

      maxNumSumTest:0,
      threeSpaceTest:0,
      eightNoSpaceTest:0,
      firstRowSpaceTest:0,
      secondRowSpaceTest:0
    },
  }
  //用百分比表示
  // 除以最大值

  // WeightCoefficient
  let numWeightCoefficient=0.5
  let positionWeightCoefficient=0.5


    // return Math.max.apply(null,result)

  let  numSumArr=[]
  let  manhattanDistanceArr=[]
  for(let i=0;i<compareNum.length;i++){
    numSumArr.push(compareNum[i].maxNumSum)
    manhattanDistanceArr.push(compareNum[i].manhattanDistance)
  }

  let numSumMax=Math.max.apply(null,numSumArr)
  let manhattanDistanceMax=Math.max.apply(null,manhattanDistanceArr)

  let directionAndScore=[]

  for(let i=0;i<compareNum.length;i++){
    let direction=compareNum[i].direction


    log("方向=",direction,"6个数字总和=",compareNum[i].maxNumSum)
    log("方向=",direction,"曼哈顿距离=",compareNum[i].manhattanDistance)





    let Score=compareNum[i].maxNumSum/numSumMax*numWeightCoefficient +
              (1-compareNum[i].manhattanDistance/manhattanDistanceMax)*positionWeightCoefficient


    scoreDetail[direction].sixNumScoreTemp=compareNum[i].maxNumSum/numSumMax*numWeightCoefficient
    scoreDetail[direction].manhattanDistanceScoreTemp=(1-compareNum[i].manhattanDistance/manhattanDistanceMax)*positionWeightCoefficient



    directionAndScore.push({direction:direction,Score:Score})
  }
  log("\n",directionAndScore)
  var compareObj = function (prop) {
    return function (obj1, obj2) {
        var val1 = obj1[prop];
        var val2 = obj2[prop];
        if (!isNaN(Number(val1)) && !isNaN(Number(val2))) {
            val1 = Number(val1);
            val2 = Number(val2);
        }
        if (val1 > val2) {
            return -1;
        } else if (val1 < val2) {
            return 1;
        } else {
            return 0;
        }
    }
  }


  for(let i=0;i<compareNum.length;i++){
    let swipeResult=compareNum[i].swipeResult
    //如果左下角的数字,比上边和右边小,那么分值为0
    if(swipeResult[12]>=2 && (swipeResult[12]<swipeResult[8] || swipeResult[12]<swipeResult[13])){
      //将对应方向的分值改为0
      let direction=compareNum[i].direction
      for(let i=0;i<directionAndScore.length;i++){

        if(directionAndScore[i].direction==direction){
          directionAndScore[i].Score=0
          break;
        }


      }

    }

  }

  //合并数字加分0.2
  //分别求各个方向滑动结果的最大值,最大值最大的加0.2分

  // return Math.max.apply(null,result)


  let maxNumOfMaxNum=0
  for(let i=0;i<compareNum.length;i++){
    let swipeResult=compareNum[i].swipeResult
    let maxNumOfMaxNumTemp=Math.max.apply(null,swipeResult)
    if(maxNumOfMaxNumTemp>maxNumOfMaxNum){
      maxNumOfMaxNum=maxNumOfMaxNumTemp
    }
  }
  for(let i=0;i<compareNum.length;i++){
    let swipeResult=compareNum[i].swipeResult
    let maxNumOfMaxNumTemp=Math.max.apply(null,swipeResult)
    if(maxNumOfMaxNumTemp==maxNumOfMaxNum){
      directionAndScore[i].Score=directionAndScore[i].Score+0.2



      let direction=compareNum[i].direction
      scoreDetail[direction].maxNumSumTest=0.2


    }
  }


  //使右上角空格字最多的加0.2

  for(let i=0;i<compareNum.length;i++){
    let swipeResult=compareNum[i].swipeResult

    if(swipeResult[3]==0){
      directionAndScore[i].Score=directionAndScore[i].Score+0.2

      let direction=compareNum[i].direction
      scoreDetail[direction].threeSpaceTest=0.2


    }
    if(swipeResult[8]!=0){
      directionAndScore[i].Score=directionAndScore[i].Score+0.5
      let direction=compareNum[i].direction
      scoreDetail[direction].eightNoSpaceTest=0.5
    }
  }
  //使头两行为空的加0.1

  for(let i=0;i<compareNum.length;i++){
    let swipeResult=compareNum[i].swipeResult

    if(swipeResult[0]==0  && swipeResult[1]==0  && swipeResult[2]==0  && swipeResult[3]==0){
      directionAndScore[i].Score=directionAndScore[i].Score+0.4
      let direction=compareNum[i].direction
      scoreDetail[direction].firstRowSpaceTest=0.4

      if(swipeResult[4]==0  && swipeResult[5]==0  && swipeResult[6]==0  && swipeResult[7]==0){
        directionAndScore[i].Score=directionAndScore[i].Score+0.1

        let direction=compareNum[i].direction
        scoreDetail[direction].secondRowSpaceTest=0.4

      }



    }
  }


  // let sixNumScoreTemp=0
  // let manhattanDistanceScoreTemp=0
  // let sixNumScore=0
  // let maxNumSumTest=0
  // let threeSpaceTest=0
  // let eightNoSpaceTest=0
  // let firstRowSpaceTest=0
  // let secondRowSpaceTest=0


  scoreDetail["up"].totalScore=



  directionAndScore.sort(compareObj("Score"))

  log("各种加权后的得分=\n",directionAndScore)

  log(scoreDetail)



  return directionAndScore[0]

  // [ { direction: 'left', Score: 0.9655172413793103 },
  // { direction: 'right', Score: 0.9310344827586207 },
  // { direction: 'up', Score: 0.5 } ]
}








