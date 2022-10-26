"use strict";



//const sdkKey = "e2npe1bqz4gx4gkrist7hztsa"
//const modelSid = "444zZAZQogU";
const sdkKey = "d6nnwa9z0fq405hx53pepqkrc"
const modelSid = "wAxVEQjFKXR";
const params = `m=${modelSid}&hr=0&play=1&qs=1`;
const sdkVersion = "3.11.1";


const iframe = document.getElementById('showcase');
const positionBtn = document.getElementById('position');
const tagDataBtn = document.getElementById('tagData');
const pomBtn = document.getElementById('PoM');
const saveBtn = document.getElementById('save');
const resetBtn = document.getElementById('reset');
const removeBtn = document.getElementById('remove');
const oneRemoveBtn = document.getElementById('oneremove');
const updateBtn = document.getElementById('upTag');
const updateText=document.getElementsByClassName('upText'); //好像不能整個class清空
const upTagLabel=document.getElementById('uplab');
const upTagDes=document.getElementById('updes');
const upTagDesLink=document.getElementById('updeslink');
const upTagMedia=document.getElementById('upmedia')
const mediaCho=document.getElementById('cho');
const tagMove = document.getElementById('tagMove');
const iconSrc = document.getElementById('iconSrc');
const opacityRange=document.getElementById('opacityRange');
//let tag;

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

  //let addingTag = false;
  
  //let mattertags=[];
  await fetch(`http://localhost:3000/getJson`, {method:'GET'})  //從API取得Json裡的data
  .then(res => {
      return res.json();   
  }).then(result => {
      console.log(result); //從資料庫取出來的tag//追加後sid會變
      Sdk.Mattertag.add(result)
  });
  

 
  //console.log(mattertags);
  //await Sdk.Mattertag.add(mattertags);
  //await Sdk.Mattertag.data.subscribe();
  
  tagDataBtn.addEventListener("click",()=>{ showTagData(Sdk) });
  
  //document.getElementById('addTag').addEventListener("click",()=>{addTag(Sdk)}); //addTag
  pomBtn.addEventListener("click",()=>{   //Position Mode
    document.getElementById('message').innerHTML="New Tag Add";
    getPosition(Sdk);
    //addtagTest(addingTag,tag);
  });
  tagMove.addEventListener("click",()=>{
    updatePosition(Sdk);
    
  });

  saveBtn.addEventListener("click",()=>{ saveTag(Sdk); });
 
  resetBtn.addEventListener("click",() => {  resetShowcase(); });

  removeBtn.addEventListener("click",()=>{ removeTag(Sdk);});

  oneRemoveBtn.addEventListener("click",()=>{ removeTag(Sdk,document.getElementById('removeSid').value);});

 
  checkTag(Sdk);
  updateTag(Sdk);
 
}



