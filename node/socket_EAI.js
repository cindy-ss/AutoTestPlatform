var net = require('net');

var HOST = '10.225.1.201';
var PORT = "18001";

var client = new net.Socket();
client.connect(PORT, HOST, function() {

    console.log('CONNECTED TO: ' + HOST + ':' + PORT);
    // 建立连接后立即向服务器发送数据，服务器将收到这些数据

    var parm = {
        _UserSeq:"",//****选输***用户序号
        _CifNo:"",//****选输***核心客户号(选输)
        _AccessIp:"",//****选输***客户端IP 呼叫中心上送CallInNo 手机银行上送40位iMEI终端唯一标识 网银送 IP地址
        _ChannelServiceId:"",//****选输***渠道服务标识  00001000441436408059  呼叫中心上送CallID 手机银行上送SessionID
        _AgentId:"",//****选输***座席/终端编号  1003 呼叫中心座席必须输入
        _MCHTimestamp: '2015-07-09 10:15:27',
        _TransactionId:"ecif.MCPerAppoinSignTrs",//交易码 ecif.MCPerAppoinSignTrs 必输
        _MCHJnlNo:'7098A0B5FFFFFFC447624762A7823013',//渠道端流水号  7098A0B5FFFFFFC447624762A7823013 必输
        _MChannelId:"MCTS",//渠道代码 PTBS 必输 个个人网银：PIBS 人电话银行：PTBS 个人手机银行：PMBS
        _DeptId:"00080000",//机构号 网点机构号 00080000
        _TellerId:"MCA",//操作员号 CCS
        _SubChannelId:"",//****选输***子渠道号 C  IVR送‘I’,CSR送‘C’，手机银行不上送
        _TerminalJnlNo:'7096A7BAFFFFFFC44EF64EF60ED6C04B',//终端流水号 7096A7BAFFFFFFC44EF64EF60ED6C04B
        _CifSeq:"",//****选输***客户序号
        _SignFlag:"0",// 是否通过身份认证  0  必输，0:否  1:是
        _ChannelMsg:"",//****选输***渠道信息 选输
        _LoginType:"O",//登录类型 O  O：动态口令版 U：证书版 R：查询版

        CifSeq:"",//****选输***电子渠道客户序号
        UserSeq:"",//****选输***电子渠道用户序号
        AppoinFlag: 0,//预签约标识   1     0 - 借记卡及电子银行业务申请； 1 - 借记卡申请； 2 - 电子银行业务申请； 3 - 天津一卡通申请
        UserName: '',//客户姓名 灯泡
        Sex:"",//M - 男 F - 女 U - 未知
        Nationality:"",//国籍
        MobilePhone:'',//本人预留手机号
        IdType:"P00",//证件类型 P00  /** 身份证 */P00,/** 军官证 */P01,/** 文职干部证 */P02,/** 警官证 */P03, /** 士兵军人证 */P04, /** 中国护照 */P05, /** 港澳台居民通行证 */P06, /** 户口簿 */P07, /** 边民出入境通行证 */P08, /** 外国人永久居留证 */P09, /** 临时身份证 */P10, /** 离休干部荣誉证 */P11, /** 武警警官证誉证补折 */P12, /** 台湾居民往来通行证 */P13, /** 军官退休证 */P14, /** 文职干部退休证 */P15, /** 军事院校学员证 */P16, /** 武警士兵证 */P17, /** 武警文职干部证 */P18, /** 武警军官退休证 */P19, /** 武警文职干部退休证 */P20, /** 驾驶执照 */P21, /** 外国护照 */P23, /** 旧身份证 */P22, /** 个人其他 */P99, /** 组织机构代码证 */E01, /** 营业执照 */E02, /** 企业名称核准书 */E03, /** 政府机构/公共机构批文 */E04, /** 香港商业登记证 */E05, /** 开户证明 */E06, /** 军队开户许可证 */E07, /** 社会团体证 */E08, /** 非法人组织机构代码证 */E09, /** 企业其他 */E99;
        IdNo:'110101198007010070',//证件号码 110101198007010070
        IdEffectiveDate:"",//证件有效期
        PostalAddress:"",//通讯地址
        PostalCode:"",//邮政编码
        Email:"",//电子邮件
        Occupation:"",//职业 01
        AgentFlag:"",//是否代理人标识 0   0 - 否 1 - 是
        AcNo:"",//账号
        CardType:"0",// 卡种  1   0-普通卡 1-添金宝
        IsSignEChannel:"",//是否追加至电子渠道  0-否 1-是 借记卡申请时用
        IsSameToIdAddress:"",//通讯地址是否与身份证地址一致 1   0-否 1-是 借记卡申请时用
        SmsMobilePhone:"",//短信银行手机号 如果短信银行开通则手机号必输
        SmsFlag:"",//短信银行标识  1 - 开通
        AgentUserName:"",//代理人姓名
        AgentIdType:"",//代理人证件类型
        AgentIdNo:"",//代理人证件号码
        AgentIdEffectiveDate:"",//代理人证件有效期  yyyy-MM-dd
        AgentPostalAddress:"",//
        AgentPhone:"",//代理人联系电话
        AgentReason:"",//代办理由 本人不便外出
        Quantity:"",//预办理卡片数量 最多九张
        OperationType:"",//操作类型     00-升级 01-新购卡
        ReqTime:"",//请求时间  格式yyyymmddhhmmss
        SmsTelNo:"",//短信动帐提醒接收手机号码
        SmsAmt:"",//短信动帐提醒金额下限
        SmsPhone:"",//短信认证手机号码
        CertFlag:"",//数字证书标识  1 - 开通
        PayFlag:"",//电子支付标识   1 - 开通
        CcsFlag:"",//电话银行标识  1 - 开通
        MbsFlag:"",//手机银行标识 1 - 开通
        IbsFlag:""//网上银行标识 1 - 开通

    };

    //console.log(new Date().getTime());

    var obj = "<?xml version=\"1.0\" encoding=\"UTF-8\"?>"
        + "<Message>" + "<Head>"
        + "<_TransactionId>outcall.MCSendMsgTrs</_TransactionId>"
        + "<_MCHTimestamp>"
        + new Date().getUTCDay()
    //DateUtil.getCurrentDateString("yyyy-MM-dd HH:mm:ss")
        + "</_MCHTimestamp>"
        + "<_MChannelId>MCTS</_MChannelId>"
        + "<_DeptId>00080000</_DeptId>"
        + "<_LoginType>O</_LoginType>"
        + "<_MCHJnlNo>7098A0B5FFFFFFC447624762A7823013</_MCHJnlNo>"
        + "<_AccessIp>"
        + "10.225.8.214"
        + "</_AccessIp>"
        + "<_locale>zh_CN</_locale>"
        + "<_TellerId>WEBS</_TellerId>"
        + "</Head>"
        + "<Body>"
        + "<OutBoundType>1</OutBoundType>"
        + "<OutBoundNo>"
        + "18627020675"
        + "</OutBoundNo>"
        + "<Content>"
        + "<![CDATA["
        + "【掌上运维平台】 "
        + "020202"
        + " (验证码)，为了保护您的账号安全，您不要把验证码透露给别人"
        + "]]>"
        + "</Content>"
        + "<Level>3</Level>"
        + "<FileFlag>0</FileFlag>"
        + "</Body>" + "</Message>";

    //client.write(JSON.stringify(parm));
    client.write(obj);
    //client.write('I am Chuck Norris!');

});

// 为客户端添加“data”事件处理函数
// data是服务器发回的数据
client.on('data', function(data) {

    console.log('DATA: ' + data);
    // 完全关闭连接
    client.destroy();

});

// 为客户端添加“close”事件处理函数
client.on('close', function() {
    console.log('Connection closed');
});