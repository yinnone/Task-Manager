document.addEventListener('DOMContentLoaded', () => {
    

    const taskTitleInput = document.getElementById('task-title');
    const taskDeadlineInput = document.getElementById('task-deadline');
    const taskDurationInput = document.getElementById('task-duration');
    const taskPrioritySelect = document.getElementById('task-priority');
    const taskCategorySelect = document.getElementById('task-category');
    const taskCommentsTextarea = document.getElementById('task-comments');
    const addTaskButton = document.getElementById('add-task');
    const taskList = document.getElementById('task-list');
    const filterButtons = document.querySelectorAll('.filter-btn');
    const sortButtons = document.querySelectorAll('.sort-btn');
    const searchInput = document.getElementById('search-input');
    const toggleThemeButton = document.getElementById('toggle-theme');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    let darkMode = JSON.parse(localStorage.getItem('darkMode')) || false;

    // Initialize UI
    if (darkMode) {
        document.body.classList.add('dark-mode');
        toggleThemeButton.textContent = 'Switch to Light Mode';
    } else {
        document.body.classList.remove('dark-mode');
        toggleThemeButton.textContent = 'Switch to Dark Mode';
    }

    function renderTasks(filter = 'all', search = '', sort = 'none') {
        taskList.innerHTML = '';

        // Apply filters
        const filteredTasks = tasks
            .filter(task => {
                if (filter === 'all') return true;
                if (filter === 'active') return !task.completed && !task.archived;
                if (filter === 'completed') return task.completed && !task.archived;
                if (filter === 'archived') return task.archived;
            })
            .filter(task => task.title.toLowerCase().includes(search.toLowerCase()));

        // Apply sorting
        if (sort === 'priority') {
            filteredTasks.sort((a, b) => {
                const priorityOrder = { low: 1, medium: 2, high: 3 };
                return priorityOrder[b.priority] - priorityOrder[a.priority];
            });
        } else if (sort === 'deadline') {
            filteredTasks.sort((a, b) => new Date(a.deadline) - new Date(b.deadline));
        } else if (sort === 'duration') {
            filteredTasks.sort((a, b) => a.duration - b.duration);
        }

        // Render tasks
        filteredTasks.forEach((task, index) => {
            const taskElement = document.createElement('li');
            taskElement.classList.add(task.priority);
            if (task.completed) taskElement.classList.add('completed');
            if (task.archived) taskElement.classList.add('archived');
            taskElement.innerHTML = `
                <div>
                    <strong>${task.title}</strong>
                    <p>Due: ${task.deadline}</p>
                    <p>Duration: ${task.duration} hours</p>
                    <p>Category: ${task.category}</p>
                    <p>Comments: ${task.comments}</p>
                    <p>Priority: <span class="priority-${task.priority}"></span></p>
                </div>
                <button class="edit-task">Edit</button>
                <button class="archive-task">${task.archived ? 'Unarchive' : 'Archive'}</button>
                <button class="complete-task">${task.completed ? 'Unmark Completed' : 'Complete'}</button>
                <button class="delete-task">Delete</button>
            `;
            taskList.appendChild(taskElement);

            // Add event listeners
            taskElement.querySelector('.complete-task').addEventListener('click', () => {
                task.completed = !task.completed;
                saveTasks();
                renderTasks();
            });

            taskElement.querySelector('.archive-task').addEventListener('click', () => {
                task.archived = !task.archived;
                saveTasks();
                renderTasks();
            });

            taskElement.querySelector('.delete-task').addEventListener('click', () => {
                tasks.splice(index, 1);
                saveTasks();
                renderTasks();
            });

            taskElement.querySelector('.edit-task').addEventListener('click', () => {
                // Implement task editing
            });
        });
    }

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    addTaskButton.addEventListener('click', () => {
        const title = taskTitleInput.value.trim();
        const deadline = taskDeadlineInput.value;
        const duration = parseFloat(taskDurationInput.value) || 0;
        const priority = taskPrioritySelect.value;
        const category = taskCategorySelect.value;
        const comments = taskCommentsTextarea.value.trim();

        if (title && deadline) {
            tasks.push({
                title,
                deadline,
                duration,
                priority,
                category,
                comments,
                completed: false,
                archived: false
            });
            saveTasks();
            renderTasks();
            taskTitleInput.value = '';
            taskDeadlineInput.value = '';
            taskDurationInput.value = '';
            taskPrioritySelect.value = 'low';
            taskCategorySelect.value = 'work';
            taskCommentsTextarea.value = '';
        } else {
            alert('Title and Deadline are required.');
        }
    });

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            renderTasks(button.dataset.filter, searchInput.value, getActiveSort());
        });
    });

    sortButtons.forEach(button => {
        button.addEventListener('click', () => {
            sortButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');
            renderTasks(getActiveFilter(), searchInput.value, button.dataset.sort);
        });
    });

    searchInput.addEventListener('input', () => {
        renderTasks(getActiveFilter(), searchInput.value, getActiveSort());
    });

    toggleThemeButton.addEventListener('click', () => {
        darkMode = !darkMode;
        document.body.classList.toggle('dark-mode', darkMode);
        localStorage.setItem('darkMode', JSON.stringify(darkMode));
        toggleThemeButton.textContent = darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode';
    });


    function getActiveFilter() {
        return document.querySelector('.filters .filter-btn.active')?.dataset.filter || 'all';
    }

    function getActiveSort() {
        return document.querySelector('.sorting .sort-btn.active')?.dataset.sort || 'none';
    }

    renderTasks();
});
