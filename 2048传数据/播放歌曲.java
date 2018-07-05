import java.io.BufferedInputStream;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import javazoom.jl.player.Player;

public class MP3Player{
public static void main(String[] args) throws Exception {
BufferedInputStream buffer = new BufferedInputStream(
new FileInputStream("金艺林 - All Right.mp3"));
new Player(buffer).play();
}
}
