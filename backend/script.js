document.addEventListener('DOMContentLoaded', function() {
    const modeToggle = document.getElementById('mode-toggle');
    const body = document.body;

    // Cek mode yang tersimpan di localStorage
    if (localStorage.getItem('theme') === 'dark') {
        body.classList.add('dark-mode');
        modeToggle.checked = true;
    }

    // Event listener untuk switch
    modeToggle.addEventListener('change', function() {
        if (this.checked) {
            body.classList.add('dark-mode');
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-mode');
            localStorage.setItem('theme', 'light');
        }
    });

    // Fetch data dari JSON file
    fetch('data.json')
        .then(response => response.json())
        .then(data => {
            // Populate the dashboard with data
            document.getElementById('on-track-count').innerText = data.onTrack;
            document.getElementById('need-reminder-count').innerText = data.needReminder;
            document.getElementById('frown-count').innerText = data.learnerReactions.frown;
            document.getElementById('meh-count').innerText = data.learnerReactions.meh;
            document.getElementById('smile-count').innerText = data.learnerReactions.smile;
            document.getElementById('laugh-count').innerText = data.learnerReactions.laugh;
            document.getElementById('satisfaction-rate').innerText = data.satisfactionRate + '%';

            // Populate learner progress
            const learnerProgress = data.learnerProgress;
            const progressContainer = document.getElementById('learner-progress');
            learnerProgress.forEach(learner => {
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

            // Populate longest waiting reviews
            const waitingReviews = data.longestWaitingReviews;
            const reviewsContainer = document.getElementById('longest-waiting-reviews');
            waitingReviews.forEach(review => {
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

            // Populate Q&A session details
            const qaSession = data.qaSession;
            document.getElementById('qa-time').innerText = qaSession.time;
            document.getElementById('qa-details').innerHTML = `
                <p class="text-gray-700 mb-4">${qaSession.description}</p>
                <ul class="list-disc list-inside text-gray-700 mb-4">
                    ${qaSession.topics.map(topic => `<li>${topic}</li>`).join('')}
                </ul>
            `;
        });
});
