<div id="top">

<!-- HEADER STYLE: CLASSIC -->
<div align="center">

<img src="Epita.png" width="30%" style="position: relative; top: 0; right: 0;" alt="Project Logo"/>

# EPITA-HUB

<em>Empower collaboration, ignite innovation, connect effortlessly.</em>

<!-- BADGES -->
<img src="https://img.shields.io/github/license/Luapsiaron/epita-hub?style=flat&logo=opensourceinitiative&logoColor=white&color=0080ff" alt="license">
<img src="https://img.shields.io/github/last-commit/Luapsiaron/epita-hub?style=flat&logo=git&logoColor=white&color=0080ff" alt="last-commit">
<img src="https://img.shields.io/github/languages/top/Luapsiaron/epita-hub?style=flat&color=0080ff" alt="repo-top-language">
<img src="https://img.shields.io/github/languages/count/Luapsiaron/epita-hub?style=flat&color=0080ff" alt="repo-language-count">

<em>Built with the tools and technologies:</em>

<img src="https://img.shields.io/badge/Express-000000.svg?style=flat&logo=Express&logoColor=white" alt="Express">
<img src="https://img.shields.io/badge/JSON-000000.svg?style=flat&logo=JSON&logoColor=white" alt="JSON">
<img src="https://img.shields.io/badge/npm-CB3837.svg?style=flat&logo=npm&logoColor=white" alt="npm">
<img src="https://img.shields.io/badge/JavaScript-F7DF1E.svg?style=flat&logo=JavaScript&logoColor=black" alt="JavaScript">
<img src="https://img.shields.io/badge/GNU%20Bash-4EAA25.svg?style=flat&logo=GNU-Bash&logoColor=white" alt="GNU%20Bash">

</div>
<br>

---

## Table of Contents

