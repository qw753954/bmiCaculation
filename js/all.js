let dataAry = JSON.parse(localStorage.getItem('bmiData')) || [];
let weight = document.querySelector('#weight');
let height = document.querySelector('#height');
const result = document.querySelector('.resultBtn');
const reResult = document.querySelector('.reResultBtn');
const list = document.querySelector('.list');
const delAll = document.querySelector('.delAll');
const greetTxt = document.querySelector('.greet');
const heightFeedback = document.querySelector('.feedHeight');
const weightFeedback = document.querySelector('.feedWeight');
const rangeWarning = document.querySelector('.rangeWarning');
const closeWarning = document.querySelector('.close');


updateList(dataAry); // 一開始就先渲染 '陣列資料' 到畫面上
greetAndClear(dataAry); // 一開始就先渲染 '招呼語 or 全部清空按鈕' 到畫面上


// 判斷欄位聚焦的狀況
weight.addEventListener('blur', function() {
    console.log('weight.value 的型別是 ' + typeof(weight.value));
    if (weight.value === '') {
        weightFeedback.style.opacity = '1';
    } else {
        weightFeedback.style.opacity = '0';
    }
})
height.addEventListener('blur', function() {
    if (height.value === '') {
        heightFeedback.style.opacity = '1';
    } else {
        heightFeedback.style.opacity = '0';
    }
})



// 點擊 x 按鈕關閉警告視窗
closeWarning.addEventListener('click', function(e) {
    e.preventDefault();
    rangeWarning.style.display = 'none';
})



// 新增 data 資料, 並存進 localStorage 中
function addData() {
    let weightInt = parseInt(weight.value);
    let heightInt = parseInt(height.value);
    let bmi = weightInt / ((heightInt / 100) * (heightInt / 100));

    console.log(bmi); //檢查 bmi 是否有運算正確, 也能順便確認 click 事件有成功執行
    console.log(bmi.toFixed(2)); //測試此數值是否有保留小數點後兩位(有四捨五入)

    // 判斷欄位的狀況
    if (height.value === '' && weight.value === '') {
        heightFeedback.style.opacity = '1';
        weightFeedback.style.opacity = '1';
        return;
    } else if (height.value === '') {
        heightFeedback.style.opacity = '1';
        return;
    } else if (weight.value === '') {
        weightFeedback.style.opacity = '1';
        return;
    } else if (heightInt < 11 || heightInt > 300 || weightInt < 1 || weightInt > 400) {
        rangeWarning.style.display = 'flex';
        return;
    }

    // 判斷 bmi 指數對應的身體狀態
    if (16 <= bmi && bmi < 18.5) {
        condition = '過輕';
        color = '#31BAF9';
    } else if (18.5 <= bmi && bmi < 25) {
        condition = '理想';
        color = '#86D73F';
    } else if (25 <= bmi && bmi < 30) {
        condition = '過重';
        color = '#FF982D';
    } else if (30 <= bmi && bmi < 35) {
        condition = '輕度肥胖';
        color = '#FF6C03';
    } else if (35 <= bmi && bmi < 40) {
        condition = '中度肥胖';
        color = '#FF6C03';
    } else if (bmi >= 40) {
        condition = '重度肥胖';
        color = '#FF1200';
    } else {
        condition = '嚴重過輕';
        color = 'yellow';
    }

    // 新增使用者相關的屬性, 含 bmi,身高,體重,狀態跟對應的 color
    let newItem = {
        bmi: bmi.toFixed(2), // 保留小數點後兩位
        weight: weightInt,
        height: heightInt,
        condition: condition,
        color: color,
        time: new Date().toLocaleDateString()
    }

    dataAry.push(newItem); // 加到陣列中
    localStorage.setItem('bmiData', JSON.stringify(dataAry));
    updateList(dataAry);
    greetAndClear(dataAry);

    // 測驗btn 隱藏, 重測(bmi結果) btn 出現
    this.classList.add('d-none');
    reResult.classList.add('d-block');
    reResult.style.color = newItem.color;
    reResult.style.borderColor = newItem.color;
    reResult.innerHTML = `${newItem.bmi} <p>BMI</p><span style="background-color: ${newItem.color};"><img src="img/icons_loop.png"></span>`;
}
result.addEventListener('click', addData);



// 點擊重新測驗 btn 的事件
reResult.addEventListener('click', function() {
    this.classList.remove('d-block'); // 測驗btn 顯示 
    result.classList.remove('d-none'); // 重測(bmi結果)btn 隱藏

    // 清空 input 的值
    weight.value = '';
    height.value = '';
});



// 把屬性資料渲染到介面上
function updateList(item) {
    let str = '';
    for (let i = 0; i < item.length; i++) {
        str +=
            `<li class="listItem mb-2" style="border-color: ${item[i].color};">
            <h4>${item[i].condition}</h4>
            <div>
                <small>BMI</small>
                <p>${item[i].bmi}</p>
            </div>
            <div>
                <small>weight</small>
                <p>${item[i].weight}</p>
            </div>
            <div>
                <small>height</small>
                <p>${item[i].height}</p>
            </div>
            <div>
                <small>${item[i].time}</small>
            </div>
            <button class="del" data-num="${i}">刪除</button>
        </li>`;
    }
    list.innerHTML = str;
}



// 招呼語&清空按鈕判斷, 他們的出現時機是相反的
function greetAndClear(ary) {
    if (ary.length == 0) { // 若陣列是空的, 招呼語出現, 全清空按鈕隱藏
        greetTxt.classList.remove('d-none');
        delAll.classList.add('d-none');
    } else if (ary.length > 0) { // 若陣列有資料, 招呼語隱藏, 全清空按鈕出現
        greetTxt.classList.add('d-none');
        delAll.classList.remove('d-none');
    }
}



// 刪除單一資料, 利用 dataset 去實現, 並同步更新至 localStorage
function delData(e) {
    e.preventDefault();
    if (e.target.nodeName !== 'BUTTON') {
        return;
    }
    console.log('有選取到 button 哦');
    let indexNum = e.target.dataset.num;
    dataAry.splice(indexNum, 1); //刪除陣列中的單一資料
    localStorage.setItem('bmiData', JSON.stringify(dataAry));
    updateList(dataAry);
    greetAndClear(dataAry);
}
list.addEventListener('click', delData);



// 清空全部的資料, 並同步更新至 localStorage
function delAllData(e) {
    e.preventDefault();
    console.log('有選取到 a 連結哦');
    dataAry = []; // 強迫變成空陣列, 即清空全部的資料
    localStorage.setItem('bmiData', JSON.stringify(dataAry));
    updateList(dataAry);
    greetAndClear(dataAry);
}
delAll.addEventListener('click', delAllData);