const router = require('koa-router')()
const fs = require('fs');//文件系统 
const path = require('path');//路径
const superagent = require('superagent');//http库 请求转发
const xml2js = require('xml2js');//xml js 互转
let pathxml = path.resolve(__dirname, '../public/housePanoramic/tour.xml');
let parser = new xml2js.Parser(); //用于解析xml为json对象
let builder = new xml2js.Builder(); //用于把json对象解析为xml
 

//生成场景数据
async function scene_data(sdid) {
  let result =  await superagent.post('http://112.74.181.229:7031/custAppApi/housepano/fetchPicture').query({houseSdid: sdid});
  let data = JSON.parse(result.text).data;
  if (data==null){
    return null;
  }else{
    return data.sceneList;
  }
}

router.get('/housePanoramic/:id', async (ctx, next) => {
  let sdid = ctx.request.url.split('/')[2];
  fs.readFile(pathxml, 'utf-8', function (err, result) {
    parser.parseString(result, function (err, result) {
      //这里转发请求 获取到图片list;        
      scene_data(sdid).then(list=>{
          //全景数据
          if(list){
              var lists=[];
              for(let i=0;i<list.length;i++){
                var obj = JSON.parse(JSON.stringify(result.krpano.scene[0]));//拷贝对象
                obj.$.name=list[i].name;
                obj.$.thumburl=list[i].thumburl;
                obj.$.title=list[i].title;
                obj.image[0].level[0].cube[0].$.url=list[i].image.levelList[0].cube.url;
                obj.preview[0].$.url=list[i].preview.url;
                lists.push(obj);
              } 
              result.krpano.scene = lists;
              var outxml = builder.buildObject(result);
              fs.writeFile('./public/housePanoramic/tour.xml', outxml.toString(), err1 => {
                console.log("文件写入成功!");
              })
             
          }else{
            console.log("无全景数据!");
          }
        })
      });
  });

  await ctx.render('tour.html', {
    title: "无全景数据!"
  });
 
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})
  
router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

module.exports = router
