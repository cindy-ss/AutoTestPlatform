/**
 * Created by Edel on 15/11/27.
 */
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.*;

public class hello {
    public static void main(String[] args) throws IOException{
        String[] cmd = new String[] {"ant", "release", "-f", "/Users/Edel/OS/share/MCT/trunk/code/MCT/build.xml"};
//        String[] cmd = new String[] {"ant", "release"};
//        String[] cmd = new String[] {"./Users/Edel/OS/share/MCT/trunk/code/MCT/ant", "release", ""};
        Process process = Runtime.getRuntime().exec(cmd);
        BufferedReader r = new BufferedReader(new InputStreamReader(process.getErrorStream()));
        String l = null;
        while((l = r.readLine()) != null) {
            System.out.println(l);
        }
    }
}