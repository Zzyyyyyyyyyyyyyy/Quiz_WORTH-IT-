document.addEventListener('DOMContentLoaded', function() {
    // Get references to important elements
    const quizForm = document.getElementById('quiz-form');
    const resultsContainer = document.getElementById('results-container');
    const saveCardButton = document.getElementById('save-card');
    const restartQuizButton = document.getElementById('restart-quiz');
    
    // Add event listeners
    if (quizForm) {
        quizForm.addEventListener('submit', handleSubmit);
    }
    
    if (saveCardButton) {
        saveCardButton.addEventListener('click', saveDignityCard);
    }
    
    if (restartQuizButton) {
        restartQuizButton.addEventListener('click', restartQuiz);
    }
    
    // Check if there's saved quiz data
    loadSavedQuizData();
    
    // Add tech-inspired particle background
    initParticleBackground();
    
    // Add interactive elements
    addInteractiveElements();

    // Add auto animation for radio buttons
    initRadioButtonEffects();

    // Initialize progress bar
    updateProgressBar(1);
});

// Initialize particle background for tech feel
function initParticleBackground() {
    const container = document.querySelector('.container');
    
    // Create floating elements
    for (let i = 0; i < 15; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        const size = Math.random() * 10 + 5;
        
        // Random position
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        
        // Random opacity and animation duration
        const opacity = Math.random() * 0.15 + 0.05;
        const animDuration = Math.random() * 20 + 15;
        
        // Apply styles
        particle.style.cssText = `
            position: absolute;
            top: ${posY}%;
            left: ${posX}%;
            width: ${size}px;
            height: ${size}px;
            background: linear-gradient(135deg, var(--primary-color), var(--secondary-color));
            border-radius: 50%;
            opacity: ${opacity};
            z-index: -1;
            animation: float ${animDuration}s infinite ease-in-out;
            animation-delay: ${Math.random() * 5}s;
        `;
        
        // Add to container
        container.appendChild(particle);
    }
    
    // Add floating animation style
    if (!document.getElementById('particle-style')) {
        const style = document.createElement('style');
        style.id = 'particle-style';
        style.textContent = `
            @keyframes float {
                0% { transform: translate(0, 0) rotate(0deg); }
                25% { transform: translate(10px, 15px) rotate(5deg); }
                50% { transform: translate(15px, 5px) rotate(0deg); }
                75% { transform: translate(5px, 10px) rotate(-5deg); }
                100% { transform: translate(0, 0) rotate(0deg); }
            }
        `;
        document.head.appendChild(style);
    }
}

// Add interactive elements to enhance user experience
function addInteractiveElements() {
    // Add ripple effect to buttons
    const buttons = document.querySelectorAll('button, .button');
    buttons.forEach(button => {
        button.addEventListener('click', createRippleEffect);
    });
    
    // Add hover effects for cards
    const cards = document.querySelectorAll('.question-card, .intro, #results-container');
    cards.forEach(card => {
        card.addEventListener('mousemove', createCardTiltEffect);
        card.addEventListener('mouseleave', removeCardTiltEffect);
    });
}

