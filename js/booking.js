    // Simulate user progress and interactivity on lessons list
    const lessonList = document.getElementById('lessonList');
    const progressBar = document.getElementById('progressBar');
    const progressText = document.getElementById('progressText');
    const enrollBtn = document.getElementById('enrollBtn');

    let enrolled = false;
    let lessons = [...lessonList.children];

    function updateProgress() {
      const completedCount = lessons.filter(lesson => lesson.dataset.completed === 'true').length;
      const totalCount = lessons.length;
      const percent = Math.round((completedCount / totalCount) * 100);
      progressBar.style.width = percent + '%';
      progressText.textContent = `Progress: ${percent}%`;
      // Disable enroll button after enrolling
      if(enrolled) {
        enrollBtn.textContent = 'Continue Course';
      }
    }

    // Toggle lesson completion on click if enrolled
    lessonList.addEventListener('click', e => {
      let li = e.target.closest('li');
      if (li && enrolled) {
        const completed = li.dataset.completed === 'true';
        li.dataset.completed = completed ? 'false' : 'true';
        li.classList.toggle('completed', !completed);
        li.querySelector('.lesson-status').textContent = !completed ? 'Completed' : 'Not Completed';
        updateProgress();
      }
    });

    enrollBtn.addEventListener('click', () => {
      if (!enrolled) {
        enrolled = true;
        enrollBtn.textContent = 'Continue Course';
        alert('You are now enrolled! Click on lessons to mark them as completed.');
      }
      else
      {
        window.location.href = 'dashboard.html';
      }
    });

    updateProgress();
