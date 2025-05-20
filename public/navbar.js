document.addEventListener('DOMContentLoaded', () => {
  fetch('navbar.html')
    .then(res => res.text())
    .then(data => {
      document.getElementById('navbar').innerHTML = data;

      // Vérifier l'état de la session utilisateur
      return fetch('/profile-data', { credentials: 'include' });
    })
    .then(res => {
      if (res.status === 401) {
        // Non connecté : afficher Sign Up et Log In
        document.getElementById('signupLink').style.display = 'inline';
        document.getElementById('loginLink').style.display = 'inline';
        document.getElementById('logoutLink').style.display = 'none';
        document.getElementById('profileLink').style.display = 'none';
        document.getElementById('chatLink').style.display = 'none';
	document.getElementById('project-link').style.display = 'none';
      } else {
        // Connecté : afficher Profile, Log Out et Chat
        return res.json().then(user => {
          document.getElementById('signupLink').style.display = 'none';
          document.getElementById('loginLink').style.display = 'none';
          document.getElementById('logoutLink').style.display = 'inline';
          document.getElementById('profileLink').style.display = 'inline';
          document.getElementById('chatLink').style.display = 'inline';
	  document.getElementById('projectLink').style.display = 'inline';

          console.log('Logged in as:', user.username);
        });
      }
    })
    .catch(err => {
      console.error('Error initializing navbar/session:', err);
    });
});

