auto();
console.show()
clickedIdiom=[]
clickedword=[]

// 082356  40

idiomFilePath="/sdcard/成语大全无换行符.txt"
idiomOriginal=files.read(idiomFilePath)
idiomOriginalLength=idiomOriginal.length-2

// removeStr2

for(let i=0;i<4;i++){
  collectWordsResult=collectWords()
  //采集到的随机汉字
  randomChineseCharacter=collectWordsResult[0]
  // log("去掉点击过的成语之前,随机汉字=",randomChineseCharacter)
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
        break;
      }
    }
    chineseCharacter=randomChineseCharacter.charAt(randomChineseCharacter.length - sequenceNumber)

  }
  idiomOutPut=outputIdiom(chineseCharacter)


  //输出搜索出来的成语
  log("输出搜索出来的成语=",idiomOutPut)



  if(idiomOutPut && idiomOutPut.length==4){
    clickIdiom(idiomOutPut)
    sleep(300)
    clickedIdiom.push(idiomOutPut)
  }else{
    clickedword.push(randomChineseCharacter.charAt(randomChineseCharacter.length - 1))
  }
}


// 点击成语
function clickIdiom(idiom){
 //log"clickIdiom接收的参数idiom=",idiom)
  let word1=idiom.slice(0,1)
  let word2=idiom.slice(1,2)
  let word3=idiom.slice(2,3)
  let word4=idiom.slice(3,4)
  let words=[word1,word2,word3,word4]
  for(let i=0;i<4;i++){
    let x=randomChineseCharacterObjects[words[i]].x
    let y=randomChineseCharacterObjects[words[i]].y
    press(x,y,10)
    sleep(200)
  }
}


function collectWords(){
  let s={}
  let words=""
  var c = className("android.view.View").boundsContains(128,798,968,1218).clickable().find().forEach(function(element) {
    if(element.desc().length==1){

      words=words+element.desc()
      s[element.desc()]={x:element.bounds().centerX(),y:element.bounds().centerY()}
    }

  });
  return [words,s]
}




function outputIdiom(word){
  // word="光" //----------------------------------

  // randomChineseCharacter="和光同尘"






 //log"outputIdiom接收的参数word=",word)
  //遍历所有包含*左*的成语
  containWordResult=containWord(word)
 //log"containWordResult=",containWordResult)
  // exit()
  //遍历所有包含*左*的成语,的其余三个字符,是否在randomChineseCharacter中

  idiomOriginalLength=containWordResult.length

  let s=""
  let cursor=0
  while(cursor<idiomOriginalLength){
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
