let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

// Show/hide date inputs based on schedule selection
document.getElementById('taskSchedule').addEventListener('change', function () {
    const taskDateContainer = document.getElementById('taskDateContainer');
    const rangeDateContainer = document.getElementById('rangeDateContainer');

    const selectedSchedule = this.value;

    if (selectedSchedule === 'specific') {
        taskDateContainer.style.display = 'block';
        rangeDateContainer.style.display = 'none';
    } else if (selectedSchedule === 'range') {
        taskDateContainer.style.display = 'none';
        rangeDateContainer.style.display = 'block';
    } else {
        taskDateContainer.style.display = 'none';
        rangeDateContainer.style.display = 'none';
    }
});

// Create Task button functionality
document.getElementById('createTaskBtn').addEventListener('click', function () {
    const title = document.getElementById('taskTitle').value.trim();
    const info = document.getElementById('taskInfo').value.trim();
    const color = document.getElementById('taskColor').value;
    const schedule = document.getElementById('taskSchedule').value;

    if (title === "") {
        alert("Please enter a task title.");
        return;
    }

    let taskDate = null;
    if (schedule === 'specific') {
        const taskDateValue = document.getElementById('taskDate').value;
        if (!taskDateValue) {
            alert("Please select a specific date.");
            return;
        }
        taskDate = taskDateValue;
    } else if (schedule === 'range') {
        const startDate = document.getElementById('startDate').value;
        const endDate = document.getElementById('endDate').value;
        if (!startDate || !endDate) {
            alert("Please select both start and end dates.");
            return;
        }
        if (new Date(startDate) > new Date(endDate)) {
            alert("Start date cannot be after end date.");
            return;
        }
        taskDate = { start: startDate, end: endDate };
    }

    const task = {
        title: title,
        info: info,
        color: color,
        schedule: schedule,
        date: taskDate,
        pinned: false
    };

    // Save task to localStorage and update task list
    tasks.push(task);
    localStorage.setItem('tasks', JSON.stringify(tasks));
    clearInputs();
    displayTasks();
});

// Display tasks
function displayTasks() {
    const container = document.getElementById('taskContainer');
    container.innerHTML = '';

    // Sort tasks: pinned tasks first
    tasks.sort((a, b) => b.pinned - a.pinned);

    tasks.forEach((task, index) => {
        const taskElement = document.createElement('div');
        taskElement.classList.add('task');
        taskElement.style.borderLeftColor = task.color;

        taskElement.innerHTML = `
            <div>
                <h3>${task.title}</h3>
                <p>${task.info}</p>
                <p><small>Schedule: ${task.schedule === 'specific' ? new Date(task.date).toDateString() : 
                    task.schedule === 'range' ? `From ${new Date(task.date.start).toDateString()} to ${new Date(task.date.end).toDateString()}` : 
                    task.schedule}</small></p>
            </div>
            <div class="task-actions">
                <i class="fas fa-trash" onclick="deleteTask(${index})" title="Delete Task"></i>
                <i class="fas fa-thumbtack" onclick="pinTask(${index})" style="color: ${task.pinned ? '#f39c12' : '#2c3e50'}" title="Pin/Unpin Task"></i>
            </div>
        `;

        container.appendChild(taskElement);
    });
}

// Delete Task
function deleteTask(index) {
        tasks.splice(index, 1);
        localStorage.setItem('tasks', JSON.stringify(tasks));
        displayTasks();
}

// Pin/Unpin Task
function pinTask(index) {
    tasks[index].pinned = !tasks[index].pinned;
    localStorage.setItem('tasks', JSON.stringify(tasks));
    displayTasks();
}

// Clear input fields after creating a task
function clearInputs() {
    document.getElementById('taskTitle').value = '';
    document.getElementById('taskInfo').value = '';
    document.getElementById('taskDate').value = '';
    document.getElementById('startDate').value = '';
    document.getElementById('endDate').value = '';
    document.getElementById('taskSchedule').value = '';
    document.getElementById('taskDateContainer').style.display = 'none';
    document.getElementById('rangeDateContainer').style.display = 'none';
}

// Initialize and display tasks on page load
document.addEventListener('DOMContentLoaded', () => {
    displayTasks();
});


document.addEventListener('DOMContentLoaded', () => {
    const content = document.querySelector('.transition-content');
    const links = document.querySelectorAll('.transition-link');

    setTimeout(() => {
        content.classList.add('visible');
        links.forEach(link => link.classList.add('visible'));
    }, 100);

    document.querySelectorAll('a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = this.href;

            content.classList.remove('visible');
            links.forEach(link => link.classList.remove('visible'));

            setTimeout(() => {
                window.location.href = target;
            }, 300);
        });
    });
});

const taskTitle = document.getElementById('taskTitle');
const taskInfo = document.getElementById('taskInfo');



