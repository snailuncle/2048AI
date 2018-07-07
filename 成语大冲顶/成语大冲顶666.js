auto();

//请求截图
if(!requestScreenCapture()){
  toast("请求截图失败");
  exit();
}



console.show()
clickedIdiom=[]
clickedword=[]

// 词库中没有的成语="如日方升"


// 词库中没有的成语="一言一行"


// 词库中没有的成语="一无所闻"
词库中没有的成语="载舟覆舟正经"

idiomFilePath="/sdcard/成语大全无换行符.txt"
idiomOriginal=files.read(idiomFilePath)
idiomOriginalLength=idiomOriginal.length-2

// removeStr2





for(let i=0;i<18;i++){
  collectWordsResult=collectWords()
  //采集到的随机汉字
  randomChineseCharacter=collectWordsResult[0]
  log("随机汉字=",randomChineseCharacter)
  // for(let k=0;k<clickedIdiom.length;k++){
  //   randomChineseCharacter=removeStr2(randomChineseCharacter,clickedIdiom[k])
  // }
  // for(let k=0;k<clickedword.length;k++){
  //   randomChineseCharacter=removeStr3(randomChineseCharacter,clickedword[k])
  // }
  // log("去掉点击过的成语之后,随机汉字=",randomChineseCharacter)
  //随机汉字和他的坐标
  randomChineseCharacterObjects=collectWordsResult[1]
  let sequenceNumber=1
  for(let i=0;i<randomChineseCharacter.length;i++){
    chineseCharacter=randomChineseCharacter.charAt(randomChineseCharacter.length - sequenceNumber)
    for(let j=0;j<clickedword.length;j++){
      if(chineseCharacter==clickedword[j]){
        sequenceNumber++;

      }
    }

    if(词库中没有的成语.indexOf(chineseCharacter)!=-1){
      sequenceNumber++;

    }





    chineseCharacter=randomChineseCharacter.charAt(randomChineseCharacter.length - sequenceNumber)

  }

  log("匹配的单个汉字是=",chineseCharacter)
  idiomOutPut=outputIdiom(chineseCharacter)


  //输出搜索出来的成语
  log("输出搜索出来的成语=",idiomOutPut)



  if(idiomOutPut && idiomOutPut.length==4){
    let clicked=false
    let sss=""
    for(let i=0;i<clickedIdiom.length;i++){
      if(clickedIdiom[i].indexOf(idiomOutPut) != -1){
        // 1234
        // 3412
        // aaa3421=false
        // aaa4132=false
        if(clickedword.indexOf(idiomOutPut+"3412")==-1){
          sss=clickIdiom3412(idiomOutPut)+"3421"

        }else if(clickedword.indexOf(idiomOutPut+"4132")==-1){
          sss=clickIdiom4132(idiomOutPut)+"4132"

        }
        clicked=true
        break;
      }
    }
    if(clicked==false){
      sss=clickIdiom(idiomOutPut)
    }
    sleep(200)
    clickedIdiom.push(sss)
  }else{
    clickedword.push(chineseCharacter)
  }
}



function checkBeforeClick(){
  var img = captureScreen();
// 082356  40
  for(var name in randomChineseCharacterObjects){
    // let names
    // names+=name+": "+randomChineseCharacterObjects[name]+", ";
    // log(names)
    // log(x,y)
    let x=randomChineseCharacterObjects[name].x+40
    let y=randomChineseCharacterObjects[name].y
    // log(x,y)
    var color = images.pixel(img, x, y);
    if(colors.isSimilar(color, "#562308")){
      // log(x,y,"这里的颜色是黑色")
      press(x,y,50)
      sleep(200)
    }
  }
}