function updateTag(Sdk){
  var mattertag;
  //click tag觸發事件//updateBtn
  Sdk.on(Sdk.Mattertag.Event.CLICK,
	  (sid)=>{
      mattertag=[];
      Sdk.Mattertag.getData().then((tags)=>{
        tags.forEach(tag=>{
          if(sid==tag.sid){
            console.log(tag.media.type)
            if(tag.media.type=="mattertag.media.photo"){
              mediaCho.value="1"
            }else if(tag.media.type=="mattertag.media.video"){
              mediaCho.value="2"
            }else{
              mediaCho.value="0"
            }
            document.getElementById('showsid').innerHTML=tag.sid;
            iconSrc.value=tag.iconSrc; //暫無
            //opacityRange.value=tag.opacityRange//暫無
            upTagLabel.value=tag.label;
            
            //console.log(tag.parsedDescription[0]);
            //console.log(tag.parsedDescription[0].type);
            if(tag.parsedDescription[0].type=="tag.chunk.text"){ 
              upTagDes.value=tag.parsedDescription[0].text;
              upTagDesLink.value=tag.parsedDescription[0].link;
            }else{
              upTagDes.value=tag.parsedDescription[0].link.label;
              upTagDesLink.value=tag.parsedDescription[0].link.url;
            }            
            upTagMedia.value=tag.media.src;
            //showTag
            //stemHeight
            Sdk.Mattertag.editOpacity(sid,Number(opacityRange.value));
            document.getElementById('stemHeight').value=tag.stemHeight;
            document.getElementById('showTag').checked=tag.enabled;
            document.getElementById('showStem').checked=tag.stemVisible;
            document.getElementById('removeSid').value=tag.sid; //刪除單個Tag用
            mattertag=tag;
          }
        }); 
      });
	  });
    updateBtn.addEventListener("click",async()=>{ 
      if(!mattertag){return;}　　　//沒有這行，修正紐按兩次會把上次的mattertag拿來追加
      removeTag(Sdk,mattertag.sid);   //看一下.catch();的例外處理方式
      let cho=mediaCho.value
      if(cho=="1"){
        cho=Sdk.Mattertag.MediaType.PHOTO;
      }else if(cho=="2"){
        cho=Sdk.Mattertag.MediaType.VIDEO;
      }else{
        cho=Sdk.Mattertag.MediaType.NONE;
      }
      //console.log(upTagDesLink.value=="undefined");
      mattertag.color={r: 0,g: 1.0,b: 0.2,};
      //mattertag.enabled=document.getElementById('showTag').checked;
      mattertag.enabled=false;
      mattertag.stemHeight=document.getElementById('stemHeight').value;
      mattertag.stemVisible=document.getElementById('showStem').checked;
      console.log(mattertag.stemHeight);
      console.log("anchorPosition",mattertag.anchorPosition);
      console.log("anchorNormal",mattertag.anchorNormal);
      console.log("stemVector",mattertag.stemVector);
      //upIcon
      mattertag.iconSrc=iconSrc.value;
      mattertag.opacityRange=opacityRange.value;
      await Sdk.Mattertag.add(mattertag).then(sid=>{
        Sdk.Mattertag.registerIcon("icon",mattertag.iconSrc)
        Sdk.Mattertag.editIcon(sid[0], "icon");
        Sdk.Mattertag.editBillboard(sid[0],{
          label: upTagLabel.value,
          description:upTagDesLink.value=="undefined"?upTagDes.value:"["+upTagDes.value+"]("+upTagDesLink.value+")",
          media: {
            type: cho,
            src:upTagMedia.value,
          } 
        });
      });
      
      console.log(mattertag);
      upTagLabel.value=""
      upTagDes.value=""
      upTagDesLink.value=""
      upTagMedia.value=""
      mediaCho.value="0"
      document.getElementById('showsid').innerHTML="";//Tag更新下的Sid
      document.getElementById('removeSid').value="";
      return;
      //updateText[0].value="OK"; 
      //updateText.forEach();
    });
}
/*
function addtagTest(addingTag,tag){
  if(!addingTag && !tag){
    addingTag = true;
    Sdk.Mattertag.add([{
        label: "Matterport Tag",
        description: "",
        anchorPosition: {x: 0, y: 0, z: 0},
        stemVector: {x:0, y: 0, z: 0},
        color: {r: 1, g: 0, b: 0},
    }])
    .then((sid) => {
        tag = sid[0];
        return Sdk.Mattertag.getData();
    })
    .then( (collection) => {
        const t_sid = collection.find( elem => elem.sid === tag);
        //const row = addToTable(t_sid);
        addTagListeners(row);
        addingTag = false;
    })
    .then(() => {
        if(isFirefox) overlayDetect();
    })
    .catch( (e) => {
        console.error(e);
        addingTag = false;
    })
  }
}
*/

async function checkTag(Sdk){  //監控tag的追加刪除和更新
  return await Sdk.Mattertag.data.subscribe({
    onAdded: function (index, item, collection) {
      console.log('Mattertag added to the collection', index, item, collection);
    },
    onRemoved: function (index, item, collection) {
      console.log('Mattertag removed from the collection', index, item, collection);
    },
    onUpdated: function (index, item, collection) {
      console.log('Mattertag updated in place in the collection', index, item, collection);
    }
  });
}

async function removeTag(Sdk,Sid){  //frameからtagを削除
  if(Sid===undefined ){
    Sdk.Mattertag.getData()
        .then(tags => {
            return tags.map(tag => tag.sid);
        })
        .then(tagSids => {
            return Sdk.Mattertag.remove(tagSids);
        })
        .catch(console.error);
  }else{
    try {await Sdk.Mattertag.remove(Sid);} 
    catch (error) {console.log("Sidを入力してください。")}
  } 
}

