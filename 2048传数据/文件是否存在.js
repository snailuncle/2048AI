importClass('java.io.File')
importClass('java.io.IOException')

filePath="/storage/emulated/0/SoGame/log/2018-07-05/1.playstation.log"
dirPath="/sdcard/SoGame/log/2018-07-05"

directory = new File(dirPath);//设定为当前文件夹

log("directory.getCanonicalPath()=",directory.getCanonicalPath());//获取标准的路径
log("directory.getAbsolutePath()=",directory.getAbsolutePath());//获取绝对路径


tempList = directory.listFiles()
log("tempList=",tempList)
exit()



file=new File(filePath);
file.createNewFile();
result=file.getAbsolutePath()
log(result)
exit()




file = new File(filePath);
log(file)
log(file.exists())
function judeFileExists(file) {

    if (file.exists()) {
        log("file exists");
    } else {
        log("file not exists, create it ...");
        try {
            file.createNewFile();
        } catch (e) {
            log(e + e.stack)
        }
    }

}

judeFileExists(file)