// Create ripple effect on button click
function createRippleEffect(event) {
    const button = event.currentTarget;
    
    // Create ripple element
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    
    // Get button dimensions and position
    const rect = button.getBoundingClientRect();
    
    // Calculate ripple size
    const size = Math.max(rect.width, rect.height) * 2;
    
    // Get click position relative to button
    const x = event.clientX - rect.left - (size / 2);
    const y = event.clientY - rect.top - (size / 2);
    
    // Apply position and styles
    ripple.style.width = ripple.style.height = `${size}px`;
    ripple.style.left = `${x}px`;
    ripple.style.top = `${y}px`;
    
    // Add to button
    button.appendChild(ripple);
    
    // Remove ripple after animation completes
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// Create tilt effect on card hover
function createCardTiltEffect(event) {
    const card = event.currentTarget;
    
    // Get card dimensions
    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    // Calculate tilt values (reduced for subtlety)
    const tiltX = ((y / rect.height) - 0.5) * 3;
    const tiltY = ((x / rect.width) - 0.5) * -3;
    
    // Apply transform
    card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
    
    // Add highlight effect
    const shine = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.15), rgba(255,255,255,0) 80%)`;
    card.style.backgroundImage = shine;
}

// Remove tilt effect when mouse leaves
function removeCardTiltEffect(event) {
    const card = event.currentTarget;
    card.style.transform = '';
    card.style.backgroundImage = '';
}

// Initialize animations for radio buttons
function initRadioButtonEffects() {
    // For radio button interactions
    const radioInputs = document.querySelectorAll('input[type="radio"], input[type="checkbox"]');
    radioInputs.forEach(input => {
        input.addEventListener('change', () => {
            if (input.checked) {
                // Animate the parent label
                const label = input.closest('label');
                if (label) {
                    // Add pulse animation
                    label.classList.add('pulse-animate');
                    setTimeout(() => {
                        label.classList.remove('pulse-animate');
                    }, 500);
                }
            }
        });
    });
    
    // Add styles for animation
    if (!document.getElementById('pulse-style')) {
        const style = document.createElement('style');
        style.id = 'pulse-style';
        style.textContent = `
            @keyframes pulse {
                0% { transform: scale(1) translateX(5px); }
                50% { transform: scale(1.03) translateX(5px); }
                100% { transform: scale(1) translateX(5px); }
            }
            .pulse-animate {
                animation: pulse 0.5s ease;
            }
            .ripple-effect {
                position: absolute;
                border-radius: 50%;
                background: rgba(255, 255, 255, 0.4);
                transform: scale(0);
                animation: ripple 0.6s linear;
                pointer-events: none;
            }
            @keyframes ripple {
                to {
                    transform: scale(2);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }
}