function showTagData(Sdk){   //印出所有TAG資訊
    
    document.getElementById("list").innerHTML="";
    
    Sdk.Mattertag.getData()
    .then((tags)=>{ 
        //console.log(a[3].color); //color.b不正確
        tags.forEach((tag)=>{
          //console.log(sid);
          document.getElementById("list").innerHTML+='<li>'+
          "Sid :"+tag.sid+"<br>"+
          "Label:"+tag.label+"<br>"+
          "anchorNormal:"+tag.anchorNormal.x.toFixed(3)+" | "
                         +tag.anchorNormal.y.toFixed(3)+" | "
                         +tag.anchorNormal.z.toFixed(3)+"<br>"+
          "anchorPosition:"+tag.anchorPosition.x.toFixed(3)+" | "
                           +tag.anchorPosition.y.toFixed(3)+" | "
                           +tag.anchorPosition.z.toFixed(3)+"<br>"+
          "color:"+tag.color.r.toFixed(2)+" | "
                  +tag.color.g.toFixed(2)+" | "
                  +tag.color.b.toFixed(2)+"<br>"+
          "description:"+tag.description+"<br>"+
          "enabled:"+tag.enabled+"<br>"+
          "floorId:"+tag.floorId+"<br>"+
          "floorIndex:"+tag.floorIndex+"<br>"+
          "media:"+tag.media.type+" | "+tag.media.src+"<br>"+
          "parsedDescription:"+tag.parsedDescription+"<br>"+  //link,type,text
          "stemHeight:"+tag.stemHeight+"<br>"+
          "stemVector:"+tag.stemVector.x.toFixed(3)+" | "
                       +tag.stemVector.y.toFixed(3)+" | "
                       +tag.stemVector.z.toFixed(3)+"<br>"+
          "stemVisible:"+tag.stemVisible+"<br>"+
          "---------------------------------------------"
          +'</li>'
        });
      });
}

async function saveTag(Sdk){ //表單資料推到API
  //byPositionMode
  var Alltag=[];
  //異步賦值
  //此處若不設置非同期，則上方宣告與下方賦職會同時進行則瀏覽器檢證即使能刷到資料，事實上array的長度還是為0
  await Sdk.Mattertag.getData().then((tags)=>{
        
      tags.forEach((tag)=>{
      console.log(tag.iconSrc);
      if(tag.sid!="qdVRtnRjpOe" && tag.sid!="iGGhyTNzMy9"){
        tag.color={r: 1,g: 1,b: 1};  
        Alltag.push(tag);
        console.log(Alltag);
      }
    });
  }); 
  //console.log(Alltag); 
  sendToJson(Alltag);
  resetShowcase();
}

//sendToJson

function sendToJson(Alltag){
  let url = 'http://localhost:3000/insertJson';
  

  fetch(url, {
      method: 'POST', 
      body: JSON.stringify(Alltag), // data can be `string` or {object}!
      headers: new Headers({
        'Content-Type': 'application/json'
      })
  }).then(res => res.json())
  .catch(error => console.error('Error:', error))
  .then(response => console.log('Success:', response));
 
  return;
}

function resetShowcase(){
  document.getElementById('message').innerHTML="";
  document.getElementById("list").innerHTML="";
  iframe.src = iframe.src;
  positionBtn.style.display = 'none';
}





