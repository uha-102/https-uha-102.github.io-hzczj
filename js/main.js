// 1. 答题校验通用函数
function checkQuiz(quizId, correctAns) {
    const options = document.querySelectorAll(`#${quizId} .quiz-option`);
    const result = document.getElementById("quiz-result");
    if (!options.length || !result) return;
    options.forEach(option => {
        option.addEventListener("click", function() {
            options.forEach(opt => opt.classList.remove("correct", "wrong"));
            if (this.dataset.ans === correctAns) {
                this.classList.add("correct");
                result.textContent = "🎉 太棒啦，答对了！";
                result.style.color = "#28a745";
                showSeal("棒", result);
                // 集卡闯关：答对发勋章
                if (location.pathname.indexOf("page2") !== -1) awardBadge("qiyuan");
                if (location.pathname.indexOf("page4") !== -1) awardBadge("zaozi");
            } else {
                this.classList.add("wrong");
                result.textContent = "😜 再想想哦，答案不对~";
                result.style.color = "#dc3545";
            }
        });
    });
}

// 2. 字谜答案显示/隐藏 - 仅修改事件绑定方式（不影响其他页面）
function showRiddleAnswer(riddleId, answerId) {
    // 强制重新获取元素，避免缓存失效
    const riddleContainer = document.getElementById(riddleId);
    const answerElement = document.getElementById(answerId);

    if (!riddleContainer || !answerElement) {
        console.warn("元素ID不存在：", riddleId, answerId);
        return;
    }

    // 初始化隐藏答案（保持原有逻辑）
    answerElement.style.display = "none";

    // 核心修改：用onclick替换addEventListener，避免多次绑定冲突
    // 仅影响字谜类页面（页面6），不影响答题类页面（2、4）
    riddleContainer.onclick = function() {
        if (answerElement.style.display === "block") {
            answerElement.style.display = "none";
        } else {
            answerElement.style.display = "block";
        }
    };
}

// 3. 留言板提交功能
function submitMessage() {
    const nameInput = document.getElementById("name");
    const charInput = document.getElementById("favorite-char");
    const reasonInput = document.getElementById("reason");
    const messageList = document.getElementById("message-list");
    const submitBtn = document.getElementById("submit-btn");
    if (!nameInput || !charInput || !reasonInput || !messageList || !submitBtn) return;

    submitBtn.addEventListener("click", function() {
        const name = nameInput.value.trim();
        const char = charInput.value.trim();
        const reason = reasonInput.value.trim();

        if (!name || !char || !reason) {
            alert("请填写完整信息哦！");
            return;
        }
        if (char.length > 1) {
            alert("只能输入一个汉字哦！");
            return;
        }
        if (reason.length > 50) {
            alert("理由不能超过50字哦！");
            return;
        }

        const li = document.createElement("li");
        li.innerHTML = `<strong>${name}</strong>：最喜欢的汉字是【${char}】，理由：${reason}`;
        messageList.appendChild(li);

        nameInput.value = "";
        charInput.value = "";
        reasonInput.value = "";

        // 集卡闯关：提交留言发勋章
        if (typeof awardBadge === "function") awardBadge("chuancheng");
    });
}

// 4. 通用答题刷新函数（保持原有逻辑，不修改）
function initQuizRefresh(pageQuizBank, config) {
    const { containerId, questionId, imgId, answerId, resultId } = config;
    const container = document.getElementById(containerId);
    const questionElem = document.getElementById(questionId);
    const imgElem = imgId ? document.getElementById(imgId) : null;
    const answerElem = answerId ? document.getElementById(answerId) : null;
    const resultElem = resultId ? document.getElementById(resultId) : null;
    const refreshBtn = document.getElementById("refresh-quiz");

    if (!container || !questionElem || !refreshBtn) return;

    // 随机渲染题目
    function renderRandomQuiz() {
        const randomIndex = Math.floor(Math.random() * pageQuizBank.length);
        const selected = pageQuizBank[randomIndex];

        // 清空旧内容（选项/答案）
        container.querySelectorAll(".quiz-option").forEach(opt => opt.remove());
        if (answerElem) answerElem.style.display = "none";
        if (resultElem) resultElem.textContent = "";

        // 渲染题目
        questionElem.textContent = selected.question;

        // 渲染图片（如有）
        if (imgElem && selected.imgSrc) {
            imgElem.src = selected.imgSrc;
            imgElem.style.display = "block";
        } else if (imgElem) {
            imgElem.style.display = "none";
        }

        // 渲染选项（答题类题目）
        if (selected.options) {
            selected.options.forEach(option => {
                const optElem = document.createElement("div");
                optElem.className = "quiz-option";
                optElem.dataset.ans = option.ans;
                optElem.textContent = option.text;
                container.appendChild(optElem);
            });
            // 重新绑定答题校验
            checkQuiz(containerId, "yes");
        }

        // 渲染字谜答案（字谜类题目）
        if (selected.answer && answerElem) {
            answerElem.textContent = `答案：${selected.answer}`;
            // 重新绑定显示答案事件
            showRiddleAnswer(containerId, answerId);
        }
    }

    // 页面加载时渲染第一题
    window.addEventListener("DOMContentLoaded", renderRandomQuiz);

    // 绑定刷新按钮事件
    refreshBtn.addEventListener("click", renderRandomQuiz);
}

