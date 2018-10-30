
// 房源对比的js
'use strict';
let vm = new Vue({
    el: '#app',
    data: {
        houseInfo: [
            {
                "avgSalePrice": 0,
                "buildAge": "string",
                "buildName": "string",
                "builtArea": 0,
                "elevator": "string",
                "houseBuildAge": "string",
                "houseDirection": "string",
                "houseFeature": "string",
                "houseImage": "string",
                "houseManageFee": "string",
                "housePic": "string",
                "houseTitle": "string",
                "id": 0,
                "livingRoomNum": 0,
                "rentPrice": 0,
                "roomsNum": 0,
                "salePrice": 0,
                "saleTotal": 0,
                "scity": "string",
                "sdid": "string",
                "totalBuildNum": 0,
                "washRoomNum": 0
            }
        ],
        project:{},//get穿参
    },
    created() {
    	var url=document.location.href;
		var urllist=url.split("?")[1].split("&")
		for( let i=0;i<urllist.length;i++){
			var item = urllist[i].split("=")
			this.project[item[0]]=item[1]
		}
		window.sessionStorage.project=JSON.stringify(this.project)		
    },
    mounted(){   	
        this.twoHouseRentListRequest();
    },
    methods: {
        defaultImg(item){
            console.log(item)
        },
        twoHouseRentListRequest(){
            axios.get(TWOHOUSEUSED+"?sdidStr="+this.project.idlist+"&scity="+this.project.scity,{
            	headers:{
            		'Content-Type': "application/json;charset=UTF-8",
            		'scity':this.project.scity
            	}
            })
            .then((res) => {
                if(res.status == 200) {
                    if(res.data.data.length){
                        this.houseInfo = res.data.data;
                    }
                }else{
                }
            })
        }
    }

})