async function updatePosition(Sdk){

  Sdk.on(Sdk.Mattertag.Event.HOVER,
    (sid)=>{
      
      Sdk.Mattertag.editColor(sid,{r: 0.1,g: 0,b: 0,});
      console.log(Sdk);
      var poseCache;
      Sdk.Camera.pose.subscribe((pose)=>{  //取得位置座標
        poseCache = pose;
      });
      var intersectionCache;
      Sdk.Pointer.intersection.subscribe((intersection)=> { //每移動滑鼠，出現新的座標就會跑一次
        console.log(intersection);
        intersectionCache = intersection;
        intersectionCache.time = new Date().getTime();
        positionBtn.style.display = 'none';
        buttonDisplayed = false; //最後不隱藏之後就只會顯示第一次而已
      });
      
      
      /*  //iframe click觸發事件，但一開始點tag也會觸發，能解決的話就能用。
      let moni=setInterval(()=>{
        let elem =document.activeElement;
        if(elem && elem.tagName=='IFRAME'){
          if(!intersectionCache){return;}
          Sdk.off(Sdk.Mattertag.Event.CLICK,(x)=>{console.log(x)});
          alert("OK");
          return;
        }
      },100);
      */
      
      var buttonDisplayed = false;
      setInterval(() => {
      if (!intersectionCache || !poseCache) {
        return;
      }
      //console.log(intersectionCache.time);
      const nextShow = intersectionCache.time ;
      if (new Date().getTime() > nextShow) {
        if (buttonDisplayed) {
          return;
        }
        var size = {
          w: iframe.clientWidth,
          h: iframe.clientHeight,
        };
        var coord = Sdk.Conversion.worldToScreen(intersectionCache.position, poseCache, size);
        positionBtn.style.left = `${coord.x - 25}px`;
        positionBtn.style.top = `${coord.y+60}px`;
        positionBtn.style.display = 'block';
        buttonDisplayed = true;
      }
    } , 3000);
    
    positionBtn.addEventListener("click",()=>{
      
      Sdk.Mattertag.editPosition(sid, {
          anchorPosition: {
            x: intersectionCache.position.x, 
            y: intersectionCache.position.y, 
            z: intersectionCache.position.z
          },
          stemVector: { // make the Mattertag stick straight up and make it 0.30 meters (~1 foot) tall
            x: intersectionCache.normal.x, 
            y: intersectionCache.normal.y, 
            z: intersectionCache.normal.z
          },
      });
    });
  });
}




async function getPosition(Sdk){
    //console.log("進入getPosition");
    var poseCache;
    Sdk.Camera.pose.subscribe(function(pose) {  //取得位置座標
      poseCache = pose;
    });
    var intersectionCache;
    Sdk.Pointer.intersection.subscribe((intersection)=> { //每移動滑鼠，出現新的座標就會跑一次
      console.log(intersection);
      intersectionCache = intersection;
      intersectionCache.time = new Date().getTime();
      positionBtn.style.display = 'none';
      buttonDisplayed = false; //最後不隱藏之後就只會顯示第一次而已
    });

    var buttonDisplayed = false;
    setInterval(() => {
      if (!intersectionCache || !poseCache) {
        return;
      }
      //console.log(intersectionCache.time);
      const nextShow = intersectionCache.time ;
      if (new Date().getTime() > nextShow) {
        if (buttonDisplayed) {
          return;
        }
        var size = {
          w: iframe.clientWidth,
          h: iframe.clientHeight,
        };
        var coord = Sdk.Conversion.worldToScreen(intersectionCache.position, poseCache, size);
        positionBtn.style.left = `${coord.x - 25}px`;
        positionBtn.style.top = `${coord.y+60}px`;
        positionBtn.style.display = 'block';
        buttonDisplayed = true;
      }
    } , 16);
    var des ="byPositionMode";
    if(document.getElementById("des").value!==""){des=document.getElementById("des").value;}
    
    positionBtn.addEventListener("click",()=>{
      console.log(intersectionCache);
      let mattertags =[{
        label: document.getElementById("lab").value,  
        description:des,
        color:{r: 0,g: 1.0,b: 0.2,},
        anchorPosition: {x: intersectionCache.position.x, 
                         y: intersectionCache.position.y, 
                         z: intersectionCache.position.z},  //本體的位置  //本体の位置
        stemVector: {x: intersectionCache.normal.x, 
                     y: intersectionCache.normal.y, 
                     z: intersectionCache.normal.z} ,    //標示距離本體的位置(圓圈)　　//Tagの位置
        floorIndex: 0,  
      }];
      console.log(mattertags);
      try{
        Sdk.Mattertag.add(mattertags);
        //();
        return; //不結束無法進入下一輪，按鈕就不再次出現
      }catch(e){
        console.log(e);
      }
      
    });
    //positionBtn.removeEventListener('click', getPosition);
}

