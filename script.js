const body = document.querySelector("body");

// スタート画面
const startFrame = document.getElementById("startFrame");
const hideBtn = document.getElementById("hideBtn");
const startTitle = document.getElementById("startTitle");
const headsUp = document.getElementById("headsUp");
const startBtn = document.getElementById("startBtn");
const settingTime = document.getElementById("settingTime");
const settingTimeValue = document.getElementById("settingTimeValue");

// 射撃画面
const shotFrame = document.getElementById("shotFrame");
const outerArea = document.getElementById("outerArea");
const timer = document.getElementById("timer");
const point = document.getElementById("point");
const shotArea = document.getElementById("shotArea");

// スコア画面
const resultFrame = document.getElementById("resultFrame");
const resultAssessment = document.getElementById("resultAssessment");
const resultScore = document.getElementById("resultScore");
const resultHit = document.getElementById("resultHit");
const resultMiss = document.getElementById("resultMiss");
const resultAccuracy = document.getElementById("resultAccuracy");
const resultHPT = document.getElementById("resultHPT");
const finishBtn = document.getElementById("finishBtn");

// 隠し要素
const shotCounter = document.getElementById("shotCounter");
const backTime = document.getElementById("backTime");
const finishCheck = document.getElementById("finishCheck");
const clickCount = document.getElementById("clickCount");
const targetSize = document.getElementById("targetSize");
const specialTitle = document.getElementById("specialTitle");
const specialOff = document.getElementById("specialOff");



// 読み込み
// ------------------------------------
window.onload = function(){
  const sound = new Audio("拳銃を撃つ.mp3");
  sound.remove();

  // 注意勧告点滅
  setInterval(function(){
    const style = headsUp.style.opacity;
    if(style == "0.2"){
      headsUp.style = "opacity: 1;";
    }else{
      headsUp.style = "opacity: 0.2;";
    }
  }, 400)
  
  special();
}


// スタート
// ------------------------------------
startBtn.onclick = function(){
  const sound = new Audio("拳銃を撃つ.mp3");
  sound.remove();
  finishCheck.textContent = "0";

  // 裏モード
  targetSize.textContent = "30px";
  const text = clickCount.textContent;
  if(text == "51231454"){
    targetSize.textContent = "150vmax";
  }
  clickCount.textContent = "";

  // タイマーセット
  const time = Number(settingTime.value);
  backTime.textContent = time + 1;
  
  // 表示変更
  timer.innerHTML = "<div>Timer</div>" + time;
  startFrame.style = "display: none;";
  shotFrame.style = "display: block;";
  setTimeout(function(){
    point.textContent = "2";
  }, 1000)
  setTimeout(function(){
    point.textContent = "1";
  }, 2000)
  setTimeout(function(){
    point.textContent = "START";
    shotCounter.textContent = "";
    finishCheck.textContent = "1";
    createTarget();
    
    const shotTimer = function(){
      backTime.textContent = Number(backTime.textContent) - 1;
      timer.innerHTML = "<div>Timer</div>" + backTime.textContent.replace("-2", "0");
      if(backTime.textContent > 0){
        setTimeout(shotTimer, 1000);
      }else if(backTime.textContent == 0){
        createScore();
      }
    }
    shotTimer();
  }, 3000)
}

settingTime.oninput = function(){
  const setValue = settingTime.value;
  settingTimeValue.textContent = setValue + "秒";
}


// 射撃
// ------------------------------------
outerArea.onmousedown = function(){
  // 射撃音
  const sound = new Audio("拳銃を撃つ.mp3");
  sound.play();
  
  // 射撃数
  shotCounter.textContent = Number(shotCounter.textContent) + 1;
  const shotCounts = Number(shotCounter.textContent);
  
  // 弾痕
  const top = event.clientY;
  const left = event.clientX;
  const div = document.createElement("div");
  div.className = "bullet-hole";
  div.id = shotCounts;
  div.style = "top: " + top + "px; left: " + left + "px;";
  outerArea.appendChild(div);
  setTimeout(function(){
    document.getElementById(shotCounts).remove();
  }, 1000)
}


// 命中
// ------------------------------------
window.onmousedown = function(){
  const className = event.target.className;
  if(className == "target"){
    event.target.remove();
    if(point.textContent == "START"){
      point.textContent = "";
    }
    point.textContent = Number(point.textContent) + 1;
    createTarget();
  }
}


// 終了
// ------------------------------------
finishBtn.onclick = function(){
  special();
  resultFrame.style = "display: none;";
  startFrame.style = "display: block";
}

