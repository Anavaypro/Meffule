document.addEventListener('DOMContentLoaded', function() {
    // Initialize Chart.js
    initStudyProgressChart();
    
    // Setup all functionality
    setupPomodoroTimer();
    setupSidebarToggle();
    setupTaskCheckboxes();
    setupMotivationQuote();
    setupThemeSwitcher();
    setupNavigation();
    setupModals();
    setupProfile();
    setupAIAssistant();
    setupNotifications();
});

function initStudyProgressChart() {
    const ctx = document.getElementById('studyProgressChart').getContext('2d');
    
    const studyData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'],
        datasets: [
            {
                label: 'Physics',
                data: [20, 35, 40, 50, 55, 60, 65],
                borderColor: '#4e73df',
                backgroundColor: 'rgba(78, 115, 223, 0.05)',
                tension: 0.4,
                fill: true
            },
            {
                label: 'Chemistry',
                data: [15, 25, 30, 35, 40, 45, 48],
                borderColor: '#1cc88a',
                backgroundColor: 'rgba(28, 200, 138, 0.05)',
                tension: 0.4,
                fill: true
            },
            {
                label: 'Maths',
                data: [30, 45, 50, 58, 62, 68, 72],
                borderColor: '#f6c23e',
                backgroundColor: 'rgba(246, 194, 62, 0.05)',
                tension: 0.4,
                fill: true
            }
        ]
    };
    
    new Chart(ctx, {
        type: 'line',
        data: studyData,
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'top',
                    labels: {
                        usePointStyle: true,
                        padding: 20
                    }
                },
                tooltip: {
                    mode: 'index',
                    intersect: false
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            },
            interaction: {
                mode: 'nearest',
                axis: 'x',
                intersect: false
            }
        }
    });
}

function setupPomodoroTimer() {
    const timerDisplay = document.querySelector('.timer-display');
    const minutesDisplay = timerDisplay.querySelector('.timer-minutes');
    const secondsDisplay = timerDisplay.querySelector('.timer-seconds');
    const startBtn = document.getElementById('timerStart');
    const resetBtn = document.getElementById('timerReset');
    const modeButtons = document.querySelectorAll('.timer-options .btn-small');
    const sessionDisplay = document.getElementById('currentSession');
    const pomodorosDisplay = document.getElementById('todayPomodoros');
    
    let timer;
    let isRunning = false;
    let totalSeconds = 25 * 60;
    let currentMode = 'pomodoro';
    let sessionsCompleted = 0;
    let pomodorosToday = 3;
    
    function updateDisplay() {
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        
        minutesDisplay.textContent = minutes.toString().padStart(2, '0');
        secondsDisplay.textContent = seconds.toString().padStart(2, '0');
    }
    
    function startTimer() {
        if (isRunning) {
            pauseTimer();
            return;
        }
        
        isRunning = true;
        startBtn.innerHTML = '<i class="fas fa-pause"></i>';
        
        timer = setInterval(() => {
            if (totalSeconds <= 0) {
                clearInterval(timer);
                isRunning = false;
                
                // Play completion sound
                const audio = new Audio('https://assets.mixkit.co/sfx/preview/mixkit-alarm-digital-clock-beep-989.mp3');
                audio.play();
                
                // Show notification
                showNotification('Timer completed!', 'Take a short break before your next session.', 'fas fa-clock');
                
                if (currentMode === 'pomodoro') {
                    sessionsCompleted++;
                    pomodorosToday++;
                    sessionDisplay.textContent = sessionsCompleted;
                    pomodorosDisplay.textContent = pomodorosToday;
                    
                    if (sessionsCompleted % 4 === 0) {
                        // Every 4 pomodoros, suggest a long break
                        showNotification('Great work!', 'You completed 4 pomodoros. Time for a long break!', 'fas fa-fire');
                    }
                }
                
                return;
            }
            
            totalSeconds--;
            updateDisplay();
            
            // Blink colon every second
            if (totalSeconds % 2 === 0) {
                timerDisplay.querySelector('.timer-colon').style.opacity = '1';
            } else {
                timerDisplay.querySelector('.timer-colon').style.opacity = '0.5';
            }
        }, 1000);
    }
    
    function pauseTimer() {
        clearInterval(timer);
        isRunning = false;
        startBtn.innerHTML = '<i class="fas fa-play"></i>';
    }
    
    function resetTimer() {
        pauseTimer();
        setTimerByMode(currentMode);
        updateDisplay();
    }
    
    function setTimerByMode(mode) {
        switch(mode) {
            case 'pomodoro':
                totalSeconds = 25 * 60;
                break;
            case 'short':
                totalSeconds = 5 * 60;
                break;
            case 'long':
                totalSeconds = 15 * 60;
                break;
            default:
                totalSeconds = 25 * 60;
        }
        updateDisplay();
    }
    
    function changeMode(mode) {
        currentMode = mode;
        resetTimer();
        
        modeButtons.forEach(btn => {
            btn.classList.remove('active');
            if (parseInt(btn.dataset.time) === (mode === 'pomodoro' ? 25 : mode === 'short' ? 5 : 15)) {
                btn.classList.add('active');
            }
        });
    }
    
    // Event listeners
    startBtn.addEventListener('click', startTimer);
    resetBtn.addEventListener('click', resetTimer);
    
    modeButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const time = parseInt(this.dataset.time);
            if (time === 25) {
                changeMode('pomodoro');
            } else if (time === 5) {
                changeMode('short');
            } else if (time === 15) {
                changeMode('long');
            }
        });
    });
    
    // Initialize
    updateDisplay();
}

