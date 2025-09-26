document.addEventListener('DOMContentLoaded', () => {

    // --- 在這裡貼上你最新的 GAS 網址 ---
    const GAS_WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwERdiY3XP43v3T5T-l-qT6fIdIq6hzm-w17LfnRxrErbcIihMMx5xiu4p-yWkLws79aw/exec';

    // --- 資料區 ---
    const characterAbilities = {
        "醋咪": ["行動力", "探索力", "社交力"],
        "Bu-Bu": ["守護力", "療癒力", "細心度"],
        "匠郎": ["專注力", "創造力", "執行力"],
        "銅仔": ["可靠度", "沉著性", "安定感"],
        "旺望": ["故事力", "靈感力", "洞察力"]
    };

    // ===== 新增：各能力值的理論最高分 (用於等比例計算) =====
    const abilityMaxScores = {
        "行動力": 9, "探索力": 11, "社交力": 9,
        "守護力": 6, "療癒力": 6, "細心度": 4,
        "專注力": 6, "創造力": 6, "執行力": 7,
        "可靠度": 6, "沉著性": 6, "安定感": 5,
        "故事力": 6, "靈感力": 5, "洞察力": 7
    };
    
    const questions = [
        { question: "旅行的前一晚，你攤開城市探索地圖和小本本，腦海裡浮現這趟旅行的樣子。此時，你最想先準備的是？", image: "images/q1.png", options: [ { text: "A. 把行程表排得清清楚楚，每一步都要安排得妥當。", scores: [{ability: "執行力", value: 1}, {ability: "沉著性", value: 1}] }, { text: "B. 整理一份必吃清單，想到美食就充滿期待。", scores: [{ability: "行動力", value: 1}, {ability: "AA", value: 1}] }, { text: "C. 想像會遇到什麼有趣的人，期待新的相遇。", scores: [{ability: "守護力", value: 1}, {ability: "故事力", value: 1}] } ] },
        { question: "打開行李箱，準備把必需品放進去。有一樣東西，是你再忙也不會忘記帶上的：", image: "images/q2.png", options: [ { text: "A. 相機或筆記本，用來捕捉細節與靈感。", scores: [{ability: "靈感力", value: 1}, {ability: "創造力", value: 1}] }, { text: "B. 零食與水，補足能量走得更遠。", scores: [{ability: "可靠度", value: 1}, {ability: "BB", value: 1}] }, { text: "C. 小禮物或伴手禮，準備在旅途中送給新朋友。", scores: [{ability: "療癒力", value: 1}, {ability: "探索力", value: 2}] } ] },
        { question: "清晨的空氣撲面而來，旅行正式開始。此刻，你心裡最接近的感受是？", image: "images/q3.png", options: [ { text: "A. 心跳加快，恨不得馬上衝出去探索。", scores: [{ability: "行動力", value: 1}, {ability: "CC", value: 1}] }, { text: "B. 平穩安定，默默觀察，隨遇而安。", scores: [{ability: "沉著性", value: 2}, {ability: "守護力", value: 1}] }, { text: "C. 想著要把沿途的故事風景，要和誰一起分享才更有意思。", scores: [{ability: "故事力", value: 1}, {ability: "創造力", value: 1}] } ] },
        { question: "經過漫長車程終於抵達目的地，推著行李走出車站，眼前是棋盤格式的街道，熙來人往的畫面與交談聲熱鬧不絕於耳。此刻，你腦海中冒出的第一個念頭是？", image: "images/q4.png", options: [ { text: "A. 哪裡有吃的！我先去填飽肚子。", scores: [{ability: "探索力", value: 1}, {ability: "DD", value: 1}] }, { text: "B. 慢慢走，邊觀察街景和人群。", scores: [{ability: "專注力", value: 1}, {ability: "EE", value: 1}] }, { text: "C. 找個路人聊聊，問問這裡有什麼必去的地方。", scores: [{ability: "細心度", value: 1}, {ability: "故事力", value: 1}] } ] },
        { question: "拖著行李走過站前廣場，街區的氣味與聲音逐漸圍繞著你。忽然，你停下腳步，因為眼前有個畫面深深吸引了你——", image: "images/q5.png", options: [ { text: "A. 香氣四溢的攤位，熱氣撲面讓人食指大動。", scores: [{ability: "行動力", value: 1}, {ability: "FF", value: 1}] }, { text: "B. 老屋牆面上的斑駁痕跡，像在低語著時間的故事。", scores: [{ability: "執行力", value: 1}, {ability: "靈感力", value: 1}] }, { text: "C. 人群的笑聲和交談，氛圍讓你忍不住微笑。", scores: [{ability: "療癒力", value: 1}, {ability: "GG", value: 1}] } ] },
        { question: "走著走著，你被一棟老屋半掩的木門吸引，推開門後走進一間小店。裡頭陳列著舊書、木椅與茶具，空氣裡瀰漫著木頭和淡淡茶香。這一刻，你會先做什麼？", image: "images/q6.png", options: [ { text: "A. 馬上問老闆：這裡有什麼故事或特色？", scores: [{ability: "故事力", value: 1}, {ability: "HH", value: 1}] }, { text: "B. 彎下身仔細觀察桌椅與工藝品，不想錯過任何細節。", scores: [{ability: "專注力", value: 1}, {ability: "II", value: 1}] }, { text: "C. 發現有件陳列的小物掉落，你順手將它放回原位。", scores: [{ability: "細心度", value: 2}, {ability: "可靠度", value: 1}] } ] },
        { question: "離開小店繼續探索，前方一群背著背包的旅人正圍在手機地圖前爭論著方向。你停下腳步，心裡盤算著要不要加入他們", image: "images/q7.png", options: [ { text: "A. 立刻上前，自然地和大家聊起來，順勢加入行程。", scores: [{ability: "社交力", value: 2}, {ability: "JJ", value: 1}] }, { text: "B. 在一旁觀察，看看他們的互動與氣氛，再決定是否參與。", scores: [{ability: "沉著性", value: 1}, {ability: "KK", value: 1}] }, { text: "C. 提出一個有趣的點子，讓氣氛更輕鬆活絡。", scores: [{ability: "靈感力", value: 1}, {ability: "創造力", value: 1}] } ] },
        { question: "後來你和大家一路走到假日市集現場，攤位一個接一個，氣味與聲音熱鬧交織。就在這裡，你不自覺停下了腳步。", image: "images/q8.png", options: [ { text: "A. 被食物攤位的香氣吸引，想立刻嚐一口。", scores: [{ability: "行動力", value: 1}, {ability: "LL", value: 1}] }, { text: "B. 注視著工藝攤上的手作小物，細細端詳其中的巧思。", scores: [{ability: "執行力", value: 1}, {ability: "MM", value: 1}] }, { text: "C. 停在一個有人講故事的角落，聽著人群笑聲聚集。", scores: [{ability: "守護力", value: 1}, {ability: "NN", value: 1}] } ] },
        { question: "在市集的角落，你和一位當地人聊了起來。閒聊中，他笑著問你：「到目前為止，這趟旅程你最喜歡的是什麼？」", image: "images/q9.png", options: [ { text: "A. 玩得盡興、吃到開心，留下最直接的快樂。", scores: [{ability: "行動力", value: 1}, {ability: "AB", value: 1}] }, { text: "B. 認識新朋友，留下溫暖的人際回憶。", scores: [{ability: "療癒力", value: 1}, {ability: "AC", value: 1}] }, { text: "C. 發現隱藏在巷弄裡的細節與故事。", scores: [{ability: "洞察力", value: 2}, {ability: "專注力", value: 1}] } ] },
        { question: "聊著聊著，天空突然烏雲密布，沒多久便下起了大雨。人群一陣騷動，你抬頭看著雨滴落在柏油路上，心裡浮現一個念頭...", image: "images/q10.png", options: [ { text: "A. 幫忙攤位的老闆收拾容易被淋濕的東西。", scores: [{ability: "守護力", value: 1},{ability: "可靠度", value: 1}] }, { text: "B. 不慌不忙地撐開雨傘，邊走邊欣賞小鎮在雨中的樣貌。", scores: [{ability: "洞察力", value: 1}, {ability: "AD", value: 1}] }, { text: "C. 靈機一動，提醒大家把攤位的布簾放下來，瞬間就多了好幾個避雨的角落。", scores: [{ability: "創造力", value: 1}, {ability: "AF", value: 1}] } ] },
        { question: "雨勢漸漸停了下來，街道還殘留著水窪與潮濕的氣息。你走進一條小巷，看見一位旅人正四處張望，臉上帶著迷茫。他抬頭看向你，彷彿在尋求幫助...", image: "images/q11.png", options: [ { text: "A. 主動走上前，帶他到主要街道，確認他能找到方向。", scores: [{ability: "可靠度", value: 1}, {ability: "AG", value: 1}] }, { text: "B. 陪他慢慢走，邊閒聊邊幫他放鬆心情，一起找到出口。", scores: [{ability: "療癒力", value: 1}, {ability: "BA", value: 1}] }, { text: "C. 拿出筆和紙，畫一張簡單的地圖，或在牆邊做個小記號。", scores: [{ability: "執行力", value: 1}, {ability: "靈感力", value: 1}] } ] },
        { question: "天色漸暗，街燈一盞盞亮起，你開始尋找今晚的落腳處，你會選擇：", image: "images/q12.png", options: [ { text: "A. 熱鬧的旅館，大廳人聲鼎沸，像小鎮的另一個縮影。", scores: [{ability: "社交力", value: 1}, {ability: "BC", value: 1}] }, { text: "B. 靠近巷弄深處的民宿，安靜整潔，讓人能好好沉澱。", scores: [{ability: "安定感", value: 2}, {ability: "BD", value: 1}] }, { text: "C. 一間帶有特色裝飾的小旅店，櫥窗透出溫暖的光芒。", scores: [{ability: "靈感力", value: 1}, {ability: "專注力", value: 1}] } ] },
        { question: "安置好行李後，住宿老闆熱情地招呼你：「今晚有個小活動，要不要一起來？」你猶豫片刻，最後決定?", image: "images/q13.png", options: [ { text: "A. 上台參加比賽或表演，親身體驗鎮上的熱鬧", scores: [{ability: "行動力", value: 1},{ability: "BE", value: 1}] }, { text: "B. 坐在人群中，和左右的人閒聊，結識幾位新朋友。", scores: [{ability: "守護力", value: 1}, {ability: "BF", value: 1}] }, { text: "C. 默默幫忙老闆，確保活動順利進行。", scores: [{ability: "可靠度", value: 2}, {ability: "執行力", value: 1}] } ] },
        { question: "第二天清晨，你準備啟程離開，一邊想著要怎麼把這趟旅程留在記憶裡，或帶給在乎的人一些紀念。", image: "images/q14.png", options: [ { text: "A. 買一份當地特產或伴手禮，帶回去和朋友分享。", scores: [{ability: "探索力", value: 1}, {ability: "可靠度", value: 1}] }, { text: "B. 用照片或文字，把這段旅程的風景與心情記錄下來。", scores: [{ability: "故事力", value: 1}, {ability: "CA", value: 1}] }, { text: "C. 選一件手作工藝品，或寫一張明信片，作為獨特的紀念。", scores: [{ability: "創造力", value: 1}, {ability: "細心度", value: 1}] } ] },
        { question: "當火車緩緩駛離，回想這趟旅程，心裡浮現一個最深的體會是：", image: "images/q15.png", options: [ { text: "A. 勇敢行動，總能遇見意想不到的驚喜。", scores: [{ability: "行動力", value: 1}, {ability: "CB", value: 1}] }, { text: "B. 陪伴與照顧，讓每一段旅程都更溫暖。", scores: [{ability: "療癒力", value: 1}, {ability: "安定感", value: 2}] }, { text: "C. 細心觀察，才能創造出新的價值與故事。", scores: [{ability: "專注力", value: 1}, {ability: "洞察力", value: 1}] } ] },
    ];
    
    const results = {
        "醋咪": {
            image: "images/hu.png",
            subtypes: {
                "行動力": { title: "衝鋒在前的領路人", description: "你是天生的行動派，總是勇敢地邁出第一步。對你來說，等待不是選項，因為行動才會帶來驚喜。你的腳步也常常成為別人的方向標。", revelation: "勇敢跨出步伐，你的行動會帶來新的故事，也成為他人追隨的力量。" },
                "社交力": { title: "人群中的能量源", description: "你自帶光芒，能快速和人打成一片。你的熱情能把陌生人變成夥伴，讓旅程不只是路途，而是充滿互動的盛會。", revelation: "善用你的感染力，把能量分享出去，會讓旅程更熱鬧、更難忘。" },
                "探索力": { title: "追尋未知的冒險者", description: "你好奇心滿滿，總想看看轉角有什麼新風景。你相信旅程最迷人的部分，不是終點，而是發現那些沒有人注意的小細節。", revelation: "相信直覺去探索，你的腳步會讓世界變得更廣闊。" }
            }
        },
        "Bu-Bu": {
            image: "images/bu.bu.png",
            subtypes: {
                "守護力": { title: "安心感的溫柔守護者", description: "你總是第一時間站出來，成為他人的依靠。你的存在讓人覺得安全，就像旅程裡的一盞燈，無論多陌生的地方，因為有你而不再害怕。", revelation: "勇於守護，但別忘了你自己也需要被照顧。" },
                "療癒力": { title: "溫柔氛圍的療癒者", description: "你擅長用細膩的感受和言語安撫人心。你的力量不在於喧鬧，而是靜靜存在，讓身邊的人感受到溫暖與放鬆。", revelation: "別忘了照顧自己，你的溫柔也值得被守護。" },
                "細心度": { title: "細節中的溫柔觀察者", description: "你眼光敏銳，總能注意到別人忽略的角落。你的細心讓故事更完整，也讓人感受到被理解與被重視。", revelation: "繼續珍惜那些細節，它們是你與世界建立連結的方式。" }
            }
        },
        "匠郎": {
            image: "images/jn.png",
            subtypes: {
                "專注力": { title: "堅持到底的沉靜工匠", description: "你能長時間專注在一件事上，從不因為瑣碎而放棄。對你而言，旅行和創作一樣，都需要耐心與堅持，才能在過程裡看到真正的價值。", revelation: "保持你的專注，但也記得偶爾抬頭，讓風景提醒你前進的理由。" },
                "創造力": { title: "把靈感化為作品的人", description: "你總能從生活裡找到靈感，並把它轉化為獨特的創作。旅行於你而言，是靈感的泉源，每個地方都可能變成下一件作品的起點。", revelation: "不要害怕嘗試，把腦海中的想法落實下來，它會成為旅程的印記。" },
                "執行力": { title: "讓想法落地的實踐者", description: "你不只停留在構想，更擅長把計畫化為行動。你相信真正的價值來自「完成」，因此每一個小小的步驟，都是通往成果的重要一環。", revelation: "相信自己的節奏，堅定地把事情做完，這份實踐會帶來安心與成就。" }
            }
        },
        "銅仔": {
            image: "images/tn.png",
            subtypes: {
                "可靠度": { title: "最值得依靠的夥伴", description: "你重視承諾，說到就做到。無論在旅程或生活中，你都是那個能讓人放心託付的人。有你在，大家會覺得即使遇上突發狀況，也不會孤單。", revelation: "別忘了，你的可靠不只給別人，也能成為自己最大的支持。" },
                "沉著性": { title: "風浪中的鎮定錨點", description: "你遇到狀況總是冷靜沉著，不會被慌亂帶走。你的沉穩像是一股力量，能讓人安心地跟隨，也能在複雜局面中找到最清晰的解方。", revelation: "保持冷靜，但也允許自己偶爾放鬆，感受單純的快樂。" },
                "安定感": { title: "人心的避風港", description: "你自帶一種安定氛圍，讓人一靠近就能放下防備。你不是最喧鬧的存在，卻是能讓人願意停留的原因。對旅程來說，你是一種安心的重力。", revelation: "繼續成為那份安定，但也要記得給自己一些新的流動與變化。" }
            }
        },
        "旺望": {
            image: "images/wn.png",
            subtypes: {
                "故事力": { title: "記憶的收藏家", description: "你喜歡蒐集人和地方的故事，把旅程裡的點滴化為回憶。對你而言，每一次旅行都像一本活的日記，而你正是書寫它的人。", revelation: "用你的眼睛和心，把故事收下，未來它們會成為珍貴的寶藏。" },
                "靈感力": { title: "創意的轉譯者", description: "你能將日常細節轉化成靈感，無論是文字、影像還是作品。旅行對你來說，不只是走過，而是吸收養分，為下一次創造做準備。", revelation: "勇敢表達你的靈感，它能點亮自己，也啟發他人。" },
                "洞察力": { title: "細節的觀察者", description: "你敏銳地捕捉環境中的細節，總能發現別人忽略的角落。你知道真正的美往往藏在不經意的瞬間，而你正是發現它的人。", revelation: "相信你的直覺，繼續用洞察的眼光尋找世界的細微之美。" }
            }
        }
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
    
    function calculateAndShowResult() {
        const characterTotals = {};
        for (const character in characterAbilities) {
            let total = 0;
            characterAbilities[character].forEach(ability => {
                total += abilityScores[ability];
            });
            characterTotals[character] = total;
        }

        finalResultCharacter = Object.keys(characterTotals).reduce((a, b) => characterTotals[a] > characterTotals[b] ? a : b);
        
        const finalCharacterAbilities = characterAbilities[finalResultCharacter];
        let highestAbility = '';
        let maxScore = -1;
        finalCharacterAbilities.forEach(ability => {
            if (abilityScores[ability] > maxScore) {
                maxScore = abilityScores[ability];
                highestAbility = ability;
            }
        });

        const prefix = highestAbility.substring(0, 2) + "派";
        const newRoleDisplay = `${prefix} ${finalResultCharacter}`;
        resultRole.textContent = newRoleDisplay;
        
        const characterData = results[finalResultCharacter];
        let displayData = {};

        if (characterData.subtypes && characterData.subtypes[highestAbility]) {
            displayData = characterData.subtypes[highestAbility];
            resultImage.src = characterData.image;
        } else {
            displayData = characterData;
            resultImage.src = characterData.image;
        }

        resultTitle.textContent = `— ${displayData.title} —`;
        resultDescription.textContent = displayData.description;
        resultRevelation.textContent = displayData.revelation;
        
        const statsBreakdown = document.getElementById('stats-breakdown');
        statsBreakdown.innerHTML = '';
        
        // ===== VVV 修改星級計算邏輯 VVV =====
        finalCharacterAbilities.forEach(ability => {
            const score = abilityScores[ability];
            const scoreDisplay = score.toFixed(1);
            
            // 從 abilityMaxScores 物件中，取得這個能力的理論最高分
            const maxPossibleScore = abilityMaxScores[ability] || 1; // 預設為1避免除以0

            // 進行等比例計算
            const percentage = (score / maxPossibleScore) * 100;
            const cappedPercentage = Math.min(percentage, 100); // 確保不超過100%

            const statItem = document.createElement('div');
            statItem.classList.add('stat-item');
            statItem.innerHTML = `
                <div class="stat-role-name">${ability}</div>
                <div class="stat-rating">
                    <div class="stars-wrapper">
                        <div class="stars-inner" style="width: ${cappedPercentage}%;"></div>
                    </div>
                    <div class="stat-score">(${scoreDisplay})</div>
                </div>
            `;
            statsBreakdown.appendChild(statItem);
        });

        showScreen('result');
    }

    async function handleFormSubmit(event) { event.preventDefault(); const submitBtn = document.getElementById('submit-form-btn'); const formStatus = document.getElementById('form-status'); submitBtn.disabled = true; formStatus.textContent = '正在送出...'; const selectedAge = document.querySelector('input[name="age"]:checked'); const formData = { nickname: document.getElementById('nickname').value, ageRange: selectedAge ? selectedAge.value : '', email: document.getElementById('email').value, igAccount: document.getElementById('ig-account').value, resultCharacter: resultRole.textContent }; try { await fetch(GAS_WEB_APP_URL, { method: 'POST', mode: 'no-cors', cache: 'no-cache', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(formData), redirect: 'follow' }); showScreen('success'); drawForm.reset(); } catch (error) { formStatus.textContent = `提交失敗，請檢查網路連線或稍後再試。`; } finally { submitBtn.disabled = false; } }

    // --- 事件監聽 ---
    startBtn.addEventListener('click', startQuiz);
    restartBtn.addEventListener('click', () => showScreen('intro'));
    drawBtn.addEventListener('click', () => { showScreen('form'); });
    drawForm.addEventListener('submit', handleFormSubmit);
    restartBtnSuccess.addEventListener('click', () => showScreen('intro'));
});