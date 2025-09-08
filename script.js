document.addEventListener('DOMContentLoaded', () => {

    // --- 在這裡貼上你最新的 GAS 網址 ---
    const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwERdiY3XP43v3T5T-l-qT6fIdIq6hzm-w17LfnRxrErbcIihMMx5xiu4p-yWkLws79aw/exec'

    // --- 資料區 ---
    const characterAbilities = {
        "醋咪": ["食慾值", "分享力", "靈活度"],
        "Bu-Bu": ["縫補力", "細膩度", "創意感"],
        "匠郎": ["工藝力", "配色感", "專注度"],
        "銅仔": ["守信力", "數字感", "沉穩度"],
        "旺望": ["記憶力", "洞察力", "耐心值"]
    };
    const questions = [
        { question: "今天你出門旅行，最先決定的是什麼？", image: "images/q1.png", options: [ { text: "A. 要吃的美食清單", scores: [{ability: "食慾值", value: 1.5}, {ability: "記憶力", value: 0.5}] }, { text: "B. 要穿的衣服風格", scores: [{ability: "創意感", value: 1}, {ability: "配色感", value: 0.5}] }, { text: "C. 預算與行程安排", scores: [{ability: "數字感", value: 1}, {ability: "耐心值", value: 0.5}] } ] },
        { question: "走到街角時，你最容易停下來看什麼？", image: "images/q2.png", options: [ { text: "A. 香味四溢的小攤子", scores: [{ability: "分享力", value: 1}, {ability: "細膩度", value: 0.5}] }, { text: "B. 繽紛布料或裝飾", scores: [{ability: "縫補力", value: 1}, {ability: "洞察力", value: 0.5}] }, { text: "C. 老建築與工坊", scores: [{ability: "工藝力", value: 1}, {ability: "沉穩度", value: 0.5}] } ] },
        { question: "你買了一樣小東西作為旅途開始的紀念，會是？", image: "images/q3.png", options: [ { text: "A. 小吃點心", scores: [{ability: "靈活度", value: 1}, {ability: "細膩度", value: 0.5}] }, { text: "B. 手工布或小飾品", scores: [{ability: "創意感", value: 1.5}, {ability: "工藝力", value: 0.5}] }, { text: "C. 木雕或金工作品", scores: [{ability: "配色感", value: 1}, {ability: "守信力", value: 0.5}] } ] },
        { question: "途中你想找朋友同行，他們會形容你是？", image: "images/q4.png", options: [ { text: "A. 最懂吃的嚮導", scores: [{ability: "分享力", value: 1}, {ability: "記憶力", value: 0.5}] }, { text: "B. 溫柔細心的照顧者", scores: [{ability: "縫補力", value: 1}, {ability: "沉穩度", value: 0.5}] }, { text: "C. 默默付出的行動派", scores: [{ability: "專注度", value: 1}, {ability: "洞察力", value: 0.5}] } ] },
        { question: "旅途中下起大雨，你的第一反應是？", image: "images/q5.png", options: [ { text: "A. 找間店坐下來，邊躲雨邊觀察路人", scores: [{ability: "洞察力", value: 1}, {ability: "細膩度", value: 0.5}] }, { text: "B. 撐起傘，覺得雨中散步也別有風味", scores: [{ability: "靈活度", value: 1}, {ability: "專注度", value: 0.5}] }, { text: "C. 馬上確認接下來的行程是否受影響", scores: [{ability: "數字感", value: 1.5}, {ability: "創意感", value: 0.5}] } ] },
        { question: "你喜歡用什麼方式記錄旅行？", image: "images/q6.png", options: [ { text: "A. 拍下食物與風景照", scores: [{ability: "食慾值", value: 1}, {ability: "記憶力", value: 0.5}] }, { text: "B. 寫下心情或畫圖", scores: [{ability: "創意感", value: 1}, {ability: "工藝力", value: 0.5}] }, { text: "C. 整理花費與票根", scores: [{ability: "守信力", value: 1}, {ability: "耐心值", value: 0.5}] } ] },
        { question: "在一個陌生的市集裡，你會先逛哪一區？", image: "images/q7.png", options: [ { text: "A. 手工藝品區", scores: [{ability: "工藝力", value: 1.5}, {ability: "細膩度", value: 0.5}] }, { text: "B. 在地小吃區", scores: [{ability: "食慾值", value: 1.5}, {ability: "數字感", value: 0.5}] }, { text: "C. 舊書或古董區", scores: [{ability: "記憶力", value: 1}, {ability: "專注度", value: 0.5}] } ] },
        { question: "旅伴臨時有狀況，需要調整行程，你會？", image: "images/q8.png", options: [ { text: "A. 沒關係，隨遇而安，剛好去探索新地方", scores: [{ability: "靈活度", value: 1}, {ability: "耐心值", value: 0.5}] }, { text: "B. 先關心對方狀況，行程可以之後再說", scores: [{ability: "縫補力", value: 1.5}, {ability: "守信力", value: 0.5}] }, { text: "C. 馬上拿出備案，重新規劃最高效的路線", scores: [{ability: "沉穩度", value: 1}, {ability: "配色感", value: 0.5}] } ] },
        { question: "對你來說，一趟完美的旅行，最重要的是？", image: "images/q9.png", options: [ { text: "A. 看到獨特的風景或作品", scores: [{ability: "專注度", value: 1}, {ability: "洞察力", value: 0.5}] }, { text: "B. 與旅伴或當地人建立情感連結", scores: [{ability: "分享力", value: 1}, {ability: "縫補力", value: 0.5}] }, { text: "C. 行程順利，所有花費都在預算內", scores: [{ability: "守信力", value: 1.5}, {ability: "耐心值", value: 0.5}] } ] },
        { question: "旅程結束後，你最想帶回家的紀念品是？", image: "images/q10.png", options: [ { text: "A. 一段難忘的回憶", scores: [{ability: "記憶力", value: 1.5}, {ability: "縫補力", value: 0.5}] }, { text: "B. 親手製作或挑選的工藝品", scores: [{ability: "工藝力", value: 1.5}, {ability: "沉穩度", value: 0.5}] }, { text: "C. 當地的特色美食或食譜", scores: [{ability: "食慾值", value: 1}, {ability: "配色感", value: 0.5}] } ] },
    ];
    const results = {
        "醋咪": { title: "熱情的城市嚮導", image: "images/hu.png", description: "你是用「味蕾」探索世界的人，總是聞到香氣就迫不及待前往。你的 食慾值 讓你敢於嘗試新事物，分享力 讓你樂於與朋友分享美食與樂趣，靈活度 讓你在街頭巷尾穿梭自如。", revelation: "你的存在能讓身邊的人不再錯過任何美好事物。請記得，偶爾慢下腳步，享受食物背後的故事與人情味。" },
        "Bu-Bu": { title: "溫柔的縫補者", image: "images/bu.png", description: "你細心、溫柔，總能注意到別人忽略的細節。你的 縫補力 讓你能修復、療癒，細膩度 讓你懂得觀察人心，創意感 讓你能把碎片拼湊成新風格。", revelation: "你帶給世界的是安心與美感。請相信自己的細膩不是弱點，而是一種能連結人心的力量。" },
        "匠郎": { title: "專注的工藝職人", image: "images/jn.png", description: "你追求品質與美感，喜歡親手創造並欣賞細節。你的 工藝力 讓你能專心打造作品，配色感 讓你在混亂中找到秩序，專注度 讓你持續完成長遠的目標。", revelation: "你的堅持讓世界看見美的可能。別忘了，作品之外，你的人生也需要留白與呼吸。" },
        "銅仔": { title: "沉穩的守信者", image: "images/tn.png", description: "你重視承諾與規則，做事有條不紊。你的 守信力 讓人依賴，數字感 讓你在複雜情境中保持冷靜，沉穩度 讓你成為團隊的靠山。", revelation: "你是別人眼中的「安全感」。但也別把自己困在框架裡，偶爾允許自己嘗試一些冒險。" },
    "旺望": { title: "念舊的記錄者", image: "images/wn.png", description: "你對過去充滿情感，喜歡透過物品與故事回憶時光。你的記憶力讓你記住細節，洞察力讓你理解事物背後的意義，耐心值讓你能靜靜等待、慢慢品味。", revelation: "你是時光的守護者。透過你的眼睛，大家能看見被遺忘的美好。記得，創造新的回憶和保存舊的一樣重要。" }
    };

    // --- DOM 元素 ---
    const screens = { intro: document.getElementById('intro-screen'), quiz: document.getElementById('quiz-screen'), result: document.getElementById('result-screen'), form: document.getElementById('form-screen'), success: document.getElementById('success-screen') };
    const startBtn = document.getElementById('start-btn');
    const restartBtn = document.getElementById('restart-btn');
    const drawBtn = document.getElementById('draw-btn');
    const drawForm = document.getElementById('draw-form');
    const restartBtnSuccess = document.getElementById('restart-btn-success');
    const questionNumber = document.getElementById('question-number');
    const questionText = document.getElementById('question-text');
    const questionImage = document.getElementById('question-image');
    const optionsContainer = document.getElementById('options-container');
    const resultRole = document.getElementById('result-role');
    const resultTitle = document.getElementById('result-title');
    const resultImage = document.getElementById('result-image');
    const resultDescription = document.getElementById('result-description');
    const resultRevelation = document.getElementById('result-revelation');

    // --- 測驗狀態 ---
    let currentQuestionIndex = 0;
    let abilityScores = {};
    let finalResultCharacter = '';

    // --- 核心函數 ---
    function showScreen(screenName) { Object.values(screens).forEach(screen => screen.classList.remove('active')); screens[screenName].classList.add('active'); }
    function resetQuiz() { currentQuestionIndex = 0; abilityScores = {}; Object.values(characterAbilities).flat().forEach(ability => { abilityScores[ability] = 0; }); finalResultCharacter = ''; }
    function startQuiz() { resetQuiz(); showScreen('quiz'); displayQuestion(); }
    function displayQuestion() { const question = questions[currentQuestionIndex]; questionNumber.textContent = `Q${currentQuestionIndex + 1} / ${questions.length}`; questionText.textContent = question.question; questionImage.src = question.image; questionImage.alt = question.question; optionsContainer.innerHTML = ''; question.options.forEach(option => { const button = document.createElement('button'); button.textContent = option.text; button.classList.add('option-btn'); button.onclick = () => selectAnswer(option.scores); optionsContainer.appendChild(button); }); }
    function selectAnswer(optionScores) { optionScores.forEach(score => { if (abilityScores.hasOwnProperty(score.ability)) { abilityScores[score.ability] += score.value; } }); currentQuestionIndex++; if (currentQuestionIndex < questions.length) { displayQuestion(); } else { calculateAndShowResult(); } }
    function calculateAndShowResult() { const characterTotals = {}; for (const character in characterAbilities) { let total = 0; characterAbilities[character].forEach(ability => { total += abilityScores[ability]; }); characterTotals[character] = total; } finalResultCharacter = Object.keys(characterTotals).reduce((a, b) => characterTotals[a] > characterTotals[b] ? a : b); const resultData = results[finalResultCharacter]; resultRole.textContent = finalResultCharacter; resultTitle.textContent = `— ${resultData.title} —`; resultImage.src = resultData.image; resultImage.alt = resultData.title; resultDescription.textContent = resultData.description; resultRevelation.textContent = resultData.revelation; const statsBreakdown = document.getElementById('stats-breakdown'); statsBreakdown.innerHTML = ''; const finalCharacterAbilities = characterAbilities[finalResultCharacter]; const MAX_ABILITY_SCORE = 3; finalCharacterAbilities.forEach(ability => { const score = abilityScores[ability]; const scoreDisplay = score.toFixed(1); const percentage = (Math.min(score, MAX_ABILITY_SCORE) / MAX_ABILITY_SCORE) * 100; const statItem = document.createElement('div'); statItem.classList.add('stat-item'); statItem.innerHTML = ` <div class="stat-role-name">${ability}</div> <div class="stat-rating"> <div class="stars-wrapper"> <div class="stars-inner" style="width: ${percentage}%;"></div> </div> <div class="stat-score">(${scoreDisplay})</div> </div> `; statsBreakdown.appendChild(statItem); }); showScreen('result'); }
    async function handleFormSubmit(event) { event.preventDefault(); const submitBtn = document.getElementById('submit-form-btn'); const formStatus = document.getElementById('form-status'); submitBtn.disabled = true; formStatus.textContent = '正在送出...'; const selectedAge = document.querySelector('input[name="age"]:checked'); const formData = { nickname: document.getElementById('nickname').value, ageRange: selectedAge ? selectedAge.value : '', email: document.getElementById('email').value, igAccount: document.getElementById('ig-account').value, resultCharacter: finalResultCharacter }; try { await fetch(GAS_WEB_APP_URL, { method: 'POST', mode: 'no-cors', cache: 'no-cache', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData), redirect: 'follow' }); showScreen('success'); drawForm.reset(); } catch (error) { formStatus.textContent = `提交失敗，請檢查網路連線或稍後再試。`; } finally { submitBtn.disabled = false; } }

    // --- 事件監聽 ---
    startBtn.addEventListener('click', startQuiz);
    restartBtn.addEventListener('click', () => showScreen('intro'));
    drawBtn.addEventListener('click', () => { showScreen('form'); });
    drawForm.addEventListener('submit', handleFormSubmit);
    restartBtnSuccess.addEventListener('click', () => showScreen('intro'));
});