// ============ ✅ 5. 甲骨文汉字连连看 完整游戏代码 (全部抽离过来的内容) ============
// 配置：甲骨文图片路径 + 对应汉字
const cardConfig = [
    { type: 'img', path: 'img/page3汉字成长史/林.jpg', key: '林' },
    { type: 'img', path: 'img/page3汉字成长史/木.jpg', key: '木' },
    { type: 'img', path: 'img/page3汉字成长史/目.jpg', key: '目' },
    { type: 'img', path: 'img/page3汉字成长史/日.jpg', key: '日' },
    { type: 'img', path: 'img/page3汉字成长史/山.jpg', key: '山' },
    { type: 'img', path: 'img/page3汉字成长史/水.jpg', key: '水' },
    { type: 'img', path: 'img/page3汉字成长史/心.jpg', key: '心' },
    { type: 'img', path: 'img/page3汉字成长史/月.jpg', key: '月' },
    { type: 'char', text: '林', key: '林' },
    { type: 'char', text: '木', key: '木' },
    { type: 'char', text: '目', key: '目' },
    { type: 'char', text: '日', key: '日' },
    { type: 'char', text: '山', key: '山' },
    { type: 'char', text: '水', key: '水' },
    { type: 'char', text: '心', key: '心' },
    { type: 'char', text: '月', key: '月' }
];

let gameCards = [];
let firstCard = null;
let secondCard = null;
let lockBoard = false;
let matchedPairs = 0;

// 初始化连连看游戏（仅在 page3 存在游戏容器时执行）
function initGame() {
    const gameContainer = document.getElementById("gameContainer");
    if (!gameContainer) return;

    gameCards = [...cardConfig].sort(() => Math.random() - 0.5);
    gameContainer.innerHTML = "";
    matchedPairs = 0;
    document.getElementById("result").textContent = "";
    document.getElementById("restart").style.display = "none";

    gameCards.forEach((config, index) => {
        const card = document.createElement("div");
        card.classList.add("card");
        card.dataset.key = config.key;
        card.dataset.index = index;

        if (config.type === 'img') {
            const img = document.createElement("img");
            img.src = config.path;
            img.alt = `古字体-${config.key}`;
            img.onerror = function() {
                this.parentNode.innerHTML = `<div class="char-text">${config.key}</div>`;
            };
            card.appendChild(img);
        } else {
            const charDiv = document.createElement("div");
            charDiv.className = "char-text";
            charDiv.textContent = config.text;
            card.appendChild(charDiv);
        }
        card.addEventListener("click", selectCard);
        gameContainer.appendChild(card);
    });
}

// 选择卡片逻辑
function selectCard() {
    if (lockBoard) return;
    const currentCard = this;
    if (currentCard.classList.contains("matched") || currentCard === firstCard) return;
    currentCard.classList.add("selected");

    if (!firstCard) {
        firstCard = currentCard;
        return;
    }
    secondCard = currentCard;
    checkForMatch();
}

// 检查匹配
function checkForMatch() {
    const isMatch = firstCard.dataset.key === secondCard.dataset.key;
    isMatch ? disableCards() : unselectCards();
}

// 匹配成功处理
function disableCards() {
    firstCard.classList.add("matched");
    secondCard.classList.add("matched");
    firstCard.classList.remove("selected");
    secondCard.classList.remove("selected");
    matchedPairs++;
    resetBoard();

    if (matchedPairs === cardConfig.length / 2) {
        const resultEl = document.getElementById("result");
        resultEl.textContent = "恭喜你，全部配对成功！🎉";
        document.getElementById("restart").style.display = "block";
        showSeal("通关", resultEl);
        awardBadge("yanbian");
    }
}

