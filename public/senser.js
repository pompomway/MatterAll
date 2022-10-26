    const sdkKey = "d6nnwa9z0fq405hx53pepqkrc"
    const modelSid = "wAxVEQjFKXR";
    const sdkVersion = "3.11.1";
    const params = `m=${modelSid}&hr=0&play=1&qs=1`;
    const iframeSrc=`https://my.matterport.com/show?${params}`
    const iframe = document.getElementById('showcase-iframe');
    iframe.setAttribute('src', iframeSrc);
 
    let ss, cc, t;
    /*
    document.addEventListener("DOMContentLoaded", () => {
      iframe.setAttribute('src', iframeSrc);
      iframe.addEventListener('load', () => showcaseLoader(iframe));    //showcaseLoader主程式運行
    });
    function showcaseLoader(iframe){   //展開iframe
      try{
        const mpSdk=window.MP_SDK.connect(iframe, sdkKey, sdkVersion)  //讀取下方tag資訊
        .catch(console.error);
        onShowcaseConnect(mpSdk);
      } catch(e){
          console.error(e);
      }
    }
    
    */
    (async function connectSdk() {
       // TODO: replace with your sdk key
       iframe.src = iframe.src;//iframe到這沒問題
      
      // connect the sdk; log an error and stop if there were any connection issues
      try {
        iframe.src = iframe.src;//iframe到這沒問題
        const mpSdk = await window.MP_SDK.connect(
          iframe, // Obtained earlier
          sdkKey, // Your SDK key
          '' // Unused but needs to be a valid string
        );
        
        await onShowcaseConnect(mpSdk);
        //await addMatterTag(mpSdk);//mkSdkがtryの中で定義されるので、ここで呼ばないと引数として渡せない。
        var addedSensor = await addSensor(mpSdk);

        await moreSensor(mpSdk, addedSensor);
        //iframe.src = iframe.src;
      } catch (e) {
        console.error(e);
      }

    })();
    
    async function onShowcaseConnect(mpSdk) {

      //iframe.src = iframe.src;
      // insert your sdk code here. See the ref https://matterport.github.io/showcase-sdk//docs/sdk/reference/current/index.html
      // try retrieving the model data and log the model's sid
      try {
        const modelData = await mpSdk.Model.getData();
        console.log('Model sid:' + modelData.sid);
      } catch (e) {
        console.error(e);
      }
    }
    //MatterTagを2個追加する
    async function addMatterTag(sdk) {
      var mattertags = [{
        label: 'Tag 1',
        description: 'abcdefg',
        anchorPosition: { x: 0, y: 1, z: 0 },
        stemVector: { x: 0, y: 1, z: 0 }
      }, {
        label: 'Tag 2',
        description: '<3 this tag!',
        anchorPosition: { x: 1, y: 1, z: 0 },
        stemVector: { x: 0, y: 0.5, z: 0 }
      }];

      await sdk.Mattertag.add(mattertags)
        .then(function (mattertagIds) {
          console.log(mattertagIds);
          // output: TODO
        });
    }

    //センサーソースデータオブジェクトの読み込み（追加）
    function readAdditionalSensorDatum() {
      let a = [
        {
          type: "sensor.sourcetype.box",
          options: {
            center: {
              x: 19.1559617925258,
              y: 1.43698657330718,
              z: -7.98320472402158
            },
            size: {
              x: 3.526293402,
              y: 2.636314988,
              z: 2.731151524
            },
            userData: {
              id: "会議室(中)"
            }
          }
        }
      ];
      return a;
    }

    //センサーソースデータオブジェクトの読み込み
    function readSensorDatum() {
      let a = [
        {
          type: "sensor.sourcetype.box",
          options: {
            center: {
              x: 19.1559617925258,
              y: 1.43698657330718,
              z: -1.20323766192878
            },
            orientation: {
              pitch: 45,
              roll: 45,
              yaw: 45
            },
            size: {
              x: 3.526293402,
              y: 2.636314988,
              z: 4.605560614
            },
            userData: {
              id: "会議室(大)"
            }
          }
        },
        {
          type: "sensor.sourcetype.box",
          options: {
            center: {
              x: 19.1559617925258,
              y: 1.43698657330718,
              z: -5.03874140757304
            },
            size: {
              x: 3.526293402,
              y: 2.636314988,
              z: 2.54968578878015
            },
            userData: {
              id: "会議室(小)"
            }
          }
        },
        {
          type: "sensor.sourcetype.cylinder",
          options: {
            basePoint: {
              x: 9.040,
              y: 0.5,
              z: 0.2698456105386362
            },
            radius: 2.0,
            height: 2.5,
            userData: {
              id: "シリンダー(小)"
            }
          }
        },
        {
          type: "sensor.sourcetype.cylinder",
          options: {
            basePoint: {
              x: 9.040,
              y: 0.7,
              z: -2
            },
            radius: 3.0,
            height: 1.0,
            userData: {
              id: "シリンダー(大)"
            }
          }
        },
        {
          type: "sensor.sourcetype.sphere",
          options: {
            origin: {
              x: 11.316773984640678,
              y: 1.4,
              z: 0.2698456105386362
            },
            radius: 1.5,
            userData: {
              id: "球(小)"
            }
          }
        },
        {
          type: "sensor.sourcetype.sphere",
          options: {
            origin: {
              x: 11.316773984640678,
              y: 1.7,
              z: 0.2698456105386362
            },
            radius: 2.5,
            userData: {
              id: "球(大)"
            }
          }
        }
      ];
      return a;
    }

    function Pl(t, e) {
      t.classList.remove("hidden"),
        t.classList.add("visible"),
        t.innerText = e
    }

    function Dl(t) {
      t.classList.remove("visible"),
        t.classList.add("hidden")
    }
    //Sensorを追加する
    async function addSensor(sdk) {
      //センサーソースデータオブジェクトの読み込み
      const srcDatum = await readSensorDatum();

      /*センサー生成*/
      const cSensor = await sdk.Sensor.createSensor(sdk.Sensor.SensorType.CAMERA);
      console.log(`cSensor=${cSensor}`)
      /*センサー表示設定*/
      cSensor.showDebug(!0);//!0:表示 0:非表示

      e = document.getElementById("text")

      //センサー観察設定
      cSensor.readings.subscribe({
        onCollectionUpdated: t => {
          const n = [];
          console.log("■■■■■■■■■■■■■■■■■■■■");
          for (const [e, i] of t) {
            i.inRange && (n.find(t => t === e.userData.id) || n.push(`【${e.userData.id}】`));
            const ra = (i.inRange == "true" ? "●" : "×");
            console.log(`inRange:${ra} inView:${i.inView} sensor id: ${e.userData.id}`);
          }
          n.length > 0 ? Pl(e, `${n.toString()}`) : Dl(e)
        }
      });

      //センサーソース設定
      const a = [];
      for (const e of srcDatum)
        a.push(sdk.Sensor.createSource(e.type, e.options));
      const s = await Promise.all(a);
      s.forEach((s) => {
        console.log(`s.userData.id=${s.userData.id}`);
      });
      /*showcaseにセンサーを組込む*/
      //return await cSensor.addSource(...s);
      try {
        await cSensor.addSource(...s);
      } catch (e) {
        console.log(e);
      }
      return cSensor;
    }

    async function moreSensor(sdk, cSensor) {
      const srcDatum = await readAdditionalSensorDatum();
      //const cSensor = await sdk.Sensor.createSensor(sdk.Sensor.SensorType.CAMERA);
      //console.log(`cSensor(追加)=${cSensor}`)
      /*センサー表示設定*/
      cSensor.showDebug(!0);//!0:表示 0:非表示
      //cSensor.showDebug(!0);//!0:表示 0:非表示
      //cSensor.showDebug(!0);//!0:表示 0:非表示
      //センサーソース設定
      const a = [];
      for (const e of srcDatum)
        a.push(sdk.Sensor.createSource(e.type, e.options));
      const s = await Promise.all(a);
      s.forEach((s) => {
        console.log(`s.userData.id=${s.userData.id}`);
      });
      //await sdk.Sensor.commit();
      //await sdk.Sensor.Isensor.addSource(...s);
      await cSensor.addSource(...s);
    }