window.onkeydown = function(){
  if(event.which == 27){
    const style = shotFrame.style.display;
    if(style == "block"){
      const check = finishCheck.textContent;
      if(check == "1"){
        backTime.textContent = "-1";
        timer.innerHTML = "<div>Timer</div>0";
        createScore();
      }
    }
  }else if(event.which == 69){
    clickCount.textContent += "1";
  }else if(event.which == 77){
    clickCount.textContent += "2";
  }else if(event.which == 80){
    clickCount.textContent += "3";
  }else if(event.which == 82){
    clickCount.textContent += "4";
  }else if(event.which == 79){
    clickCount.textContent += "5";
  }
}


// 超越者モードオフ
// ------------------------------------
specialOff.onclick = function(){
  const userSelect = confirm("超越者モードをオフにします。よろしいですか？");
  if(userSelect == true){
    localStorage.setItem("specialTitle-XXX", "");
    special();
  }
}


// 裏モード起動
// ------------------------------------
hideBtn.onclick = function(){
  clickCount.textContent = Number(clickCount.textContent) + 1;
}



function clientHW(elem){
  const height = elem.clientHeight;
  const width = elem.clientWidth;
  const arry = (height + "," + width).split(",");
  return arry;
}

function createTarget(){
  const top = Math.floor(Math.random() * clientHW(shotArea)[0]);
  const left = Math.floor(Math.random() * clientHW(shotArea)[1]);
  const size = targetSize.textContent;
  const div = document.createElement("div");
  div.className = "target";
  div.id = "target";
  div.style = "top: " + top + "px; left: " + left + "px; width: " + size + "; height: " + size + ";";
  shotArea.appendChild(div);
}

function createScore(){
  finishCheck.textContent = "0";
  targetSize.textContent = "30px";
  
  // スコア表示
  const target = document.querySelector(".target");
  target.remove();
  const time = Number(settingTime.value);
  const hit = Number(point.textContent);
  const shotCounts = Number(shotCounter.textContent);
  point.textContent = "FINISH";
  resultHit.textContent = String(hit).replace("NaN", "-");
  resultMiss.textContent = String(shotCounts - hit).replace("NaN", "-");
  resultAccuracy.textContent = String((hit / shotCounts * 100).toFixed(2)).replace("NaN", "-");
  resultHPT.textContent = String((hit / time * 60).toFixed(2)).replace("NaN", "-");
  const score = (hit / time * 60) * (hit / shotCounts) ^ 3;
  if(shotCounts == 0){
    resultScore.textContent = "-";
    resultAssessment.innerHTML = "<div class='result-normal red'>キミ、なんで撃たなかったの？</div>";
  }else{
    resultScore.textContent = String(score).replace("NaN", "");
    if(score > 1000){
      resultAssessment.innerHTML = "<div class='result-normal yellow'>汝には『超越者』の称号を与えよう</div>";
      localStorage.setItem("specialTitle-XXX", "1");
    }else if(score > 300){
      resultAssessment.innerHTML = "<div class='result-normal yellow'>人間卒業、おめでとうございます！</div>";
    }else if(score > 100){
      resultAssessment.innerHTML = "<div class='result-normal yellow'>あなたは今、人外へと足を踏み入れました</div>";
    }else if(score > 85){
      resultAssessment.innerHTML = "<div class='result-normal yellow'>AIMマスター</div>";
    }else if(score > 70){
      resultAssessment.innerHTML = "<div class='result-normal'>ガチ勢</div>";
    }else if(score > 55){
      resultAssessment.innerHTML = "<div class='result-normal'>上級者</div>";
    }else if(score > 40){
      resultAssessment.innerHTML = "<div class='result-normal'>まだまだいける！</div>";
    }else if(score > 25){
      resultAssessment.innerHTML = "<div class='result-normal'>初心者</div>";
    }else if(score > 10){
      resultAssessment.innerHTML = "<div class='result-normal red'>ここからがスタートです</div>";
    }else if(score > 3){
      resultAssessment.innerHTML = "<div class='result-normal red'>くそざこナメクジ</div>";
    }else if(score >= 0){
      resultAssessment.innerHTML = "<div class='result-normal red'>まじめにやってんの？</div>";
    }
  }
  setTimeout(function(){
    shotFrame.style = "display: none;";
    resultFrame.style = "display:block;";
    point.textContent = "3";
    settingTime.value = 60;
    settingTimeValue.textContent = "60秒";
  }, 2000)
}

function special(){
  // 超越者表示
  const special = localStorage.getItem("specialTitle-XXX");
  if(special == "1"){
    body.style = "background-image: url(god.jpg!d); background-size: cover;";
    startTitle.style = "background: linear-gradient(90deg, #f00 , #ff0); background-clip: text; -webkit-background-clip: text; color: rgba(0, 0, 0, 0);";
    specialTitle.style = "display: block;";
    specialOff.style = "display: block;";
  }else{
    body.style = "";
    startTitle.style = "";
    specialTitle.style = "display: none;";
    specialOff.style = "display: none;";
  }
}