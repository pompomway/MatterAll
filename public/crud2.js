"use strict";



const sdkKey = "d6nnwa9z0fq405hx53pepqkrc"
const modelSid = "wAxVEQjFKXR";
const params = `m=${modelSid}&hr=0&play=1&qs=1`;
const sdkVersion = "3.11.1";


let setTag;
let otherData=[];

const iframe = document.getElementById('showcase');
const tagDataBtn = document.getElementById('tagData');
const saveBtn = document.getElementById('save');
const resetBtn = document.getElementById('reset');
const removeBtn = document.getElementById('remove');
const oneRemoveBtn = document.getElementById('oneremove');
const list=document.getElementById("list");
const updateBtn = document.getElementById('upTag');
const showSid=document.getElementById('showSid');
const updateText=document.getElementsByClassName('upText'); //好像不能整個class清空
const upTagLabel=document.getElementById('uplab');
const upTagDes=document.getElementById('updes');
const upTagDesLink=document.getElementById('updeslink');
const upTagMedia=document.getElementById('upmedia')
const mediaCho=document.getElementById('cho');
const tagMove = document.getElementById('tagMove');
const iconSrc = document.getElementById('iconSrc');
const opacityRange=document.getElementById('opacityRange');
const showStem=document.getElementById('showStem');
const removeSid=document.getElementById('removeSid');
const showTag=document.getElementById('showTag');
const addTagBtn=document.getElementById('newTag');
const stemHeight=document.getElementById('stemHeight');
const isFirefox = navigator.userAgent.indexOf("Firefox") > -1;

//let tag;
//let addingTag = false;
//let movingTag = false;
document.addEventListener("DOMContentLoaded", () => {
  iframe.setAttribute('src', `https://my.matterport.com/show?${params}`);
  iframe.addEventListener('load', () => showcaseLoader(iframe));    //showcaseLoader主程式運行
});


//var tagProperty;

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
  //tagProperty=Sdk.Mattertag.MattertagDescriptor;
  console.log(Sdk);
  //tagProperty.anchorPosition={x:0,y:0,z:1}

  //let mattertags=[];
  await fetch(`http://localhost:3000/getJson`, {method:'GET'})  //從API取得Json裡的data
  .then(res => {
      return res.json();   
  }).then(async(result) => {
      console.log(result); //從資料庫取出來的tag//追加後sid會變
      let sids=await Sdk.Mattertag.add(result);
      result.forEach((tag,i)=>{
        if(tag.opacity){Sdk.Mattertag.editOpacity(sids[i],Number(tag.opacity));}
        if(tag.iconSrc){
          Sdk.Mattertag.registerIcon("icon",tag.iconSrc);
          Sdk.Mattertag.editIcon(sids[i], "icon"); 
        }
        otherData.push({
          sid:sids[i],
          iconSrc:tag.iconSrc,
          opacity:tag.opacity
        });
      });
      
  });


 
  //console.log(mattertags);
  //await Sdk.Mattertag.add(mattertags);
  //await Sdk.Mattertag.data.subscribe();
  
  tagDataBtn.addEventListener("click",()=>{ showTagData(Sdk) });
  
  //document.getElementById('addTag').addEventListener("click",()=>{addTag(Sdk)}); //addTag

  tagMove.addEventListener("click",()=>{updatePosition(Sdk);});

  saveBtn.addEventListener("click",()=>{ saveTag(Sdk); });
 
  resetBtn.addEventListener("click",() => {  resetShowcase(); });

  removeBtn.addEventListener("click",()=>{ removeTag(Sdk);});

  oneRemoveBtn.addEventListener("click",()=>{ removeTag(Sdk,removeSid.value);});
  
  


  checkTag(Sdk);
  updateTag(Sdk);
  newTag(Sdk);
  
  //Sdk.on(Sdk.Mattertag.Event.HOVER,(sid)=>{console.log(sid);});
  //Sdk.off(Sdk.Mattertag.Event.CLICK,()=>{console.log("?")});
  
}


