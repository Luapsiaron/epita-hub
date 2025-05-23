document.addEventListener('DOMContentLoaded', () => {
  fetch('/profile-data')
    .then(res => {
      if (res.status === 401) window.location.href = '/login.html';
      else return res.json();
    })
    .then(user => {
      loadProjects();
      setupForm();
    });
});

function setupForm() {
  const form = document.getElementById('create-project-form');
  form.addEventListener('submit', e => {
    e.preventDefault();
    const formData = new FormData(form);
    fetch('/projects', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ projectName: formData.get('projectName') })
    })
    .then(res => {
      if (res.ok) {
        form.reset();
        loadProjects();
      }
    });
  });
}

function loadProjects() {
  fetch('/projects')
    .then(res => res.json())
    .then(projects => {
      const list = document.getElementById('project-list');
      list.innerHTML = '';
      projects.forEach(p => {
        const div = document.createElement('div');
        div.className = 'project-card';
        div.innerHTML = `
  <h3>${p.projectName}</h3>
  <p><strong>Owner:</strong> ${p.owner}</p>
  <a href="/project-tasks.html?id=${p.id}">[Manage Tasks]</a>
`;
        list.appendChild(div);
      });
    });
}

