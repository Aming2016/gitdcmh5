var vm = new Vue({
    el: '#box',
    data:{
        type: '',//ios web android 
        menu:['公积金贷款','商业贷款','组合贷款'],
        mode: "按贷款总额",//计算模式
        isLoans: true,//按贷款计算方式
        loans: null,//贷款总额
        loans2: null,//贷款总额上限
        sellPrice: null,//房价总额
        sellPrice2: null,//房价总额上限
        houseLoans: null,//组合贷款的公积金贷款
        commercialLoans: null,//组合贷款的商业贷款
        years: "30年",//贷款年限
        rate11: "最新基准利率(3.25%)",//公积金贷款利率
        rate21: "最新基准利率(4.9%)",//商业贷款利率
        calcRate1: 3.25, //用于计算的公积金贷款利率
        calcRate2: 4.9,  //用于计算的商业贷款利率
        calcYears: 30,   //用于计算的贷款年数
        isToast: false,//是否提示
        toastContent: "请输入贷款金额",//提示内容
        rate: "7成",//公积金 商业 组合的贷款比例
        own2rate: '',//自定义利率
        selectNum: 0,//tab切换的索引
        selectNum1: null,//计算方式的样式
        selectNum2: null,//年的样式
        selectNum3: null,//利率的样式
        selectNum4: null,//比例的样式
        isCancel: false,//打开展开选项
        ergodic : null,//展开项将要的遍历对象
        calcWay: ['按房价总额','按贷款总额'], //计算方式
        loanYears: 30,  //贷款年限
        loanRate: [], //贷款利率
        loanRate2: [2,3,4,5,6,7,8],//贷款比例(多少成)
        titles: ['计算方式','贷款年限','贷款利率','贷款比例'],//展开项的标题
        titleIndex: 0,//展开项的标题的索引
    },
    created() {
        this.selectItem(1);
        try{
            var url = location.href;
            var urlparams = this.parseUrl(url);
            this.type = urlparams.type.toLowerCase();
        }catch(err){}
    },
    watch: {
        // 房价
        sellPrice(){
            this.sellPrice2 = this.sellPrice;
            if(this.mode=='按房价总额'){
                this.loans = parseInt(this.sellPrice*7/10);
                this.loans2 = this.loans;
            }
        },
        // 贷款金额
        loans() {
            if(this.mode=='按房价总额'){
                if(this.sellPrice2!=null){
                    if(this.loans>this.loans2) {
                        this.isToast=true;
                        this.toastContent="超出贷款总额";
                        setTimeout(()=>{this.isToast=false},3000);
                    }
                }
            }else{
                this.commercialLoans = this.loans;
            }
        },
        // 贷款比例
        rate() {
            if(this.mode=='按房价总额'){
                this.loans = parseInt(parseInt(this.rate)/10*this.sellPrice);
                this.loans2 = this.loans;
            }
        },

        // 公积金贷款
        houseLoans() {
            if((this.commercialLoans+this.houseLoans)>this.loans){
                this.isToast=true;
                this.toastContent="超出贷款总额";
                setTimeout(()=>{this.isToast=false},3000);
            }
            this.commercialLoans = this.loans - this.houseLoans;
        },
        // 自定义利率
        own2rate() {
            if(parseInt(this.own2rate)>100){
                this.isToast=true;                
                this.own2rate=null;
                this.toastContent="请输入100以内的数值";
                setTimeout(()=>{
                    this.isToast=false
                },2000);
            }
        }
    },
    methods:{
        //自定义利率
        confirmRate() {
            let index = this.selectNum;
            let showown2Rate = Number(Number(this.own2rate).toFixed(2));
            if(showown2Rate>100){
                this.isToast=true;                
                this.toastContent="请输入100以内的数值";
                setTimeout(()=>{
                    this.own2rate = null;
                    this.isToast=false}
                ,3000);
            }else{
                if(index==0){
                    this.rate11='自定义利率('+showown2Rate+'%)';
                    this.calcRate1=showown2Rate;
                }else if(index==1){
                    this.rate21='自定义利率('+showown2Rate+'%)';
                    this.calcRate2=showown2Rate;  
                }else if(index==3){
                    this.rate11='自定义利率('+showown2Rate+'%)';
                    this.calcRate1=showown2Rate;
                }else if(index==4){
                    this.rate21='自定义利率('+showown2Rate+'%)';
                    this.calcRate2=showown2Rate;                  
                } 
                this.own2rate = null;               
                this.cancel();
            }

        },
        //返回
        back() {
            this.url = "scheme://host/pathPrefix"; 
            switch(this.type){
                case 'web': return window.history.back(); 
                case 'ios': return location.href = this.url;  
                case 'android': return location.href = this.url;
            }
        },
        //解析url
        parseUrl(url) {
            try{
                var urlStr=url.split("?")[1].split("&");
                var urlparams = {};
                for( let i=0;i<urlStr.length;i++){
                    var item = urlStr[i].split("=")
                    urlparams[item[0]]=item[1]
                }
                return urlparams;
            }
            catch(err){}
        },  
        /**
         * selectItem(index) 
         * index  0 1 2 控制菜单对应高亮
         * index 3 4 控制贷款利率 公积金利率 商贷利率
         */
        changeLoans() {
            this.houseLoans = this.loans - this.commercialLoans;
            this.commercialLoans = this.loans - this.houseLoans;
        },
        selectItem(index) {
            //修改头部的菜单高亮
            if(index<=2){
                this.selectNum=index 
            }
            //修改loanRate贷款利率的内容
            switch(index) {
                case 0:this.loanRate = ['','1.1倍','1.2倍'];break;
                case 1:this.loanRate = ['','9.5折','9折','8.8折','8.7折','8.6折','1.1倍','1.2倍','1.3倍','1.4倍'];break;
                case 3:this.loanRate = ['','1.1倍','1.2倍'];this.unfold(2);break;
                case 4:this.loanRate = ['','9.5折','9折','8.8折','8.7折','8.6折','1.1倍','1.2倍','1.3倍','1.4倍'];this.unfold(2);break;
            }
        },
        // 关闭展开项
        cancel() {
            this.isCancel = false;
        },
        // 控制展开项内容
        unfold(num) {
            this.isCancel = true;
            switch(num){
                case 0: 
                    this.titleIndex = 0;
                    this.sellPrice2 = null;
                    this.ergodic  = this.calcWay;//计算方式
                    break;
                case 1: 
                    this.titleIndex = 1;
                    this.sellPrice2 = null;                    
                    this.ergodic  = this.loanYears;//贷款年限                     
                    break;
                case 2: 
                    this.titleIndex = 2;
                    this.sellPrice2 = null;                    
                    this.ergodic  = this.loanRate;//贷款利率                                                       
                    break;
                case 3:
                    this.titleIndex = 3;
                    this.sellPrice2 = null;                    
                    this.ergodic  = this.loanRate2;//贷款比例                                                     
                    break;
            }
        },
        // 展开项点击
        selectOption(item,index) {
            //修改input的值
            let num = this.titleIndex;
            switch(num){
                case 0://计算方式
                    this.mode = item;
                    this.selectNum1 = index;
                    if(this.mode == "按房价总额"){
                        this.isLoans=false;
                    }else if(this.mode == "按贷款总额") {
                        this.isLoans=true;
                    }
                    break;
                case 1://年限
                    this.years=item+'年';
                    this.calcYears=item;
                    this.selectNum2 = index;
                    if(item>1&&item<=5){
                        this.rate11="最新基准利率(2.75%)";
                        this.rate21="最新基准率(4.75%)";
                        this.calcRate1=2.75;
                        this.calcRate2=4.75;                                    
                    }
                    else if(item == 1) {
                        this.rate11="最新基准利率(2.75%)";
                        this.rate21="最新基准率(4.35%)";
                        this.calcRate1=2.75;
                        this.calcRate2=4.35;   
                    }
                    else{
                        this.rate11="最新基准利率(3.25%)";
                        this.rate21="最新基准率(4.9%)";
                        this.calcRate1=3.25;
                        this.calcRate2=4.9; 
                    }
                    break;
                case 2://利率
                    this.selectNum3 = index;
                    this.changeRate(item,index,this.selectNum);
                    break;
                case 3://贷款比例
                    this.selectItem4 = index;
                    this.rate=item+'成';
                    break;
            }
            this.cancel();
        },
        changeRate(item,index) {
            var resultRate1;//公积金贷款利率
            var resultRate2;//商业贷款利率
            // 取出数字
            var num = item.slice(0,-1)-0;
                
            //修改利率 基准利率3.25%
            resultRate1 = Math.floor( num * 3.25 * 100) / 100//不四舍五入 截取小数点后两位 思想是先扩大100倍取整，再缩小100倍
            this.calcRate1 = resultRate1;
            
            //修改利率 基准利率4.9%
            if(item.slice(-1)=='折'){
                resultRate2 = num * 4.9 / 10;
            }else if(item.slice(-1)=='倍'){
                resultRate2 = num * 4.9;                                   
            }
            resultRate2 = Math.floor(resultRate2 * 100) / 100//不四舍五入 截取小数点后两位 思想是先扩大100倍取整，再缩小100倍
            this.calcRate2 = resultRate2;
            
            //公积金贷款利率显示
            index==0
            ? this.rate11 = "最新基准利率(3.25%)"
            : this.rate11 = "最新基准利率"+item+"("+resultRate1+"%)";

            //商业贷款利率显示
            index==0
            ? this.rate21 = "最新基准利率(4.9%)"
            : this.rate21 = "最新基准利率"+item+"("+resultRate2+"%)";
        },
        //计算
        calcResult() {
            //验证是否输入贷款额 
            if(this.loans==null){
                this.isToast = true;
                return setTimeout(()=>{this.isToast=false},3000);
            }else if(this.mode=='按房价总额'){
                if(this.loans>this.sellPrice){
                    this.isToast=true;
                    this.toastContent="超出贷款总额";
                    setTimeout(()=>{this.isToast=false},3000);
                    return;
                }
            }
            //这里调取真正的计算
            let result; 
            if(this.selectNum == 0){//公积金贷款按贷款总额计算
                result = this.calcformula(0);
            }else if(this.selectNum == 1){//商业贷款按贷款总额计算
                result = this.calcformula(1);
            }else{//组合贷款按贷款总额计算
                result = this.groupCalc();
            }
            if(this.loans!=null) location.href="./calcChart.html?selectNum1="+JSON.stringify(result.selectNum1)+"&selectNum2="+JSON.stringify(result.selectNum2);
        },
        /**
         * 计算公式
         * 等额本金计算公式
         * 每月还款额 = 本金/还款月数 + (本金-累计还款总额)*月利率
         * 每月本金 = 本金/还款月数
         * 每月利息 = (本金-累计还款总额)*月利率
         * 每月月供递减额 = 贷款本金/还款月数*月利率
         * 总利息 = [(贷款本金/还款月数+贷款本金*月利率)+贷款本金/还款月数*(1+月利率)]/2*还款月数-贷款本金
         * 计算原则: 每月归还的本金额始终不变,利息随剩余本金的减少减少。
         *
         * 等额本息计算公式
         * 每月还款额 = (本金*月利率*(1+月利率)^还款月数)/((1+月利率)^还款月数-1);
         * 每月还利息 = 剩余本金*贷款月利率   注:第一个月的剩余本金就是贷款本金
         * 还款总利息 = 贷款本金*贷款月数*月利率*(1+月利率)^还款月数 / [(1+月利率)^还款月数-1]-贷款本金
         * 计算原则: 银行从每月月供款中,先收取剩余本金的利息,后收取本金;利息在月供比例中
         *          随剩余本金的减少而降低,本金在月供款中的比例变高,但是月供总额不变。
         * 
         * 房屋价格的贷款额度计算
         * 房屋总价 = 单价*面积
         * 贷款额度 = 房屋总价*贷款成数/10
         * 参考首付 = 房屋总价-贷款金额
         * 月利率 = 年利率*倍数/12 或者 年利率*折扣数/12
         * 还款月数 = 贷款年限*12
         * 支付利息 = 月均还款*还款月数 - 贷款金额
         * 月均还款 = (贷款金额*月利率*(1+月利率)^还款月数)/((1+月利率)^还款月数-1)
         * 
         * 组合型计算
         * 商业贷款月均还款 = (商业贷款金额*月利率*(1+月利率)^还款月数)/((1+月利率)^还款月数-1)
         * 公积金贷款月均还款 = (公积金贷款金额*月利率*(1+月利率)^还款月数)/((1+月利率)^还款月数-1)
         * 月均还款 = 商业贷款月均还款 + 公积金贷款月均还款
         * 贷款金额 = 商业贷款金额+公积金贷款金额
         * 月利率 = 年利率*倍数/12 或者 年利率*折扣数/12
         * 支付利息 = 月均还款*还款月数 - 贷款金额
         */
        //公积金和商业贷款
        calcformula(num) {
            //按照贷款总额进行计算
            let rate = num == 0 ? this.calcRate1 : this.calcRate2;
            let D = (this.loans-0)*10000;    //贷款总额多少元
            let R = rate/100;                //贷款利率(年利率)
            let r = R/12;                    //月利率 
            let years = this.calcYears;      //贷款年数
            let month = years*12;            //月数

            let result1 = {                //等额本金
                totalLoans: D,             //贷款总额多少元
                totalLoans2: D/10000,      //贷款总额多少万
                month: month,              //月数
                rnb: null,                 //每月还款多少元
                totalRnb: null,            //总共还多少元
                totalInterest: null,       //总共支付多少万利息
                totalInterest2: null,      //总共支付多少元利息
                Decreasing: null,          //每月递减多少元
            }
            let result2 = {                //等额本息
                totalLoans: D,             //贷款总额多少元
                totalLoans2: D/10000,      //贷款总额多少万
                month: month,              //月数
                rnb: null,                 //每月还款多少元
                totalRnb: null,            //总共还多少元
                totalInterest: null,       //总共支付多少万利息
                totalInterest2: null,      //总共支付多少元利息
            }

            //年数
            "string" == typeof this.years
            ? years = this.years.slice(0,-1)-0
            : years = this.years;

            //等额本金总利息
            let totalInterest = [(D/month+D*r)+D/month*(1+r)]/2*month-D;
            result1.totalInterest = Math.floor(totalInterest/10000*10)/10;
            result1.totalInterest2 = Math.floor(totalInterest);
            result1.totalRnb = result1.totalInterest + result1.totalLoans2;
            result1.rnb = Math.floor((D - result1.totalRnb)*r + D/month);
            result1.Decreasing = Math.floor((D/month*r));

            //等额本息月均还款
            let midn = Math.pow((1+r), month);
            let rnb = (D*r*midn)/(midn-1);
            result2.rnb = Math.floor(rnb);
            result2.totalInterest = Math.floor((rnb*month-D)/10000*10)/10;
            result2.totalInterest2 = Math.floor((rnb*month-D)*10)/10;
            result2.totalRnb = result2.totalInterest + result2.totalLoans2;
            return {
                selectNum1: result1,
                selectNum2: result2
            };
        },
        //组合贷款计算
        groupCalc() {
            let D1 = this.houseLoans*10000;        //公积金贷款
            let D2 = this.commercialLoans*10000;   //商业贷款
            let D = D1 + D2;
            let R1 = this.calcRate1/100;     //公积金贷款利率
            let R2 = this.calcRate2/100;     //商业贷款利率
            let r1 = R1/12;                  //公积金贷款月利率
            let r2 = R2/12;                  //商业贷款月利率
            let years = this.calcYears;      //贷款年数
            let month = years*12;            //月数

            let result1 = {                //等额本金
                totalLoans: D,             //贷款总额多少元
                totalLoans2: D/10000,      //贷款总额多少万
                month: month,              //月数
                rnb: null,                 //每月还款多少元
                totalRnb: null,            //总共还多少元
                totalInterest: null,       //总共支付多少万利息
                totalInterest2: null,      //总共支付多少元利息
            }
            let result2 = {                //等额本息
                totalLoans: D,             //贷款总额多少元
                totalLoans2: D/10000,      //贷款总额多少万
                month: month,              //月数
                rnb: null,                 //每月还款多少元
                totalRnb: null,            //总共还多少元
                totalInterest: null,       //总共支付多少万利息
                totalInterest2: null,      //总共支付多少元利息
            }

            //年数
            "string" == typeof this.years
            ? years = this.years.slice(0,-1)-0
            : years = this.years;

            //等额本金
            let r = (R1+R2)/12;
            let totalInterest = [(D1/month+D1*r1)+D1/month*(1+r1)]/2*month-D1 + [(D2/month+D2*r2)+D2/month*(1+r2)]/2*month-D2
            result1.totalInterest = Math.floor(totalInterest/10000*10)/10;
            result1.totalInterest2 = Math.floor(totalInterest);
            result1.totalRnb = result1.totalInterest + result1.totalLoans2;
            result1.rnb = Math.floor((D1 - result1.totalRnb)*r1 + D1/month+ (D2 - result1.totalRnb)*r2 + D2/month);
            result1.Decreasing = Math.floor(D1/month*r1+D2/month*r2);


            //等额本息月均还款 = 商业贷款月均还款 + 公积金贷款月均还款
            let midn1 = Math.pow((1+r1), month);
            let midn2 = Math.pow((1+r2), month);
            let rnb = (D1*r1*midn1)/(midn1-1) + (D2*r2*midn2)/(midn2-1);
            result2.rnb = Math.floor(rnb);
            result2.totalInterest = Math.floor((rnb*month-D)/10000*10)/10;
            result2.totalInterest2 = Math.floor((rnb*month-D)*10)/10;
            result2.totalRnb = result2.totalInterest + result2.totalLoans2;

            return {
                selectNum1: result1,
                selectNum2: result2
            };
        }
    }
}) 
