document.addEventListener('DOMContentLoaded', () => {
    const todoInput = document.getElementById('todoInput');
    const addButton = document.getElementById('addButton');
    const todoList = document.getElementById('todoList');
    const clearButton = document.getElementById('clearButton');
  
    // Load tasks from local storage on page load
    loadTasks();
  
    addButton.addEventListener('click', addTodo);
    todoInput.addEventListener('keypress', function(event) {
      if (event.key === 'Enter') {
        addTodo();
      }
    });
  
    clearButton.addEventListener('click', () => {
      todoList.innerHTML = '';
      saveTasks();
    });
  
    function addTodo() {
      const todoText = todoInput.value.trim();
      if (todoText !== '') {
        const li = createTodoItem(todoText, false);
        todoList.appendChild(li);
        todoInput.value = '';
  
        saveTasks();
      }
    }
  
    function createTodoItem(todoText, completed) {
      const li = document.createElement('li');
      li.setAttribute('draggable', 'true');
      if (completed) {
        li.classList.add('completed');
      }
  
      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.checked = completed;
      checkbox.addEventListener('change', () => {
        if (checkbox.checked) {
          li.classList.add('completed');
        } else {
          li.classList.remove('completed');
        }
        saveTasks();
      });
  
      const taskSpan = document.createElement('span');
      taskSpan.textContent = todoText;
  
      const editIcon = document.createElement('span');
      editIcon.classList.add('edit-icon');
      editIcon.innerHTML = '<i class="fas fa-edit"></i>';
      editIcon.addEventListener('click', () => {
        editTask(li, taskSpan);
      });
  
      const deleteIcon = document.createElement('span');
      deleteIcon.classList.add('delete-icon');
      deleteIcon.innerHTML = '<i class="fas fa-trash"></i>';
      deleteIcon.addEventListener('click', () => {
        todoList.removeChild(li);
        saveTasks();
      });
  
      const iconContainer = document.createElement('div');
      iconContainer.classList.add('icon-container');
      iconContainer.appendChild(editIcon);
      iconContainer.appendChild(deleteIcon);
  
      li.appendChild(checkbox);
      li.appendChild(taskSpan);
      li.appendChild(iconContainer);
  
      // Add drag and drop handlers
      li.addEventListener('dragstart', handleDragStart);
      li.addEventListener('dragover', handleDragOver);
      li.addEventListener('drop', handleDrop);
      li.addEventListener('dragend', handleDragEnd);
  
      return li;
    }
  
    function editTask(li, taskSpan) {
      const input = document.createElement('input');
      input.type = 'text';
      input.value = taskSpan.textContent;
      input.classList.add('input-field');
  
      li.replaceChild(input, taskSpan);
      input.focus();
  
      input.addEventListener('keypress', function(event) {
        if (event.key === 'Enter') {
          taskSpan.textContent = input.value;
          li.replaceChild(taskSpan, input);
          saveTasks();
        }
      });
  
      input.addEventListener('blur', function() {
        taskSpan.textContent = input.value;
        li.replaceChild(taskSpan, input);
        saveTasks();
      });
    }
  
    function saveTasks() {
      const tasks = [];
      todoList.querySelectorAll('li').forEach(li => {
        tasks.push({
          text: li.querySelector('span').textContent,
          completed: li.querySelector('input').checked
        });
      });
      localStorage.setItem('tasks', JSON.stringify(tasks));
    }
  
    function loadTasks() {
      const tasks = JSON.parse(localStorage.getItem('tasks')) || [];
      tasks.forEach(task => {
        const li = createTodoItem(task.text, task.completed);
        todoList.appendChild(li);
      });
    }
  
    // Drag and Drop Handlers
    let draggedItem = null;
  
    function handleDragStart(event) {
      draggedItem = this;
      setTimeout(() => {
        this.classList.add('dragging');
      }, 0);
    }
  
    function handleDragOver(event) {
      event.preventDefault();
      const afterElement = getDragAfterElement(todoList, event.clientY);
      if (afterElement == null) {
        todoList.appendChild(draggedItem);
      } else {
        todoList.insertBefore(draggedItem, afterElement);
      }
    }
  
    function handleDrop() {
      this.classList.remove('dragging');
      saveTasks();
    }
  
    function handleDragEnd() {
      this.classList.remove('dragging');
    }
  
    function getDragAfterElement(container, y) {
      const draggableElements = [...container.querySelectorAll('li:not(.dragging)')];
  
      return draggableElements.reduce((closest, child) => {
        const box = child.getBoundingClientRect();
        const offset = y - box.top - box.height / 2;
        if (offset < 0 && offset > closest.offset) {
          return { offset: offset, element: child };
        } else {
          return closest;
        }
      }, { offset: Number.NEGATIVE_INFINITY }).element;
    }
  });
  