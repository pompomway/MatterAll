//不寫

var iframe = document.getElementById('showcase');
var text = document.getElementById('text');
var button = document.getElementById('button');

// this key only works from jsfiddle.
var jsFiddleKey = "6eb9607db19546aebe10dce90aa001fa";

var sdkVersion = "3.5";
var modelSid = "444zZAZQogU";

function pointToString(point) {
  var x = point.x.toFixed(3);
  var y = point.y.toFixed(3);
  var z = point.z.toFixed(3);

  return `{ x: ${x}, y: ${y}, z: ${z} }`;
}

iframe.src = `https://my.matterport.com/show?m=${modelSid}&hr=0&play=1&title=0&qs=1`;

window.MP_SDK.connect(iframe, jsFiddleKey, sdkVersion).then(async function(theSdk) {
  var sdk = theSdk;
  console.log('SDK Connected!');

  var poseCache;
  sdk.Camera.pose.subscribe(function(pose) {
    poseCache = pose;
  });

  var intersectionCache;
  sdk.Pointer.intersection.subscribe(function(intersection) {
    console.log(intersection);
    intersectionCache = intersection;
    intersectionCache.time = new Date().getTime();
    button.style.display = 'none';
    buttonDisplayed = false;
  });

  var delayBeforeShow = 1000;
  var buttonDisplayed = false;
  setInterval(() => {
    if (!intersectionCache || !poseCache) {
      return;
    }

    const nextShow = intersectionCache.time + delayBeforeShow;
    if (new Date().getTime() > nextShow) {
      if (buttonDisplayed) {
        return;
      }

      var size = {
        w: iframe.clientWidth,
        h: iframe.clientHeight,
      };
      var coord = sdk.Conversion.worldToScreen(intersectionCache.position, poseCache, size);
      button.style.left = `${coord.x - 25}px`;
      button.style.top = `${coord.y - 22}px`;
      button.style.display = 'block';
      buttonDisplayed = true;
    }
  }, 16);

  button.addEventListener('click', function() {
    text.innerHTML = `position: ${pointToString(intersectionCache.position)}\nnormal: ${pointToString(intersectionCache.normal)}\nfloorId: ${intersectionCache.floorId}`;
    button.style.display = 'none';
    iframe.focus();
  });
});