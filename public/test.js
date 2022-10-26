"use strict";



const sdkKey = "e2npe1bqz4gx4gkrist7hztsa"
const modelSid = "444zZAZQogU";
//const params = `m=${modelSid}&play=1&qs=1&log=0&applicationKey=${sdkKey}`;
const params = `m=${modelSid}&hr=0&play=1&qs=1`;

//const tagData=require("data");

const sdkVersion = "3.5";


var iframe = document.getElementById('showcase');
//var container = document.getElementById('container');



document.addEventListener("DOMContentLoaded", () => {
  iframe.setAttribute('src', `https://my.matterport.com/show?${params}`);
  iframe.addEventListener('load', () => showcaseLoader(iframe));    //showcaseLoader主程式運行

});


function showcaseLoader(iframe){   //展開iframe
    try{
      window.MP_SDK.connect(iframe, sdkKey, '3.10')
        .then(loadedShowcaseHandler)   //讀取下方tag資訊
        .catch(console.error);
    } catch(e){
        console.error(e);
    }
}



async function loadedShowcaseHandler(Sdk){  //tag設定

  

  Sdk.Floor.getData()        //樓層資訊
	    .then(function(floors) {
	      // Floor data retreival complete.
	      //alert('Current floor: ' + floors.currentFloor);
	      //alert('Total floos: ' + floors.totalFloors);
	      //alert('Name of first floor: ' + floors.floorNames[0]);
	    })
	    .catch(function(error) {
	      // Floors data retrieval error.
	});
  var mattertags=[];
  await fetch(`http://localhost:3000/getJson`, {method:'GET'})
  .then(res => {
      return res.json();   
  }).then(result => {
      result.forEach((res)=>{
        let tag={
          label: res.label,
          description:res.description,
          color:{r: res.color.r,g: res.color.g,b: res.color.b,},
          anchorPosition: {x: res.anchorPosition.x, y: res.anchorPosition.y, z: res.anchorPosition.z}, 
          stemVector: {x: res.stemVector.x, y: res.stemVector.y, z: res.stemVector.z}    ,
          floorIndex:res.floorIndex
        };
        mattertags.push(tag);
      });
  }).then();
  
  
  
  var mattertags1 = [{
    label: 'ゴミ箱 3',
    description:"[燃えるゴミ](https://www.city.yokohama.lg.jp/kurashi/sumai-kurashi/gomi-recycle/gomi/shushu/das1.html)",
    media:{
      type: Sdk.Mattertag.MediaType.VIDEO,
      src:'https://www.youtube.com/watch?v=a93rbfBNlWY',
    },
    color:{r: 0,g: 1.0,b: 0.2,},
    anchorPosition: {x: 0, y: 0.5, z: 0.8},  //本體的位置  //本体の位置
    stemVector: {x: 0, y: 0.3, z: 0} ,    //標示距離本體的位置(圓圈)　　//Tagの位置
    floorIndex: 0,  //??
    
  }, {
    label: 'ゴミ箱 4',
    description:"[弁当空箱](https://www.city.yokohama.lg.jp/kurashi/sumai-kurashi/gomi-recycle/gomi/shushu/das12.html)",
  　media:{
      type: Sdk.Mattertag.MediaType.PHOTO,
      src:'https://www.packstyle.jp/sysimg/product/00619315-01.jpg',
    },
    color:{r: 0,g: 1.0,b: 0.2,},
    anchorPosition: {x: 0, y: 0.5, z: 0.6},  //x:南北 y:高さ
    stemVector: {x: 0, y: 0.3, z: 0},
    
  }];
  console.log(mattertags);
  console.log(mattertags1);
  await Sdk.Mattertag.add(mattertags);
  await Sdk.Mattertag.add(mattertags1);

  Sdk.Mattertag.getData().then((a)=>{
    a.forEach((sid)=>{
      console.log(sid);
      document.getElementById("list").innerHTML+='<li>'+
      "Sid :"+sid.sid+"<br>"+
      "Label:"+sid.label+"<br>"+
      "anchorNormal:"+sid.anchorNormal.x.toFixed(3)+" | "+sid.anchorNormal.y.toFixed(3)+" | "+sid.anchorNormal.z.toFixed(3)+"<br>"+
      "anchorPosition:"+sid.anchorPosition.x.toFixed(3)+" | "+sid.anchorPosition.y.toFixed(3)+" | "+sid.anchorPosition.z.toFixed(3)+"<br>"+
      "color:"+sid.color.r.toFixed(3)+" | "+sid.color.g.toFixed(3)+" | "+sid.color.b.toFixed(3)+"<br>"+
      "description:"+sid.description+"<br>"+
      "enabled:"+sid.enabled+"<br>"+
      "floorId:"+sid.floorId+"<br>"+
      "floorIndex:"+sid.floorIndex+"<br>"+
      "media:"+sid.media.type+" | "+sid.media.src+"<br>"+
      "parsedDescription:"+sid.parsedDescription+"<br>"+  //link,type,text
      "stemHeight:"+sid.stemHeight+"<br>"+
      "stemVector:"+sid.stemVector.x.toFixed(3)+" | "+sid.stemVector.y.toFixed(3)+" | "+sid.stemVector.z.toFixed(3)+"<br>"+
      "stemVisible:"+sid.stemVisible+"<br>"+
      "---------------------------------------------"
      +'</li>'
     
    });
  });
  
          
}
//重載
document.getElementById('reset').addEventListener("click",() => {  //按鈕重載
  iframe.setAttribute('src', `https://my.matterport.com/show?${params}`);
  iframe.addEventListener('load', () => showcaseLoader(iframe));    

});

document.getElementById('test').addEventListener("click",() => {  //
 
});




document.getElementById("json").addEventListener("click",()=>{  //Json
    const fs =require("fs");
    alert(1);
    try{
       const data=fs.readFileSync("./data.json","utf8");
       const config=JSON.parse(data);
       alert(config.name);
    }catch(e){
      alert(e);
    }
});




