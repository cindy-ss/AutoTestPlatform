/**
 * Created by Edel on 15/11/6.
 */
var n = 5;
for(i = 0; i < n; i ++){
    for(j = 0; j < n + i; j++){
        if(j < n - i - 1){
            document.write("&nbsp;&nbsp;");
        }else{
            document.write("*&nbsp;");
        }
    }
    document.write("<br/>");
}