# 🎯 Anonymous Marks - Sistem de evaluare anonimă a proiectelor

## 📝 Descriere
**Anonymous Marks** este o aplicație web dezvoltată cu React și Node.js care facilitează gestionarea și evaluarea anonimă a proiectelor educaționale. Platforma permite studenților (Membri Participanți) să își încarce proiectele și să evalueze alte proiecte, în timp ce profesorii pot superviza întregul proces și vizualiza evaluările.

## ✨ Funcționalități

### 🔐 Autentificare
- Sistem de login
- Roluri diferite pentru utilizatori: Membru Participant (MP) și Profesor
- Sesiune de utilizator cu păstrarea rolului și a ID-ului de utilizator

### 👨‍🎓 Pentru Membri Participanți (MP)
- **📂 Gestionarea propriului proiect**
  - Adăugarea/editarea datelor despre echipă și proiect
  - Încărcarea și actualizarea livrabilelor (link-uri către resurse)
  - Vizualizarea detaliilor propriului proiect

- **⭐ Rol de evaluator**
  - Fiecare MP poate fi și evaluator pentru alte echipe
  - Sistem de alocare anonimă pentru evaluare
  - **Evaluarea se face transparent și obiectiv**, fără a cunoaște identitatea echipei evaluate
  - Acordarea de note se face într-un **sistem complet anonim**, protejând atât evaluatorul cât și echipa evaluată

- **🔍 Evaluarea altor proiecte**
  - Vizualizarea proiectelor atribuite pentru evaluare
  - Examinarea livrabilelor încărcate de alte echipe
  - Acordarea de note (1-10) proiectelor în mod anonim
  - Posibilitatea de a modifica nota într-o perioadă limitată de timp

### 👨‍🏫 Pentru Profesori
- **📊 Supervizarea tuturor proiectelor**
  - Vizualizarea listei complete de proiecte
  - Accesarea livrabilelor fiecărei echipe
  - Consultarea notelor acordate pentru fiecare proiect
  - Verificarea mediei notelor (cu eliminarea extremelor când există minimum 3 evaluări)

## 🛠️ Tehnologii utilizate
- **Frontend**: React.js, CSS
- **Backend**: Node.js, Express
- **Bază de date**: MySQL

## 🏗️ Structura proiectului

### 💻 Componente Frontend
- **App.js** - Componenta principală care gestionează starea de autentificare
- **LoginModal.js** - Interfața de autentificare cu animații
- **Dashboard.js** - Încarcă dashboard-ul corespunzător rolului utilizatorului
- **MPDashboard.js** - Interfața pentru Membrii Participanți
- **ProfessorDashboard.js** - Interfața pentru Profesori
- **Navbar.js** - Bara de navigare a aplicației

### ⚙️ Backend
- **server.js** - Configurare server Express
- **routes/** - Definirea rutelor API
  - loginRoutes.js
  - projectRoutes.js
  - evaluationRoutes.js
- **controllers/** - Logica de business
  - loginController.js
  - projectController.js
  - evaluationController.js
- **config/** - Configurații
  - db.js - Configurare conexiune MySQL

## 🔒 Funcționalități de securitate
- **Evaluare complet anonimă** a proiectelor
- Restricții temporale pentru modificarea notelor
- Validări de date atât pe frontend cât și pe backend

## 🧮 Algoritmul de notare
- Când există cel puțin **3 evaluatori**: se elimină nota cea mai mare și nota cea mai mică, iar media se calculează din notele rămase
- Când există **2 evaluatori**: media se calculează din cele două note
- Când există **un singur evaluator**: nota acestuia este considerată media

## 📋 Instalare și rulare

### Cerințe preliminare
- Node.js
- MySQL

### Pași de instalare
1. Clonează repository-ul
```bash
git clone https://github.com/radugabe/AnonymousMarks-ReactApps.git
cd anonymous-marks
```

2. Instalează dependențele pentru frontend
```bash
cd client
npm install
```

3. Instalează dependențele pentru backend
```bash
cd ../server
npm install
```

4. Configurează baza de date
- Creează o bază de date MySQL numită `web_project`
- Actualizează credențialele în fișierul `server/config/db.js`

5. Rulează aplicația
```bash
# Terminal 1 - Backend
cd server
npm start

# Terminal 2 - Frontend
cd client
npm start
```

6. Deschide aplicația în browser la adresa `http://localhost:3000`

## 💾 Structura bazei de date
- **users** - Informații despre utilizatori (username, password, role, user_id)
- **teams** - Informații despre echipe (team_id, team_name, project_title)
- **team_content** - Asocierea dintre utilizatori și echipe (user_id, team_id)
- **deliverables** - Livrabilele încărcate (deliverable, sent_user_id)
- **user_evaluators** - Asocierea dintre evaluatori și echipe (user_id, team_id)
- **evaluations** - Notele acordate (id, team_id, user_id, mark, timestamp)

## 📜 Licență
© Toate drepturile rezervate.

---

> ### 🌟 **Caracteristică principală: Sistemul de evaluare anonimă**
> Platforma **Anonymous Marks** rezolvă problema evaluării obiective în mediul academic prin implementarea unui sistem în care:
> - **MP-urile au dublu rol**: de autor de proiect și de evaluator
> - **Anonimitatea este garantată**: evaluatorii nu știu ce echipă evaluează și echipele nu știu cine le-a evaluat
> - **Calculul notei finale**: folosește un algoritm care elimină subiectivitatea (eliminând extremele)
