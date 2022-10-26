"use strict";

const sdkKey = "e2npe1bqz4gx4gkrist7hztsa"
const modelSid = "444zZAZQogU";
const params = `m=${modelSid}&hr=0&play=1&qs=1`;
const sdkVersion = "3.11.1";

const iframe = document.getElementById('showcase');



document.addEventListener("DOMContentLoaded", () => {
  iframe.setAttribute('src', `https://my.matterport.com/show?${params}`);
  iframe.addEventListener('load', () => showcaseLoader(iframe));    //showcaseLoader主程式運行

});


function showcaseLoader(iframe){   //展開iframe
    try{
      window.MP_SDK.connect(iframe, sdkKey, sdkVersion)
        .then(loadedShowcaseHandler)   //讀取下方tag資訊
        .then(getPoints)
        .catch(console.error);
    } catch(e){
        console.error(e);
    }
}




async function loadedShowcaseHandler(Sdk){  //tag設定

  var deTag;

  await Sdk.Mattertag.getData(Sdk).then(Tags=>{
    deTag=Tags.length;  
  }); 
  
  document.getElementById('remove').addEventListener("click",()=>{  
    Sdk.Mattertag.getData().then((tags)=>{
      try {
        Sdk.Mattertag.remove(tags[deTag].sid); 
        //tags[tags.length-1].sidにしましたら、削除はTag追加の逆順になります。
      } catch (error) {
        console.log("DefaultTag can not delete!");
      }
    });
  });

  document.getElementById('addTag').addEventListener("click",()=>{ //addTag
    let getX=Number(document.getElementById("getX").value);
    let getY=Number(document.getElementById("getY").value);
    let getZ=Number(document.getElementById("getZ").value);

    let getnX=Number(document.getElementById("getnX").value);
    let getnY=Number(document.getElementById("getnY").value);
    let getnZ=Number(document.getElementById("getnZ").value);
    if (getnY===0){
      getnY=0.5;
    }
    let lab=document.getElementById("lab").value;
    let des=document.getElementById("des").value;
    let mattertags = [{
      label: lab,  
      description:des,
      color:{r: 1.0,g: 1.0,b: 0.2,},
      anchorPosition: {x: getX, y: getY, z: getZ},  //本體的位置  //本体の位置
      stemVector: {x: getnX, y: getnY, z: getnZ} ,    //標示距離本體的位置(圓圈)　　//Tagの位置
      floorIndex: 0,  
    }];
  try{
    Sdk.Mattertag.add(mattertags);
  }catch(e){
    console.log(e);
  }
  });
          
}
//重載
document.getElementById('reset').addEventListener("click",() => {  //按鈕重載
  iframe.src = iframe.src; 
});
document.getElementById('getPoint').addEventListener("click",()=>{   //連結到pointer 
  window.location.assign('http://localhost:3000/pointer');  
});


function getPoints(Sdk){
    let getUrlString = location.href;
    console.log(getUrlString)
    let url = new URL(getUrlString);  //取得網址
    console.log(url)
    let getX=Number(url.searchParams.get('x'));  //position
    let getY=Number(url.searchParams.get('y'));
    let getZ=Number(url.searchParams.get('z'));
  
    let getnX=Number(url.searchParams.get('xn'));  //normal
    let getnY=Number(url.searchParams.get('yn'));
    let getnZ=Number(url.searchParams.get('zn'));
  
    document.getElementById("getX").value=getX;
    document.getElementById("getY").value=getY;
    document.getElementById("getZ").value=getZ;
    document.getElementById("getnX").value=getnX;
    document.getElementById("getnY").value=getnY;
    document.getElementById("getnZ").value=getnZ;
  
    let mattertags = [{
      color:{r: 1.0,g: 1.0,b: 0.2,},
      anchorPosition: {x: getX, y: getY, z: getZ},  
      stemVector: {x: getnX, y: getnY, z: getnZ} ,    
      floorIndex: 0,  
    }];
    try{
      Sdk.Mattertag.add(mattertags);
    }catch(e){
      console.log("mattertags is no data");
    }
}
