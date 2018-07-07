auto();

// 查找父控件,
// 父控件下的全部子控件都是汉字

function collectWords(){
  let s=""
  var c = className("android.view.View").boundsContains(128,798,968,1218).clickable().find().forEach(function(element) {
    s=s+element.desc()
  });
  return s
}





