// Основной класс приложения
class PsychoSafetyApp {
    constructor() {
        this.currentBreathingInterval = null;
        this.breathingStartTime = null;
        this.breathingTimerInterval = null;
        this.init();
    }

    init() {
        this.setupMobileMenu();
        this.setupSmoothScroll();
        this.setupActiveNav();
        this.setupAnimations();
        this.setupPageSpecificFeatures();
        this.setupEventListeners();
        this.loadSavedData();
    }

    // Мобильное меню
    setupMobileMenu() {
        const navToggle = document.querySelector('.nav-toggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', (e) => {
                e.stopPropagation();
                navMenu.classList.toggle('active');
                navToggle.classList.toggle('active');
            });

            // Закрытие меню при клике на ссылку
            document.querySelectorAll('.nav-link').forEach(link => {
                link.addEventListener('click', () => {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                });
            });

            // Закрытие меню при клике вне его
            document.addEventListener('click', (e) => {
                if (!e.target.closest('.nav-container')) {
                    navMenu.classList.remove('active');
                    navToggle.classList.remove('active');
                }
            });
        }
    }

    // Плавная прокрутка
    setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', function (e) {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    const offsetTop = target.offsetTop - 70;
                    window.scrollTo({
                        top: offsetTop,
                        behavior: 'smooth'
                    });
                }
            });
        });
    }

    // Активная навигация
    setupActiveNav() {
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        document.querySelectorAll('.nav-link').forEach(link => {
            const linkHref = link.getAttribute('href');
            if (linkHref === currentPage || (currentPage === '' && linkHref === 'index.html')) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    }

    // Анимации появления
    setupAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in-up');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        document.querySelectorAll('.card, .stat-card, .feature-card, .type-card, .step-card, .finding-card').forEach(el => {
            observer.observe(el);
        });
    }

    // Настройка обработчиков событий
    setupEventListeners() {
        // Обработчики для чек-листов
        document.querySelectorAll('.checklist-item input').forEach(input => {
            input.addEventListener('change', this.handleChecklistChange.bind(this));
        });

        // Обработчики для точек симптомов
        document.querySelectorAll('.level-dot').forEach(dot => {
            dot.addEventListener('click', this.handleSymptomLevelClick.bind(this));
        });

        // Обработчики для эмоциональных тегов
        document.querySelectorAll('.emotion-tag').forEach(tag => {
            tag.addEventListener('click', this.handleEmotionTagClick.bind(this));
        });
    }

    // Загрузка сохраненных данных
    loadSavedData() {
        this.loadBoundaries();
        this.loadDefensePlan();
    }

    // Функции для конкретных страниц
    setupPageSpecificFeatures() {
        const currentPage = window.location.pathname.split('/').pop();
        
        switch(currentPage) {
            case 'research.html':
                this.setupCharts();
                break;
            case 'tools.html':
                this.setupTools();
                break;
        }
    }

    // ========== ИНСТРУМЕНТЫ ==========

    // Чек-лист манипуляций
    handleChecklistChange(e) {
        const parent = e.target.parentElement;
        if (e.target.checked) {
            parent.style.opacity = '0.6';
            parent.style.textDecoration = 'line-through';
        } else {
            parent.style.opacity = '1';
            parent.style.textDecoration = 'none';
        }
    }

    calculateManipulationScore() {
        const checkboxes = document.querySelectorAll('#manipulationChecklist input:checked');
        const score = checkboxes.length;
        const resultsDiv = document.getElementById('manipulationResults');
        const scoreDiv = resultsDiv.querySelector('.results-score');
        const messageDiv = resultsDiv.querySelector('.results-message');

        let message = '';
        let color = '';

        if (score === 0) {
            message = 'Отличный результат! Вы хорошо защищены от манипуляций.';
            color = 'var(--success)';
        } else if (score <= 2) {
            message = 'Внимание! Есть признаки возможных манипуляций. Рекомендуется развивать навыки распознавания.';
            color = 'var(--warning)';
        } else if (score <= 4) {
            message = 'Тревожный сигнал! Вы подвергаетесь систематическим манипуляциям. Рекомендуется обратиться к психологу.';
            color = 'var(--danger)';
        } else {
            message = 'Критическая ситуация! Необходима срочная психологическая помощь и изменение окружения.';
            color = 'var(--danger)';
        }

        scoreDiv.innerHTML = `<strong>Результат: ${score} из 6</strong>`;
        scoreDiv.style.color = color;
        messageDiv.textContent = message;
        resultsDiv.style.display = 'block';
        resultsDiv.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    resetChecklist(checklistId) {
        const checklist = document.getElementById(checklistId);
        const checkboxes = checklist.querySelectorAll('input');
        checkboxes.forEach(checkbox => {
            checkbox.checked = false;
            checkbox.parentElement.style.opacity = '1';
            checkbox.parentElement.style.textDecoration = 'none';
        });
        document.getElementById('manipulationResults').style.display = 'none';
    }

    // Тест на выгорание
    handleSymptomLevelClick(e) {
        const dot = e.target;
        if (!dot.classList.contains('level-dot')) return;

        const symptomLevel = dot.closest('.symptom-level');
        const dots = symptomLevel.querySelectorAll('.level-dot');
        const clickedLevel = parseInt(dot.getAttribute('data-level'));

        dots.forEach((d, index) => {
            if (index < clickedLevel) {
                d.classList.add('active');
            } else {
                d.classList.remove('active');
            }
        });
    }

    calculateBurnoutScore() {
        const symptoms = document.querySelectorAll('.symptom-level');
        let totalScore = 0;
        let maxScore = symptoms.length * 5;
        
        symptoms.forEach(symptom => {
            const activeDots = symptom.querySelectorAll('.level-dot.active').length;
            totalScore += activeDots;
        });
        
        const percentage = Math.round((totalScore / maxScore) * 100);
        this.showBurnoutResults(percentage, totalScore);
    }

    showBurnoutResults(percentage, score) {
        let resultsSection = document.querySelector('.results-section');
        
        if (!resultsSection) {
            resultsSection = document.createElement('div');
            resultsSection.className = 'results-section';
            document.querySelector('.tool-card:nth-child(2)').appendChild(resultsSection);
        }

        let message = '';
        let recommendations = '';

        if (percentage <= 20) {
            message = 'Низкий риск выгорания';
            recommendations = `
                <div class="recommendation-item">
                    <i class="bi bi-check-circle recommendation-icon"></i>
                    <span>Продолжайте практиковать здоровые привычки</span>
                </div>
                <div class="recommendation-item">
                    <i class="bi bi-heart recommendation-icon"></i>
                    <span>Регулярно занимайтесь профилактикой стресса</span>
                </div>
            `;
        } else if (percentage <= 50) {
            message = 'Умеренный риск';
            recommendations = `
                <div class="recommendation-item">
                    <i class="bi bi-clock recommendation-icon"></i>
                    <span>Увеличьте время отдыха и восстановления</span>
                </div>
                <div class="recommendation-item">
                    <i class="bi bi-people recommendation-icon"></i>
                    <span>Обсудите нагрузку с руководителем</span>
                </div>
                <div class="recommendation-item">
                    <i class="bi bi-activity recommendation-icon"></i>
                    <span>Введите регулярные физические упражнения</span>
                </div>
            `;
        } else if (percentage <= 80) {
            message = 'Высокий риск выгорания';
            recommendations = `
                <div class="recommendation-item">
                    <i class="bi bi-exclamation-triangle recommendation-icon"></i>
                    <span>Срочно снизьте рабочую нагрузку</span>
                </div>
                <div class="recommendation-item">
                    <i class="bi bi-heart-pulse recommendation-icon"></i>
                    <span>Обратитесь к психологу или врачу</span>
                </div>
                <div class="recommendation-item">
                    <i class="bi bi-calendar-x recommendation-icon"></i>
                    <span>Возьмите отпуск для восстановления</span>
                </div>
            `;
        } else {
            message = 'Критический уровень';
            recommendations = `
                <div class="recommendation-item">
                    <i class="bi bi-ambulance recommendation-icon"></i>
                    <span>Немедленно обратитесь за медицинской помощью</span>
                </div>
                <div class="recommendation-item">
                    <i class="bi bi-telephone recommendation-icon"></i>
                    <span>Свяжитесь с психологической службой</span>
                </div>
                <div class="recommendation-item">
                    <i class="bi bi-house-door recommendation-icon"></i>
                    <span>Временно прекратите рабочую деятельность</span>
                </div>
            `;
        }

        resultsSection.innerHTML = `
            <h3 class="results-title"><i class="bi bi-graph-up"></i> Результаты теста на выгорание</h3>
            <div class="progress-container">
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${percentage}%"></div>
                </div>
                <div class="progress-label">
                    <span>Низкий риск</span>
                    <span>${percentage}%</span>
                    <span>Высокий риск</span>
                </div>
            </div>
            <div class="results-message">
                <strong>${message}</strong> (${score} баллов из 25)
            </div>
            <div class="recommendations">
                ${recommendations}
            </div>
        `;
        
        resultsSection.style.display = 'block';
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }

    resetBurnoutTest() {
        document.querySelectorAll('.level-dot').forEach(dot => {
            dot.classList.remove('active');
        });
        const resultsSection = document.querySelector('.results-section');
        if (resultsSection) {
            resultsSection.style.display = 'none';
        }
    }

    // Дневник эмоций
    handleEmotionTagClick(e) {
        const tag = e.target;
        tag.classList.toggle('active');
    }

    saveEmotionEntry() {
        const text = document.getElementById('emotionText').value.trim();
        const selectedEmotions = Array.from(document.querySelectorAll('.emotion-tag.active'))
            .map(tag => tag.textContent.trim());

        if (!text) {
            this.showNotification('Пожалуйста, опишите ваше эмоциональное состояние', 'warning');
            return;
        }

        const entry = {
            text: text,
            emotions: selectedEmotions,
            timestamp: new Date().toLocaleString('ru-RU')
        };

        // Сохраняем в localStorage
        let entries = JSON.parse(localStorage.getItem('emotionDiary') || '[]');
        entries.unshift(entry); // Добавляем в начало
        localStorage.setItem('emotionDiary', JSON.stringify(entries));

        this.showNotification('Запись сохранена!', 'success');
        
        // Очищаем форму
        document.getElementById('emotionText').value = '';
        document.querySelectorAll('.emotion-tag.active').forEach(tag => {
            tag.classList.remove('active');
        });
    }

    viewEmotionHistory() {
        const entries = JSON.parse(localStorage.getItem('emotionDiary') || '[]');
        const historyDiv = document.getElementById('emotionHistory');
        const listDiv = document.getElementById('historyList');

        if (entries.length === 0) {
            listDiv.innerHTML = '<p>Пока нет сохраненных записей.</p>';
        } else {
            listDiv.innerHTML = entries.map(entry => `
                <div class="emotion-entry">
                    <div class="entry-header">
                        <strong>${entry.timestamp}</strong>
                        <span class="emotion-badges">
                            ${entry.emotions.map(emotion => `<span class="emotion-badge">${emotion}</span>`).join('')}
                        </span>
                    </div>
                    <div class="entry-text">${entry.text}</div>
                </div>
            `).join('');
        }

        historyDiv.style.display = 'block';
        historyDiv.scrollIntoView({ behavior: 'smooth' });
    }

    // Границы
    saveBoundaries() {
        const boundaries = {
            work: document.getElementById('workBoundary').value.trim(),
            relationship: document.getElementById('relationshipBoundary').value.trim(),
            emotional: document.getElementById('emotionalBoundary').value.trim(),
            digital: document.getElementById('digitalBoundary').value.trim()
        };

        // Проверяем, что хотя бы одна граница заполнена
        const hasData = Object.values(boundaries).some(boundary => boundary !== '');
        
        if (!hasData) {
            this.showNotification('Пожалуйста, определите хотя бы одну границу', 'warning');
            return;
        }

        localStorage.setItem('personalBoundaries', JSON.stringify(boundaries));
        this.showNotification('Границы сохранены!', 'success');
    }

    loadBoundaries() {
        const boundaries = JSON.parse(localStorage.getItem('personalBoundaries') || '{}');
        const container = document.getElementById('savedBoundaries');
        const list = document.getElementById('boundariesList');

        if (Object.keys(boundaries).length === 0) {
            list.innerHTML = '<p>Сохраненные границы не найдены.</p>';
        } else {
            list.innerHTML = `
                ${boundaries.work ? `<div class="boundary-item"><strong>Рабочие:</strong> ${boundaries.work}</div>` : ''}
                ${boundaries.relationship ? `<div class="boundary-item"><strong>Отношения:</strong> ${boundaries.relationship}</div>` : ''}
                ${boundaries.emotional ? `<div class="boundary-item"><strong>Эмоциональные:</strong> ${boundaries.emotional}</div>` : ''}
                ${boundaries.digital ? `<div class="boundary-item"><strong>Цифровые:</strong> ${boundaries.digital}</div>` : ''}
            `;
        }

        container.style.display = 'block';
        container.scrollIntoView({ behavior: 'smooth' });
    }

    // План самообороны
    saveDefensePlan() {
        const plan = {
            triggers: document.getElementById('triggers').value.trim(),
            autoResponses: document.getElementById('autoResponses').value.trim(),
            support: document.getElementById('support').value.trim(),
            updated: new Date().toLocaleString('ru-RU')
        };

        localStorage.setItem('defensePlan', JSON.stringify(plan));
        this.showNotification('План самообороны сохранен!', 'success');
    }

    loadDefensePlan() {
        const plan = JSON.parse(localStorage.getItem('defensePlan') || '{}');
        
        if (plan.triggers) {
            document.getElementById('triggers').value = plan.triggers;
        }
        if (plan.autoResponses) {
            document.getElementById('autoResponses').value = plan.autoResponses;
        }
        if (plan.support) {
            document.getElementById('support').value = plan.support;
        }

        if (plan.updated) {
            this.showNotification(`План загружен (обновлен: ${plan.updated})`, 'info');
        }
    }

    // Дыхательные упражнения
    startBreathingExercise() {
        const technique = document.getElementById('breathingTechnique').value;
        const circle = document.getElementById('breathingCircle');
        const instruction = document.getElementById('breathingInstruction');
        const startBtn = document.getElementById('startBreathing');
        const stopBtn = document.getElementById('stopBreathing');
        const timer = document.getElementById('breathingTimer');

        // Останавливаем предыдущее упражнение
        this.stopBreathingExercise();

        startBtn.style.display = 'none';
        stopBtn.style.display = 'inline-flex';

        this.breathingStartTime = Date.now();
        this.updateBreathingTimer(timer);

        this.breathingTimerInterval = setInterval(() => {
            this.updateBreathingTimer(timer);
        }, 1000);

        let phase = 0;
        const techniques = {
            square: {
                phases: [
                    { duration: 4000, text: 'Вдох', action: 'inhale' },
                    { duration: 4000, text: 'Задержка', action: 'hold' },
                    { duration: 4000, text: 'Выдох', action: 'exhale' },
                    { duration: 4000, text: 'Пауза', action: 'pause' }
                ]
            },
            '478': {
                phases: [
                    { duration: 4000, text: 'Вдох (4 сек)', action: 'inhale' },
                    { duration: 7000, text: 'Задержка (7 сек)', action: 'hold' },
                    { duration: 8000, text: 'Выдох (8 сек)', action: 'exhale' }
                ]
            },
            belly: {
                phases: [
                    { duration: 4000, text: 'Медленный вдох животом', action: 'inhale' },
                    { duration: 2000, text: 'Пауза', action: 'hold' },
                    { duration: 6000, text: 'Медленный выдох', action: 'exhale' }
                ]
            }
        };

        const currentTechnique = techniques[technique];

        const executePhase = () => {
            if (!this.currentBreathingInterval) return; // Проверка на остановку

            const phaseData = currentTechnique.phases[phase];
            instruction.textContent = phaseData.text;
            circle.className = 'breathing-circle ' + phaseData.action;

            this.currentBreathingInterval = setTimeout(() => {
                phase = (phase + 1) % currentTechnique.phases.length;
                executePhase();
            }, phaseData.duration);
        };

        executePhase();
    }

    stopBreathingExercise() {
        if (this.currentBreathingInterval) {
            clearTimeout(this.currentBreathingInterval);
            this.currentBreathingInterval = null;
        }
        if (this.breathingTimerInterval) {
            clearInterval(this.breathingTimerInterval);
            this.breathingTimerInterval = null;
        }

        const circle = document.getElementById('breathingCircle');
        const instruction = document.getElementById('breathingInstruction');
        const startBtn = document.getElementById('startBreathing');
        const stopBtn = document.getElementById('stopBreathing');

        circle.className = 'breathing-circle';
        instruction.textContent = 'Выберите технику для начала';
        startBtn.style.display = 'inline-flex';
        stopBtn.style.display = 'none';
    }

    updateBreathingTimer(timerElement) {
        if (!this.breathingStartTime) return;
        
        const elapsed = Math.floor((Date.now() - this.breathingStartTime) / 1000);
        const minutes = Math.floor(elapsed / 60).toString().padStart(2, '0');
        const seconds = (elapsed % 60).toString().padStart(2, '0');
        timerElement.textContent = `${minutes}:${seconds}`;
    }

    // Графики для исследований
    setupCharts() {
        if (typeof Chart === 'undefined') {
            console.warn('Chart.js не загружен');
            return;
        }

        // График по возрастам
        const ageCtx = document.getElementById('ageChart');
        if (ageCtx) {
            new Chart(ageCtx, {
                type: 'bar',
                data: {
                    labels: ['18-25', '26-35', '36-45', '46-55', '56+'],
                    datasets: [{
                        label: 'Процент с симптомами выгорания',
                        data: [35, 48, 52, 45, 38],
                        backgroundColor: '#603F2B',
                        borderColor: '#765541',
                        borderWidth: 1,
                        borderRadius: 8
                    }]
                },
                options: this.getChartOptions('bar')
            });
        }

        // График типов манипуляций
        const manipulationCtx = document.getElementById('manipulationChart');
        if (manipulationCtx) {
            new Chart(manipulationCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Чувство вины', 'Газлайтинг', 'Давление группой', 'Игра в жертву', 'Другие'],
                    datasets: [{
                        data: [35, 25, 20, 15, 5],
                        backgroundColor: [
                            '#603F2B',
                            '#765541',
                            '#FAB787',
                            '#FFD7BD',
                            '#E8C4B0'
                        ],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom'
                        }
                    }
                }
            });
        }

        // График эффективности методов
        const effectivenessCtx = document.getElementById('effectivenessChart');
        if (effectivenessCtx) {
            new Chart(effectivenessCtx, {
                type: 'radar',
                data: {
                    labels: ['Распознавание', 'Дистанцирование', 'Вопросы', 'Отказ', 'Поддержка', 'Обучение'],
                    datasets: [{
                        label: 'Эффективность',
                        data: [85, 75, 90, 95, 80, 70],
                        backgroundColor: 'rgba(96, 63, 43, 0.2)',
                        borderColor: '#603F2B',
                        pointBackgroundColor: '#603F2B',
                        pointBorderColor: '#fff',
                        pointHoverBackgroundColor: '#fff',
                        pointHoverBorderColor: '#603F2B'
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    scales: {
                        r: {
                            angleLines: {
                                display: true
                            },
                            suggestedMin: 0,
                            suggestedMax: 100
                        }
                    }
                }
            });
        }

        // График динамики стресса
        const stressCtx = document.getElementById('stressChart');
        if (stressCtx) {
            new Chart(stressCtx, {
                type: 'line',
                data: {
                    labels: ['Янв', 'Фев', 'Мар', 'Апр', 'Май', 'Июн', 'Июл', 'Авг', 'Сен', 'Окт', 'Ноя', 'Дек'],
                    datasets: [{
                        label: 'Уровень стресса',
                        data: [65, 59, 70, 65, 60, 55, 45, 40, 50, 60, 70, 75],
                        borderColor: '#603F2B',
                        backgroundColor: 'rgba(96, 63, 43, 0.1)',
                        tension: 0.4,
                        fill: true
                    }]
                },
                options: this.getChartOptions('line')
            });
        }
    }

    getChartOptions(type) {
        const baseOptions = {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                }
            }
        };

        if (type === 'bar' || type === 'line') {
            baseOptions.scales = {
                y: {
                    beginAtZero: true,
                    max: 100,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            };
        }

        return baseOptions;
    }

    // Уведомления
    showNotification(message, type = 'info') {
        // Создаем уведомление
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="bi bi-${this.getNotificationIcon(type)}"></i>
                <span>${message}</span>
            </div>
        `;

        // Стили для уведомления
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: var(--white);
            padding: 1rem 1.5rem;
            border-radius: 10px;
            box-shadow: 0 5px 15px rgba(0,0,0,0.2);
            border-left: 4px solid ${this.getNotificationColor(type)};
            z-index: 10000;
            max-width: 400px;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(notification);

        // Удаляем уведомление через 4 секунды
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 4000);
    }

    getNotificationIcon(type) {
        const icons = {
            success: 'check-circle',
            warning: 'exclamation-triangle',
            danger: 'x-circle',
            info: 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    getNotificationColor(type) {
        const colors = {
            success: '#28a745',
            warning: '#ffc107',
            danger: '#dc3545',
            info: '#603F2B'
        };
        return colors[type] || '#603F2B';
    }

    setupTools() {
        console.log('Инструменты инициализированы');
        // Дополнительная инициализация для страницы инструментов
    }
}

// Глобальные функции для вызова из HTML
function calculateManipulationScore() {
    if (window.psychoApp) {
        window.psychoApp.calculateManipulationScore();
    }
}

function resetChecklist(checklistId) {
    if (window.psychoApp) {
        window.psychoApp.resetChecklist(checklistId);
    }
}

function calculateBurnoutScore() {
    if (window.psychoApp) {
        window.psychoApp.calculateBurnoutScore();
    }
}

function resetBurnoutTest() {
    if (window.psychoApp) {
        window.psychoApp.resetBurnoutTest();
    }
}

function saveEmotionEntry() {
    if (window.psychoApp) {
        window.psychoApp.saveEmotionEntry();
    }
}

function viewEmotionHistory() {
    if (window.psychoApp) {
        window.psychoApp.viewEmotionHistory();
    }
}

function saveBoundaries() {
    if (window.psychoApp) {
        window.psychoApp.saveBoundaries();
    }
}

function loadBoundaries() {
    if (window.psychoApp) {
        window.psychoApp.loadBoundaries();
    }
}

function startBreathingExercise() {
    if (window.psychoApp) {
        window.psychoApp.startBreathingExercise();
    }
}

function stopBreathingExercise() {
    if (window.psychoApp) {
        window.psychoApp.stopBreathingExercise();
    }
}

function saveDefensePlan() {
    if (window.psychoApp) {
        window.psychoApp.saveDefensePlan();
    }
}

function loadDefensePlan() {
    if (window.psychoApp) {
        window.psychoApp.loadDefensePlan();
    }
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', () => {
    window.psychoApp = new PsychoSafetyApp();
});

// Добавляем CSS для анимаций уведомлений
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .emotion-entry {
        background: var(--accent-light);
        padding: 1rem;
        margin-bottom: 1rem;
        border-radius: 8px;
    }
    
    .entry-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 0.5rem;
    }
    
    .emotion-badges {
        display: flex;
        gap: 0.5rem;
        flex-wrap: wrap;
    }
    
    .emotion-badge {
        background: var(--primary-dark);
        color: var(--white);
        padding: 0.2rem 0.5rem;
        border-radius: 12px;
        font-size: 0.8rem;
    }
    
    .boundary-item {
        background: var(--accent-light);
        padding: 1rem;
        margin-bottom: 0.5rem;
        border-radius: 8px;
    }
    
    .breathing-circle {
        width: 150px;
        height: 150px;
        border-radius: 50%;
        margin: 2rem auto;
        transition: all 0.5s ease;
        background: var(--accent-light);
        display: flex;
        align-items: center;
        justify-content: center;
        color: var(--primary-dark);
        font-weight: bold;
    }
    
    .breathing-circle.inhale {
        background: var(--primary-bg);
        transform: scale(1.2);
    }
    
    .breathing-circle.exhale {
        background: var(--accent-light);
        transform: scale(0.8);
    }
    
    .breathing-circle.hold {
        background: var(--primary-medium);
        transform: scale(1.1);
    }
    
    .breathing-circle.pause {
        background: var(--accent-light);
        transform: scale(1);
    }
    
    .breathing-timer {
        font-size: 1.5rem;
        font-weight: bold;
        text-align: center;
        margin-top: 1rem;
        color: var(--primary-dark);
    }
    
    .tool-description {
        color: var(--text-light);
        margin-bottom: 1.5rem;
        font-size: 0.9rem;
        line-height: 1.5;
    }
    
    .chart-description {
        color: var(--text-light);
        font-size: 0.8rem;
        margin-top: 1rem;
        text-align: center;
        font-style: italic;
    }
`;
document.head.appendChild(style);