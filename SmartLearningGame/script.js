/* =========================================================================
   NOVA NEXUS - CORE APPLICATION LOGIC
   Description: Modular structure, Multi-age support, Mock Firebase Auth,
   Advanced Game Engines (Math Race, Memory, Quiz Battles).
========================================================================= */

// --- 1. MASSIVE DATA DICTIONARY (Categorized by Age Group) ---
const moduleData = {
    kids: [
        { id: 'math_kids', name: 'Math Safari', icon: 'fa-plus', color: '#FF007F', type: 'quiz', desc: 'Basic arithmetic for young minds.' },
        { id: 'memory_kids', name: 'Memory Match', icon: 'fa-th-large', color: '#00F0FF', type: 'memory', desc: 'Improve visual memory.' },
        { id: 'science_kids', name: 'Science Lab', icon: 'fa-flask', color: '#00ff66', type: 'quiz', desc: 'Explore nature and planets.' }
    ],
    teens: [
        { id: 'coding_teens', name: 'Coding Battle', icon: 'fa-laptop-code', color: '#00F0FF', type: 'quiz', desc: 'Python, HTML & JS Logic.' },
        { id: 'math_race_teens', name: 'Math Speed Race', icon: 'fa-tachometer-alt', color: '#ffcc00', type: 'math_race', desc: 'Timed algebra and arithmetic.' },
        { id: 'escape_teens', name: 'Escape Room', icon: 'fa-door-closed', color: '#7000ff', type: 'quiz', desc: 'Solve riddles to escape.' },
        { id: 'cyber_teens', name: 'Cyber Detective', icon: 'fa-user-secret', color: '#ff003c', type: 'quiz', desc: 'Identify phishing and malware.' }
    ],
    adults: [
        { id: 'aptitude_adults', name: 'Aptitude Test', icon: 'fa-brain', color: '#7000ff', type: 'quiz', desc: 'Competitive exam prep.' },
        { id: 'career_adults', name: 'Career Simulator', icon: 'fa-user-tie', color: '#00ff66', type: 'quiz', desc: 'Business and finance scenarios.' },
        { id: 'ai_adults', name: 'AI & Tech Masters', icon: 'fa-network-wired', color: '#00F0FF', type: 'quiz', desc: 'Advanced tech knowledge.' },
        { id: 'math_race_adults', name: 'Financial Math', icon: 'fa-chart-line', color: '#ffcc00', type: 'math_race', desc: 'Calculate interest and ROI quickly.' }
    ]
};

// Quiz Question Banks (Sample populated)
const questionBanks = {
    math_kids: [
        { q: "What is 5 + 3?", options: ["7", "8", "9", "6"], ans: "8" },
        { q: "Count: 1, 2, 3, __?", options: ["4", "5", "6", "10"], ans: "4" },
        { q: "10 - 5 = ?", options: ["3", "4", "5", "6"], ans: "5" }
    ],
    science_kids: [
        { q: "Which animal barks?", options: ["Cat", "Dog", "Cow", "Bird"], ans: "Dog" },
        { q: "What color is the sky?", options: ["Red", "Green", "Blue", "Yellow"], ans: "Blue" },
        { q: "Plants need ___ to grow.", options: ["Juice", "Milk", "Water", "Soda"], ans: "Water" }
    ],
    coding_teens: [
        { q: "What does HTML stand for?", options: ["Hyper Text Markup Language", "High Tech Multi Language", "Hyperlink Text Module", "None"], ans: "Hyper Text Markup Language" },
        { q: "Which is a JS Framework?", options: ["Laravel", "React", "Django", "Flask"], ans: "React" },
        { q: "In Python, how do you output 'Hello'?", options: ["echo 'Hello'", "print('Hello')", "console.log('Hello')", "printf('Hello')"], ans: "print('Hello')" }
    ],
    escape_teens: [
        { q: "I speak without a mouth and hear without ears. I have no body, but I come alive with wind. What am I?", options: ["An echo", "A cloud", "A ghost", "A tree"], ans: "An echo" },
        { q: "The more you take, the more you leave behind. What are they?", options: ["Footsteps", "Memories", "Coins", "Friends"], ans: "Footsteps" }
    ],
    cyber_teens: [
        { q: "What is Phishing?", options: ["Catching fish", "Fake emails to steal data", "A computer virus", "A firewall"], ans: "Fake emails to steal data" },
        { q: "Which password is the strongest?", options: ["password123", "Admin", "MyDog1", "Tr#8pL$z9!"], ans: "Tr#8pL$z9!" }
    ],
    aptitude_adults: [
        { q: "If A is brother of B, B is sister of C, and C is father of D. How is D related to A?", options: ["Nephew/Niece", "Son", "Brother", "Uncle"], ans: "Nephew/Niece" },
        { q: "Find the missing number: 2, 6, 12, 20, ?", options: ["24", "28", "30", "32"], ans: "30" }
    ],
    career_adults: [
        { q: "What is ROI?", options: ["Return on Investment", "Rate of Interest", "Risk of Inflation", "Revenue on Income"], ans: "Return on Investment" },
        { q: "A 'Bear Market' means prices are:", options: ["Rising", "Falling", "Stable", "Fluctuating wildly"], ans: "Falling" }
    ],
    ai_adults: [
        { q: "What does NLP stand for in AI?", options: ["Natural Language Processing", "Neural Logic Programming", "New Learning Protocols", "Network Local Path"], ans: "Natural Language Processing" },
        { q: "Which of these is a Large Language Model?", options: ["ResNet", "GPT-4", "YOLO", "CNN"], ans: "GPT-4" }
    ]
};

