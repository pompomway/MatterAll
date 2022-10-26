"use strict";

const sdkKey = "e2npe1bqz4gx4gkrist7hztsa"   
const modelSid = "444zZAZQogU";
const params = `m=${modelSid}&hr=0&play=1&qs=1`;
const sdkVersion = "3.11.1";

const iframe = document.getElementById('showcase');

//建構子
document.addEventListener("DOMContentLoaded", () => {
  iframe.setAttribute('src', `https://my.matterport.com/show?${params}`);
  iframe.addEventListener('load', () => showcaseLoader(iframe));    //showcaseLoader主程式運行
});


function showcaseLoader(iframe){   //展開iframe
    try{
      window.MP_SDK.connect(iframe, sdkKey, sdkVersion)
        .then(loadedShowcaseHandler)   //讀取下方tag資訊
        .catch(console.error);
    } catch(e){
        console.error(e);
    }
}

async function loadedShowcaseHandler(Sdk){  //tag設定
  Sdk.on(Sdk.Mattertag.Event.HOVER,(sid)=>{console.log(sid);});
  Sdk.off(Sdk.Mattertag.Event.CLICK,()=>{console.log("?")}); 
  Sdk.Mattertag.registerIcon("test","https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/How_to_use_icon.svg/40px-How_to_use_icon.svg.png");
  Sdk.Mattertag.editIcon("iGGhyTNzMy9", 'test');
  let mattertags =[{
    label: 'ゴミ箱 1',
    
    //stemVisible:false, //OK
    enabled:false, 
    //sid:'gomi1',
    //anchorNormal:
    description:"[燃えるゴミ](https://www.city.yokohama.lg.jp/kurashi/sumai-kurashi/gomi-recycle/gomi/shushu/das1.html)",
    media:{
      type: Sdk.Mattertag.MediaType.VIDEO,
      src:'https://www.youtube-nocookie.com/embed/a93rbfBNlWY',
    },
    color:{r: 1.0,g: 1.0,b: 0.2,},
    anchorPosition: {x: 0, y: 0.5, z: 1.5},  //本體的位置  //本体の位置
    stemVector: {x: 0, y: 0.3, z: 0.5} ,    //標示距離本體的位置(圓圈)　　//Tagの位置
    stemHeight:1, 
    floorIndex: 0,  //??
  }, {
    label: 'ゴミ箱 2',
    //sid:'gomi2',
    enabled:true,
    description:"[弁当空箱](https://www.city.yokohama.lg.jp/kurashi/sumai-kurashi/gomi-recycle/gomi/shushu/das12.html)",
  　media:{
      type: Sdk.Mattertag.MediaType.PHOTO,
      src:'https://www.packstyle.jp/sysimg/product/00619315-01.jpg',
    },
    color:{r: 1.0,g: 1.0,b: 0.2,},
    anchorPosition: {x: 0, y: 0.5, z: 1.2},  //x:南北 y:高さ
    stemVector: {x: 0, y: 0.3, z: 0},
  }];

  await Sdk.Mattertag.add(mattertags).then(Sids => {  
    Sids.forEach(sid=>{
      console.log(sid);
    })
  }); 
  

  await Sdk.Mattertag.getData().then(tags=>{
    tags.forEach(tag=>{
      console.log(tag);
      console.log(tag.enabled);
      //console.log(tag.enabled);
    });
  });         
}


    //alert(a[0]);
    //Sdk.Mattertag.add(mattertags);
    
    /*addMatterTags原文
      mpSdk.Mattertag.add(mattertags).then(() => {
          mattertags.forEach(property => {
            //alert("label: " + property.sid);  //check用
            //console.log("label: " + property.label);
          });
      */




