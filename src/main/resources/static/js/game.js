/**
 * ============================================================================
 * SINH VIÊN LÉN LÚT (SNEAKY STUDENT) - GAME ENGINE & LOGIC
 * ============================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. DOM Elements ---
    const timerBarFill = document.getElementById('timer-bar-fill');
    const timerText = document.getElementById('timer-text');

    // Start Screen
    const screenStart = document.getElementById('screen-start');
    const btnStartGame = document.getElementById('btn-start-game');

    // Game UI elements (ẩn đến khi nhấn Bắt Đầu)
    const hiddenUntilStart = document.querySelectorAll('.hidden-until-start');

    // Mentor Elements
    const mentorBox = document.getElementById('mentor-box');
    const mentorImg = document.getElementById('mentor-img');
    const mentorCaption = document.getElementById('mentor-caption');
    const mentorStatusText = document.getElementById('mentor-status-text');
    const mentorStatusChip = document.getElementById('mentor-status-chip');

    // Student Elements
    const studentBox = document.getElementById('student-box');
    const studentImg = document.getElementById('student-img');
    const studentCaption = document.getElementById('student-caption');
    const studentStatusText = document.getElementById('student-status-text');

    // Controls
    const btnPlayAction = document.getElementById('btn-play-action');

    // Focus Bar Elements
    const focusBarPanel = document.getElementById('focus-bar-panel');
    const focusBarFill = document.getElementById('focus-bar-fill');
    const focusBarPct = document.getElementById('focus-bar-pct');
    const focusStatusText = document.getElementById('focus-status-text');
    const focusAddictWarning = document.getElementById('focus-addict-warning');

    // Modals
    const modalGameOver = document.getElementById('modal-game-over');
    const modalGameWin = document.getElementById('modal-game-win');
    const btnRetryLose = document.getElementById('btn-retry-lose');
    const btnRetryWin = document.getElementById('btn-retry-win');

    // Sound toggle
    const btnToggleSound = document.getElementById('btn-toggle-sound');
    const soundIcon = document.getElementById('sound-icon');
    let isSoundMuted = false;

    if (btnToggleSound) {
        btnToggleSound.addEventListener('click', () => {
            isSoundMuted = !isSoundMuted;
            soundIcon.textContent = isSoundMuted ? '🔇' : '🔊';
            btnToggleSound.classList.toggle('muted', isSoundMuted);
            btnToggleSound.title = isSoundMuted ? 'Bật âm thanh' : 'Tắt âm thanh';
        });
    }

    // =========================================================
    // --- START SCREEN LOGIC ---
    // =========================================================
    const showGameUI = () => {
        // Kích hoạt AudioContext từ thao tác click của người dùng
        getAudioContext();
        SoundEffects.gameStart();

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

            // =========================================================
            // --- 3. ÂM THANH DỰ ÁN (SYNTHESIZED SOUND EFFECTS) ---
            // Sử dụng Web Audio API không phụ thuộc tải file mp3 bên ngoài
            // =========================================================
            let audioCtx = null;
            const getAudioContext = () => {
                if (!audioCtx) {
                    const AudioContext = window.AudioContext || window.webkitAudioContext;
                    if (AudioContext) audioCtx = new AudioContext();
                }
                if (audioCtx && audioCtx.state === 'suspended') {
                    audioCtx.resume();
                }
                return audioCtx;
            };

            const SoundEffects = {
                // Tiếng gõ phím lách cách khi đang chăm chỉ học code
                keyboardTyping: () => {
                    if (isSoundMuted) return;
                    const ctx = getAudioContext();
                    if (!ctx) return;
                    const now = ctx.currentTime;
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    const freq = 1200 + (Math.random() * 800 - 400); // 800Hz - 1600Hz
                    osc.type = 'triangle';
                    osc.frequency.setValueAtTime(freq, now);
                    gain.gain.setValueAtTime(0.015, now);
                    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(now);
                    osc.stop(now + 0.04);
                },

                // Tiếng 8-bit coin / điểm số vui nhộn khi lén chơi game
                gamingBlip: () => {
                    if (isSoundMuted) return;
                    const ctx = getAudioContext();
                    if (!ctx) return;
                    const now = ctx.currentTime;
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'square';
                    const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
                    const note = notes[Math.floor(Math.random() * notes.length)];
                    osc.frequency.setValueAtTime(note, now);
                    osc.frequency.exponentialRampToValueAtTime(note * 1.5, now + 0.08);
                    gain.gain.setValueAtTime(0.03, now);
                    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(now);
                    osc.stop(now + 0.08);
                },

                // Tiếng bấm nút Bắt Đầu (Game Start chime)
                gameStart: () => {
                    if (isSoundMuted) return;
                    const ctx = getAudioContext();
                    if (!ctx) return;
                    const now = ctx.currentTime;
                    const chord = [261.63, 329.63, 392.00, 523.25]; // C major
                    chord.forEach((freq, idx) => {
                        const osc = ctx.createOscillator();
                        const gain = ctx.createGain();
                        osc.type = 'triangle';
                        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
                        gain.gain.setValueAtTime(0.06, now + idx * 0.08);
                        gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.08 + 0.35);
                        osc.connect(gain);
                        gain.connect(ctx.destination);
                        osc.start(now + idx * 0.08);
                        osc.stop(now + idx * 0.08 + 0.35);
                    });
                },

                // Còi cảnh báo Mentor sắp ngước nhìn
                mentorWarning: () => {
                    if (isSoundMuted) return;
                    const ctx = getAudioContext();
                    if (!ctx) return;
                    const now = ctx.currentTime;
                    for (let i = 0; i < 2; i++) {
                        const osc = ctx.createOscillator();
                        const gain = ctx.createGain();
                        osc.type = 'sawtooth';
                        const startTime = now + i * 0.15;
                        osc.frequency.setValueAtTime(440, startTime);
                        osc.frequency.exponentialRampToValueAtTime(880, startTime + 0.12);
                        gain.gain.setValueAtTime(0.08, startTime);
                        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.12);
                        osc.connect(gain);
                        gain.connect(ctx.destination);
                        osc.start(startTime);
                        osc.stop(startTime + 0.12);
                    }
                },

                // Còi báo động khi Mentor ngẩng đầu quan sát
                mentorWatching: () => {
                    if (isSoundMuted) return;
                    const ctx = getAudioContext();
                    if (!ctx) return;
                    const now = ctx.currentTime;
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(880, now);
                    osc.frequency.linearRampToValueAtTime(660, now + 0.25);
                    gain.gain.setValueAtTime(0.09, now);
                    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(now);
                    osc.stop(now + 0.3);
                },

                // Âm thanh khi thanh tập trung về 0% (Bị nghiện game)
                focusLostAddicted: () => {
                    if (isSoundMuted) return;
                    const ctx = getAudioContext();
                    if (!ctx) return;
                    const now = ctx.currentTime;
                    const tones = [400, 320, 250, 180];
                    tones.forEach((freq, idx) => {
                        const osc = ctx.createOscillator();
                        const gain = ctx.createGain();
                        osc.type = 'sawtooth';
                        const startTime = now + idx * 0.12;
                        osc.frequency.setValueAtTime(freq, startTime);
                        gain.gain.setValueAtTime(0.07, startTime);
                        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.15);
                        osc.connect(gain);
                        gain.connect(ctx.destination);
                        osc.start(startTime);
                        osc.stop(startTime + 0.15);
                    });
                },

                // Nhạc GameOver bi tráng khi bị Mentor bắt bài
                gameOver: () => {
                    if (isSoundMuted) return;
                    const ctx = getAudioContext();
                    if (!ctx) return;
                    const now = ctx.currentTime;
                    const sadNotes = [330, 311, 293, 277, 220]; // Mi, Re#, Re, Do#, La
                    sadNotes.forEach((freq, idx) => {
                        const osc = ctx.createOscillator();
                        const gain = ctx.createGain();
                        osc.type = 'sawtooth';
                        const startTime = now + idx * 0.18;
                        osc.frequency.setValueAtTime(freq, startTime);
                        gain.gain.setValueAtTime(0.1, startTime);
                        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.25);
                        osc.connect(gain);
                        gain.connect(ctx.destination);
                        osc.start(startTime);
                        osc.stop(startTime + 0.25);
                    });
                },

                // Nhạc chiến thắng hào hùng (Victory Fanfare) khi sống sót qua 3 phút
                victoryFanfare: () => {
                    if (isSoundMuted) return;
                    const ctx = getAudioContext();
                    if (!ctx) return;
                    const now = ctx.currentTime;
                    // Nhịp điệu chiến thắng: Sol, Sol, Sol, Đô (ngân dài)
                    const fanfare = [
                        { f: 523.25, d: 0.12, t: 0 },
                        { f: 523.25, d: 0.12, t: 0.14 },
                        { f: 523.25, d: 0.12, t: 0.28 },
                        { f: 659.25, d: 0.35, t: 0.42 },
                        { f: 587.33, d: 0.15, t: 0.8 },
                        { f: 783.99, d: 0.6, t: 0.98 }
                    ];
                    fanfare.forEach(item => {
                        const osc = ctx.createOscillator();
                        const gain = ctx.createGain();
                        osc.type = 'triangle';
                        const startTime = now + item.t;
                        osc.frequency.setValueAtTime(item.f, startTime);
                        gain.gain.setValueAtTime(0.12, startTime);
                        gain.gain.exponentialRampToValueAtTime(0.001, startTime + item.d);
                        osc.connect(gain);
                        gain.connect(ctx.destination);
                        osc.start(startTime);
                        osc.stop(startTime + item.d);
                    });
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
                SoundEffects.focusLostAddicted();
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

                        // Thỉnh thoảng phát tiếng gõ phím lách cách khi đang học
                        if (Math.random() < 0.25) {
                            SoundEffects.keyboardTyping();
                        }

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

                        // Phát tiếng game 8-bit lách cách vui nhộn
                        if (Math.random() < 0.35) {
                            SoundEffects.gamingBlip();
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
                SoundEffects.mentorWarning();
            };

            const setMentorWatching = () => {
                currentMentorState = MENTOR_STATE.WATCHING;
                mentorImg.src = '/images/mentor-warning.svg'; // có thể dùng warning hoặc angry
                mentorBox.className = 'character-card mentor-section watching-state';
                mentorCaption.textContent = '👀 MENTOR ĐANG QUAN SÁT LỚP HỌC!';
                mentorStatusChip.innerHTML = '<span class="dot danger"></span><span id="mentor-status-text">NGUY HIỂM: Mentor đang theo dõi!</span>';
                SoundEffects.mentorWatching();
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

                SoundEffects.gameOver();

                // Show Game Over Modal
                modalGameOver.classList.remove('hidden');
            };

            const triggerWin = () => {
                currentGameStatus = GAME_STATUS.WIN;
                clearInterval(countdownInterval);
                clearInterval(focusInterval);
                clearTimeout(mentorCycleTimeout);
                if (gameLoopFrame) cancelAnimationFrame(gameLoopFrame);

                SoundEffects.victoryFanfare();

                // Show Game Win Modal
                modalGameWin.classList.remove('hidden');
            };

            // --- 10. Event Listeners for Player Control (Hold & Release) ---
            const onStartPlaying = (e) => {
                if (e.cancelable) e.preventDefault();
                if (currentGameStatus === GAME_STATUS.RUNNING) {
                    SoundEffects.gamingBlip();
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
