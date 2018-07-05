import java.io.File;
import java.io.IOException;

public class Main {

    public static void main(String[] args) {

        File file = new File("d:\\test_file.txt");
        Main.judeFileExists(file);

        File dir = new File("d:\\test_dir");
        Main.judeDirExists(dir);
    }

    // 判断文件是否存在
    public static void judeFileExists(File file) {

        if (file.exists()) {
            System.out.println("file exists");
        } else {
            System.out.println("file not exists, create it ...");
            try {
                file.createNewFile();
            } catch (IOException e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }
        }

    }