function newTag(Sdk){
  function placeTag(){ //要 結束
    console.log("placeTag");
    if(setTag) Sdk.Mattertag.navigateToTag(setTag, Sdk.Mattertag.Transition.FLY);
    setTag = null;
    //movingTag = false;
  }
  if(!isFirefox){focusDetect();}

  function focusDetect(){
    console.log("focusDetect");
    const eventListener = window.addEventListener('blur', function() {//要
        if (document.activeElement === iframe) {
            placeTag(); //function you want to call on click
            setTimeout(()=>{ window.focus(); }, 0);
        }
        window.removeEventListener('blur', eventListener );
    });
  }

  function overlayDetect(){//要
    console.log("overlayDetect");
    if(setTag){
        const overlay = document.createElement('div');
        overlay.setAttribute('class', 'click-overlay');
        overlay.addEventListener('mousemove', e => {
            Sdk.Renderer.getWorldPositionData({
                x: e.clientX - 30,
                y: e.clientY - 5
            })
            .then(data =>{
                updateTagPos(data.position); 
            })
            .catch(e => {
                console.error(e);
                placeTag();
            });        
        });
        overlay.addEventListener('click', e => {
            placeTag();
            overlay.remove();
        });
        //container.insertAdjacentElement('beforeend', overlay);
    }
  }
//要
  function updateTagPos(newPos, newNorm=undefined){ //intersectionData進來，呼叫editPosition修改
    
    if(!newPos) return;
    let  scale = 0.8; //預設Stem長可以從這裡改，下方newNorm乘此變數即可
    //if(!newNorm) newNorm = {x: 0, y: 1, z: 0};  //為什麼指定?
    Sdk.Mattertag.editPosition(setTag, {
        anchorPosition: newPos,
        stemVector: {
            x:  scale*newNorm.x,
            y:  scale*newNorm.y,
            z:  scale*newNorm.z,
        } 
    })
    .catch(e =>{
        console.error(e);
        setTag = null;
        //movingTag = false;
    });
  }

  Sdk.Pointer.intersection.subscribe(intersectionData => { //移動的話變更整個intersectionData//要 //載入開始一直在跑
    if(setTag){
      console.log(intersectionData);
      updateTagPos(intersectionData.position, intersectionData.normal);   
    }
  });

  addTagBtn.addEventListener('click', () => {//要
      if(!setTag){
          //addingTag = true;
          Sdk.Mattertag.add([{
              label: "Matterport Tag",
              description: "  ",
              anchorPosition: {x: 0, y: 0, z: 0},
              stemVector: {x:0, y: 0, z: 0},
              color: {r: 0,g: 1.0,b: 0.2},
          }])
          .then((sid) => {
            setTag = sid[0];
            //addingTag = false;
            if(isFirefox) overlayDetect();
            //return Sdk.Mattertag.getData();
          })
          .catch( (e) => {
              console.error(e);
              //addingTag = false;
        })
    }
  });
}



