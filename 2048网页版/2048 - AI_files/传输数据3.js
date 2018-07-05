info= [ { x: 0, y: 0, num: 8 },
        { x: 1, y: 0, num: 16 },
        { x: 2, y: 0, num: 16 },
        { x: 3, y: 0, num: 8 },
        { x: 0, y: 1, num: 16 },
        { x: 1, y: 1, num: 32 },
        { x: 2, y: 1, num: 0 },
        { x: 3, y: 1, num: 0 },
        { x: 0, y: 2, num: 128 },
        { x: 1, y: 2, num: 8 },
        { x: 2, y: 2, num: 0 },
        { x: 3, y: 2, num: 8 },
        { x: 0, y: 3, num: 0 },
        { x: 1, y: 3, num: 0 },
        { x: 2, y: 3, num: 0 },
        { x: 3, y: 3, num: 0 } ]


  // tile=[{x:x,y:y},value]  || null
    //  00 10 20 30
    //  01 11 21 31
    //  02 12 22 32
    //  03 13 23 33
function convertDataToAiStyle(info){
  let tiles=[]
  for(let i=0;i<info.length;i++){
    if(info[i].num==0){
    }else{
      tiles.push([{x:info[i].x,y:info[i].y},info[i].num])
    }
  }
}
