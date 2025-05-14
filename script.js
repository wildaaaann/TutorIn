document.addEventListener('DOMContentLoaded', function () {
    const modeToggle = document.getElementById('mode-toggle');
    const body = document.body;

    // Mode gelap/terang
    if (localStorage.getItem('theme') === 'light') {
        body.classList.add('dark-mode');
        modeToggle.checked = true;
    }

    modeToggle.addEventListener('change', function () {
        if (this.checked) {
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    });

    // Fetch data dashboard
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            document.getElementById('on-track-count').innerText = data.onTrack;
            document.getElementById('need-reminder-count').innerText = data.needReminder;
            document.getElementById('frown-count').innerText = data.learnerReactions.frown;
            document.getElementById('meh-count').innerText = data.learnerReactions.meh;
            document.getElementById('smile-count').innerText = data.learnerReactions.smile;
            document.getElementById('laugh-count').innerText = data.learnerReactions.laugh;
            document.getElementById('satisfaction-rate').innerText = data.satisfactionRate + '%';

            const progressContainer = document.getElementById('learner-progress');
            data.learnerProgress.forEach(learner => {
                const learnerDiv = document.createElement('div');
                learnerDiv.classList.add('mb-4');
                learnerDiv.innerHTML = `
                    <div class="flex justify-between items-center mb-2">
                        <span>${learner.name}</span>
                        <span>${learner.progress}%</span>
                    </div>
                    <div class="w-full bg-gray-200 rounded-full h-2.5">
                        <div class="bg-blue-600 h-2.5 rounded-full" style="width: ${learner.progress}%"></div>
                    </div>
                `;
                progressContainer.appendChild(learnerDiv);
            });

            const reviewsContainer = document.getElementById('longest-waiting-reviews');
            data.longestWaitingReviews.forEach(review => {
                const reviewDiv = document.createElement('div');
                reviewDiv.classList.add('mb-4');
                reviewDiv.innerHTML = `
                    <div class="flex justify-between items-center mb-2">
                        <span>${review.name}</span>
                        <span class="text-gray-500">${review.timeAgo}</span>
                    </div>
                    <p class="text-gray-700">changed status to <span class="bg-gray-200 px-2 py-1 rounded">In review</span></p>
                    <p class="text-blue-600">${review.course}</p>
                `;
                reviewsContainer.appendChild(reviewDiv);
            });

            const qaSession = data.qaSession;
            document.getElementById('qa-time').innerText = qaSession.time;
            document.getElementById('qa-details').innerHTML = `
                <p class="text-gray-700 mb-4">${qaSession.description}</p>
                <ul class="list-disc list-inside text-gray-700 mb-4">
                    ${qaSession.topics.map(topic => `<li>${topic}</li>`).join('')}
                </ul>
            `;
        });

    // Kalender Dinamis
    const datesContainer = document.getElementById("calendarDates");
    const monthTitle = document.getElementById("monthTitle");

    const date = new Date();
    const currentYear = date.getFullYear();
    const currentMonth = date.getMonth();

    const firstDayOfMonth = new Date(currentYear, currentMonth, 1);
    const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0);
    const prevMonthLastDay = new Date(currentYear, currentMonth, 0);

    const startDay = firstDayOfMonth.getDay();
    const totalDays = lastDayOfMonth.getDate();
    const totalPrevDays = prevMonthLastDay.getDate();

    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    monthTitle.textContent = `${monthNames[currentMonth]} ${currentYear}`;
    datesContainer.innerHTML = "";

    // Tanggal dari bulan sebelumnya
    for (let i = startDay; i > 0; i--) {
        const div = document.createElement("div");
        div.classList.add("text-gray-400");
        div.textContent = totalPrevDays - i + 1;
        datesContainer.appendChild(div);
    }

    // Tanggal bulan ini
    for (let i = 1; i <= totalDays; i++) {
        const div = document.createElement("div");
        div.classList.add("relative", "text-center");

        // Tambahkan angka tanggal
        div.textContent = i;

        // Tambahkan titik merah jika tanggal ini adalah hari ini
        const today = new Date();
        if (
            i === today.getDate() &&
            currentMonth === today.getMonth() &&
            currentYear === today.getFullYear()
        ) {
            const dot = document.createElement("span");
            dot.classList.add("bg-red-500", "rounded-full", "w-2", "h-2", "absolute", "bottom-1", "left-1/2", "transform", "-translate-x-1/2");
            div.appendChild(dot);
        }

        datesContainer.appendChild(div);
    }


    // Tanggal bulan berikutnya
    const totalBoxes = startDay + totalDays;
    const nextDays = 7 - (totalBoxes % 7);
    if (nextDays < 7) {
        for (let i = 1; i <= nextDays; i++) {
            const div = document.createElement("div");
            div.classList.add("text-gray-400");
            div.textContent = i;
            datesContainer.appendChild(div);
        }
    }
});