function setupSidebarToggle() {
    const sidebarToggle = document.querySelector('.sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    const mainContent = document.querySelector('.main-content');
    
    sidebarToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        
        if (window.innerWidth < 768) {
            if (sidebar.classList.contains('active')) {
                mainContent.style.marginLeft = '0';
            } else {
                mainContent.style.marginLeft = '0';
            }
        } else if (window.innerWidth < 992) {
            if (sidebar.classList.contains('active')) {
                sidebar.style.width = 'var(--sidebar-width)';
                mainContent.style.marginLeft = 'var(--sidebar-width)';
            } else {
                sidebar.style.width = 'var(--sidebar-collapsed-width)';
                mainContent.style.marginLeft = 'var(--sidebar-collapsed-width)';
            }
        }
    });
}

function setupTaskCheckboxes() {
    const checkboxes = document.querySelectorAll('.task-checkbox input[type="checkbox"]');
    
    checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            const taskItem = this.closest('.task-item');
            if (this.checked) {
                taskItem.style.opacity = '0.6';
                taskItem.style.textDecoration = 'line-through';
                
                // Update stats
                const statsCards = document.querySelectorAll('.stat-card');
                const goalsCard = statsCards[0];
                const currentText = goalsCard.querySelector('p').textContent;
                const [completed, total] = currentText.match(/\d+/g);
                
                goalsCard.querySelector('p').textContent = `${parseInt(completed) + 1}/${total} completed`;
                goalsCard.querySelector('.progress-bar').style.width = `${((parseInt(completed) + 1) / parseInt(total)) * 100}%`;
                
                // Show confetti effect for completed task
                if (taskItem.classList.contains('priority-high')) {
                    showConfetti();
                    showNotification('Task completed!', 'Great job on completing an important task!', 'fas fa-check-circle');
                }
            } else {
                taskItem.style.opacity = '1';
                taskItem.style.textDecoration = 'none';
            }
        });
    });
}