- [Overview](#overview)
- [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Installation](#installation)
    - [Usage](#usage)
    - [Testing](#testing)
- [Features](#features)
- [Project Structure](#project-structure)
    - [Project Index](#project-index)
- [License](#license)

---

## Overview

**Epita Hub** is a collaborative web platform designed to help students at EPITA, my engineering school in Frances. It brings together essential tools like real-time chat, project tracking, calendar sharing, and user profiles — all accessible through a clean and functional interface.

Built with Node.js and designed to run on an IaaS environment (EC2), it showcases practical DevOps skills like scripting, deployment automation, and service configuration.

✨ **Key Features:**

This project simplifies the complexities of managing user interactions and project data. The core features include:

- 💬 **Team Chat:** Real-time messaging system using Socket.IO, with support for public and private channels.
- 🔒 **User Authentication:** Secure sign-up and login with persistent user data.
- 📊 **Project Management:** Create and assign tasks, track progress, and view deadlines.
- 📆 **Shared Calendars:** Importable .ics files for each campus, integrated into the UI.
- ⚙️ **Server Automation:** Shell scripts for deployment, backup, recovery, and maintenance.
- 🌐 **Cloud-Hosted:** Deployed on AWS EC2 with Apache2 as a reverse proxy and PM2 for process management.

---


## Project Structure

```sh
└── epita-hub/
    ├── LICENSE
    ├── channels.json
    ├── messages.json
    ├── package-lock.json
    ├── package.json
    ├── projects.json
    ├── public
    │   ├── LICENSE.html
    │   ├── calendar.html
    │   ├── calendars
    │   ├── chat.html
    │   ├── chat.js
    │   ├── edit.html
    │   ├── index.html
    │   ├── login.html
    │   ├── monitoring.html
    │   ├── navbar.html
    │   ├── navbar.js
    │   ├── profile.html
    │   ├── project-tasks.html
    │   ├── project-tasks.js
    │   ├── project.html
    │   ├── project.js
    │   ├── signup.html
    │   └── style.css
    ├── scripts
    │   ├── backup.sh
    │   ├── redeploy.sh
    │   ├── restart.sh
    │   └── setup_server.sh
    ├── server.js
    └── users.json
```

---

### Project Index

<details open>
	<summary><b><code>EPITA-HUB/</code></b></summary>
	<!-- __root__ Submodule -->
	<details>
	    <summary><b>__root__</b></summary>
	    <blockquote>
		    <div class='directory-path' style='padding: 8px 0; color: #666;'>
			    <code><b>⦿ __root__</b></code>
		    <table style='width: 100%; border-collapse: collapse;'>
		    <thead>
			    <tr style='background-color: #f8f9fa;'>
				    <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
				    <th style='text-align: left; padding: 8px;'>Summary</th>
			    </tr>
		    </thead>
			    <tr style='border-bottom: 1px solid #eee;'>
				    <td style='padding: 8px;'><b><a href='https://github.com/Luapsiaron/epita-hub/blob/master/server.js'>server.js</a></b></td>
				    <td style='padding: 8px;'>Starts the main Node.js server using Express and Socket.IO. Manages user authentication, real-time messaging, channel creation, and project/task handling.</td>
			    </tr>
			    <tr style='border-bottom: 1px solid #eee;'>
				    <td style='padding: 8px;'><b><a href='https://github.com/Luapsiaron/epita-hub/blob/master/projects.json'>projects.json</a></b></td>
				    <td style='padding: 8px;'>Stores all project data: names, statuses, assigned users, and associated tasks. Acts as the central reference for project management.</td>
			    </tr>
			    <tr style='border-bottom: 1px solid #eee;'>
				    <td style='padding: 8px;'><b><a href='https://github.com/Luapsiaron/epita-hub/blob/master/package.json'>package.json</a></b></td>
				    <td style='padding: 8px;'>Declares the app’s dependencies (e.g., Express, Socket.IO) and includes startup scripts for PM2. Required to install and run the project.</td>
			    </tr>
			    <tr style='border-bottom: 1px solid #eee;'>
				    <td style='padding: 8px;'><b><a href='https://github.com/Luapsiaron/epita-hub/blob/master/users.json'>users.json</a></b></td>
				    <td style='padding: 8px;'>Contains registered user accounts, including usernames, hashed passwords, campus info, bios, and profile pictures. Used for login and personalization.</td>
			    </tr>
			    <tr style='border-bottom: 1px solid #eee;'>
				    <td style='padding: 8px;'><b><a href='https://github.com/Luapsiaron/epita-hub/blob/master/messages.json'>messages.json</a></b></td>
				    <td style='padding: 8px;'>Logs chat messages organized by channels. Supports conversation history and real-time chat functionality.</td>
			    </tr>
			    <tr style='border-bottom: 1px solid #eee;'>
				    <td style='padding: 8px;'><b><a href='https://github.com/Luapsiaron/epita-hub/blob/master/channels.json'>channels.json</a></b></td>
				    <td style='padding: 8px;'>Defines the structure of public and private channels, including members and creators. Controls access to chat spaces.</td>
			    </tr>
			    <tr style='border-bottom: 1px solid #eee;'>
				    <td style='padding: 8px;'><b><a href='https://github.com/Luapsiaron/epita-hub/blob/master/LICENSE'>LICENSE</a></b></td>
				    <td style='padding: 8px;'>MIT License allowing free use, modification, and distribution of the project. Encourages open-source collaboration.</td>
			    </tr>
		    </table>
	    </blockquote>
	</details>
	<!-- public Submodule -->
	<details>
	    <summary><b>public</b></summary>
	    <blockquote>
	        <div class='directory-path' style='padding: 8px 0; color: #666;'>
		        <code><b>⦿ public</b></code>
	        </div>
	        <table style='width: 100%; border-collapse: collapse;'>
	        <thead>
		        <tr style='background-color: #f8f9fa;'>
			        <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
			        <th style='text-align: left; padding: 8px;'>Summary</th>
		        </tr>
	        </thead>
		        <tr style='border-bottom: 1px solid #eee;'>
			        <td style='padding: 8px;'>index.html</td>
			        <td style='padding: 8px;'>Landing page of the application. Redirects users to login or sign-up and serves as the entry point for unauthenticated visitors.</td>
		        </tr>
		        <tr style='border-bottom: 1px solid #eee;'>
			        <td style='padding: 8px;'>login.html</td>
			        <td style='padding: 8px;'>Login form interface. Sends user credentials to the server for authentication.</td>
		        </tr>
		        <tr style='border-bottom: 1px solid #eee;'>
			        <td style='padding: 8px;'>signup.html</td>
			        <td style='padding: 8px;'>Registration page allowing users to create an account with campus, bio, and password information.</td>
		        </tr>
		        <tr style='border-bottom: 1px solid #eee;'>
			        <td style='padding: 8px;'>profile.html</td>
			        <td style='padding: 8px;'>User profile display showing username, bio, campus, and profile picture. Pulls data from users.json.</td>
		        </tr>
		        <tr style='border-bottom: 1px solid #eee;'>
			        <td style='padding: 8px;'>edit.html</td>
			        <td style='padding: 8px;'>Profile editing interface. Allows users to update bio, campus, and profile image.</td>
		        </tr>
		        <tr style='border-bottom: 1px solid #eee;'>
			        <td style='padding: 8px;'>navbar.html / navbar.js</td>
			        <td style='padding: 8px;'>Reusable navigation bar and JavaScript logic to dynamically insert the navbar into each page and handle UI interactions.</td>
		        </tr>
		        <tr style='border-bottom: 1px solid #eee;'>
			        <td style='padding: 8px;'>chat.html / chat.js</td>
			        <td style='padding: 8px;'>Real-time chat interface using Socket.IO. Supports multiple channels and displays message history.</td>
		        </tr>
		        <tr style='border-bottom: 1px solid #eee;'>
			        <td style='padding: 8px;'>project.html / project.js</td>
			        <td style='padding: 8px;'>Project dashboard allowing users to view and manage their assigned projects and team roles.</td>
		        </tr>
		        <tr style='border-bottom: 1px solid #eee;'>
			        <td style='padding: 8px;'>project-tasks.html / project-tasks.js</td>
			        <td style='padding: 8px;'>Task management interface for a selected project. Supports assignment, status updates, and member tracking.</td>
		        </tr>
		        <tr style='border-bottom: 1px solid #eee;'>
			        <td style='padding: 8px;'>calendar.html</td>
			        <td style='padding: 8px;'>Displays synchronized campus calendars from `.ics` files to help users coordinate schedules.</td>
		        </tr>
		        <tr style='border-bottom: 1px solid #eee;'>
			        <td style='padding: 8px;'>calendars/</td>
			        <td style='padding: 8px;'>Folder containing `.ics` files for each EPITA campus (e.g. Rennes, Paris, Lyon) used in calendar.html.</td>
		        </tr>
		        <tr style='border-bottom: 1px solid #eee;'>
			        <td style='padding: 8px;'>monitoring.html</td>
			        <td style='padding: 8px;'>Monitoring interface for overviewing internal server or usage status (work-in-progress / optional).</td>
		        </tr>
		        <tr style='border-bottom: 1px solid #eee;'>
			        <td style='padding: 8px;'>style.css</td>
			        <td style='padding: 8px;'>Main stylesheet used across all HTML pages to apply a consistent layout and design system.</td>
		        </tr>
		        <tr style='border-bottom: 1px solid #eee;'>
			        <td style='padding: 8px;'>LICENSE.html</td>
			        <td style='padding: 8px;'>HTML rendering of the MIT license, displayed from within the web interface for transparency.</td>
		        </tr>
	        </table>
	    </blockquote>
    </details>
	<!-- scripts Submodule -->
    <details>
	    <summary><b>scripts</b></summary>
	    <blockquote>
		    <div class='directory-path' style='padding: 8px 0; color: #666;'>
			    <code><b>⦿ scripts</b></code>
		    </div>
		    <table style='width: 100%; border-collapse: collapse;'>
		    <thead>
			    <tr style='background-color: #f8f9fa;'>
				    <th style='width: 30%; text-align: left; padding: 8px;'>File Name</th>
				    <th style='text-align: left; padding: 8px;'>Summary</th>
			    </tr>
		    </thead>
			    <tr style='border-bottom: 1px solid #eee;'>
				    <td style='padding: 8px;'><b><a href='https://github.com/Luapsiaron/epita-hub/blob/master/scripts/setup_server.sh'>setup_server.sh</a></b></td>
				    <td style='padding: 8px;'>- Installs and configures all necessary components for running EPITA Hub on a fresh EC2 instance<br>- Updates system packages, installs Node.js, Apache2, and PM2, and sets up Apache as a reverse proxy to the Node.js app<br>- Automatically starts the server and prepares the environment for production use.</td>
			    </tr>
			    <tr style='border-bottom: 1px solid #eee;'>
				    <td style='padding: 8px;'><b><a href='https://github.com/Luapsiaron/epita-hub/blob/master/scripts/redeploy.sh'>redeploy.sh</a></b></td>
				    <td style='padding: 8px;'>- Restores a previously created backup of the project<br>- Removes the current project directory, extracts a selected backup archive, and restarts the Node.js server using PM2<br>- Useful for quick recovery in case of data loss or system failure.</td>
			    </tr>
			    <tr style='border-bottom: 1px solid #eee;'>
				    <td style='padding: 8px;'><b><a href='https://github.com/Luapsiaron/epita-hub/blob/master/scripts/restart.sh'>restart.sh</a></b></td>
				    <td style='padding: 8px;'>- Performs basic server maintenance by flushing PM2 logs and restarting the Node.js process<br>- Helps keep the server running smoothly and ensures logs don’t consume unnecessary disk space over time.</td>
			    </tr>
			    <tr style='border-bottom: 1px solid #eee;'>
				    <td style='padding: 8px;'><b><a href='https://github.com/Luapsiaron/epita-hub/blob/master/scripts/backup.sh'>backup.sh</a></b></td>
				    <td style='padding: 8px;'>- Creates a compressed archive of the entire project directory with a timestamp<br>- Ensures data integrity by optionally stopping the server before backup, and restarting it after completion<br>- Essential for keeping regular recovery points of code and data.</td>
			    </tr>
		    </table>
	    </blockquote>
    </details>
</details>

---

## Getting Started

### Installation

Install epita-hub on a fresh EC2 instance in just a few steps using the automated setup script.


1. **Connect to your EC2 instance:**

    ```sh
    ❯ ssh -i your-key.pem ubuntu@<your-ec2-ip>
    ```

2. **Clone the repository:**

    ```sh
    ❯ git clone https://github.com/Luapsiaron/epita-hub-auth.git
    ❯ cd epita-hub-auth/scripts

    ```

3. **Make the setup script executable:**

    ```sh
    ❯ chmod +x setup_server.sh
    ```
    
3. **Run the setup script:**

    ```sh
    ❯ ./setup_server.sh
    ```

This script installs all required packages (Apache2, Node.js, PM2), sets up the reverse proxy, installs project dependencies (including Socket.IO), and starts the server automatically.


## License

Epita-hub is protected under the [LICENSE](https://choosealicense.com/licenses) License. For more details, refer to the [LICENSE](https://choosealicense.com/licenses/) file.

---
