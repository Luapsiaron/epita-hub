document.addEventListener('DOMContentLoaded', () => {
  fetch('/profile-data')
    .then(res => {
      if (res.status === 401) window.location.href = '/login.html';
      return res.json();
    })
    .then(user => {
      const projectId = new URLSearchParams(window.location.search).get('id');
      if (!projectId) return alert('Project ID missing.');

      window.currentUser = user.username;
      window.currentProjectId = projectId;

      setupForm(projectId);
      setupMemberForm(projectId);
      setupDeleteProjectButton(projectId);
      loadProject(projectId);
    });
});

function loadProject(projectId) {
  fetch(`/projects/${projectId}`)
    .then(res => res.json())
    .then(project => {
      document.getElementById('project-title').textContent = project.projectName;

      const isOwner = project.owner === window.currentUser;
      document.getElementById('owner-section').style.display = isOwner ? 'block' : 'none';

      const todo = document.getElementById('todo');
      const inprogress = document.getElementById('inprogress');
      const done = document.getElementById('done');

      [todo, inprogress, done].forEach(el => el.innerHTML = `<h2>${el.id.replace('inprogress', 'In Progress').replace('todo', 'To Do').replace('done', 'Done')}</h2>`);

      project.tasks.forEach(task => {
        const div = document.createElement('div');
        div.className = 'task';
        div.innerHTML = `
          <strong>${task.title}</strong><br>
          ${task.assignedTo ? `👤 ${task.assignedTo}<br>` : ''}
          ${task.dueDate ? `📅 ${task.dueDate}<br>` : ''}
        `;

        if (isOwner) {
          const select = document.createElement('select');
          ['To Do', 'In Progress', 'Done'].forEach(status => {
            const option = document.createElement('option');
            option.value = status;
            option.textContent = status;
            if (task.status === status) option.selected = true;
            select.appendChild(option);
          });
          select.onchange = () => updateStatus(projectId, task.id, select.value);
          div.appendChild(select);

          const delBtn = document.createElement('button');
          delBtn.textContent = 'Delete';
          delBtn.style.marginTop = '0.5rem';
          delBtn.onclick = () => deleteTask(projectId, task.id);
          div.appendChild(delBtn);
        }

        if (task.status === 'To Do') todo.appendChild(div);
        else if (task.status === 'In Progress') inprogress.appendChild(div);
        else done.appendChild(div);
      });
    });
}

function setupForm(projectId) {
  const form = document.getElementById('add-task-form');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    data.status = 'To Do';

    fetch(`/projects/${projectId}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    }).then(() => {
      form.reset();
      loadProject(projectId);
    });
  });
}

function setupMemberForm(projectId) {
  const form = document.getElementById('add-member-form');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(form);
    fetch(`/projects/${projectId}/members`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ newMember: formData.get('newMember') })
    })
    .then(() => {
      form.reset();
      alert('Member added');
    });
  });
}

function updateStatus(projectId, taskId, status) {
  fetch(`/projects/${projectId}/tasks/${taskId}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status })
  }).then(() => loadProject(projectId));
}

function deleteTask(projectId, taskId) {
  fetch(`/projects/${projectId}/tasks/${taskId}`, {
    method: 'DELETE'
  }).then(() => loadProject(projectId));
}

function setupDeleteProjectButton(projectId) {
  const btn = document.getElementById('delete-project-btn');
  btn.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete this project?')) {
      fetch(`/projects/${projectId}`, {
        method: 'DELETE'
      }).then(() => {
        window.location.href = '/project.html';
      });
    }
  });
}