// 匹配失败处理
function unselectCards() {
    lockBoard = true;
    setTimeout(() => {
        firstCard.classList.remove("selected");
        secondCard.classList.remove("selected");
        resetBoard();
    }, 500);
}

// 重置卡片状态
function resetBoard() {
    [firstCard, secondCard, lockBoard] = [null, null, false];
}

// ============ 页面加载初始化 + 绑定事件 ============
// 页面加载完成后初始化连连看游戏
window.addEventListener("load", initGame);
// 重新开始按钮绑定事件
document.getElementById("restart")?.addEventListener("click", initGame);

// 谐音猜谜题库：图片路径、谜底、谐音解析
const puzzleBank = [
    {
        img: "./img/page6趣味汉字乐园/谐音小游戏/陆游.png",
        answer: "路由器",
        desc: "陆游（路由）气（器）"
    },
    {
        img: "./img/page6趣味汉字乐园/谐音小游戏/瓶子.png",
        answer: "躺平",
        desc: "躺瓶（平）"
    },
    {
        img: "./img/page6趣味汉字乐园/谐音小游戏/马.png",
        answer: "瘦死的骆驼比马大",
        desc: "寿司（瘦死）的骆驼比马大"
    },
    {
        img: "./img/page6趣味汉字乐园/谐音小游戏/鸡.png",
        answer: "打火机",
        desc: "打火鸡（谐音机）"
    },
    {
        img: "./img/page6趣味汉字乐园/谐音小游戏/好酒.png",
        answer: "好久不见",
        desc: "好酒（谐音好久）不见"
    },
    {
        img: "./img/page6趣味汉字乐园/谐音小游戏/狼.png",
        answer: "蟑螂",
        desc: "脏（zang)谐音蟑（zhang),狼谐音螂"
    },
    {
        img: "./img/page6趣味汉字乐园/谐音小游戏/枸杞.png",
        answer: "枸杞",
        desc: "狗（谐音枸）起（谐音杞）"
    },
];

// 获取DOM元素（仅针对游戏模块）
const imgContainer = document.getElementById("img-container");
const answerInput = document.getElementById("answer-input");
const submitBtn = document.getElementById("submit-btn");
const tipText = document.getElementById("tip-text");
const answerBtn = document.getElementById("answer-btn");
const refreshBtn = document.getElementById("refresh-btn");

// 谐音猜谜游戏元素只在 page6 存在，其他页面不绑定，避免脚本报错
const hasPuzzleGame = imgContainer && answerInput && submitBtn && tipText && answerBtn && refreshBtn;

let currentPuzzle = puzzleBank[0]; // 默认显示第一题

// 初始化游戏题目
function initPuzzle(puzzle) {
    if (!hasPuzzleGame) return;
    const img = imgContainer.querySelector("img");
    img.src = puzzle.img;
    img.alt = `猜谜图片：${puzzle.desc}`;
    answerInput.value = "";
    tipText.textContent = "";
    tipText.style.color = ""; // 重置提示文字颜色
    answerBtn.style.display = "none";
}

if (hasPuzzleGame) {
    // 提交答案判断逻辑
    submitBtn.addEventListener("click", () => {
        const userAnswer = answerInput.value.trim();
        if (!userAnswer) {
            tipText.textContent = "请输入谜底后再提交！";
            tipText.style.color = "#f44336";
            return;
        }

        if (userAnswer === currentPuzzle.answer) {
            tipText.textContent = `回答正确！解析：${currentPuzzle.desc}`;
            tipText.style.color = "#4caf50";
            answerBtn.style.display = "none";
        } else {
            tipText.textContent = "回答错误，再试试吧！";
            tipText.style.color = "#f44336";
            answerBtn.style.display = "block";
        }
    });

    // 查看答案按钮逻辑
    answerBtn.addEventListener("click", () => {
        tipText.textContent = `正确答案：${currentPuzzle.answer}，解析：${currentPuzzle.desc}`;
        tipText.style.color = "#f44336";
    });

    // 刷新题目逻辑
    refreshBtn.addEventListener("click", () => {
        const randomIndex = Math.floor(Math.random() * puzzleBank.length);
        currentPuzzle = puzzleBank[randomIndex];
        initPuzzle(currentPuzzle);
    });

    // 页面加载初始化
    window.addEventListener("load", () => {
        initPuzzle(currentPuzzle);
    });
}

// ============ 汉字成长史 - 播报功能 ============
// 全局存储当前语音实例，用于中断播放
let currentSpeech = null;

/**
 * 语音播报函数
 * @param {string} textId - 要播报的文本容器ID
 */
