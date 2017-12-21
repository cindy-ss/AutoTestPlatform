# 内部接口

## Meta Checker

* 接口名: 获取meta检查结果
* 接口地址：`/trans`
* Method：`POST`
* 输入参数：
```
{
data : {
}
}
```
* 输出参数：
```
{
    status : String,
    data : String,
    message : String.
}
```
| 字段 | 取值 |
| --- | --- |
| status | success 或 failed |
| message | 'Upload data received.'或'Upload data not detected.' |

## Copy Checker