
s1="12345678我们"
s2="我89哦"
sss=removeStr2(s1,s2)
log(sss)
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