// AI Tutor Responses
const aiResponses = {
    start: ["Initializing learning matrix...", "Analyzing optimal path...", "Challenge accepted. Let's begin."],
    correct: ["Algorithm confirmed! Excellent.", "Neural pathway strengthened.", "Flawless execution.", "You're accelerating!"],
    wrong: ["Anomaly detected. Recalibrating...", "Error 404: Answer not found. Try again.", "Analyzing mistake... Keep pushing.", "Don't let the system beat you."]
};

// --- 2. CORE APPLICATION STATE ---
const app = {
    user: {
        uid: null,
        name: "",
        email: "",
        avatar: "Nexus",
        xp: 0,
        level: 1,
        coins: 0,
        streak: 0,
        ageGroup: null, // 'kids', 'teens', 'adults'
        theme: 'neon-dark',
        sfx: true
    },
    system: {
        authMode: 'login', // 'login' or 'register'
        currentModule: null
    },
    sounds: {
        bgMusic: document.getElementById('bg-music'),
        correct: document.getElementById('correct-sound'),
        wrong: document.getElementById('wrong-sound')
    },

    // --- 3. INITIALIZATION & BACKGROUND ---
    init() {
        this.initParticles();
        this.loadData();
        this.setupNavigation(); // Setup popstate listener
        
        setTimeout(() => {
            if (this.user.uid) {
                if(!this.user.ageGroup) {
                    this.showScreen('age-screen', false); // initial state
                } else {
                    this.updateNavbar();
                    this.renderDashboard();
                    this.showScreen('dashboard-screen', false); // initial state
                    document.getElementById('navbar').classList.remove('hidden');
                }
            } else {
                this.showScreen('auth-screen', false); // initial state
            }
        }, 2000);
        
        document.getElementById('sfx-toggle').checked = this.user.sfx;
    },

    initParticles() {
        if(window.particlesJS) {
            particlesJS("particles-js", {
                "particles": {
                    "number": { "value": 80 },
                    "color": { "value": ["#00f0ff", "#ff003c", "#7000ff"] },
                    "shape": { "type": "circle" },
                    "opacity": { "value": 0.5, "random": true },
                    "size": { "value": 3, "random": true },
                    "line_linked": { "enable": true, "distance": 150, "color": "#00f0ff", "opacity": 0.2, "width": 1 },
                    "move": { "enable": true, "speed": 2, "direction": "none", "out_mode": "out" }
                },
                "interactivity": {
                    "events": { "onhover": { "enable": true, "mode": "grab" }, "onclick": { "enable": true, "mode": "push" } },
                    "modes": { "grab": { "distance": 140, "line_linked": { "opacity": 1 } } }
                }
            });
        }
    },

    // --- 4. DATA MANAGEMENT (MOCK FIREBASE CLOUD SAVE) ---
    saveData() {
        // In a real app, this pushes to Firebase Firestore
        // firebase.firestore().collection('users').doc(this.user.uid).set(this.user);
        localStorage.setItem('novanexus_user', JSON.stringify(this.user));
    },
    loadData() {
        const saved = localStorage.getItem('novanexus_user');
        if (saved) {
            this.user = { ...this.user, ...JSON.parse(saved) };
        }
    },
    resetProgress() {
        localStorage.removeItem('novanexus_user');
        location.reload();
    },

    // --- 5. AUTHENTICATION (MOCK FIREBASE AUTH) ---
    switchAuthTab(mode) {
        this.system.authMode = mode;
        const tabs = document.querySelectorAll('.tab-btn');
        tabs[0].classList.toggle('active', mode === 'login');
        tabs[1].classList.toggle('active', mode === 'register');
        
        const nameInput = document.getElementById('auth-name');
        if(mode === 'register') {
            nameInput.classList.remove('hidden');
        } else {
            nameInput.classList.add('hidden');
        }
    },

    authenticate() {
        const email = document.getElementById('auth-email').value;
        const pass = document.getElementById('auth-password').value;
        const name = document.getElementById('auth-name').value;

        if(!email || !pass) {
            alert("System Error: Credentials required.");
            return;
        }

        // Mock Auth Success
        this.user.uid = "user_" + Math.floor(Math.random()*10000);
        this.user.email = email;
        this.user.name = this.system.authMode === 'register' ? (name || "Recruit") : "Agent_" + email.split('@')[0];
        this.user.avatar = this.user.name; // Dicebear seed
        
        this.postLoginProcess();
    },

    guestLogin() {
        this.user.uid = "guest_" + Math.floor(Math.random()*10000);
        this.user.name = "Guest_Player";
        this.user.avatar = "Bot";
        this.postLoginProcess();
    },

    postLoginProcess() {
        this.saveData();
        if(this.user.sfx) {
            this.sounds.bgMusic.volume = 0.2;
            this.sounds.bgMusic.play().catch(e=>console.log("Audio requires interaction"));
        }
        this.showScreen('age-screen');
    },

    // --- 6. CORE UI & NAVIGATION ---
    setupNavigation() {
        // Handle browser back/forward buttons
        window.addEventListener('popstate', (e) => {
            if (e.state && e.state.screenId) {
                this.handleNavChange(e.state.screenId, false);
            }
        });
        
        // Prevent accidental exit
        window.addEventListener('beforeunload', (e) => {
            if (['quiz-screen', 'math-race-screen', 'memory-screen'].includes(this.system.currentScreen)) {
                e.preventDefault();
                e.returnValue = '';
            }
        });
    },

    goBack() {
        window.history.back();
    },

    showScreen(id, pushState = true) {
        this.handleNavChange(id, pushState);
    },

    handleNavChange(id, pushState) {
        // Confirmation before leaving a game
        if (['quiz-screen', 'math-race-screen', 'memory-screen'].includes(this.system.currentScreen) && !['results-screen'].includes(id)) {
            if (!confirm("Are you sure you want to exit the current game? Your progress will be lost.")) {
                if (pushState) return; // Abort
            }
        }
        
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        document.getElementById(id).classList.add('active');
        
        // Manage Navbar back button visibility
        const backBtn = document.getElementById('nav-back-btn');
        if (backBtn) {
            backBtn.style.display = ['dashboard-screen', 'auth-screen', 'age-screen', 'splash-screen'].includes(id) ? 'none' : 'flex';
        }

        this.system.currentScreen = id;

        if (pushState) {
            window.history.pushState({ screenId: id }, '', '#' + id);
        } else if (pushState === false && !window.history.state) {
            // Replace initial state so the first back button click doesn't exit immediately
            window.history.replaceState({ screenId: id }, '', '#' + id);
        }
        window.scrollTo(0,0);
    },

    updateNavbar() {
        document.getElementById('nav-name').innerText = this.user.name;
        document.getElementById('nav-level').innerText = this.user.level;
        document.getElementById('nav-coins').innerText = this.user.coins;
        document.getElementById('nav-streak').innerText = this.user.streak;
        document.getElementById('nav-avatar').src = `https://api.dicebear.com/7.x/bottts/svg?seed=${this.user.avatar}&backgroundColor=111424`;
        document.getElementById('nav-mode-label').innerText = this.user.ageGroup ? this.user.ageGroup.toUpperCase() : "MODE";
        
        const xpNext = this.user.level * 200; // Harder scaling
        document.getElementById('nav-xp').innerText = this.user.xp;
        document.getElementById('nav-xp-next').innerText = xpNext;
        document.getElementById('xp-bar').style.width = `${(this.user.xp / xpNext) * 100}%`;
    },

    toggleMusic() {
        if (this.sounds.bgMusic.paused) {
            this.sounds.bgMusic.play();
            document.getElementById('music-icon').className = 'fas fa-music';
        } else {
            this.sounds.bgMusic.pause();
            document.getElementById('music-icon').className = 'fas fa-volume-mute';
        }
    },
    toggleSettings() { document.getElementById('settings-modal').classList.toggle('hidden'); },
    toggleSfx() {
        this.user.sfx = document.getElementById('sfx-toggle').checked;
        this.saveData();
    },
    playSfx(type) {
        if (!this.user.sfx) return;
        try {
            if (type === 'correct') { this.sounds.correct.currentTime = 0; this.sounds.correct.play(); }
            else if (type === 'wrong') { this.sounds.wrong.currentTime = 0; this.sounds.wrong.play(); }
        } catch(e) {}
    },
    setAiMessage(type) {
        const list = aiResponses[type];
        const msg = list[Math.floor(Math.random() * list.length)];
        const el = document.getElementById('ai-message');
        el.innerText = msg;
        el.style.transform = 'scale(1.05)';
        setTimeout(() => el.style.transform = 'scale(1)', 200);
    },

    // --- 7. DASHBOARD & AGE SELECTION ---
    selectAgeGroup(group) {
        this.user.ageGroup = group;
        this.saveData();
        this.updateNavbar();
        this.renderDashboard();
        
        // AI Greeting based on age
        const greetings = {
            kids: "Ready for an adventure? Let's play and learn!",
            teens: "Welcome back. Time to level up your skills.",
            adults: "System online. Prepare for advanced simulations."
        };
        document.getElementById('ai-greeting').innerText = greetings[group];
        
        document.getElementById('navbar').classList.remove('hidden');
        this.showScreen('dashboard-screen');
    },

    renderDashboard() {
        const grid = document.getElementById('modules-grid');
        grid.innerHTML = '';
        const modules = moduleData[this.user.ageGroup] || [];
        
        modules.forEach(mod => {
            const card = document.createElement('div');
            card.className = '3d-card cyber-border';
            card.innerHTML = `
                <i class="fas ${mod.icon} age-icon" style="color:${mod.color}; text-shadow: 0 0 10px ${mod.color};"></i>
                <h3 class="neon-text" style="color:${mod.color}">${mod.name}</h3>
                <p style="color:var(--text-muted); margin-top:5px; font-size:0.9rem;">${mod.desc}</p>
            `;
            card.onclick = () => this.launchModule(mod);
            grid.appendChild(card);
        });

        // Render Badges
        const bc = document.getElementById('badges-container');
        bc.innerHTML = '';
        for(let i=1; i<=Math.min(this.user.level, 5); i++) {
            bc.innerHTML += `<div class="badge"><i class="fas fa-star"></i></div>`;
        }
    },

    startSmartPlan() {
        // Automatically picks the first module
        if(moduleData[this.user.ageGroup].length > 0) {
            this.launchModule(moduleData[this.user.ageGroup][0]);
        }
    },

    // --- 8. MODULE ROUTER ---
    launchModule(mod) {
        this.system.currentModule = mod;
        
        if (mod.type === 'quiz') {
            this.games.quiz.start(mod.id);
        } else if (mod.type === 'math_race') {
            this.games.mathRace.init();
        } else if (mod.type === 'memory') {
            this.games.memory.start();
        } else {
            alert("Module under construction.");
        }
    },

    retryCurrentModule() {
        if(this.system.currentModule) this.launchModule(this.system.currentModule);
        else this.showScreen('dashboard-screen');
    },

    // --- 9. RESULTS & REWARDS LOGIC ---
    endGame(score, type = 'quiz') {
        this.showScreen('results-screen');
        
        const isWin = score > 0;
        document.getElementById('result-title').innerText = isWin ? "MISSION ACCOMPLISHED" : "MISSION FAILED";
        document.getElementById('result-title').style.color = isWin ? "var(--primary)" : "var(--accent)";
        
        // Complex XP calc based on game type
        let xpEarned = score * (type === 'math_race' ? 5 : 15);
        let coinsEarned = Math.floor(xpEarned / 10);
        
        document.getElementById('result-score').innerText = score;
        document.getElementById('result-xp').innerText = "+" + xpEarned;
        document.getElementById('result-coins').innerText = "+" + coinsEarned;
        
        this.user.xp += xpEarned;
        this.user.coins += coinsEarned;
        if(isWin) this.user.streak += 1; else this.user.streak = 0;
        
        // Level Up Logic
        const xpNeeded = this.user.level * 200;
        const levelMsg = document.getElementById('level-up-msg');
        if (this.user.xp >= xpNeeded) {
            this.user.level++;
            this.user.xp -= xpNeeded;
            levelMsg.classList.remove('hidden');
            if (typeof confetti !== "undefined") this.fireConfetti(300);
        } else {
            levelMsg.classList.add('hidden');
            if (isWin && typeof confetti !== "undefined") this.fireConfetti(100);
        }
        
        this.saveData();
        this.updateNavbar();
    },

    fireConfetti(count) {
        confetti({ particleCount: count, spread: 100, origin: { y: 0.6 }, colors: ['#00f0ff', '#7000ff', '#ff003c'] });
    },

    // --- 10. SPECIFIC GAME ENGINES ---
    games: {
        
        // ================= STANDARD QUIZ ENGINE =================
        quiz: {
            questions: [], currentIndex: 0, score: 0, timer: null, timeLeft: 15,
            
            start(bankId) {
                this.score = 0; this.currentIndex = 0;
                // Get questions or fallback to empty
                const rawQs = questionBanks[bankId] || [{q:"No data for this module yet.", options:["OK"], ans:"OK"}];
                // Shuffle and pick 5 max
                this.questions = [...rawQs].sort(() => 0.5 - Math.random()).slice(0, 5);
                
                app.showScreen('quiz-screen');
                app.setAiMessage('start');
                this.loadNext();
            },
            
            loadNext() {
                if (this.currentIndex >= this.questions.length) {
                    app.endGame(this.score, 'quiz');
                    return;
                }
                const q = this.questions[this.currentIndex];
                document.getElementById('quiz-qnum').innerText = this.currentIndex + 1;
                document.getElementById('quiz-score').innerText = this.score;
                document.getElementById('question-text').innerText = q.q;

                const container = document.getElementById('options-container');
                container.innerHTML = '';
                const opts = [...q.options].sort(() => 0.5 - Math.random());
                
                opts.forEach(opt => {
                    const btn = document.createElement('button');
                    btn.className = 'option-btn';
                    btn.innerText = opt;
                    btn.onclick = () => this.check(btn, opt, q.ans);
                    container.appendChild(btn);
                });
                this.startTimer();
            },
            
            startTimer() {
                clearInterval(this.timer);
                this.timeLeft = 15;
                const bar = document.getElementById('timer-bar');
                const txt = document.getElementById('timer-text');
                bar.style.width = '100%'; bar.classList.remove('danger');
                
                this.timer = setInterval(() => {
                    this.timeLeft--;
                    txt.innerText = this.timeLeft + 's';
                    const pct = (this.timeLeft / 15) * 100;
                    bar.style.width = pct + '%';
                    if(pct < 30) bar.classList.add('danger');
                    
                    if(this.timeLeft <= 0) {
                        clearInterval(this.timer);
                        app.playSfx('wrong'); app.setAiMessage('wrong');
                        setTimeout(() => { this.currentIndex++; this.loadNext(); }, 1500);
                    }
                }, 1000);
            },
            
            check(btn, selected, correct) {
                clearInterval(this.timer);
                document.querySelectorAll('#options-container .option-btn').forEach(b => b.disabled = true);
                
                if (selected === correct) {
                    btn.classList.add('correct');
                    this.score += 10 + (this.timeLeft > 5 ? 5 : 0);
                    app.playSfx('correct'); app.setAiMessage('correct');
                } else {
                    btn.classList.add('wrong');
                    app.playSfx('wrong'); app.setAiMessage('wrong');
                    document.querySelectorAll('#options-container .option-btn').forEach(b => {
                        if(b.innerText === correct) b.classList.add('correct');
                    });
                }
                setTimeout(() => { this.currentIndex++; this.loadNext(); }, 1500);
            }
        },

        // ================= MATH SPEED RACE =================
        mathRace: {
            timer: null, timeLeft: 30, score: 0, currentAns: 0,
            
            init() {
                app.showScreen('math-race-screen');
                document.getElementById('race-time').innerText = '30';
                document.getElementById('race-score').innerText = '0';
                document.getElementById('race-equation').innerText = "Ready?";
                document.getElementById('race-input').value = "";
                document.getElementById('race-input').disabled = true;
                document.getElementById('race-start-btn').style.display = 'inline-block';
            },
            
            start() {
                document.getElementById('race-start-btn').style.display = 'none';
                document.getElementById('race-input').disabled = false;
                document.getElementById('race-input').focus();
                this.score = 0;
                this.timeLeft = 30;
                this.generateEq();
                
                this.timer = setInterval(() => {
                    this.timeLeft--;
                    document.getElementById('race-time').innerText = this.timeLeft;
                    if(this.timeLeft <= 0) {
                        clearInterval(this.timer);
                        document.getElementById('race-input').disabled = true;
                        app.endGame(this.score, 'math_race');
                    }
                }, 1000);
            },
            
            generateEq() {
                // Adjust difficulty based on age
                let max = app.user.ageGroup === 'kids' ? 10 : (app.user.ageGroup === 'teens' ? 50 : 100);
                const a = Math.floor(Math.random() * max) + 1;
                const b = Math.floor(Math.random() * max) + 1;
                const ops = ['+', '-'];
                if(app.user.ageGroup !== 'kids') ops.push('*');
                const op = ops[Math.floor(Math.random() * ops.length)];
                
                let eq = "";
                if(op === '+') { this.currentAns = a + b; eq = `${a} + ${b}`; }
                if(op === '-') { 
                    const maxV = Math.max(a,b); const minV = Math.min(a,b); // prevent negative for simple mode
                    this.currentAns = maxV - minV; eq = `${maxV} - ${minV}`; 
                }
                if(op === '*') { this.currentAns = a * (b > 10 ? 5 : b); eq = `${a} × ${(b > 10 ? 5 : b)}`; } // keep multiplication sane
                
                document.getElementById('race-equation').innerText = eq;
                document.getElementById('race-input').value = "";
            },
            
            submit() {
                const val = parseInt(document.getElementById('race-input').value);
                if(isNaN(val)) return;
                
                if(val === this.currentAns) {
                    this.score += 1;
                    document.getElementById('race-score').innerText = this.score;
                    app.playSfx('correct');
                    this.generateEq();
                } else {
                    app.playSfx('wrong');
                    document.getElementById('race-input').value = ""; // Clear to try again
                }
                document.getElementById('race-input').focus();
            }
        },

        // ================= MEMORY MATCH =================
        memory: {
            cards: [], flipped: [], matches: 0, moves: 0,
            
            start() {
                app.showScreen('memory-screen');
                this.matches = 0; this.moves = 0;
                document.getElementById('memory-matches').innerText = '0/6';
                document.getElementById('memory-moves').innerText = '0';
                
                const emojis = ['🚀','🤖','🧠','💻','⚡','🌍'];
                const deck = [...emojis, ...emojis].sort(() => 0.5 - Math.random());
                
                const grid = document.getElementById('memory-grid');
                grid.innerHTML = '';
                this.cards = [];
                
                deck.forEach((icon, i) => {
                    const card = document.createElement('div');
                    card.className = 'memory-card cyber-border';
                    card.dataset.val = icon;
                    card.dataset.idx = i;
                    card.onclick = () => this.flip(card);
                    grid.appendChild(card);
                });
            },
            
            flip(card) {
                if(card.classList.contains('flipped') || card.classList.contains('matched') || this.flipped.length >= 2) return;
                
                card.classList.add('flipped');
                card.innerText = card.dataset.val;
                this.flipped.push(card);
                
                if(this.flipped.length === 2) {
                    this.moves++;
                    document.getElementById('memory-moves').innerText = this.moves;
                    setTimeout(() => this.checkMatch(), 800);
                }
            },
            
            checkMatch() {
                const [c1, c2] = this.flipped;
                if(c1.dataset.val === c2.dataset.val) {
                    c1.classList.add('matched'); c2.classList.add('matched');
                    app.playSfx('correct');
                    this.matches++;
                    document.getElementById('memory-matches').innerText = `${this.matches}/6`;
                    if(this.matches === 6) {
                        setTimeout(() => app.endGame(Math.max(100 - (this.moves * 2), 20), 'memory'), 1000);
                    }
                } else {
                    c1.classList.remove('flipped'); c2.classList.remove('flipped');
                    c1.innerText = ''; c2.innerText = '';
                    app.playSfx('wrong');
                }
                this.flipped = [];
            }
        }
    }
};

// --- BOOTSTRAP ---
window.onload = () => {
    app.init();
    
    // Setup Enter key for Math Race
    document.getElementById('race-input').addEventListener("keypress", function(event) {
        if (event.key === "Enter") app.games.mathRace.submit();
    });
};