function updateTag(Sdk){
  let mattertag;
  //click tag觸發事件//updateBtn
  Sdk.on(Sdk.Mattertag.Event.CLICK,
	  async(sid)=>{
      mattertag=[];
      iconSrc.value="";
      showSid.innerHTML=sid;
      otherData.forEach(other=>{
        if(other.sid===sid){
          if(!other.opacity && !other.iconSrc){return;}
          if(other.opacity){opacityRange.value=other.opacity}
          if(other.iconSrc){iconSrc.value=other.iconSrc}
        }
        
        //if(other.opacity){opacityRange.value=other.opacity}
        //if(other.iconSrc){iconSrc.value=other.iconSrc}
      });
      await Sdk.Mattertag.getData().then((tags)=>{

        tags.forEach(tag=>{
          //opacityRange
          
          if(sid==tag.sid){
            //console.log(tag.media.type)
            if(tag.media.type=="mattertag.media.photo"){
              mediaCho.value="1"
            }else if(tag.media.type=="mattertag.media.video"){
              mediaCho.value="2"
            }else{
              mediaCho.value="0"
            }
            
            //iconSrc.value=tag.iconSrc; //暫無
            //opacityRange.value=tag.opacityRange//暫無
            upTagLabel.value=tag.label;
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
            opacityRange.addEventListener('input',()=>{     
              if(showSid.innerText==tag.sid){
                Sdk.Mattertag.editOpacity(sid,Number(opacityRange.value));
              }    
            });
        
            stemHeight.value=1;
            showTag.checked=tag.enabled;
            showStem.checked=tag.stemVisible;
            removeSid.value=tag.sid; //刪除單個Tag用
            mattertag=tag;
          }
        }); 
      });
	  });

    updateBtn.addEventListener("click",async()=>{ 
      if(!mattertag){return;}　　　//沒有這行，修正紐按兩次會把上次的mattertag拿來追加
      removeTag(Sdk,mattertag.sid);   //看一下.catch();的例外處理方式
      //Sdk.Mattertag.remove(mattertag.sid);
      otherData.forEach((other,i)=>{
        if(mattertag.sid==other.sid){otherData[i].remove}
      });
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
      //mattertag.stemHeight=0
      if(!isNaN(Number(stemHeight.value))){mattertag.stemHeight=Number(stemHeight.value);}
      

      mattertag.stemVisible=showStem.checked;
      console.log(mattertag.stemHeight);
      console.log("anchorPosition",mattertag.anchorPosition);
      console.log("anchorNormal",mattertag.anchorNormal);
      console.log("stemVector",mattertag.stemVector);
      
      await Sdk.Mattertag.add(mattertag).then(async(sid)=>{
        console.log(iconSrc.value);
        //upIcon
        console.log(sid);
        if(iconSrc.value){
          try {
            await Sdk.Mattertag.registerIcon(sid[0],iconSrc.value);
            await Sdk.Mattertag.editIcon(sid[0], sid[0]); 
            
          } catch (error) {
            console.log(error)
          } 
        }  

        //Sdk.Mattertag.registerIcon("icon",iconSrc.value);
        //Sdk.Mattertag.editIcon(sid[0], "icon"); 
        //https://upload.wikimedia.org/wikipedia/commons/thumb/6/69/How_to_use_icon.svg/40px-How_to_use_icon.svg.png
        Sdk.Mattertag.editOpacity(sid[0],Number(opacityRange.value));
        Sdk.Mattertag.editPosition(sid[0], {
          stemVector: {
              x:  mattertag.stemHeight*mattertag.stemVector.x,
              y:  mattertag.stemHeight*mattertag.stemVector.y,
              z:  mattertag.stemHeight*mattertag.stemVector.z,
          }
        })
        Sdk.Mattertag.editBillboard(sid[0],{
          label: upTagLabel.value,
          description:upTagDesLink.value=="undefined"?upTagDes.value:"["+upTagDes.value+"]("+upTagDesLink.value+")",
          media: {
            type: cho,
            src:upTagMedia.value,
          } 
        });
        otherData.push({
          sid:sid[0],
          opacity:Number(opacityRange.value),
          iconSrc:iconSrc.value
        });
      }).then(()=>{
        
      });
      
      
      //console.log(mattertag);
  
      upTagLabel.value=""
      upTagDes.value=""
      upTagDesLink.value=""
      upTagMedia.value=""
      mediaCho.value="0"
      showSid.innerHTML="";//Tag更新下的Sid
      opacityRange.value=1;
      iconSrc.value=""
      removeSid.value="";
      stemHeight.value="";
      mattertag=null;
      return;
      //updateText[0].value="OK"; 
      //updateText.forEach();
    });
}


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
    
  list.innerHTML="";
    //iframe.Mattertag.data.subscribe();
    //console.log(tagProperty);
    Sdk.Mattertag.getData()
    .then((tags)=>{ 
        //console.log(a[3].color); //color.b不正確
        tags.forEach((tag)=>{
          //console.log(sid);
          list.innerHTML+='<li>'+
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
          "IconSrc:"+tag.iconSrc+"<br>"+
          "---------------------------------------------"
          +'</li>'
        });
      });
}

async function saveTag(Sdk){ //表單資料推到API
  console.log(otherData);
  //byPositionMode
  var Alltag=[];
  //異步賦值
  //此處若不設置非同期，則上方宣告與下方賦職會同時進行則瀏覽器檢證即使能刷到資料，事實上array的長度還是為0
  await Sdk.Mattertag.getData().then((tags)=>{    
      tags.forEach((tag)=>{
        otherData.forEach(other=>{
          if(other.sid==tag.sid){
            console.log(other.sid)
            tag.iconSrc=other.iconSrc,
            tag.opacity=other.opacity
          }
        });
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
  list.innerHTML="";
  iframe.src = iframe.src;
  otherData=[];
}


function updatePosition(Sdk){

  setTag=showSid.innerText;

  Sdk.Mattertag.editColor(setTag,{r: 0.1,g: 0,b: 0,});
  Sdk.Pointer.intersection.subscribe(intersectionData => {

    console.log(setTag);
    if(setTag){            
      //updateTagPos(intersectionData.position, intersectionData.normal);
      Sdk.Mattertag.editPosition(setTag, {
        anchorPosition: {
          x:  intersectionData.position.x,
          y:  intersectionData.position.y,
          z:  intersectionData.position.z,
        },
        stemVector: {
            x:  intersectionData.normal.x,
            y:  intersectionData.normal.y,
            z:  intersectionData.normal.z,
        }
      })
    }
  });
}