// Navigation functions
function nextQuestion(currentQuestionNumber) {
    const currentQuestion = document.getElementById(`q${currentQuestionNumber}`);
    const nextQuestion = document.getElementById(`q${currentQuestionNumber + 1}`);
    
    // Validate required fields for the current question
    if (!validateQuestion(currentQuestion)) {
        shakeElement(currentQuestion);
        return;
    }
    
    // Update progress bar
    updateProgressBar(currentQuestionNumber + 1);
    
    // Slide transition effect
    currentQuestion.style.transform = 'translateX(-100px)';
    currentQuestion.style.opacity = '0';
    
    setTimeout(() => {
        // Hide current question and show next question
        currentQuestion.classList.add('hidden');
        currentQuestion.style.transform = '';
        currentQuestion.style.opacity = '';
        
        nextQuestion.classList.remove('hidden');
        
        // Start entrance animation
        nextQuestion.style.transform = 'translateX(100px)';
        nextQuestion.style.opacity = '0';
        
        setTimeout(() => {
            nextQuestion.style.transform = 'translateX(0)';
            nextQuestion.style.opacity = '1';
        }, 50);
        
        // Save the current progress
        saveQuizProgress();
        
        // Scroll to top of question
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, 300);
}

function prevQuestion(currentQuestionNumber) {
    const currentQuestion = document.getElementById(`q${currentQuestionNumber}`);
    const prevQuestion = document.getElementById(`q${currentQuestionNumber - 1}`);
    
    // Update progress bar
    updateProgressBar(currentQuestionNumber - 1);
    
    // Slide transition effect
    currentQuestion.style.transform = 'translateX(100px)';
    currentQuestion.style.opacity = '0';
    
    setTimeout(() => {
        // Hide current question and show previous question
        currentQuestion.classList.add('hidden');
        currentQuestion.style.transform = '';
        currentQuestion.style.opacity = '';
        
        prevQuestion.classList.remove('hidden');
        
        // Start entrance animation
        prevQuestion.style.transform = 'translateX(-100px)';
        prevQuestion.style.opacity = '0';
        
        setTimeout(() => {
            prevQuestion.style.transform = 'translateX(0)';
            prevQuestion.style.opacity = '1';
        }, 50);
        
        // Scroll to top of question
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, 300);
}

// Update progress bar based on current question
function updateProgressBar(questionNumber) {
    const totalQuestions = 8; // Total number of questions
    const progressFill = document.getElementById('progress-fill');
    const progressPercentage = document.querySelector('.progress-percentage');
    const currentQuestionText = document.querySelector('.current-question');
    
    if (progressFill && progressPercentage && currentQuestionText) {
        // Calculate progress percentage
        const progress = (questionNumber / totalQuestions) * 100;
        
        // Animate progress bar
        progressFill.style.width = `${progress}%`;
        
        // Update text indicators
        progressPercentage.textContent = `${Math.round(progress)}%`;
        currentQuestionText.textContent = `Question ${questionNumber}`;
        
        // Add pulse animation to progress bar
        progressFill.classList.add('pulse-progress');
        setTimeout(() => {
            progressFill.classList.remove('pulse-progress');
        }, 500);
    }
}

// Add pulse animation style if not exists
if (!document.getElementById('progress-pulse-style')) {
    const style = document.createElement('style');
    style.id = 'progress-pulse-style';
    style.textContent = `
        @keyframes pulse-progress {
            0%, 100% { opacity: 1; }
            50% { opacity: 0.7; }
        }
        .pulse-progress {
            animation: pulse-progress 0.5s ease;
        }
    `;
    document.head.appendChild(style);
}

// Shake effect for validation errors
function shakeElement(element) {
    element.classList.add('shake-effect');
    setTimeout(() => {
        element.classList.remove('shake-effect');
    }, 600);
    
    // Add shake animation if it doesn't exist
    if (!document.getElementById('shake-style')) {
        const style = document.createElement('style');
        style.id = 'shake-style';
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                10%, 30%, 50%, 70%, 90% { transform: translateX(-5px); }
                20%, 40%, 60%, 80% { transform: translateX(5px); }
            }
            .shake-effect {
                animation: shake 0.6s cubic-bezier(.36,.07,.19,.97) both;
            }
        `;
        document.head.appendChild(style);
    }
}

function validateQuestion(questionElement) {
    // For questions with required radio buttons
    const radioGroups = questionElement.querySelectorAll('input[type="radio"][required]');
    for (let radioGroup of radioGroups) {
        const groupName = radioGroup.getAttribute('name');
        const checkedRadio = questionElement.querySelector(`input[name="${groupName}"]:checked`);
        
        if (!checkedRadio) {
            // Visual feedback for validation error
            const groupLabels = questionElement.querySelectorAll(`input[name="${groupName}"]`).forEach(input => {
                const label = input.closest('label');
                if (label) {
                    label.classList.add('highlight-required');
                    setTimeout(() => {
                        label.classList.remove('highlight-required');
                    }, 1500);
                }
            });
            
            // Add highlight style if needed
            if (!document.getElementById('highlight-style')) {
                const style = document.createElement('style');
                style.id = 'highlight-style';
                style.textContent = `
                    @keyframes pulse-highlight {
                        0%, 100% { border-color: rgba(255, 0, 0, 0.3); box-shadow: 0 0 0 rgba(255, 0, 0, 0.3); }
                        50% { border-color: rgba(255, 0, 0, 0.6); box-shadow: 0 0 5px rgba(255, 0, 0, 0.3); }
                    }
                    .highlight-required {
                        animation: pulse-highlight 1.5s ease infinite;
                    }
                `;
                document.head.appendChild(style);
            }
            
            // Show toast notification instead of alert
            showToast('Please select an option before proceeding.', 'warning');
            return false;
        }
    }
    
    return true;
}

// Show toast notification
function showToast(message, type = 'info') {
    // Create toast container if it doesn't exist
    let toastContainer = document.getElementById('toast-container');
    if (!toastContainer) {
        toastContainer = document.createElement('div');
        toastContainer.id = 'toast-container';
        toastContainer.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 9999;
        `;
        document.body.appendChild(toastContainer);
        
        // Add styles
        if (!document.getElementById('toast-style')) {
            const style = document.createElement('style');
            style.id = 'toast-style';
            style.textContent = `
                .toast {
                    margin-bottom: 10px;
                    padding: 15px 25px;
                    background: white;
                    color: #333;
                    border-radius: 8px;
                    box-shadow: 0 3px 10px rgba(0,0,0,0.1), 0 3px 3px rgba(0,0,0,0.05);
                    display: flex;
                    align-items: center;
                    transform: translateX(120%);
                    transition: transform 0.3s ease;
                    position: relative;
                    overflow: hidden;
                }
                .toast::before {
                    content: '';
                    position: absolute;
                    left: 0;
                    top: 0;
                    height: 100%;
                    width: 5px;
                }
                .toast.info::before { background: var(--primary-color); }
                .toast.success::before { background: var(--success-color); }
                .toast.warning::before { background: #ff9800; }
                .toast.error::before { background: #f44336; }
                .toast.show { transform: translateX(0); }
                .toast-progress {
                    position: absolute;
                    bottom: 0;
                    left: 0;
                    height: 3px;
                    background: rgba(0,0,0,0.1);
                    width: 100%;
                }
                .toast-progress::after {
                    content: '';
                    position: absolute;
                    top: 0;
                    left: 0;
                    height: 100%;
                    width: 100%;
                    background: var(--primary-color);
                    animation: toast-progress 3s linear forwards;
                }
                @keyframes toast-progress {
                    to { width: 0%; }
                }
            `;
            document.head.appendChild(style);
        }
    }
    
    // Create toast element
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.innerHTML = `
        ${message}
        <div class="toast-progress"></div>
    `;
    toastContainer.appendChild(toast);
    
    // Show toast with animation
    setTimeout(() => {
        toast.classList.add('show');
    }, 10);
    
    // Remove toast after 3 seconds
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// Form submission handler
function handleSubmit(event) {
    event.preventDefault();
    
    // Validate the final question
    const finalQuestion = document.getElementById('q8');
    if (!validateQuestion(finalQuestion)) {
        shakeElement(finalQuestion);
        return;
    }
    
    // Show loading animation
    showLoadingOverlay();
    
    // Collect all form data
    const formData = new FormData(event.target);
    
    // Convert FormData to a regular object
    let quizData = {};
    for (let [key, value] of formData.entries()) {
        // Handle checkbox values (multiple selections)
        if (key === 'experiences') {
            if (!quizData[key]) {
                quizData[key] = [];
            }
            quizData[key].push(value);
        } else {
            quizData[key] = value;
        }
    }
    
    // Add timestamp and unique ID
    quizData.timestamp = new Date().toISOString();
    quizData.id = generateUniqueId();
    
    // Delay for animation effect
    setTimeout(() => {
        // Hide loading
        hideLoadingOverlay();
        
        // Calculate and display results
        displayResults(quizData);
        
        // Hide quiz with fade-out animation
        const quizContainer = document.getElementById('quiz-container');
        quizContainer.style.opacity = '0';
        quizContainer.style.transform = 'translateY(-20px)';
        
        setTimeout(() => {
            // Hide quiz and show results
            quizContainer.classList.add('hidden');
            document.getElementById('results-container').classList.remove('hidden');
            
            // Animate results bars after a delay
            setTimeout(() => {
                // Get income and value score
                const earningsCategory = quizData.earnings;
                const trueValueScore = calculateTrueValueScore(quizData);
                
                // Animate bars
                animateValueBars(earningsCategory, trueValueScore);
            }, 500);
        }, 300);
        
        // Save completed quiz data locally
        localStorage.setItem('quizCompleted', 'true');
        localStorage.setItem('quizData', JSON.stringify(quizData));
        
        // Scroll to top with smooth animation
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }, 1500);
}

// Show loading overlay
function showLoadingOverlay() {
    // Create overlay if it doesn't exist
    let overlay = document.getElementById('loading-overlay');
    if (!overlay) {
        overlay = document.createElement('div');
        overlay.id = 'loading-overlay';
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background: rgba(255, 255, 255, 0.8);
            display: flex;
            justify-content: center;
            align-items: center;
            z-index: 9999;
            backdrop-filter: blur(3px);
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        // Create loading spinner
        const spinner = document.createElement('div');
        spinner.className = 'loading-spinner';
        overlay.appendChild(spinner);
        
        // Add spinner style
        if (!document.getElementById('spinner-style')) {
            const style = document.createElement('style');
            style.id = 'spinner-style';
            style.textContent = `
                .loading-spinner {
                    width: 50px;
                    height: 50px;
                    border: 3px solid rgba(0, 0, 0, 0.1);
                    border-radius: 50%;
                    border-top-color: var(--primary-color);
                    animation: spinner 1s linear infinite;
                    box-shadow: 0 0 20px rgba(61, 99, 255, 0.2);
                }
                @keyframes spinner {
                    to { transform: rotate(360deg); }
                }
            `;
            document.head.appendChild(style);
        }
        
        document.body.appendChild(overlay);
    }
    
    // Show overlay with animation
    setTimeout(() => {
        overlay.style.opacity = '1';
    }, 10);
}

// Hide loading overlay
function hideLoadingOverlay() {
    const overlay = document.getElementById('loading-overlay');
    if (overlay) {
        overlay.style.opacity = '0';
        setTimeout(() => {
            overlay.remove();
        }, 300);
    }
}

// Generate a unique ID for each response
function generateUniqueId() {
    return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Animate value bars
function animateValueBars(earningsCategory, trueValueScore) {
    // Set income bar width based on earnings category
    const incomeBar = document.getElementById('income-bar');
    let incomeWidth = 0;
    
    switch(earningsCategory) {
        case 'under-20': incomeWidth = 25; break;
        case '20-50': incomeWidth = 50; break;
        case '50-100': incomeWidth = 75; break;
        case '100-plus': incomeWidth = 100; break;
    }
    
    // Trigger animation by setting the width
    incomeBar.style.width = `${incomeWidth}%`;
    
    // Set value bar width based on true value score
    const valueBar = document.getElementById('value-bar');
    valueBar.style.width = `${trueValueScore}%`;
}

// Calculate and display quiz results
function displayResults(quizData) {
    // Calculate income value based on earnings selection
    let incomeValue = '$0';
    switch(quizData.earnings) {
        case 'under-20':
            incomeValue = 'Less than $20';
            break;
        case '20-50':
            incomeValue = '$20 - $50';
            break;
        case '50-100':
            incomeValue = '$50 - $100';
            break;
        case '100-plus':
            incomeValue = 'More than $100';
            break;
    }
    
    // Display income value
    document.getElementById('income-value').textContent = incomeValue;
    
    // Calculate "true value" score based on various factors
    let trueValueScore = calculateTrueValueScore(quizData);
    
    // Adjust the balance visualization
    updateBalanceVisualization(quizData.earnings, trueValueScore);
    
    // Display message to platform
    const messageEl = document.getElementById('your-message');
    messageEl.textContent = quizData['message-to-platform'] || 'No message provided.';
}

function calculateTrueValueScore(quizData) {
    let score = 50; // Base score
    
    // Add points based on hours worked
    switch(quizData.hours) {
        case 'less-than-2': score += 5; break;
        case '2-4': score += 10; break;
        case '5-7': score += 15; break;
        case 'more-than-8': score += 20; break;
    }
    
    // Add points for platform fragmentation
    switch(quizData.platforms) {
        case 'one': score += 5; break;
        case 'two': score += 10; break;
        case 'three-plus': score += 15; break;
    }
    
    // Add points for emotional drain
    switch(quizData['emotional-drain']) {
        case 'not-at-all': break;
        case 'little-tired': score += 5; break;
        case 'drained-detached': score += 15; break;
        case 'numb-anxious': score += 25; break;
    }
    
    // Add points for negative experiences
    const experiences = Array.isArray(quizData.experiences) ? quizData.experiences.length : 0;
    score += experiences * 5;
    
    // Add points for lack of appreciation
    switch(quizData.appreciation) {
        case 'yes-genuine': break;
        case 'yes-brief': score += 5; break;
        case 'no': score += 15; break;
    }
    
    return score;
}

function updateBalanceVisualization(earningsCategory, trueValueScore) {
    // Set income bar width based on earnings category
    const incomeBar = document.getElementById('income-bar');
    let incomeWidth = 0;
    
    switch(earningsCategory) {
        case 'under-20': incomeWidth = 25; break;
        case '20-50': incomeWidth = 50; break;
        case '50-100': incomeWidth = 75; break;
        case '100-plus': incomeWidth = 100; break;
    }
    
    incomeBar.style.width = `${incomeWidth}%`;
    
    // Set value bar width based on true value score
    const valueBar = document.getElementById('value-bar');
    valueBar.style.width = `${trueValueScore}%`;
}

// Save and load quiz progress
function saveQuizProgress() {
    const formData = new FormData(document.getElementById('quiz-form'));
    const quizData = Object.fromEntries(formData);
    
    localStorage.setItem('quizInProgress', 'true');
    localStorage.setItem('quizData', JSON.stringify(quizData));
}

function loadSavedQuizData() {
    const quizCompleted = localStorage.getItem('quizCompleted') === 'true';
    const quizInProgress = localStorage.getItem('quizInProgress') === 'true';
    
    if (quizCompleted) {
        // Show completed quiz results
        const quizDataString = localStorage.getItem('quizData');
        if (quizDataString) {
            const quizData = JSON.parse(quizDataString);
            
            // Hide quiz and show results
            if (document.getElementById('quiz-container')) {
                document.getElementById('quiz-container').classList.add('hidden');
            }
            if (document.getElementById('results-container')) {
                document.getElementById('results-container').classList.remove('hidden');
                displayResults(quizData);
            }
        }
    } else if (quizInProgress) {
        // Resume quiz in progress
        const quizDataString = localStorage.getItem('quizData');
        if (quizDataString && document.getElementById('quiz-form')) {
            const quizData = JSON.parse(quizDataString);
            
            // Fill in saved answers
            fillFormWithSavedData(quizData);
        }
    }
}

function fillFormWithSavedData(quizData) {
    // Fill in radio buttons
    for (const [name, value] of Object.entries(quizData)) {
        const radioInput = document.querySelector(`input[name="${name}"][value="${value}"]`);
        if (radioInput) {
            radioInput.checked = true;
        }
        
        // For checkboxes (special handling for experiences)
        if (name === 'experiences') {
            const values = Array.isArray(value) ? value : [value];
            values.forEach(val => {
                const checkbox = document.querySelector(`input[name="experiences"][value="${val}"]`);
                if (checkbox) {
                    checkbox.checked = true;
                }
            });
        }
        
        // For textarea
        if (name === 'message-to-platform') {
            const textarea = document.querySelector('textarea[name="message-to-platform"]');
            if (textarea) {
                textarea.value = value;
            }
        }
    }
}

// Save dignity card as PDF
function saveDignityCard() {
    // Show loading animation
    showLoadingOverlay();
    
    // Get the saved quiz data
    const quizDataString = localStorage.getItem('quizData');
    if (!quizDataString) {
        hideLoadingOverlay();
        showToast('No quiz data found to save.', 'error');
        return;
    }
    
    // Parse the quiz data
    const quizData = JSON.parse(quizDataString);
    
    try {
        // Initialize jsPDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();
        
        // Set document properties
        doc.setProperties({
            title: 'Worker Dignity Card',
            subject: 'Work or Worth Quiz Results',
            author: 'Work or Worth Quiz',
            keywords: 'gig work, dignity, labor value',
            creator: 'Work or Worth Quiz'
        });
        
        // Add document title
        doc.setFontSize(22);
        doc.setTextColor(74, 111, 165); // Primary color
        doc.text('WORKER DIGNITY CARD', 105, 20, { align: 'center' });
        
        doc.setFontSize(14);
        doc.setTextColor(156, 137, 184); // Secondary color
        doc.text(`Generated on ${new Date().toLocaleDateString()}`, 105, 30, { align: 'center' });
        
        // Add horizontal line
        doc.setDrawColor(74, 111, 165);
        doc.setLineWidth(0.5);
        doc.line(20, 35, 190, 35);
        
        // Economic Value Section
        doc.setFontSize(16);
        doc.setTextColor(74, 111, 165);
        doc.text('YOUR ECONOMIC VALUE', 20, 50);
        
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        
        // Format income value
        let incomeValue = '$0';
        switch(quizData.earnings) {
            case 'under-20': incomeValue = 'Less than $20'; break;
            case '20-50': incomeValue = '$20 - $50'; break;
            case '50-100': incomeValue = '$50 - $100'; break;
            case '100-plus': incomeValue = 'More than $100'; break;
        }
        
        doc.text(`Hours worked: ${formatValue(quizData.hours)}`, 25, 60);
        doc.text(`Platforms used: ${formatValue(quizData.platforms)}`, 25, 70);
        doc.text(`Income today: ${incomeValue}`, 25, 80);
        
        // True Value Section
        doc.setFontSize(16);
        doc.setTextColor(240, 168, 104); // Accent color
        doc.text('YOUR TRUE VALUE', 20, 100);
        
        doc.setFontSize(12);
        doc.setTextColor(0, 0, 0);
        doc.text("But your worth — in resilience, in care, in grit — can't be calculated.", 25, 110);
        
        // Emotional State
        doc.text(`Emotional state: ${formatValue(quizData['emotional-drain'])}`, 25, 125);
        
        // Appreciated
        doc.text(`Received appreciation: ${formatValue(quizData.appreciation)}`, 25, 135);
        
        // Proud of
        doc.text(`What you felt proud of: ${formatValue(quizData['proud-of'])}`, 25, 145);
        
        // Negative Experiences
        if (quizData.experiences && quizData.experiences.length) {
            doc.text('Challenges faced:', 25, 160);
            
            const experiences = Array.isArray(quizData.experiences) ? quizData.experiences : [quizData.experiences];
            let yPos = 170;
            
            experiences.forEach(exp => {
                doc.text(`• ${formatValue(exp)}`, 30, yPos);
                yPos += 10;
            });
        }
        
        // Message to Platform
        if (quizData['message-to-platform']) {
            doc.setFontSize(16);
            doc.setTextColor(74, 111, 165);
            doc.text('YOUR MESSAGE TO THE PLATFORM', 20, 200);
            
            doc.setFontSize(12);
            doc.setTextColor(0, 0, 0);
            
            // Handle long messages by wrapping text
            const message = quizData['message-to-platform'];
            const splitMessage = doc.splitTextToSize(message, 170);
            doc.text(splitMessage, 25, 210);
        }
        
        // Footer
        doc.setFontSize(10);
        doc.setTextColor(100, 100, 100);
        doc.text('Generated by the Work or Worth Quiz — Challenging how we value gig work.', 105, 280, { align: 'center' });
        
        // Hide loading overlay
        hideLoadingOverlay();
        
        // Save the PDF
        const filename = `dignity-card-${new Date().toISOString().split('T')[0]}.pdf`;
        doc.save(filename);
        
        // Show success toast
        showToast('Your Dignity Card has been saved as a PDF to your device.', 'success');
    } catch (error) {
        console.error('Error generating PDF:', error);
        hideLoadingOverlay();
        showToast('There was an error creating the PDF. Please try again.', 'error');
    }
}

// Format values for display
function formatValue(value) {
    if (!value) return 'N/A';
    
    // Replace hyphens with spaces and capitalize first letter of each word
    return value.replace(/-/g, ' ')
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

// Restart the quiz
function restartQuiz() {
    // Show confirmation with animation
    if (confirm('Are you sure you want to restart the quiz? Your current results will be cleared.')) {
        // Show loading animation
        showLoadingOverlay();
        
        setTimeout(() => {
            // Clear local storage
            localStorage.removeItem('quizCompleted');
            localStorage.removeItem('quizInProgress');
            localStorage.removeItem('quizData');
            
            // Hide results with animation
            const resultsContainer = document.getElementById('results-container');
            resultsContainer.style.opacity = '0';
            resultsContainer.style.transform = 'translateY(-20px)';
            
            setTimeout(() => {
                // Show first question and hide results
                if (document.getElementById('quiz-container')) {
                    document.getElementById('quiz-container').classList.remove('hidden');
                    document.getElementById('quiz-container').style.opacity = '1';
                    document.getElementById('quiz-container').style.transform = '';
                }
                if (resultsContainer) {
                    resultsContainer.classList.add('hidden');
                    resultsContainer.style.opacity = '';
                    resultsContainer.style.transform = '';
                }
                
                // Reset all question cards
                const questionCards = document.querySelectorAll('.question-card');
                questionCards.forEach((card, index) => {
                    if (index === 0) {
                        card.classList.remove('hidden');
                    } else {
                        card.classList.add('hidden');
                    }
                });
                
                // Reset form
                const quizForm = document.getElementById('quiz-form');
                if (quizForm) {
                    quizForm.reset();
                }
                
                // Hide loading overlay
                hideLoadingOverlay();
                
                // Show success toast
                showToast('Quiz has been reset. You can start again.', 'info');
                
                // Scroll to top with smooth animation
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            }, 300);
        }, 800);
    }
} 