var dataAry = JSON.parse(localStorage.getItem('bmiData')) || [];
var weight = document.querySelector('#weight');
var height = document.querySelector('#height');
var result = document.querySelector('.resultBtn');
var reResult = document.querySelector('.reResultBtn');
var list = document.querySelector('.list');
var delAll = document.querySelector('.delAll');
var greetTxt = document.querySelector('.greet');
var today = new Date(); //時間


updateList(dataAry); // 一開始就先渲染 '陣列資料' 到畫面上
greetAndClear(dataAry); // 一開始就先渲染 '招呼語 or 全部清空按鈕' 到畫面上


// 判斷欄位聚焦的狀況
weight.addEventListener('blur', function() {
    console.log('weight.value 的型別是 ' + typeof(weight.value));
    if (weight.value === '') {
        alert('請輸入體重欄位')
    }
})

height.addEventListener('blur', function() {
    if (height.value === '') {
        alert('請輸入身高欄位')
    }
})


// 新增 data 資料, 並存進 localStorage 中
function addData() {
    var weightInt = parseInt(weight.value);
    var heightInt = parseInt(height.value);
    var bmi = weightInt / ((heightInt / 100) * (heightInt / 100));

    console.log(bmi); //確認 click 事件是否有成功執行
    console.log(bmi.toFixed(2)); //確認此數值是否有保留小數點後兩位

    // 判斷欄位狀況
    if (height.value === '' || weight.value === '') {
        alert('欄位不可為空');
        return;
    } else if (weightInt < 0 || weightInt >= 400 || heightInt < 10 || heightInt >= 300) {
        alert('填寫的數值請在合理範圍內～\n\n 體重範圍是 1 ~ 400\n 身高範圍是 11 ~ 300');
        return;
    }

    // 判斷 bmi 指數對應的身體狀態
    if (16 <= bmi && bmi < 18.5) {
        var condition = '過輕';
        var color = '#31BAF9';
    } else if (18.5 <= bmi && bmi < 25) {
        var condition = '理想';
        var color = '#86D73F';
    } else if (25 <= bmi && bmi < 30) {
        var condition = '過重';
        var color = '#FF982D';
    } else if (30 <= bmi && bmi < 35) {
        var condition = '輕度肥胖';
        var color = '#FF6C03';
    } else if (35 <= bmi && bmi < 40) {
        var condition = '中度肥胖';
        var color = '#FF6C03';
    } else if (bmi >= 40) {
        var condition = '重度肥胖';
        var color = '#FF1200';
    } else {
        var condition = '嚴重過輕';
        var color = 'yellow';
    }

    // 新增使用者的屬性, 含 bmi,身高,體重,狀態跟對應的 color
    var newItem = {
        bmi: bmi.toFixed(2),
        weight: weightInt,
        height: heightInt,
        condition: condition,
        color: color
    }

    dataAry.push(newItem); // 加到陣列中
    localStorage.setItem('bmiData', JSON.stringify(dataAry));
    updateList(dataAry);
    greetAndClear(dataAry);
    this.classList.add('d-none');
    reResult.classList.add('d-block');
    reResult.style.color = newItem.color;
    reResult.style.borderColor = newItem.color;
    reResult.innerHTML = newItem.bmi + '<p>BMI</p><span style="background-color:' + newItem.color + '"><img src="img/icons_loop.png"></span>';
}
result.addEventListener('click', addData);


// 重新測驗 view
function reTest() {
    this.classList.remove('d-block');
    result.classList.remove('d-none');
    weight.value = '';
    height.value = '';
}
reResult.addEventListener('click', reTest);


// 把屬性資料渲染到介面上
function updateList(item) {
    var str = '';
    for (var i = 0; i < item.length; i++) {
        str += '<li class="listItem mb-2" style="border-color:' + item[i].color + ';"></span><h3>' + item[i].condition + '</h3><div><small>BMI</small><p>' + item[i].bmi + '</p></div><div><small>weight</small><p>' +
            item[i].weight + '</p></div><div><small>height</small><p>' + item[i].height + '</p></div><div><small>' + today.getFullYear() + '/' + (today.getMonth() + 1) + '/' + today.getDate() + '</small></div><button class="del" data-num="' + i + '">刪除</button></li>';
    }
    list.innerHTML = str;
}

// 招呼語判斷 & 渲染到介面上
function greetAndClear(ary) {
    if (ary.length == 0) { // 若陣列是空的, 招呼語出現, 全清空按鈕隱藏
        greetTxt.classList.remove('d-none');
        delAll.classList.add('d-none');
    } else if (ary.length > 0) { // 若陣列有值, 招呼語隱藏, 全清空按鈕出現
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
    console.log('成功選取 button');
    var indexNum = e.target.dataset.num;
    console.log(indexNum);
    dataAry.splice(indexNum, 1);
    localStorage.setItem('bmiData', JSON.stringify(dataAry));
    updateList(dataAry);
    greetAndClear(dataAry);
}
list.addEventListener('click', delData);


// 清空全部的資料, 並同步更新至 localStorage
function delAllData(e) {
    e.preventDefault();
    console.log('成功選取 a 連結');
    dataAry = []; // 強迫變成空陣列, 即清空全部的資料
    localStorage.setItem('bmiData', JSON.stringify(dataAry));
    updateList(dataAry);
    greetAndClear(dataAry);
}
delAll.addEventListener('click', delAllData);