function setupMotivationQuote() {
    const quoteText = document.getElementById('motivationText');
    const quoteAuthor = document.getElementById('motivationAuthor');
    const newQuoteBtn = document.getElementById('newQuoteBtn');
    
    const quotes = [
        {
            text: "Success is the sum of small efforts, repeated day in and day out.",
            author: "Robert Collier"
        },
        {
            text: "The secret of getting ahead is getting started.",
            author: "Mark Twain"
        },
        {
            text: "Don't watch the clock; do what it does. Keep going.",
            author: "Sam Levenson"
        },
        {
            text: "The expert in anything was once a beginner.",
            author: "Helen Hayes"
        },
        {
            text: "Your limitation—it's only your imagination.",
            author: "Unknown"
        },
        {
            text: "Push yourself, because no one else is going to do it for you.",
            author: "Unknown"
        },
        {
            text: "JEE is not just an exam, it's a journey that builds character.",
            author: "JEE Topper"
        },
        {
            text: "Consistency is the key to cracking JEE.",
            author: "IIT Professor"
        }
    ];
    
    function getRandomQuote() {
        const randomIndex = Math.floor(Math.random() * quotes.length);
        return quotes[randomIndex];
    }
    
    newQuoteBtn.addEventListener('click', function() {
        const quote = getRandomQuote();
        quoteText.textContent = quote.text;
        quoteAuthor.textContent = `- ${quote.author}`;
    });
    
    // Set initial quote
    const initialQuote = getRandomQuote();
    quoteText.textContent = initialQuote.text;
    quoteAuthor.textContent = `- ${quote.author}`;
}

function setupThemeSwitcher() {
    const themeButtons = document.querySelectorAll('.theme-btn');
    
    themeButtons.forEach(button => {
        button.addEventListener('click', function() {
            const theme = this.dataset.theme;
            document.body.className = `${theme}-theme`;
            
            // Save theme preference
            localStorage.setItem('opdumo-theme', theme);
            
            // Update active button
            themeButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
        });
    });
    
    // Load saved theme
    const savedTheme = localStorage.getItem('opdumo-theme') || 'normal';
    document.body.className = `${savedTheme}-theme`;
    
    // Set active button
    themeButtons.forEach(btn => {
        if (btn.dataset.theme === savedTheme) {
            btn.classList.add('active');
        }
    });
}

function setupNavigation() {
    const menuItems = document.querySelectorAll('.sidebar-menu li');
    
    menuItems.forEach(item => {
        item.addEventListener('click', function() {
            const section = this.dataset.section;
            
            // Remove active class from all items
            menuItems.forEach(i => i.classList.remove('active'));
            
            // Add active class to clicked item
            this.classList.add('active');
            
            // Update header title
            document.querySelector('.main-header h1').textContent = this.querySelector('span').textContent;
            
            // Update breadcrumb
            const breadcrumb = document.querySelector('.breadcrumb');
            breadcrumb.innerHTML = `
                <span>Home</span>
                <i class="fas fa-chevron-right"></i>
                <span>${this.querySelector('span').textContent}</span>
            `;
            
            // Special handling for AI Tutor
            if (section === 'aitutor') {
                document.getElementById('aiTutorModal').classList.add('active');
            }
        });
    });
}

