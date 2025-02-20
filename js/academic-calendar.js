document.addEventListener('DOMContentLoaded', function() {
    // Calendar state
    let currentDate = new Date();
    let currentMonth = currentDate.getMonth();
    let currentYear = currentDate.getFullYear();
    
    // Calendar data (example)
    const events = {
        '2023-09-15': [
            {
                title: 'Parent-Teacher Conference',
                time: '14:00 - 18:00',
                description: 'Fall semester parent-teacher meetings',
                category: 'meeting'
            }
        ],
        // Add more events...
    };

    // Initialize calendar
    function initCalendar() {
        updateMonthDisplay();
        renderCalendar();
        bindEventListeners();
    }

    // Update month display
    function updateMonthDisplay() {
        const months = ['January', 'February', 'March', 'April', 'May', 'June',
                       'July', 'August', 'September', 'October', 'November', 'December'];
        document.getElementById('currentMonth').textContent = 
            `${months[currentMonth]} ${currentYear}`;
    }

    // Render calendar grid
    function renderCalendar() {
        const daysGrid = document.getElementById('daysGrid');
        daysGrid.innerHTML = '';

        const firstDay = new Date(currentYear, currentMonth, 1);
        const lastDay = new Date(currentYear, currentMonth + 1, 0);
        const startingDay = firstDay.getDay();
        const monthDays = lastDay.getDate();

        // Previous month padding
        for (let i = 0; i < startingDay; i++) {
            daysGrid.appendChild(createDayElement(''));
        }

        // Current month days
        for (let day = 1; day <= monthDays; day++) {
            const dateString = `${currentYear}-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const hasEvents = events[dateString] ? true : false;
            
            const dayElement = createDayElement(day, hasEvents);
            if (hasEvents) {
                dayElement.addEventListener('click', () => showEvents(dateString));
            }
            
            daysGrid.appendChild(dayElement);
        }
    }

    // Create day element
    function createDayElement(day, hasEvents = false) {
        const div = document.createElement('div');
        div.className = 'calendar-day';
        
        if (day !== '') {
            div.innerHTML = `
                <span class="day-number">${day}</span>
                ${hasEvents ? '<span class="event-dot"></span>' : ''}
            `;
            
            // Check if it's today
            const today = new Date();
            if (day === today.getDate() && 
                currentMonth === today.getMonth() && 
                currentYear === today.getFullYear()) {
                div.classList.add('today');
            }
            
            if (hasEvents) {
                div.classList.add('has-event');
            }
        }
        
        return div;
    }

    // Show events for a specific date
    function showEvents(dateString) {
        const modal = document.getElementById('eventModal');
        const title = document.getElementById('eventTitle');
        const date = document.getElementById('eventDate');
        const time = document.getElementById('eventTime');
        const description = document.getElementById('eventDescription');

        const dateEvents = events[dateString];
        if (dateEvents && dateEvents.length > 0) {
            const event = dateEvents[0]; // Show first event (expand for multiple)
            title.textContent = event.title;
            date.textContent = `Date: ${dateString}`;
            time.textContent = `Time: ${event.time}`;
            description.textContent = event.description;
            modal.style.display = 'block';
        }
    }

    // Bind event listeners
    function bindEventListeners() {
        // Month navigation
        document.getElementById('prevMonth').addEventListener('click', () => {
            currentMonth--;
            if (currentMonth < 0) {
                currentMonth = 11;
                currentYear--;
            }
            updateMonthDisplay();
            renderCalendar();
        });

        document.getElementById('nextMonth').addEventListener('click', () => {
            currentMonth++;
            if (currentMonth > 11) {
                currentMonth = 0;
                currentYear++;
            }
            updateMonthDisplay();
            renderCalendar();
        });

        // Year selection
        document.getElementById('yearSelect').addEventListener('change', (e) => {
            currentYear = parseInt(e.target.value);
            updateMonthDisplay();
            renderCalendar();
        });

        // View toggle
        document.querySelectorAll('.view-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                
                const view = e.target.dataset.view;
                document.querySelectorAll('.calendar-view').forEach(v => v.style.display = 'none');
                document.getElementById(`${view}View`).style.display = 'block';
            });
        });

        // Modal close
        document.querySelector('.close-modal').addEventListener('click', () => {
            document.getElementById('eventModal').style.display = 'none';
        });
    }

    // Initialize calendar
    initCalendar();
}); 