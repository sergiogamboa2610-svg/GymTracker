const App = (() => {
  const STORAGE_KEY = 'gymTrackerProDataV1';
  let state = loadState();
  let currentUserId = localStorage.getItem('gymTrackerProCurrentUser') || null;
  let progressChart;

  const $ = (id) => document.getElementById(id);
  const uid = () => crypto.randomUUID ? crypto.randomUUID() : String(Date.now() + Math.random());
  const today = () => new Date().toISOString().slice(0, 10);

  function defaultState(){return {users:[],progress:[],tasks:[],meals:[],workouts:[],settings:{theme:'dark'}}}
  function loadState(){try{return JSON.parse(localStorage.getItem(STORAGE_KEY)) || defaultState()}catch{return defaultState()}}
  function saveState(){localStorage.setItem(STORAGE_KEY, JSON.stringify(state));}
  function currentUser(){return state.users.find(u=>u.id===currentUserId)}
  function byUser(rows){return rows.filter(x=>x.userId===currentUserId)}
  function money(n){return Number(n||0).toLocaleString('es-CR')}
  function escapeHtml(value){return String(value ?? '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#039;','"':'&quot;'}[c]));}

  function seedIfEmpty(){
    if(state.users.length) return;
    const id = uid();
    state.users.push({id,name:'Demo User',age:30,height:175,weight:80,goal:'Ganar músculo'});
    state.progress.push({id:uid(),userId:id,date:today(),weight:80,muscle:36,fat:22});
    state.tasks.push({id:uid(),userId:id,title:'Tomar 2 litros de agua',priority:'Alta',doneDate:''});
    state.meals.push({id:uid(),userId:id,date:today(),type:'Desayuno',description:'Avena, claras, banano y café',calories:520,protein:35,carbs:62,fat:12});
    state.workouts.push({id:uid(),userId:id,date:today(),exercise:'Press banca',muscle:'Pecho',sets:4,reps:10,weight:70,done:false});
    currentUserId = id;
    localStorage.setItem('gymTrackerProCurrentUser', id);
    saveState();
  }

  function toast(message, type='primary'){
    const el = document.createElement('div');
    el.className = 'toast align-items-center show';
    el.role = 'alert';
    el.innerHTML = `<div class="d-flex"><div class="toast-body"><i class="bi bi-info-circle me-2 text-${type}"></i>${escapeHtml(message)}</div><button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button></div>`;
    $('toastContainer').appendChild(el);
    setTimeout(()=>el.remove(), 3500);
  }

  function init(){
    seedIfEmpty();
    applyTheme(state.settings.theme || 'dark');
    bindEvents();
    renderLoginUsers();
    if(currentUser()) showApp(); else showLogin();
  }

  function bindEvents(){
    $('btnLogin').addEventListener('click', () => { currentUserId = $('loginUserSelect').value; localStorage.setItem('gymTrackerProCurrentUser', currentUserId); showApp(); });
    $('btnLogout').addEventListener('click', showLogin);
    $('btnTheme').addEventListener('click', toggleTheme);
    $('btnBackup').addEventListener('click', exportData);
    $('importFile').addEventListener('change', importData);
    $('importFileSettings').addEventListener('change', importData);
    $('userForm').addEventListener('submit', createUser);
    $('progressForm').addEventListener('submit', addProgress);
    $('taskForm').addEventListener('submit', addTask);
    $('mealForm').addEventListener('submit', addMeal);
    $('workoutForm').addEventListener('submit', addWorkout);
    document.querySelectorAll('.nav-link').forEach(btn => btn.addEventListener('click', () => navigate(btn.dataset.view)));
    $('progressDate').value = today();
    $('workoutDay').value = today();
  }

  function showLogin(){
    $('appShell').classList.add('d-none');
    $('loginScreen').classList.remove('d-none');
    renderLoginUsers();
  }

  function showApp(){
    $('loginScreen').classList.add('d-none');
    $('appShell').classList.remove('d-none');
    renderAll();
  }

  function navigate(view){
    document.querySelectorAll('.nav-link').forEach(x=>x.classList.toggle('active', x.dataset.view===view));
    document.querySelectorAll('.view').forEach(x=>x.classList.remove('active-view'));
    $(`view-${view}`).classList.add('active-view');
    const titles = {dashboard:'Home',tasks:'Tareas',nutrition:'Menú',workouts:'Rutinas',settings:'Configuración'};
    $('pageTitle').textContent = titles[view] || 'Home';
    renderAll();
  }

  function initials(name){return name.split(' ').map(x=>x[0]).join('').slice(0,2).toUpperCase()}

  function renderLoginUsers(){
    $('loginUserSelect').innerHTML = state.users.map(u=>`<option value="${u.id}" ${u.id===currentUserId?'selected':''}>${escapeHtml(u.name)} - ${escapeHtml(u.goal)}</option>`).join('');
  }

  function renderHeader(){
    const u = currentUser(); if(!u) return;
    $('sidebarUserName').textContent = u.name;
    $('sidebarUserGoal').textContent = u.goal;
    $('sidebarAvatar').textContent = initials(u.name);
  }

  function renderAll(){renderHeader(); renderDashboard(); renderTasks(); renderMeals(); renderWorkouts(); renderUsers();}

  function renderDashboard(){
    const u = currentUser(); if(!u) return;
    const progress = byUser(state.progress).sort((a,b)=>a.date.localeCompare(b.date));
    const latest = progress.at(-1) || {weight:u.weight,muscle:0,fat:0};
    const bmi = latest.weight && u.height ? (latest.weight / Math.pow(u.height/100,2)).toFixed(1) : '0';
    $('kpiWeight').textContent = `${latest.weight || 0} kg`;
    $('kpiMuscle').textContent = `${latest.muscle || 0} kg`;
    $('kpiFat').textContent = `${latest.fat || 0}%`;
    $('kpiBmi').textContent = bmi;
    $('progressWeight').value = latest.weight || u.weight || 0;
    $('progressMuscle').value = latest.muscle || 0;
    $('progressFat').value = latest.fat || 0;

    const tasks = byUser(state.tasks); const done = tasks.filter(t=>t.doneDate===today()).length; const taskPct = tasks.length ? Math.round(done/tasks.length*100) : 0;
    const workoutsDone = byUser(state.workouts).filter(w=>w.done).length;
    const mealsToday = byUser(state.meals).filter(m=>m.date===today());
    const calories = mealsToday.reduce((s,m)=>s+Number(m.calories||0),0);
    $('summaryTasks').textContent = `${taskPct}%`; $('barTasks').style.width = `${taskPct}%`;
    $('summaryWorkouts').textContent = `${workoutsDone}`; $('barWorkouts').style.width = `${Math.min(workoutsDone*15,100)}%`;
    $('summaryCalories').textContent = `${money(calories)} kcal`; $('barCalories').style.width = `${Math.min(calories/2500*100,100)}%`;
    renderChart(progress);
  }

  function renderChart(progress){
    const ctx = $('progressChart');
    if(progressChart) progressChart.destroy();
    progressChart = new Chart(ctx, {type:'line',data:{labels:progress.map(p=>p.date),datasets:[
      {label:'Peso',data:progress.map(p=>Number(p.weight)),borderColor:'#60a5fa',backgroundColor:'rgba(96,165,250,.15)',tension:.35,fill:true},
      {label:'Masa muscular',data:progress.map(p=>Number(p.muscle)),borderColor:'#22c55e',backgroundColor:'rgba(34,197,94,.08)',tension:.35},
      {label:'Grasa %',data:progress.map(p=>Number(p.fat)),borderColor:'#f59e0b',backgroundColor:'rgba(245,158,11,.08)',tension:.35}
    ]},options:{responsive:true,plugins:{legend:{labels:{color:getComputedStyle(document.documentElement).getPropertyValue('--text')}}},scales:{x:{ticks:{color:'#94a3b8'},grid:{color:'rgba(148,163,184,.12)'}},y:{ticks:{color:'#94a3b8'},grid:{color:'rgba(148,163,184,.12)'}}}}});
  }

  function createUser(e){
    e.preventDefault();
    const user = {id:uid(),name:$('userName').value.trim(),age:Number($('userAge').value),height:Number($('userHeight').value),weight:Number($('userWeight').value),goal:$('userGoal').value};
    state.users.push(user); currentUserId = user.id; localStorage.setItem('gymTrackerProCurrentUser', user.id);
    saveState(); bootstrap.Modal.getInstance(document.querySelector('#userModal'))?.hide(); e.target.reset();
    renderLoginUsers(); showApp(); toast('Usuario creado correctamente','success');
  }

  function addProgress(e){
    e.preventDefault();
    state.progress.push({id:uid(),userId:currentUserId,date:$('progressDate').value,weight:Number($('progressWeight').value),muscle:Number($('progressMuscle').value),fat:Number($('progressFat').value)});
    saveState(); bootstrap.Modal.getInstance(document.querySelector('#progressModal'))?.hide(); renderDashboard(); toast('Progreso registrado','success');
  }

  function addTask(e){
    e.preventDefault();
    state.tasks.push({id:uid(),userId:currentUserId,title:$('taskTitle').value.trim(),priority:$('taskPriority').value,doneDate:''});
    saveState(); e.target.reset(); $('taskPriority').value='Media'; renderAll(); toast('Tarea agregada','success');
  }

  function renderTasks(){
    const rows = byUser(state.tasks);
    $('tasksTable').innerHTML = rows.map(t=>`<tr><td><input class="form-check-input" type="checkbox" ${t.doneDate===today()?'checked':''} onchange="App.toggleTask('${t.id}')"></td><td class="${t.doneDate===today()?'text-decoration-line-through text-secondary':''}">${escapeHtml(t.title)}</td><td><span class="badge-priority priority-${t.priority}">${t.priority}</span></td><td class="text-end"><button class="btn btn-sm btn-outline-danger" onclick="App.deleteItem('tasks','${t.id}')"><i class="bi bi-trash"></i></button></td></tr>`).join('') || `<tr><td colspan="4" class="text-center text-secondary py-4">No hay tareas registradas.</td></tr>`;
  }
  function toggleTask(id){const t=state.tasks.find(x=>x.id===id); if(t){t.doneDate=(t.doneDate===today()?'':today()); saveState(); renderAll();}}

  function addMeal(e){
    e.preventDefault();
    state.meals.push({id:uid(),userId:currentUserId,date:today(),type:$('mealType').value,description:$('mealDescription').value.trim(),calories:Number($('mealCalories').value),protein:Number($('mealProtein').value),carbs:Number($('mealCarbs').value),fat:Number($('mealFat').value)});
    saveState(); e.target.reset(); renderAll(); toast('Comida registrada','success');
  }

  function renderMeals(){
    const types = ['Desayuno','Merienda AM','Almuerzo','Merienda PM','Cena'];
    const meals = byUser(state.meals).filter(m=>m.date===today());
    $('mealCards').innerHTML = types.map(type => {
      const entries = meals.filter(m=>m.type===type);
      return `<div class="meal-card"><h5>${type}</h5>${entries.map(m=>`<div class="meal-entry"><strong>${escapeHtml(m.description)}</strong><p>${m.calories} kcal</p><div class="macro-row"><span class="macro">P ${m.protein}g</span><span class="macro">C ${m.carbs}g</span><span class="macro">G ${m.fat}g</span></div><button class="btn btn-sm btn-outline-danger mt-2" onclick="App.deleteItem('meals','${m.id}')"><i class="bi bi-trash"></i></button></div>`).join('') || '<p class="text-secondary">Sin registro.</p>'}</div>`
    }).join('');
  }

  function addWorkout(e){
    e.preventDefault();
    state.workouts.push({id:uid(),userId:currentUserId,date:$('workoutDay').value,exercise:$('exerciseName').value.trim(),muscle:$('muscleGroup').value.trim(),sets:Number($('sets').value),reps:Number($('reps').value),weight:Number($('weightUsed').value),done:false});
    saveState(); e.target.reset(); $('workoutDay').value=today(); $('sets').value=4; $('reps').value=10; $('weightUsed').value=0; renderAll(); toast('Ejercicio agregado','success');
  }

  function renderWorkouts(){
    const workouts = byUser(state.workouts);
    const t = today();
    const dates = [...new Set(workouts.map(w=>w.date||w.day))].sort((a,b)=>b.localeCompare(a));
    if(!dates.length){
      $('workoutBoard').innerHTML = '<p class="text-secondary text-center py-4">No hay rutinas registradas. Agrega tu primer ejercicio.</p>';
      return;
    }
    $('workoutBoard').innerHTML = dates.map(date => {
      const entries = workouts.filter(w=>(w.date||w.day)===date);
      const isToday = date === t;
      const label = isToday ? `<span class="badge bg-primary me-2">Hoy</span>${date}` : date;
      return `<div class="day-card${isToday?' border border-primary':''}"><h5>${label}</h5>${entries.map(w=>`<div class="exercise-entry"><strong>${escapeHtml(w.exercise)}</strong><p>${escapeHtml(w.muscle || 'General')} · ${w.sets}x${w.reps} · ${w.weight}kg</p><div class="d-flex gap-2 mt-2"><button class="btn btn-sm ${w.done?'btn-success':'btn-outline-success'}" onclick="App.toggleWorkout('${w.id}')"><i class="bi bi-check2"></i></button><button class="btn btn-sm btn-outline-danger" onclick="App.deleteItem('workouts','${w.id}')"><i class="bi bi-trash"></i></button></div></div>`).join('') || '<p class="text-secondary">Sin ejercicios.</p>'}</div>`
    }).join('');
  }
  function toggleWorkout(id){const w=state.workouts.find(x=>x.id===id); if(w){w.done=!w.done; saveState(); renderAll();}}

  function renderUsers(){
    $('usersList').innerHTML = state.users.map(u=>`<div class="user-card"><div class="avatar">${initials(u.name)}</div><div class="flex-grow-1"><strong>${escapeHtml(u.name)}</strong><span>${u.age} años · ${u.height} cm · ${escapeHtml(u.goal)}</span></div><button class="btn btn-sm btn-outline-primary" onclick="App.selectUser('${u.id}')">Usar</button><button class="btn btn-sm btn-outline-danger" onclick="App.deleteUser('${u.id}')"><i class="bi bi-trash"></i></button></div>`).join('');
  }

  function selectUser(id){currentUserId=id; localStorage.setItem('gymTrackerProCurrentUser', id); renderAll(); toast('Usuario seleccionado','success');}
  function deleteUser(id){
    if(state.users.length===1){toast('Debe existir al menos un usuario','warning'); return;}
    if(!confirm('¿Eliminar este usuario y toda su información?')) return;
    state.users = state.users.filter(u=>u.id!==id);
    ['progress','tasks','meals','workouts'].forEach(k=>state[k]=state[k].filter(x=>x.userId!==id));
    if(currentUserId===id) currentUserId = state.users[0].id;
    localStorage.setItem('gymTrackerProCurrentUser', currentUserId); saveState(); renderAll(); renderLoginUsers();
  }

  function deleteItem(collection,id){state[collection]=state[collection].filter(x=>x.id!==id); saveState(); renderAll();}
  function resetCurrentUserData(){
    if(!confirm('¿Limpiar todos los datos del usuario actual?')) return;
    ['progress','tasks','meals','workouts'].forEach(k=>state[k]=state[k].filter(x=>x.userId!==currentUserId));
    saveState(); renderAll(); toast('Datos del usuario limpiados','success');
  }

  function applyTheme(theme){document.documentElement.setAttribute('data-theme', theme); state.settings.theme = theme; saveState();}
  function toggleTheme(){applyTheme((state.settings.theme || 'dark') === 'dark' ? 'light' : 'dark'); renderDashboard();}

  function exportData(){
    const blob = new Blob([JSON.stringify(state,null,2)], {type:'application/json'});
    const url = URL.createObjectURL(blob); const a = document.createElement('a');
    a.href=url; a.download=`gym-tracker-backup-${today()}.json`; a.click(); URL.revokeObjectURL(url);
  }
  function importData(e){
    const file = e.target.files[0]; if(!file) return;
    const reader = new FileReader();
    reader.onload = () => {try{state = JSON.parse(reader.result); saveState(); currentUserId = state.users?.[0]?.id || null; localStorage.setItem('gymTrackerProCurrentUser', currentUserId); renderLoginUsers(); showApp(); toast('Backup importado','success');}catch{toast('Archivo JSON inválido','danger')}};
    reader.readAsText(file); e.target.value='';
  }

  return {init,toggleTask,toggleWorkout,deleteItem,selectUser,deleteUser,exportData,importData,toggleTheme,resetCurrentUserData};
})();

document.addEventListener('DOMContentLoaded', App.init);