function setupModals() {
    const modals = document.querySelectorAll('.modal');
    const closeButtons = document.querySelectorAll('.close-modal');
    const newTaskBtn = document.getElementById('newTaskBtn');
    const addTaskBtn = document.getElementById('addTaskBtn');
    
    // Close modals when clicking close button or outside
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this || e.target.classList.contains('close-modal')) {
                this.classList.remove('active');
            }
        });
    });
    
    // Close modals with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            modals.forEach(modal => modal.classList.remove('active'));
        }
    });
    
    // New task button
    newTaskBtn.addEventListener('click', function() {
        document.getElementById('newTaskModal').classList.add('active');
    });
    
    addTaskBtn.addEventListener('click', function() {
        document.getElementById('newTaskModal').classList.add('active');
    });
    
    // Task form submission
    const taskForm = document.getElementById('taskForm');
    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const title = document.getElementById('taskTitle').value;
        const subject = document.getElementById('taskSubject').value;
        const chapter = document.getElementById('taskChapter').value;
        const priority = document.querySelector('input[name="priority"]:checked').value;
        const dueDate = document.getElementById('taskDueDate').value;
        const pomodoros = document.getElementById('taskPomodoros').value;
        
        // Create new task element
        const taskList = document.querySelector('.task-list');
        const newTask = document.createElement('div');
        newTask.className = `task-item priority-${priority}`;
        newTask.innerHTML = `
            <div class="task-checkbox">
                <input type="checkbox" id="task-${Date.now()}">
                <label for="task-${Date.now()}"></label>
            </div>
            <div class="task-content">
                <h3>${title}</h3>
                <p>${subject}${chapter ? ' - ' + chapter : ''}</p>
                <div class="task-meta">
                    ${dueDate ? `<span class="task-time"><i class="fas fa-clock"></i> Due ${formatDueDate(dueDate)}</span>` : ''}
                    <span class="task-pomodoros"><i class="fas fa-hourglass-half"></i> ${pomodoros} Pomodoros</span>
                </div>
            </div>
            <div class="task-actions">
                <button class="btn btn-icon">
                    <i class="fas fa-ellipsis-v"></i>
                </button>
            </div>
        `;
        
        // Add to top of task list
        taskList.prepend(newTask);
        
        // Reset form
        taskForm.reset();
        
        // Close modal
        document.getElementById('newTaskModal').classList.remove('active');
        
        // Show success message
        showNotification('Task added!', 'Your new task has been added to your list.', 'fas fa-check-circle');
        
        // Set up checkbox for new task
        setupTaskCheckboxes();
    });
    
    function formatDueDate(dateString) {
        const date = new Date(dateString);
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        
        if (date.toDateString() === today.toDateString()) {
            return 'Today';
        } else if (date.toDateString() === tomorrow.toDateString()) {
            return 'Tomorrow';
        } else {
            const diffDays = Math.ceil((date - today) / (1000 * 60 * 60 * 24));
            return `in ${diffDays} days`;
        }
    }
}

function setupProfile() {
    const profileForm = document.getElementById('profileForm');
    const changeAvatarBtn = document.getElementById('changeAvatar');
    
    // Change avatar button
    changeAvatarBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Generate random avatar
        const randomId = Math.floor(Math.random() * 100);
        const newAvatarUrl = `https://randomuser.me/api/portraits/men/${randomId}.jpg`;
        document.getElementById('profileAvatar').src = newAvatarUrl;
        
        // Update sidebar avatar
        document.querySelector('.sidebar .avatar img').src = newAvatarUrl;
    });
    
    // Profile form submission
    profileForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const fullName = document.getElementById('profileFullName').value;
        const email = document.getElementById('profileEmail').value;
        const targetYear = document.getElementById('profileTargetYear').value;
        
        // Update profile info
        document.querySelector('.profile-info h3').textContent = fullName;
        document.querySelector('.user-name').textContent = fullName;
        
        // Close modal
        document.getElementById('profileModal').classList.remove('active');
        
        // Show success message
        showNotification('Profile updated!', 'Your profile information has been saved.', 'fas fa-user');
    });
    
    // Open profile when clicking user info in sidebar
    document.querySelector('.user-profile').addEventListener('click', function() {
        document.getElementById('profileModal').classList.add('active');
    });
}

