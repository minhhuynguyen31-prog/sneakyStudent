/**
 * ============================================================================
 * SINH VIÊN LÉN LÚT (SNEAKY STUDENT) - GAME ENGINE & LOGIC
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. DOM Elements ---
    const timerBarFill = document.getElementById('timer-bar-fill');
    const timerText    = document.getElementById('timer-text');

    // Start Screen
    const screenStart  = document.getElementById('screen-start');
    const btnStartGame = document.getElementById('btn-start-game');

    // Game UI elements (ẩn đến khi nhấn Bắt Đầu)
    const hiddenUntilStart = document.querySelectorAll('.hidden-until-start');

    // Mentor Elements
    const mentorBox        = document.getElementById('mentor-box');
    const mentorImg        = document.getElementById('mentor-img');
    const mentorCaption    = document.getElementById('mentor-caption');
    const mentorStatusText = document.getElementById('mentor-status-text');
    const mentorStatusChip = document.getElementById('mentor-status-chip');

    // Student Elements
    const studentBox        = document.getElementById('student-box');
    const studentImg        = document.getElementById('student-img');
    const studentCaption    = document.getElementById('student-caption');
    const studentStatusText = document.getElementById('student-status-text');

    // Controls
    const btnPlayAction = document.getElementById('btn-play-action');

    // Focus Bar Elements
    const focusBarPanel     = document.getElementById('focus-bar-panel');
    const focusBarFill      = document.getElementById('focus-bar-fill');
    const focusBarPct       = document.getElementById('focus-bar-pct');
    const focusStatusText   = document.getElementById('focus-status-text');
    const focusAddictWarning= document.getElementById('focus-addict-warning');

    // Modals
    const modalGameOver = document.getElementById('modal-game-over');
    const modalGameWin  = document.getElementById('modal-game-win');
    const btnRetryLose  = document.getElementById('btn-retry-lose');
    const btnRetryWin   = document.getElementById('btn-retry-win');

    // =========================================================
    // --- START SCREEN LOGIC ---
    // =========================================================
    const showGameUI = () => {
        // Hiệu ứng slide màn Start lên trên
        screenStart.classList.add('slide-out');

        // Sau khi animation kết thúc -> ẩn hoàn toàn, hiện game
        screenStart.addEventListener('animationend', () => {
            screenStart.style.display = 'none';

            // Hiện tất cả phần tử game
            hiddenUntilStart.forEach(el => {
                el.classList.remove('hidden-until-start');
                el.classList.add('fade-in-game');
            });

            // Khởi động game ngay
            initGame();
        }, { once: true });
    };

    // Click nút Bắt Đầu
    btnStartGame.addEventListener('click', showGameUI);

    // Phím ENTER bắt đầu
    document.addEventListener('keydown', (e) => {
        if (e.code === 'Enter' && screenStart.style.display !== 'none' && !screenStart.classList.contains('slide-out')) {
            showGameUI();
        }
    });

    // --- 2. Game States ---
    const MENTOR_STATE = {
        SAFE: 'SAFE',          // Cúi mặt code (An toàn)
        WARNING: 'WARNING',    // Cảnh báo chuẩn bị ngẩng nhìn (0.5 - 1s)
        WATCHING: 'WATCHING'   // Ngẩng đầu quan sát (Nguy hiểm!)
    };

    const STUDENT_STATE = {
        LEARNING: 'LEARNING',  // Đang học ngoan
        PLAYING: 'PLAYING'     // Đang bấm game lén lút
    };

    const GAME_STATUS = {
        READY: 'READY',
        RUNNING: 'RUNNING',
        OVER: 'OVER',
        WIN: 'WIN'
    };

    // State Variables
    let currentMentorState = MENTOR_STATE.SAFE;
    let currentStudentState = STUDENT_STATE.LEARNING;
    let currentGameStatus = GAME_STATUS.READY;

    // Focus State Variables
    const MAX_FOCUS = 100;
    let currentFocus = MAX_FOCUS;
    let isAddicted = false; // Khi focus = 0: bị nghiện vĩnh viễn, không về học được
    let focusInterval = null;

    // Timer Variables
    const TOTAL_SECONDS = (typeof GAME_CONFIG !== 'undefined' && GAME_CONFIG.totalSeconds) ? GAME_CONFIG.totalSeconds : 180;
    let remainingTimeSeconds = TOTAL_SECONDS;
    
    // Timers & Intervals references
    let countdownInterval = null;
    let mentorCycleTimeout = null;
    let gameLoopFrame = null;

    // --- 3. Audio & Haptic Feedback (Optional Web Audio API Beeps) ---
    const playTone = (frequency, duration, type = 'sine') => {
        try {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (!AudioContext) return;
            const ctx = new AudioContext();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = type;
            osc.frequency.value = frequency;
            osc.connect(gain);
            gain.connect(ctx.destination);
            gain.gain.setValueAtTime(0.05, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.00001, ctx.currentTime + duration);
            osc.start();
            osc.stop(ctx.currentTime + duration);
        } catch (e) {
            // Audio not allowed or unsupported
        }
    };

    // --- 4. Initialize / Reset Game ---
    const initGame = () => {
        // Reset timers
        clearInterval(countdownInterval);
        clearInterval(focusInterval);
        clearTimeout(mentorCycleTimeout);
        if (gameLoopFrame) cancelAnimationFrame(gameLoopFrame);

        remainingTimeSeconds = TOTAL_SECONDS;
        currentMentorState = MENTOR_STATE.SAFE;
        currentStudentState = STUDENT_STATE.LEARNING;
        currentGameStatus = GAME_STATUS.RUNNING;

        // Reset Focus State
        currentFocus = MAX_FOCUS;
        isAddicted = false;
        focusBarPanel.classList.remove('addicted-state');
        focusAddictWarning.classList.add('hidden');
        btnPlayAction.classList.remove('addicted-locked');
        studentBox.classList.remove('addicted-state');

        // Hide Modals
        modalGameOver.classList.add('hidden');
        modalGameWin.classList.add('hidden');

        // Reset UI
        updateTimerDisplay();
        updateFocusDisplay();
        setMentorSafe();
        setStudentLearning();
        btnPlayAction.classList.remove('active-holding');

        // Start Countdown, Focus System & Mentor Cycle
        startCountdown();
        startFocusSystem();
        scheduleNextMentorState();
        startGameTick();
    };

    // --- 5. Timer System ---
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    const updateTimerDisplay = () => {
        const percent = Math.max(0, (remainingTimeSeconds / TOTAL_SECONDS) * 100);
        timerBarFill.style.width = `${percent}%`;
        timerText.textContent = formatTime(remainingTimeSeconds);

        // Dynamic color changes as timer runs low
        if (percent < 25) {
            timerBarFill.style.background = 'linear-gradient(90deg, #ef4444, #b91c1c)';
        } else if (percent < 50) {
            timerBarFill.style.background = 'linear-gradient(90deg, #f59e0b, #d97706)';
        } else {
            timerBarFill.style.background = 'linear-gradient(90deg, #10b981, #3b82f6)';
        }
    };

    const startCountdown = () => {
        countdownInterval = setInterval(() => {
            if (currentGameStatus !== GAME_STATUS.RUNNING) return;

            remainingTimeSeconds -= 0.1;

            if (remainingTimeSeconds <= 0) {
                remainingTimeSeconds = 0;
                updateTimerDisplay();
                triggerWin();
            } else {
                updateTimerDisplay();
            }
        }, 100);
    };

    // --- 5.1. Focus Bar System (Thanh trạng thái tập trung) ---
    const updateFocusDisplay = () => {
        const roundedPct = Math.round(currentFocus);
        focusBarFill.style.width = `${roundedPct}%`;
        focusBarPct.textContent = `${roundedPct}%`;

        // Gỡ bỏ các class trạng thái cũ
        focusBarFill.classList.remove('focus-high', 'focus-mid', 'focus-low', 'focus-addicted');

        if (isAddicted) {
            focusBarFill.classList.add('focus-addicted');
            focusBarPct.textContent = `0% 🔥`;
            focusBarPct.style.color = '#a855f7';
            focusStatusText.textContent = 'MẤT TẬP TRUNG HOÀN TOÀN! ĐANG BỊ CUỐN VÀO GAME!';
            focusAddictWarning.classList.remove('hidden');
        } else if (currentFocus > 60) {
            focusBarFill.classList.add('focus-high');
            focusBarPct.style.color = '#059669';
            focusStatusText.textContent = 'Đang chăm chú học tốt!';
            focusAddictWarning.classList.add('hidden');
        } else if (currentFocus > 25) {
            focusBarFill.classList.add('focus-mid');
            focusBarPct.style.color = '#d97706';
            focusStatusText.textContent = 'Bắt đầu xao nhãng! Hãy chơi game 1 chút để xả stress!';
            focusAddictWarning.classList.add('hidden');
        } else {
            focusBarFill.classList.add('focus-low');
            focusBarPct.style.color = '#dc2626';
            focusStatusText.textContent = 'CẢNH BÁO: Não sắp quá tải! Bấm chơi game ngay kẻo gục!';
            focusAddictWarning.classList.add('hidden');
        }
    };

    const triggerAddiction = () => {
        if (isAddicted || currentGameStatus !== GAME_STATUS.RUNNING) return;

        isAddicted = true;
        currentFocus = 0;

        // UI & âm thanh cảnh báo nghiện game
        playTone(330, 0.4, 'sawtooth');
        focusBarPanel.classList.add('addicted-state');
        btnPlayAction.classList.add('addicted-locked');
        studentBox.classList.add('addicted-state');

        // Bắt buộc chuyển sang trạng thái chơi game vĩnh viễn
        setStudentPlaying();
        updateFocusDisplay();
    };

    const startFocusSystem = () => {
        // Cứ mỗi 100ms kiểm tra và cập nhật mức tập trung
        focusInterval = setInterval(() => {
            if (currentGameStatus !== GAME_STATUS.RUNNING) return;

            if (isAddicted) {
                // Đã nghiện game: giữ chặt ở trạng thái chơi game, không bao giờ hồi phục
                if (currentStudentState !== STUDENT_STATE.PLAYING) {
                    setStudentPlaying();
                }
                return;
            }

            if (currentStudentState === STUDENT_STATE.LEARNING) {
                // Khi không bấm nút chơi game (đang học): Thanh tập trung sẽ tự tụt dần (~7% mỗi giây)
                currentFocus -= 0.7;

                if (currentFocus <= 0) {
                    currentFocus = 0;
                    updateFocusDisplay();
                    triggerAddiction();
                } else {
                    updateFocusDisplay();
                }
            } else if (currentStudentState === STUDENT_STATE.PLAYING) {
                // Khi bấm nút chơi game: Hồi phục lại độ tập trung (~10% mỗi giây)
                if (currentFocus < MAX_FOCUS) {
                    currentFocus = Math.min(MAX_FOCUS, currentFocus + 1.0);
                    updateFocusDisplay();
                }
            }
        }, 100);
    };

    // --- 6. Mentor State Machine ---
    const setMentorSafe = () => {
        currentMentorState = MENTOR_STATE.SAFE;
        mentorImg.src = '/images/mentor-safe.svg';
        mentorBox.className = 'character-card mentor-section';
        mentorCaption.textContent = 'Mentor đang cắm cúi gõ code fix bug...';
        mentorStatusChip.innerHTML = '<span class="dot safe"></span><span id="mentor-status-text">Mentor: Cúi mặt code (An toàn)</span>';
    };

    const setMentorWarning = () => {
        currentMentorState = MENTOR_STATE.WARNING;
        mentorImg.src = '/images/mentor-warning.svg';
        mentorBox.className = 'character-card mentor-section warning-state';
        mentorCaption.textContent = 'Mentor ngước mắt... Sắp kiểm tra!';
        mentorStatusChip.innerHTML = '<span class="dot warning"></span><span id="mentor-status-text">CẢNH BÁO: Mentor chuẩn bị ngẩng đầu!</span>';
        playTone(440, 0.2, 'triangle');
    };

    const setMentorWatching = () => {
        currentMentorState = MENTOR_STATE.WATCHING;
        mentorImg.src = '/images/mentor-warning.svg'; // có thể dùng warning hoặc angry
        mentorBox.className = 'character-card mentor-section watching-state';
        mentorCaption.textContent = '👀 MENTOR ĐANG QUAN SÁT LỚP HỌC!';
        mentorStatusChip.innerHTML = '<span class="dot danger"></span><span id="mentor-status-text">NGUY HIỂM: Mentor đang theo dõi!</span>';
        playTone(660, 0.3, 'sawtooth');
    };

    const getRandomBetween = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;

    const scheduleNextMentorState = () => {
        if (currentGameStatus !== GAME_STATUS.RUNNING) return;

        // Trạng thái SAFE: kéo dài 2.5s - 5.0s
        const safeDuration = getRandomBetween(2500, 5000);

        mentorCycleTimeout = setTimeout(() => {
            if (currentGameStatus !== GAME_STATUS.RUNNING) return;

            // Bước qua WARNING: kéo dài 0.5s - 1.0s (500ms - 1000ms theo đúng luật)
            setMentorWarning();
            const warningDuration = getRandomBetween(600, 1000);

            mentorCycleTimeout = setTimeout(() => {
                if (currentGameStatus !== GAME_STATUS.RUNNING) return;

                // Bước qua WATCHING: kéo dài 1.5s - 2.8s
                setMentorWatching();
                const watchingDuration = getRandomBetween(1500, 2800);

                mentorCycleTimeout = setTimeout(() => {
                    if (currentGameStatus !== GAME_STATUS.RUNNING) return;

                    // Quay lại trạng thái SAFE
                    setMentorSafe();
                    scheduleNextMentorState();
                }, watchingDuration);

            }, warningDuration);

        }, safeDuration);
    };

    // --- 7. Student State Controls ---
    const setStudentLearning = () => {
        // Nếu đã bị nghiện (focus = 0), không cho phép quay lại trạng thái học bài!
        if (isAddicted) {
            setStudentPlaying();
            return;
        }

        currentStudentState = STUDENT_STATE.LEARNING;
        studentImg.src = '/images/student-learning.svg';
        studentBox.className = 'character-card student-section';
        studentCaption.textContent = 'Chăm chỉ nhìn màn hình IDE code...';
        studentStatusText.textContent = 'Trạng thái: Đang chăm chỉ học 💻';
        btnPlayAction.classList.remove('active-holding');
    };

    const setStudentPlaying = () => {
        if (currentGameStatus !== GAME_STATUS.RUNNING) return;

        currentStudentState = STUDENT_STATE.PLAYING;
        studentImg.src = '/images/student-playing.svg';
        studentBox.className = isAddicted ? 'character-card student-section playing-state addicted-state' : 'character-card student-section playing-state';
        studentCaption.textContent = isAddicted ? '😵 MẤT TẬP TRUNG! Bị dính mắt vào game rồi!' : '🎮 Đang cày rank game cực căng!';
        studentStatusText.textContent = isAddicted ? 'Trạng thái: BỊ NGHIỆN GAME RỒI! 🚫' : 'Trạng thái: ĐANG CHƠI GAME! 🔥';
        btnPlayAction.classList.add('active-holding');
    };

    // --- 8. Real-time Game Loop (Check Game Over condition) ---
    const startGameTick = () => {
        const tick = () => {
            if (currentGameStatus === GAME_STATUS.RUNNING) {
                // Điều kiện Bị bắt: Mentor đang WATCHING và Student đang PLAYING
                if (currentMentorState === MENTOR_STATE.WATCHING && currentStudentState === STUDENT_STATE.PLAYING) {
                    triggerGameOver();
                    return;
                }
                gameLoopFrame = requestAnimationFrame(tick);
            }
        };
        gameLoopFrame = requestAnimationFrame(tick);
    };

    // --- 9. Win & Game Over Handlers ---
    const triggerGameOver = () => {
        currentGameStatus = GAME_STATUS.OVER;
        clearInterval(countdownInterval);
        clearInterval(focusInterval);
        clearTimeout(mentorCycleTimeout);
        if (gameLoopFrame) cancelAnimationFrame(gameLoopFrame);

        playTone(220, 0.6, 'sawtooth');

        // Show Game Over Modal
        modalGameOver.classList.remove('hidden');
    };

    const triggerWin = () => {
        currentGameStatus = GAME_STATUS.WIN;
        clearInterval(countdownInterval);
        clearInterval(focusInterval);
        clearTimeout(mentorCycleTimeout);
        if (gameLoopFrame) cancelAnimationFrame(gameLoopFrame);

        playTone(880, 0.5, 'sine');

        // Show Game Win Modal
        modalGameWin.classList.remove('hidden');
    };

    // --- 10. Event Listeners for Player Control (Hold & Release) ---
    const onStartPlaying = (e) => {
        if (e.cancelable) e.preventDefault();
        if (currentGameStatus === GAME_STATUS.RUNNING) {
            setStudentPlaying();
        }
    };

    const onStopPlaying = (e) => {
        if (e.cancelable) e.preventDefault();
        if (currentGameStatus === GAME_STATUS.RUNNING) {
            setStudentLearning();
        }
    };

    // Mouse Events
    btnPlayAction.addEventListener('mousedown', onStartPlaying);
    window.addEventListener('mouseup', onStopPlaying);

    // Touch Events for Mobile / Tablet
    btnPlayAction.addEventListener('touchstart', onStartPlaying, { passive: false });
    window.addEventListener('touchend', onStopPlaying, { passive: false });
    window.addEventListener('touchcancel', onStopPlaying, { passive: false });

    // Keyboard shortcut (Spacebar hold/release)
    let spacePressed = false;
    window.addEventListener('keydown', (e) => {
        if (e.code === 'Space' && !spacePressed && currentGameStatus === GAME_STATUS.RUNNING) {
            spacePressed = true;
            setStudentPlaying();
        }
    });

    window.addEventListener('keyup', (e) => {
        if (e.code === 'Space') {
            spacePressed = false;
            setStudentLearning();
        }
    });

    // Replay Buttons
    btnRetryLose.addEventListener('click', () => initGame());
    btnRetryWin.addEventListener('click', () => initGame());

    // --- 11. Game khởi động từ Start Screen (không tự động chạy) ---
    // initGame() sẽ được gọi bởi showGameUI() sau khi nhấn nút BẮT ĐẦU CHƠI
});
