class Calendar {
    constructor(sheetId, apiKey, sheetName) {
        this.date = new Date();
        this.currentMonth = this.date.getMonth();
        this.currentYear = this.date.getFullYear();
        this.selectedDate = null;

        // Google Sheets configuration
        this.sheetId = sheetId;
        this.apiKey = apiKey;
        this.sheetName = sheetName;
        this.events = {};

        this.initializeCalendar();
        this.bindEvents();
    }

    async fetchEventsFromGoogleSheet() {
        const url = `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/${this.sheetName}!A2:F?key=${this.apiKey}`;
        try {
            const response = await fetch(url);
            const data = await response.json();

            if (data.values && data.values.length > 0) {
                this.processEventData(data.values);
                this.renderCalendar();
                this.updateUpcomingEvents();
            } else {
                console.error("No event data found in the sheet.");
            }
        } catch (error) {
            console.error("Error fetching events from Google Sheets:", error);
        }
    }

    processEventData(data) {
        this.events = {};
        data.forEach(row => {
            const [date, title, type, time, location, description] = row;
            if (!this.events[date]) this.events[date] = [];
            this.events[date].push({ title, type, time, location, description });
        });
    }

    initializeCalendar() {
        this.fetchEventsFromGoogleSheet();
    }

    bindEvents() {
        document.querySelector('.prev-month').addEventListener('click', () => {
            this.changeMonth(-1);
        });

        document.querySelector('.next-month').addEventListener('click', () => {
            this.changeMonth(1);
        });

        document.getElementById('eventType').addEventListener('change', () => {
            this.renderCalendar();
        });

        document.querySelector('.close-modal').addEventListener('click', () => {
            this.closeEventModal();
        });
    }

    renderCalendar() {
        const firstDay = new Date(this.currentYear, this.currentMonth, 1);
        const lastDay = new Date(this.currentYear, this.currentMonth + 1, 0);
        const daysGrid = document.querySelector('.calendar-days');
        const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 
                           'July', 'August', 'September', 'October', 'November', 'December'];

        document.querySelector('.current-month').textContent = 
            `${monthNames[this.currentMonth]} ${this.currentYear}`;

        daysGrid.innerHTML = '';

        // Previous month's days
        for (let i = 0; i < firstDay.getDay(); i++) {
            const prevDate = new Date(this.currentYear, this.currentMonth, -i);
            this.createDayElement(daysGrid, prevDate, true);
        }

        // Current month's days
        for (let i = 1; i <= lastDay.getDate(); i++) {
            const date = new Date(this.currentYear, this.currentMonth, i);
            this.createDayElement(daysGrid, date, false);
        }

        // Next month's days
        const remainingDays = 42 - (firstDay.getDay() + lastDay.getDate());
        for (let i = 1; i <= remainingDays; i++) {
            const nextDate = new Date(this.currentYear, this.currentMonth + 1, i);
            this.createDayElement(daysGrid, nextDate, true);
        }
    }

    createDayElement(container, date, isDifferentMonth) {
        const dayDiv = document.createElement('div');
        dayDiv.className = 'calendar-day';
        if (isDifferentMonth) dayDiv.classList.add('different-month');
        if (this.isToday(date)) dayDiv.classList.add('today');

        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = date.getDate();
        dayDiv.appendChild(dayNumber);

        // Add events for this day
        const dateString = this.formatDate(date);
        const dayEvents = this.events[dateString] || [];
        const filteredEvents = this.filterEvents(dayEvents);

        filteredEvents.forEach(event => {
            const eventDiv = this.createEventElement(event);
            dayDiv.appendChild(eventDiv);
        });

        container.appendChild(dayDiv);
    }

    filterEvents(events) {
        const selectedType = document.getElementById('eventType').value;
        if (!selectedType) return events;
        return events.filter(event => event.type === selectedType);
    }

    createEventElement(event) {
        const eventDiv = document.createElement('div');
        eventDiv.className = `event ${event.type}`;
        eventDiv.textContent = event.title;
        eventDiv.addEventListener('click', (e) => {
            e.stopPropagation();
            this.showEventDetails(event);
        });
        return eventDiv;
    }

    showEventDetails(event) {
        const modal = document.getElementById('eventModal');
        const modalTitle = document.getElementById('modalTitle');
        const modalBody = document.getElementById('modalBody');

        modalTitle.textContent = event.title;
        modalBody.innerHTML = `
            <p><i class="far fa-clock"></i> ${event.time}</p>
            <p><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
            <p><i class="fas fa-info-circle"></i> ${event.description}</p>
        `;

        modal.style.display = 'flex';
    }

    closeEventModal() {
        document.getElementById('eventModal').style.display = 'none';
    }

    updateUpcomingEvents() {
        const upcomingList = document.getElementById('upcomingEventsList');
        const today = new Date();
        let upcomingEvents = [];

        Object.entries(this.events).forEach(([date, events]) => {
            const eventDate = new Date(date);
            if (eventDate >= today) {
                events.forEach(event => {
                    upcomingEvents.push({ date: eventDate, ...event });
                });
            }
        });

        upcomingEvents.sort((a, b) => a.date - b.date);

        upcomingList.innerHTML = upcomingEvents
            .slice(0, 5)
            .map(event => `
                <div class="event-card">
                    <div class="event-date">
                        <span class="day">${event.date.getDate()}</span>
                        <span class="month">${event.date.toLocaleString('default', { month: 'short' }).toUpperCase()}</span>
                    </div>
                    <div class="event-details">
                        <h3>${event.title}</h3>
                        <p><i class="far fa-clock"></i> ${event.time}</p>
                        <p><i class="fas fa-map-marker-alt"></i> ${event.location}</p>
                    </div>
                </div>
            `).join('');
    }

    changeMonth(delta) {
        this.currentMonth += delta;
        if (this.currentMonth > 11) {
            this.currentMonth = 0;
            this.currentYear++;
        } else if (this.currentMonth < 0) {
            this.currentMonth = 11;
            this.currentYear--;
        }
        this.renderCalendar();
    }

    isToday(date) {
        const today = new Date();
        return date.getDate() === today.getDate() &&
               date.getMonth() === today.getMonth() &&
               date.getFullYear() === today.getFullYear();
    }

    formatDate(date) {
        return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
    }
}

document.addEventListener('DOMContentLoaded', () => {
    new Calendar('1D1lAmIEfrWUEErlwymPkP5UMZDSnjP4QyXTEAUAYHvI', 'AIzaSyB-35r2YQLe3WSxOx3YHHW0qgAchnhriuo', 'Sheet2');
});