function playText(textId) {
    // 获取目标容器的所有文本内容（标题+正文）
    const textContainer = document.getElementById(textId);
    if (!textContainer) return;

    // 提取纯文本（合并h3标题和p标签内容）
    const title = textContainer.querySelector('h3').textContent.trim();
    const content = textContainer.querySelector('p').textContent.trim();
    const fullText = `${title}。${content}`;

    // 中断当前正在播放的语音（避免多段语音重叠）
    if (currentSpeech && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel(currentSpeech);
    }

    // 创建语音实例
    const speech = new SpeechSynthesisUtterance(fullText);
    // 配置语音参数（中文、语速、音量）
    speech.lang = 'zh-CN'; // 中文语音
    speech.rate = 1; // 语速（0.1-10，默认1）
    speech.volume = 1; // 音量（0-1，默认1）
    speech.pitch = 1; // 音调（0-2，默认1）

    // 存储当前语音实例
    currentSpeech = speech;

    // 开始播报
    window.speechSynthesis.speak(speech);
}

// 兼容性处理：若浏览器不支持SpeechSynthesis，隐藏所有播报按钮
if (!window.speechSynthesis) {
    document.querySelectorAll('.play-btn').forEach(btn => {
        btn.style.display = 'none';
    });
}

// 注：page6 形近字轮播由页面内联脚本实现，这里不再重复绑定，避免一次点击翻两页


// ============ 仪式感细节：印章动画 + 滚动浮现 ============
/**
 * 在指定元素内盖一枚印章动画
 * @param {string} text - 印章文字（如"棒""通关"）
 * @param {HTMLElement} anchor - 印章插入的容器
 */
function showSeal(text, anchor) {
    if (!anchor) return;
    const old = anchor.querySelector(".seal-stamp");
    if (old) old.remove();
    const seal = document.createElement("div");
    seal.className = "seal-stamp";
    seal.textContent = text;
    anchor.appendChild(seal);
    // 触发盖章动画
    requestAnimationFrame(() => seal.classList.add("stamped"));
    // 停留片刻后淡出移除
    setTimeout(() => {
        seal.classList.add("seal-fade");
        setTimeout(() => seal.remove(), 600);
    }, 1800);
}

// 滚动浮现动画：内容滚动到可视区域时淡入上移
(function initScrollReveal() {
    const items = document.querySelectorAll(
        ".section-title, .text-box, .img-box, .timeline-item, .interactive-box, .calligraphy-item, .timemachine"
    );
    if (!items.length || !("IntersectionObserver" in window)) return;
    document.body.classList.add("reveal-enabled");
    items.forEach(el => el.classList.add("reveal-item"));
    const io = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add("revealed");
                io.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12 });
    items.forEach(el => io.observe(el));
})();


// ============ 集卡闯关：勋章系统 ============
const BADGE_DEFS = [
    { id: "qiyuan",     icon: "🦴", name: "起源勋章", desc: "汉字的由来 · 答对一题" },
    { id: "yanbian",    icon: "⏳", name: "演变勋章", desc: "汉字连连看 · 全部配对" },
    { id: "zaozi",      icon: "🔨", name: "造字勋章", desc: "造字法闯关 · 答对一题" },
    { id: "leyuan",     icon: "🧩", name: "乐园勋章", desc: "汉字变变变 · 组合成功" },
    { id: "yinshua",    icon: "🖨️", name: "印刷勋章", desc: "活字印刷 · 印出诗句" },
    { id: "chuancheng", icon: "✍️", name: "传承勋章", desc: "传承汉字文化 · 提交留言" }
];

function getBadges() {
    try { return JSON.parse(localStorage.getItem("hz_badges") || "[]"); }
    catch (e) { return []; }
}

function awardBadge(id) {
    const def = BADGE_DEFS.find(b => b.id === id);
    if (!def) return;
    const owned = getBadges();
    if (owned.includes(id)) return;
    owned.push(id);
    try { localStorage.setItem("hz_badges", JSON.stringify(owned)); } catch (e) {}
    showBadgeToast(`🏅 获得「${def.name}」！已收集 ${owned.length}/${BADGE_DEFS.length}`);
}

function showBadgeToast(text) {
    const old = document.querySelector(".badge-toast");
    if (old) old.remove();
    const toast = document.createElement("div");
    toast.className = "badge-toast";
    toast.textContent = text;
    document.body.appendChild(toast);
    requestAnimationFrame(() => toast.classList.add("show"));
    setTimeout(() => {
        toast.classList.remove("show");
        setTimeout(() => toast.remove(), 400);
    }, 2400);
}
