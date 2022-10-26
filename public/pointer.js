const iframe = document.getElementById('showcase');
const text = document.getElementById('text');
const button = document.getElementById('button');

// this key only works from jsfiddle.
const sdkKey = "d6nnwa9z0fq405hx53pepqkrc";  //網頁上的JS編輯器jsfiddle用，但去掉的話point按鈕會顯示出來並無法點選
const sdkVersion = "3.5";
const modelSid = "444zZAZQogU";

function pointToString(point) {  //toFixed保留到小數第三位
  let x = point.x.toFixed(3);
  let y = point.y.toFixed(3);
  let z = point.z.toFixed(3);
  return `{ x: ${x}, y: ${y}, z: ${z} }`;
}

iframe.src = `https://my.matterport.com/show?m=${modelSid}&hr=0&play=1&title=0&qs=1`;


window.MP_SDK.connect(iframe, sdkKey, sdkVersion).then(async function(Sdk) {
  console.log('SDK Connected!');

  var poseCache;
  Sdk.Camera.pose.subscribe((pose)=> {  //取得Camera情報
    poseCache = pose;
    console.log(pose);
  });

  var intersectionCache;
  var buttonDisplayed = false; //僅用於紀錄button狀況，真正控制button顯示狀況的是button.style.display
  Sdk.Pointer.intersection.subscribe((intersection)=> { //每移動滑鼠，出現新的座標就會跑一次//左記の情報を得える、connectの中に使って、マウス移動すると情報すぐ更新できる。
    console.log(intersection);
    intersectionCache = intersection;
    intersectionCache.time = new Date().getTime();
    console.log(intersectionCache);
    button.style.display = 'none';  
    buttonDisplayed = false;

  }); 

  

  
  setInterval(() => {
    if (!intersectionCache || !poseCache) {
      return;
    }

    const nextShow = intersectionCache.time + 1000;
    if (new Date().getTime() > nextShow) {
      if (buttonDisplayed) {
        return;
      }

      var size = {
        w: iframe.clientWidth,
        h: iframe.clientHeight,
      };
      var coord = Sdk.Conversion.worldToScreen(intersectionCache.position, poseCache, size);
      console.log(coord);
      button.style.left = `${coord.x - 25}px`;
      button.style.top = `${coord.y - 22}px`;
      button.style.display = 'block';
      buttonDisplayed = true;
    }
  }, 16);

  

  button.addEventListener('click', ()=> {    //按鈕從這開始

    text.innerHTML = `position: ${pointToString(intersectionCache.position)}\n
        normal: ${pointToString(intersectionCache.normal)}\nfloorId: ${intersectionCache.floorId}`;
    button.style.display = 'none';
    iframe.focus();
    let xp=intersectionCache.position.x.toFixed(3);  //取得position座標各為小數3位
    let yp=intersectionCache.position.y.toFixed(3);
    let zp=intersectionCache.position.z.toFixed(3);

    let xn=intersectionCache.normal.x.toFixed(3);  //取得normal座標各為小數3位
    let yn=intersectionCache.normal.y.toFixed(3);
    let zn=intersectionCache.normal.z.toFixed(3);

    window.location.assign('http://localhost:3000/inputTag?x='+xp+'&y='+yp+'&z='+zp+'&xn='+xn+'&yn='+yn+'&zn='+zn); //當頁跳轉
  });
});


