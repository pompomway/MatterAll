"use strict";



const sdkKey = "e2npe1bqz4gx4gkrist7hztsa"
const modelSid = "444zZAZQogU";
//const params = `m=${modelSid}&play=1&qs=1&log=0&applicationKey=${sdkKey}`;
const params = `m=${modelSid}&hr=0&play=1&qs=1`;



const sdkVersion = "3.10";


var iframe = document.getElementById('showcase');
var positionbtn = document.getElementById('position');



document.addEventListener("DOMContentLoaded", () => {
  iframe.setAttribute('src', `https://my.matterport.com/show?${params}`);
  iframe.addEventListener('load', () => showcaseLoader(iframe));    //showcaseLoader主程式運行

});


function showcaseLoader(iframe){   //展開iframe
    try{
      window.MP_SDK.connect(iframe, sdkKey, sdkVersion) 
        .then(loadedShowcaseHandler)   //讀取下方tag資訊 //loadedShowcaseHandler一定要先啟動，不然這裡面的東西都不能用
        .then(getPoints)    
        .catch(console.error);
    } catch(e){
        console.error(e);
    }
}

async function getPosition(Sdk){
  
  var poseCache;
  Sdk.Camera.pose.subscribe(function(pose) {  //取得位置座標
    poseCache = pose;
  });
  var intersectionCache;
  Sdk.Pointer.intersection.subscribe((intersection)=> { //每移動滑鼠，出現新的座標就會跑一次
    console.log(intersection);
    intersectionCache = intersection;
    intersectionCache.time = new Date().getTime();
    positionbtn.style.display = 'none';
    buttonDisplayed = false; //最後不隱藏之後就只會顯示第一次而已
  });
  var delayBeforeShow = 1000;  
  var buttonDisplayed = false;
  setInterval(() => {
    if (!intersectionCache || !poseCache) {
      return;
    }
    //console.log(intersectionCache.time);
    const nextShow = intersectionCache.time + delayBeforeShow;
    if (new Date().getTime() > nextShow) {
      if (buttonDisplayed) {
        return;
      }

      var size = {
        w: iframe.clientWidth,
        h: iframe.clientHeight,
      };
      var coord = Sdk.Conversion.worldToScreen(intersectionCache.position, poseCache, size);
      positionbtn.style.left = `${coord.x - 25}px`;
      positionbtn.style.top = `${coord.y+50}px`;
      positionbtn.style.display = 'block';
      buttonDisplayed = true;
    }
  }, 16);
  document.getElementById('position').addEventListener("click",()=>{
    var mattertags = [{
      label: "",  
      description:"",
      color:{r: 1.0,g: 1.0,b: 0.2,},
      anchorPosition: {x: intersectionCache.position.x, y: intersectionCache.position.y, z: intersectionCache.position.z},  //本體的位置  //本体の位置
      stemVector: {x: intersectionCache.normal.x, y: intersectionCache.normal.y, z: intersectionCache.normal.z} ,    //標示距離本體的位置(圓圈)　　//Tagの位置
      floorIndex: 0,  
    }];
  
  try{
    Sdk.Mattertag.add(mattertags);
    return; //不結束無法進入下一輪，按鈕就不再次出現
  }catch(e){
    alert(e);
  }
    
  });
}

//declare function on(event: Mattertag.Event.HOVER, callback: (tagSid: string, hovering: boolean) => void): Emitter;


async function loadedShowcaseHandler(Sdk){  //tag設定
  //on(Mattertag.Event.HOVER,);
  //getPosition(Sdk);  //要放在loadedShowcaseHandler裡面
  Sdk.on(Sdk.Mattertag.Event.CLICK,
	  function(sid) {
	  	//console.log(sid + ': ' + JSON.stringify(hovering,null,2));
      console.log(sid);
	  }
	);
  document.getElementById('remove').addEventListener("click",()=>{   
    Sdk.Mattertag.getData().then((tags)=>{
      Sdk.Mattertag.remove(tags[tags.length-1].sid);
    });
  });
  //getPosition(Sdk);
 

  document.getElementById('addTag').addEventListener("click",()=>{ //addTag
    var getX=Number(document.getElementById("getX").value);
    var getY=Number(document.getElementById("getY").value);
    var getZ=Number(document.getElementById("getZ").value);

    var lab=document.getElementById("lab").value;
    var des=document.getElementById("des").value;
    var mattertags = [{
      label: lab,  
      description:des,
      color:{r: 1.0,g: 1.0,b: 0.2,},
      anchorPosition: {x: getX, y: getY, z: getZ}, 
      stemVector: {x: 0, y: 0.5, z: 0} ,  
      floorIndex: 0,  
    }];
  
  try{
    Sdk.Mattertag.add(mattertags);
  }catch(e){
    alert(e);
  }
  });
          
}
//重載
document.getElementById('reset').addEventListener("click",() => {  //按鈕重載
  iframe.setAttribute('src', `https://my.matterport.com/show?${params}`);
  iframe.addEventListener('load', () => showcaseLoader(iframe));    

});
document.getElementById('getPoint').addEventListener("click",()=>{   //連結到pointer 
  window.location.assign('http://localhost:3000/pointer');  
});


function getPoints(Sdk){
  var getUrlString = location.href;

  var url = new URL(getUrlString);
  var getX=url.searchParams.get('x');
  var getY=url.searchParams.get('y');
  var getZ=url.searchParams.get('z');
  document.getElementById("getX").value=getX;
  document.getElementById("getY").value=getY;
  document.getElementById("getZ").value=getZ;

  var mattertags = [{

    color:{r: 1.0,g: 1.0,b: 0.2,},
    anchorPosition: {x: getX, y: getY, z: getZ},  //本體的位置  //本体の位置
    stemVector: {x: getX+2.5, y: getY, z: getZ-2.1} ,    //標示距離本體的位置(圓圈)　　//Tagの位置
    floorIndex: 0,  //??
  }];
  try{
    Sdk.Mattertag.add(mattertags);
  }catch(e){
    console.log("mattertags is no data");
  }
}