function setupAIAssistant() {
    const aiInput = document.querySelector('.ai-input input');
    const aiSendBtn = document.querySelector('.ai-input button');
    const aiMessages = document.querySelector('.ai-messages');
    
    // Sample responses
    const aiResponses = [
        "I'd recommend focusing on thermodynamics first as it's a high-weightage topic in JEE.",
        "For organic chemistry, make sure you understand the reaction mechanisms thoroughly.",
        "Practice is key for mathematics. Solve at least 20 problems daily from each topic.",
        "Here's a study plan for your next week: Monday-Physics, Tuesday-Chemistry, Wednesday-Maths, and repeat.",
        "Make sure to take regular breaks during your study sessions to maintain focus.",
        "I suggest solving previous years' JEE papers to understand the exam pattern better."
    ];
    
    function addMessage(text, isUser = false) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `ai-message ${isUser ? 'ai-user' : 'ai-response'}`;
        
        if (!isUser) {
            messageDiv.innerHTML = `
                <div class="ai-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="ai-content">
                    <p>${text}</p>
                </div>
            `;
        } else {
            messageDiv.innerHTML = `
                <div class="ai-content">
                    <p>${text}</p>
                </div>
                <div class="ai-avatar">
                    <i class="fas fa-user"></i>
                </div>
            `;
        }
        
        aiMessages.appendChild(messageDiv);
        aiMessages.scrollTop = aiMessages.scrollHeight;
    }
    
    aiSendBtn.addEventListener('click', function() {
        const question = aiInput.value.trim();
        if (question) {
            // Add user message
            addMessage(question, true);
            aiInput.value = '';
            
            // Show typing indicator
            const typingIndicator = document.createElement('div');
            typingIndicator.className = 'ai-message ai-response';
            typingIndicator.innerHTML = `
                <div class="ai-avatar">
                    <i class="fas fa-robot"></i>
                </div>
                <div class="ai-content">
                    <p class="typing">Typing...</p>
                </div>
            `;
            aiMessages.appendChild(typingIndicator);
            aiMessages.scrollTop = aiMessages.scrollHeight;
            
            // Simulate AI thinking
            setTimeout(() => {
                // Remove typing indicator
                aiMessages.removeChild(typingIndicator);
                
                // Add AI response
                const randomResponse = aiResponses[Math.floor(Math.random() * aiResponses.length)];
                addMessage(randomResponse);
            }, 1500);
        }
    });
    
    // Allow sending with Enter key
    aiInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            aiSendBtn.click();
        }
    });
}

function setupNotifications() {
    const notificationBadge = document.querySelector('.notification-badge');
    let notificationCount = parseInt(notificationBadge.textContent);
    
    // Sample function to show notification
    window.showNotification = function(title, message, icon) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification-item';
        notification.innerHTML = `
            <div class="notification-icon">
                <i class="${icon}"></i>
            </div>
            <div class="notification-content">
                <p>${title}</p>
                <span>${message}</span>
            </div>
        `;
        
        // Add to dropdown
        const dropdown = document.querySelector('.notification-dropdown .notification-item:first-child');
        dropdown.parentNode.insertBefore(notification, dropdown);
        
        // Update badge count
        notificationCount++;
        notificationBadge.textContent = notificationCount;
        
        // Show desktop notification if supported
        if ('Notification' in window && Notification.permission === 'granted') {
            new Notification(title, { body: message });
        }
    };
    
    // Request notification permission
    if ('Notification' in window) {
        Notification.requestPermission();
    }
}

function showConfetti() {
    const confettiContainer = document.createElement('div');
    confettiContainer.style.position = 'fixed';
    confettiContainer.style.top = '0';
    confettiContainer.style.left = '0';
    confettiContainer.style.width = '100%';
    confettiContainer.style.height = '100%';
    confettiContainer.style.pointerEvents = 'none';
    confettiContainer.style.zIndex = '1000';
    document.body.appendChild(confettiContainer);
    
    const colors = ['#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5', '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4CAF50', '#8BC34A', '#CDDC39', '#FFEB3B', '#FFC107', '#FF9800', '#FF5722'];
    
    for (let i = 0; i < 100; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'absolute';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.borderRadius = '50%';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.opacity = '0';
        confettiContainer.appendChild(confetti);
        
        const animationDuration = Math.random() * 3 + 2;
        
        confetti.animate([
            { 
                opacity: 0,
                top: '-10px',
                transform: 'rotate(0deg)'
            },
            { 
                opacity: 1,
                offset: 0.1
            },
            { 
                opacity: 1,
                offset: 0.9
            },
            { 
                opacity: 0,
                top: '100vh',
                transform: 'rotate(360deg)'
            }
        ], {
            duration: animationDuration * 1000,
            easing: 'cubic-bezier(0.1, 0.8, 0.9, 1)'
        });
    }
    
    setTimeout(() => {
        confettiContainer.remove();
    }, 5000);
}