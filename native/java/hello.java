import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStreamWriter;
import java.io.PrintWriter;
import java.net.ConnectException;
import java.net.Socket;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Properties;

public class hello{
    public static void main(String[] args){
        String rspMsg = "";
        Socket socket = null;
        PrintWriter printWriter = null;
        BufferedReader bufferedReader = null;
//        logger.info("socket interface request message----" + requestStr);

        try
        {
            // 初始化连接
            socket = new Socket("10.225.1.201", "18001");

            // 由Socket对象得到输出流，并构造PrintWriter对象
            printWriter = new PrintWriter(new OutputStreamWriter(socket.getOutputStream(), "UTF-8"));

            // 由Socket对象得到输入流，并构造BufferedReader对象
            bufferedReader = new BufferedReader(new InputStreamReader(socket.getInputStream(), "UTF-8"));
            printWriter.println("");

            // 将请求报文字符串输出到Server
            printWriter.flush();
            StringBuffer rspBuffer = new StringBuffer();
            String tmpLine = "";

            // 读取响应报文
            do
            {
                tmpLine = bufferedReader.readLine();

                if (null != tmpLine && !"".equals(tmpLine))
                {
                    rspBuffer.append(tmpLine);
                }

            } while (StringUtils.isNotEmpty(tmpLine));

            rspMsg = rspBuffer.toString();
        }
        catch (ConnectException e)
        {
            rspMsg = "接口调用失败，无法连接短信平台服务";
        }
        catch (Exception e)
        {
            rspMsg = "接口调用异常";
        }

    System.out.println("Hello World");
}
}