// 点击成语
function clickIdiom(idiom){
  log(idiom,"点击顺序1234")

  checkBeforeClick()
 //log"clickIdiom接收的参数idiom=",idiom)
  let word1=idiom.slice(0,1)
  let word2=idiom.slice(1,2)
  let word3=idiom.slice(2,3)
  let word4=idiom.slice(3,4)
  let words=[word1,word2,word3,word4]
  for(let i=0;i<4;i++){
    let x=randomChineseCharacterObjects[words[i]].x
    let y=randomChineseCharacterObjects[words[i]].y
    press(x,y,50)
    sleep(200)
  }
  return idiom
}
// 点击成语
function clickIdiom3412(idiom){
  log(idiom,"点击顺序3412")

  checkBeforeClick()
 //log"clickIdiom接收的参数idiom=",idiom)
  let word1=idiom.slice(0,1)
  let word2=idiom.slice(1,2)
  let word3=idiom.slice(2,3)
  let word4=idiom.slice(3,4)
  let words=[word3,word4,word1,word2]
  for(let i=0;i<4;i++){
    let x=randomChineseCharacterObjects[words[i]].x
    let y=randomChineseCharacterObjects[words[i]].y
    press(x,y,50)
    sleep(200)
  }
  return idiom

}
function clickIdiom4132(idiom){
  log(idiom,"点击顺序4132")
  checkBeforeClick()
 //log"clickIdiom接收的参数idiom=",idiom)
  let word1=idiom.slice(0,1)
  let word2=idiom.slice(1,2)
  let word3=idiom.slice(2,3)
  let word4=idiom.slice(3,4)
  let words=[word4,word1,word3,word2]
  for(let i=0;i<4;i++){
    let x=randomChineseCharacterObjects[words[i]].x
    let y=randomChineseCharacterObjects[words[i]].y
    press(x,y,50)
    sleep(200)
  }
  return idiom

}


function collectWords(){
  let s={}
  let words=""
  var cc=className("android.view.View").boundsContains(128,798,968,1218).clickable().find()
  // log("cc=",cc)
  // log("ccLength=",cc.length)
  cc.forEach(function(element) {
    if(element.desc().length==1){
      // log("desc的长度是1=",element.desc().length)
      if(words.indexOf(element.desc()) == -1){

        words=words+element.desc()
      }



      // log("element.desc()=",element.desc())
      // log("words=",words)
      s[element.desc()]={x:element.bounds().centerX(),y:element.bounds().centerY()}
    }else{
      // log("desc的长度不是1=",element.desc().length)
    }

  });
  // log("最终的words=",words)
  return [words,s]
}




function outputIdiom(word){
  // word="光" //----------------------------------

  // randomChineseCharacter="和光同尘"






 //log"outputIdiom接收的参数word=",word)
  //遍历所有包含*左*的成语
  containWordResult=containWord(word)
//  log("containWordResult=",containWordResult)
  // exit()
  //遍历所有包含*左*的成语,的其余三个字符,是否在randomChineseCharacter中

  containWordResultLength=containWordResult.length

  let s=""
  let cursor=0
  // log("157行containWordResultLength=",containWordResultLength)
  while(cursor<containWordResultLength){
    let remainThreeWords=removeWord(containWordResult.slice(cursor,cursor+4),word)
    let count=0
    let cursor2=0
    while(cursor2<3){
      if(randomChineseCharacter.indexOf(remainThreeWords.slice(cursor2,cursor2+1)) != -1){
        count++;
      }
      cursor2++;
    }
    if(count==3){
      return containWordResult.slice(cursor,cursor+4)
    }
    cursor=cursor+4
  }
  return false
}

function removeStr2(str1,str2){
  let word1=str2.slice(0,1)
  let word2=str2.slice(1,2)
  let word3=str2.slice(2,3)
  let word4=str2.slice(3,4)

  let result
  result=str1.replace(word1,"");
  result=result.replace(word2,"");
  result=result.replace(word3,"");
  result=result.replace(word4,"");
  return result
}
function removeStr3(str1,str2){
  let result=str1.replace(str2,"");
  return result
}

function removeWord(idiom,word){
  return idiom.replace(word,"");
}


//返回包含指定字符的成语数组
function containWord(word){
  idiomOriginal=files.read(idiomFilePath)
  ////logidiomOriginal.slice(0,8))
  // exit()
  let s=""
  let cursor=0
  while(cursor<idiomOriginalLength){
    // sleep(1000)
    ////logidiomOriginal.slice(cursor,cursor+4))
    if(idiomOriginal.slice(cursor,cursor+4).indexOf(word) != -1){
      ////log"循环中")
      ////logidiomOriginal.slice(cursor,cursor+4))
      s=s+idiomOriginal.slice(cursor,cursor+4)
    }
    cursor=cursor+4
  }
  ////logs)
  // exit()
  return s
}

// cursor
