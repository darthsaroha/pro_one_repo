"use-strict";

//CORE MODULE FUNCTION
function coreModuleFunc() {
    this.modalElements = [];
}
coreModuleFunc.prototype.showModalFunc = function(id) {
    let modal = document.getElementById(id);
    modal.style = "display: block;";
    modal.className = "modal show";
    coreModule.modalElements.push(modal);
}
coreModuleFunc.prototype.closeModalFunc = function(modal) {
    if (typeof modal === "string") { modal = document.getElementById(modal); }
    modal.removeAttribute("style");
    modal.className = "modal";
    appModule.closeOpenAlertsFunc();
    coreModule.modalElements.pop();
}
coreModuleFunc.prototype.closeOpenModalsFunc = function() {
    for (let i = 0; i < coreModule.modalElements.length; i++) {
        coreModule.closeModalFunc(this.modalElements[i]);
    }
}
let coreModule = new coreModuleFunc();
//APP MODULE FUNCTION
function appModuleFunc() {
    this.appPages = [{ url: "welcome", temp: "welcome", init: this.initWelcomeFunc },
        { url: "", temp: "dashboard", init: this.initDashboardFunc },
        { url: "board", temp: "board", init: this.initBoardFunc }
    ];
    this.userData = {};
    this.params = [];
    this.colorSchemes = ["#007bff", "#E84A5F", "#CC527A", "#2F9599", "#5E412F", "#355C7D"];
    this.alertElements = [];
    this.dashboardPage = document.getElementById('dashboardPageID');
    this.pageLoader = document.getElementById('pageLoaderID');
}
appModuleFunc.prototype.createAlertBoxFunc = function(ele, msg, typ, icn) {
    if (ele.firstChild.className == 'alert alert-success') { return; }
    let el = document.createElement('div');
    el.className = 'alert alert-success';
    el.innerHTML = `<i class="fas fa-${icn} color"></i> ${msg}<button type="button" class="close" onclick="javascript: this.parentNode.remove();" style="outline: 0;"><span aria-hidden="true">&times;</span></button>`;
    if (typ == 0) { el.innerHTML = `<center><i class="fas fa-${icn} fa-2x color"></i><br> ${msg} Or <a style="cursor: pointer; color: var(--blue);" onclick="javascript: this.parentNode.parentNode.remove();">No</a></center>`; }
    ele.prepend(el);
    appModule.alertElements.push(el);
}
appModuleFunc.prototype.closeOpenAlertsFunc = function() {
    for (let i = 0; i < appModule.alertElements.length; i++) {
        appModule.alertElements[i].remove();
    }
}
appModuleFunc.prototype.isLoggedFunc = function() {
    if (localStorage.getItem("userData") == null) {
        window.location.hash = "/welcome";
        return;
    }
    appModule.userData = JSON.parse(localStorage.getItem("userData"));
}
appModuleFunc.prototype.initFunc = function(e) {
    e.preventDefault();
    appModule.params = window.location.hash.split("/");
    if (appModule.params[0] === "") { appModule.params.push(""); }
    coreModule.closeOpenModalsFunc();
    appModule.closeOpenAlertsFunc();
    appModule.pageLoader.className = 'modal-backdrop';
    for (let i = 0; i < 3; i++) {
        document.getElementById(`${appModule.appPages[i].temp}PageID`).className = "container d-none";
        if (appModule.appPages[i].url === appModule.params[1]) {
            document.getElementById(`${appModule.appPages[i].temp}PageID`).className = "container";
            appModule.appPages[i].init();
        }
    }
}
appModuleFunc.prototype.initWelcomeFunc = function() {
    localStorage.clear();
    document.documentElement.style.setProperty('--blue', appModule.colorSchemes[0]);
    appModule.pageLoader.className = 'modal-backdrop d-none';
}
appModuleFunc.prototype.initDashboardFunc = function() {
    appModule.isLoggedFunc();
    document.documentElement.style.setProperty('--blue', appModule.colorSchemes[appModule.userData.conf.cs]);
    boardModule.getBoardsFunc();
}
appModuleFunc.prototype.initBoardFunc = function() {
    appModule.isLoggedFunc();
    boardModule.getBoardFunc();
}
appModuleFunc.prototype.colorElemFunc = function(col, form, val) {
    let el = document.createElement('div');
    el.data = val;
    el.className = "col-2";
    el.style = `background-color: ${col}; cursor: pointer; border: 2px solid #fff; height: 45px; text-align: center; padding-top: 9px; color: #fff;`;
    el.innerHTML = ``;
    el.addEventListener('click', function(e) {
        this.innerHTML = `<i class="fas fa-check"></i>`;
        if (this.parentNode.children[form.cs.value].innerHTML !== `` && this.data != form.cs.value) {
            this.parentNode.children[form.cs.value].innerHTML = ``;
        }
        form.cs.value = this.data;
    });
    return el;
}
appModuleFunc.prototype.smallLoadingFunc = function(ele) {
    let el = document.createElement('div');
    el.id = 'loadingIconID';
    el.className = 'loaderln';
    ele.parentNode.appendChild(el);
}
appModuleFunc.prototype.colorPaletteFunc = function(el, si) {
    el.cs.value = si;
    const len = el.lastElementChild.previousElementSibling.children[3].children.length;
    [el.lastElementChild.previousElementSibling.children[3].className, el.lastElementChild.previousElementSibling.children[2].className] = ['row d-none', 'fas fa-angle-down fa-2x'];
    for (let i = 0; i < this.colorSchemes.length; i++) {
        if (len == 0) { el.lastElementChild.previousElementSibling.children[3].appendChild(this.colorElemFunc(this.colorSchemes[i], el, i)); continue; }
        el.lastElementChild.previousElementSibling.children[3].children[i].innerHTML = ``;
    }
    el.lastElementChild.previousElementSibling.children[3].children[si].innerHTML = '<i class="fas fa-check"></i>';
}
let appModule = new appModuleFunc();
//USER MODULE FUNCTION
function userModuleFunc() {
    this.loginForm = document.querySelector(`form[name="loginForm"]`);
    this.joinForm = document.querySelector(`form[name="joinForm"]`);
    this.loginForm.addEventListener('submit', this.loginFunc);
    this.joinForm.addEventListener('submit', this.joinFunc);
}
userModuleFunc.prototype.loginFunc = function(e) {
    e.preventDefault();
    appModule.smallLoadingFunc(loginForm);
    fetch("/user/auth", { method: 'post', headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" }, body: `{ "email" : "${this.email.value}", "digest" : "${this.digest.value}"}` }).then(data => data.json())
        .then(data => {
            localStorage.setItem("userData", JSON.stringify(data));
            window.location.hash = "/";
        })
        .catch(function(error) { appModule.createAlertBoxFunc(userModule.loginForm, "Cannot Find Record", 1, "exclamation"); })
        .then(function() { document.getElementById('loadingIconID').remove(); });
}
userModuleFunc.prototype.joinFunc = function(e) {
    e.preventDefault();
    appModule.smallLoadingFunc(joinForm);
    fetch("/user/join", { method: 'post', headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" }, body: `{ "email" : "${this.email.value}", "digest" : "${this.digest.value}", "name" : "${this.name.value}"}` }).then(data => data.json())
        .then(data => {
            localStorage.setItem("userData", JSON.stringify(data));
            window.location.hash = "/";
        })
        .catch(function(error) { appModule.createAlertBoxFunc(userModule.joinForm, "Cannot Create Record", 1, "exclamation"); })
        .then(function() { document.getElementById('loadingIconID').remove(); });
}
let userModule = new userModuleFunc();
//BOARD MODULE
function boardModuleFunc() {
    this.addBoardForm = document.querySelector(`form[name="addBoardForm"]`);
    this.addListForm = document.querySelector(`form[name="addListForm"]`);
    this.editBoardForm = document.querySelector(`form[name="editBoardForm"]`);
    this.editListForm = document.querySelector(`form[name="editListForm"]`);
    this.addTaskForm = document.querySelector(`form[name="addTaskForm"]`);
    this.editTaskForm = document.querySelector(`form[name="editTaskForm"]`);
    this.boardList = document.getElementById('boardListID');
    this.boardDetail = document.getElementById(`boardDetailID`);
    this.taskList = document.getElementById(`taskListID`);
    this.boardsData = [];
    this.boardData = {};
    this.selectedList = 0;
    this.selectedListElem = {};
    this.selectedTask = 0;
    this.selectedTaskElem = {};
    this.addBoardForm.addEventListener('submit', this.addBoardFunc);
    this.editBoardForm.addEventListener('submit', this.editBoardFunc);
    this.addListForm.addEventListener('submit', this.addListFunc);
    this.editListForm.addEventListener('submit', this.editListFunc);
    this.addTaskForm.addEventListener('submit', this.addTaskFunc);
    this.editTaskForm.addEventListener('submit', this.editTaskFunc);
}
boardModuleFunc.prototype.prepEditBoardModalFunc = function(e) {
    coreModule.showModalFunc('editBoardModalID');
    [boardModule.editBoardForm.name.value, boardModule.editBoardForm.desc.value] = [boardModule.boardData.name, boardModule.boardData.desc];
    appModule.colorPaletteFunc(boardModule.editBoardForm, boardModule.boardData.conf.cs);
}
boardModuleFunc.prototype.addBoardFunc = function(e) {
    e.preventDefault();
    appModule.smallLoadingFunc(addBoardForm);
    fetch("/user/board/create?auth0=" + appModule.userData.auth[0] + "&auth2=" + appModule.userData.auth[2], { method: 'post', headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" }, body: `{ "name" : "${this.name.value}", "desc": "${this.desc.value}","conf" : "{\\"cs\\":${this.cs.value}}"}` }).then(data => data.json())
        .then(data => {
            this.reset();
            boardModule.boardsData.push(data);
            boardModule.boardList.appendChild(boardModule.boardElementFunc(data));
            coreModule.closeModalFunc("addBoardModalID");
        })
        .catch(function(error) { appModule.createAlertBoxFunc(boardModule.addBoardForm, "Cannot Create Board", 1, "exclamation"); })
        .then(function() { document.getElementById('loadingIconID').remove(); });
}
boardModuleFunc.prototype.boardElementFunc = function(data) {
    let el = document.createElement('div');
    el.className = "card";
    let date = new Date(data.created_at);
    el.innerHTML = `<div class="card-body"><h4 class="card-title" style="cursor: pointer;" onclick='javascript: window.location.hash = "/board/${data.id}";''>${data.name}</h4><h6 class="card-subtitle mb-2 text-muted">${data.desc}</h6><i class="far fa-calendar-alt color"></i> ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}<hr style="margin-left: -20px; margin-right: -20px;"><center>
    <i class="fas fa-angle-down fa-2x" style="cursor: pointer; color: #888;" onclick="javascript: this.nextElementSibling.classList.toggle('d-none'); if(this.classList.contains('fa-angle-down')) {this.className='fas fa-angle-up fa-2x';}else {this.className='fas fa-angle-down fa-2x';}"></i>
    <div class="d-none"><br><h3><font class="text-muted">${data.stats[4]}</font><font style="color: var(--blue);">/</font>${data.stats[3]}</h3>
    <div class="progress"><div class="progress-bar" role="progressbar" style="width: ${(data.stats[4]/data.stats[3])*100}%" aria-valuenow="${(data.stats[4]/data.stats[3])*100}" aria-valuemin="0" aria-valuemax="100"></div></div><b class="text-muted"> Progress</b></div></center></div>`;
    return el;
}
boardModuleFunc.prototype.listElementFunc = function(data) {
    let el = document.createElement('div');
    el.className = "card";
    el.data = data.i;
    el.style = "max-width: 20rem; margin: auto; margin-bottom: 10px;";
    el.innerHTML = `<div class="card-body"><h4 class="card-title"><a style="cursor: pointer;">${data.n}</a> <span id="${data.i}ListTotalID" class="badge badge-secondary">${data.ts.length}</span></h4><h6 class="card-subtitle mb-2 text-muted">${data.d}</h6><a class="card-link" style="cursor: pointer; color: var(--blue);" onclick="javascript: coreModule.showModalFunc('addTaskModalID'); boardModule.selectedListElem = this.parentNode.parentNode; boardModule.addTaskForm.reset();"><i class="fas fa-plus"></i> Add Task</a><br><i class="fas fa-angle-down fa-2x" style="cursor: pointer; margin-left: 45%; position: relative; color: #888;" onclick="javascript: this.nextElementSibling.classList.toggle('d-none'); if(this.classList.contains('fa-angle-down')) {this.className='fas fa-angle-up fa-2x';}else {this.className='fas fa-angle-down fa-2x';}"></i><div class="d-none" style="padding-top: 9px; margin-top: 8px;" id="${data.i}TaskListID"></div></div>`;
    for (let i = 0; i < data.ts.length; i++) {
        el.childNodes[0].childNodes[5].appendChild(boardModule.taskElemFunc(data.ts[i]));
    }
    el.childNodes[0].childNodes[0].addEventListener('click', function(e) {
        boardModule.editListForm.name.value = data.n;
        boardModule.editListForm.desc.value = data.d;
        boardModule.selectedListElem = el;
        coreModule.showModalFunc('editListModalID');
    });
    return el;
}
boardModuleFunc.prototype.taskElemFunc = function(data) {
    let el = document.createElement('div');
    el.className = "card";
    el.data = data.i;
    el.datali = data.li;
    el.style = "cursor: pointer; margin-bottom: 12px;";
    el.innerHTML = `<div class="card-body" style="padding: -4px; "><h6 class = "card-title">${data.c.substring(0,120)}..</h6></div>`;
    el.addEventListener('click', function(e) {
        [boardModule.selectedTaskElem, boardModule.editTaskForm.content.value] = [el, data.c];
        boardModule.findList(el.datali);
        if (data.s == 1) {
            boardModule.editTaskForm.status.checked = true;
            boardModule.editTaskForm.status.value = 1;
        } else {
            boardModule.editTaskForm.status.checked = false;
            boardModule.editTaskForm.status.value = 0;
        }
        coreModule.showModalFunc('viewTaskModalID');
        document.getElementById("viewTaskTabID").children[0].innerHTML = `<b class="text-muted">Content</b><br><span>${data.c}</span><hr><b class="text-muted">Added By</b><br><div class="media"><img class="mr-3 img-thumbnail" src="https://www.gravatar.com/avatar/${md5(data.us)}/60x60" alt=""><div class="media-body">${data.us}<br><i class="far fa-calendar-alt color"></i> ${data.dd}/${data.dm}/${data.dy}</div></div>`;
        boardModule.editTaskForm.children[3].children[1].innerHTML = '';
        let opt = document.createElement('option');
        opt.value = boardModule.selectedList;
        opt.style = "outline: 0;";
        opt.innerHTML = boardModule.boardData.tasks[boardModule.selectedList].n;
        boardModule.editTaskForm.children[3].children[1].appendChild(opt);
        for (let i = 0; i < boardModule.boardData.tasks.length; i++) {
            if (boardModule.boardData.tasks[i].i != el.datali) {
                let e = document.createElement('option');
                e.value = i;
                e.innerHTML = boardModule.boardData.tasks[i].n;
                boardModule.editTaskForm.children[3].children[1].appendChild(e);
            }
        }
        boardModule.editTaskForm.children[3].children[1].addEventListener('change', boardModule.moveTaskFunc);
    });
    return el;
}
boardModuleFunc.prototype.getBoardsFunc = function() {
    boardModule.boardList.innerHTML = ``;
    fetch("/user/boards?auth0=" + appModule.userData.auth[0] + "&auth2=" + appModule.userData.auth[2], { method: 'get', headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" } }).then(data => data.json())
        .then(data => {
            boardModule.boardsData = data;
            for (let i = 0; i < boardModule.boardsData.length; i++) {
                boardModule.boardList.appendChild(boardModule.boardElementFunc(boardModule.boardsData[i]));
            }
            appModule.pageLoader.className = 'modal-backdrop d-none';
        })
        .catch(function(error) {});
}
boardModuleFunc.prototype.boardDetailFunc = function(data) {
    let date = new Date(data.created_at);
    boardModule.boardDetail.innerHTML = `<h4><i class="far fa-clipboard color"></i> ${data.name}</h4><font class="text-muted">${data.desc}</font><br><i class="far fa-calendar-alt color"></i> <span> ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}</span><hr><a href="/#/" class="card-link" style="color: var(--blue);"><i class="fas fa-arrow-left"></i> Back</a><a style="cursor: pointer; color: #fff;" class="btn btn-danger card-link" onclick="coreModule.showModalFunc('addListModalID')"><i class="fas fa-plus"></i> Add List</a><a style="cursor: pointer; color: var(--blue);" onclick="boardModule.prepEditBoardModalFunc();" class="card-link"><i class="fas fa-edit"></i> Edit</a>
 `;
}
boardModuleFunc.prototype.getBoardFunc = function() {
    boardModule.taskList.innerHTML = ``;
    fetch("/user/board?auth0=" + appModule.userData.auth[0] + "&auth2=" + appModule.userData.auth[2] + "&bdi=" + appModule.params[2], { method: 'get', headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" } }).then(data => data.json())
        .then(data => {
            let date = new Date(data.created_at);
            document.documentElement.style.setProperty('--blue', appModule.colorSchemes[data.conf.cs]);
            boardModule.boardData = data;
            boardModule.boardDetailFunc(data);
            for (let i = 0; i < data.tasks.length; i++) {
                boardModule.taskList.appendChild(boardModule.listElementFunc(data.tasks[i]));
            }
            appModule.pageLoader.className = 'modal-backdrop d-none';
        })
        .catch(function(error) {
            console.log(error);
            window.location.hash = "/";
            return;
        });
}
boardModuleFunc.prototype.editBoardFunc = function(e) {
    e.preventDefault();
    appModule.smallLoadingFunc(editBoardForm);
    fetch("/user/board/update?auth0=" + appModule.userData.auth[0] + "&auth2=" + appModule.userData.auth[2], { method: 'post', headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" }, body: `{"name" : "${this.name.value}" ,"desc" : "${this.desc.value}", "id" : "${boardModule.boardData.id}","conf" : "{\\"cs\\":${this.cs.value}}"}` }).then(data => data.json())
        .then(data => {
            [boardModule.boardData.conf.cs, boardModule.boardData.name, boardModule.boardData.desc] = [this.cs.value, this.name.value, this.desc.value];
            document.documentElement.style.setProperty('--blue', appModule.colorSchemes[boardModule.boardData.conf.cs]);
            boardModule.boardDetailFunc(boardModule.boardData);
            appModule.createAlertBoxFunc(boardModule.editBoardForm, "Succesfully Updated Board", 1, "check");
        })
        .catch(function(error) { appModule.createAlertBoxFunc(boardModule.editBoardForm, "Cannot Edit Board", 1, "exclamation"); })
        .then(function() { document.getElementById('loadingIconID').remove(); });
}
boardModuleFunc.prototype.addListFunc = function(e) {
    e.preventDefault();
    boardModule.boardData.stats[0]++;
    boardModule.boardData.stats[2]++;
    let list = { "i": boardModule.boardData.stats[0], "n": this.name.value, "d": this.desc.value, "ts": [], s: 0 };
    boardModule.boardData.tasks.push(list);
    appModule.smallLoadingFunc(addListForm);
    fetch("/user/board/update/task?auth0=" + appModule.userData.auth[0] + "&auth2=" + appModule.userData.auth[2], { method: 'post', headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" }, body: `{"stats" : "${JSON.stringify(boardModule.boardData.stats)}" ,"tasks" : ${JSON.stringify(JSON.stringify(boardModule.boardData.tasks))} , "id" : "${boardModule.boardData.id}"}` }).then(data => data.json())
        .then(data => {
            this.reset();
            boardModule.taskList.appendChild(boardModule.listElementFunc(list));
            coreModule.closeModalFunc('addListModalID');
        })
        .catch(function(error) {
            boardModule.boardData.stats[2]--;
            boardModule.boardData.tasks.pop();
            appModule.createAlertBoxFunc(boardModule.addListForm, "Cannot Create List", 1, "exclamation");
        })
        .then(function() { document.getElementById('loadingIconID').remove(); });
}
boardModuleFunc.prototype.findList = function(id) {
    for (let i = 0; i < boardModule.boardData.tasks.length; i++) {
        if (boardModule.boardData.tasks[i].i == id) {
            boardModule.selectedList = i;
            return;
        }
    }
}
boardModuleFunc.prototype.findTask = function(id) {
    for (let i = 0; i < boardModule.boardData.tasks[boardModule.selectedList].ts.length; i++) {
        if (boardModule.boardData.tasks[boardModule.selectedList].ts[i].i == id) {
            boardModule.selectedTask = i;
            return;
        }
    }
}
boardModuleFunc.prototype.editListFunc = function(e) {
    e.preventDefault();
    boardModule.findList(boardModule.selectedListElem.data);
    let bk = { n: boardModule.boardData.tasks[boardModule.selectedList].n, d: boardModule.boardData.tasks[boardModule.selectedList].d, s: boardModule.boardData.tasks[boardModule.selectedList].s };
    boardModule.boardData.tasks[boardModule.selectedList].n = this.name.value;
    boardModule.boardData.tasks[boardModule.selectedList].d = this.desc.value;
    appModule.smallLoadingFunc(editListForm);
    fetch("/user/board/update/task?auth0=" + appModule.userData.auth[0] + "&auth2=" + appModule.userData.auth[2], { method: 'post', headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" }, body: `{"stats" : "${JSON.stringify(boardModule.boardData.stats)}" ,"tasks" : ${JSON.stringify(JSON.stringify(boardModule.boardData.tasks))} , "id" : "${boardModule.boardData.id}"}` }).then(data => data.json())
        .then(data => {
            boardModule.selectedListElem.childNodes[0].childNodes[0].childNodes[0].innerHTML = this.name.value;
            boardModule.selectedListElem.childNodes[0].childNodes[1].innerHTML = this.desc.value;
            appModule.createAlertBoxFunc(boardModule.editListForm, "Succesfully Updated List", 1, "check");
        })
        .catch(function(error) {
            boardModule.boardData.tasks[boardModule.selectedList].n = bk.n;
            boardModule.boardData.tasks[boardModule.selectedList].d = bk.d;
            appModule.createAlertBoxFunc(boardModule.editListForm, "Cannot Update List", 1, "exclamation");
        })
        .then(function() { document.getElementById('loadingIconID').remove(); });
}
boardModuleFunc.prototype.addTaskFunc = function(e) {
    e.preventDefault();
    let dt = new Date();
    boardModule.findList(boardModule.selectedListElem.data);
    boardModule.boardData.stats[1]++;
    boardModule.boardData.stats[3]++;
    let task = { "i": boardModule.boardData.stats[1], "li": boardModule.selectedListElem.data, "c": this.content.value, "s": boardModule.boardData.tasks[boardModule.selectedList].s, "dd": dt.getDate(), "dm": (dt.getMonth() + 1), "dy": dt.getFullYear(), "us": appModule.userData.email };
    boardModule.boardData.stats[4] += task.s ? 1 : 0;
    boardModule.boardData.tasks[boardModule.selectedList].ts.push(task);
    appModule.smallLoadingFunc(addTaskForm);
    fetch("/user/board/update/task?auth0=" + appModule.userData.auth[0] + "&auth2=" + appModule.userData.auth[2], { method: 'post', headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" }, body: `{"stats" : "${JSON.stringify(boardModule.boardData.stats)}" ,"tasks" : ${JSON.stringify(JSON.stringify(boardModule.boardData.tasks))} , "id" : "${boardModule.boardData.id}"}` }).then(data => data.json())
        .then(data => {
            boardModule.selectedListElem.childNodes[0].children[0].children[1].innerHTML = boardModule.boardData.tasks[boardModule.selectedList].ts.length;
            boardModule.selectedListElem.childNodes[0].childNodes[5].appendChild(boardModule.taskElemFunc(task));
            this.reset();
            coreModule.closeModalFunc('addTaskModalID');
        })
        .catch(function(error) {
            boardModule.boardData.stats[3]--;
            boardModule.boardData.tasks[boardModule.selectedList].ts.pop();
            appModule.createAlertBoxFunc(boardModule.addTaskForm, "Cannot Add Task", 1, "exclamation");
        })
        .then(function() { document.getElementById('loadingIconID').remove(); });
}
boardModuleFunc.prototype.editTaskFunc = function(e) {
    e.preventDefault();
    boardModule.findList(boardModule.selectedTaskElem.datali);
    boardModule.findTask(boardModule.selectedTaskElem.data);
    let bk = { c: boardModule.boardData.tasks[boardModule.selectedList].ts[boardModule.selectedTask].c, s: boardModule.boardData.tasks[boardModule.selectedList].ts[boardModule.selectedTask].s };
    boardModule.boardData.tasks[boardModule.selectedList].ts[boardModule.selectedTask].c = this.content.value;
    boardModule.boardData.tasks[boardModule.selectedList].ts[boardModule.selectedTask].s = this.status.checked ? 1 : 0;
    if (boardModule.boardData.tasks[boardModule.selectedList].ts[boardModule.selectedTask].s != bk.s) {
        boardModule.boardData.stats[4] += this.status.checked ? 1 : -1;
    }
    appModule.smallLoadingFunc(editTaskForm);
    fetch("/user/board/update/task?auth0=" + appModule.userData.auth[0] + "&auth2=" + appModule.userData.auth[2], { method: 'post', headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" }, body: `{"stats" : "${JSON.stringify(boardModule.boardData.stats)}" ,"tasks" : ${JSON.stringify(JSON.stringify(boardModule.boardData.tasks))} , "id" : "${boardModule.boardData.id}"}` }).then(data => data.json())
        .then(data => {
            boardModule.selectedTaskElem.childNodes[0].childNodes[0].innerHTML = this.content.value;
            document.getElementById("viewTaskTabID").children[0].children[2].innerHTML = this.content.value;
            appModule.createAlertBoxFunc(boardModule.editTaskForm, "Succesfully Updated Task", 1, "check");
        })
        .catch(function(error) {
            boardModule.boardData.tasks[boardModule.selectedList].ts[boardModule.selectedTask].c = bk.c;
            appModule.createAlertBoxFunc(boardModule.editTaskForm, "Cannot Update Task", 1, "exclamation");
        })
        .then(function() { document.getElementById('loadingIconID').remove(); });
}
boardModuleFunc.prototype.moveTaskFunc = function(e) {
    e.preventDefault();
    boardModule.findList(boardModule.selectedTaskElem.datali);
    boardModule.findTask(boardModule.selectedTaskElem.data);
    let task = boardModule.boardData.tasks[boardModule.selectedList].ts[boardModule.selectedTask];
    if (task == null) {
        return;
    }
    task.li = boardModule.boardData.tasks[this.value].i;
    boardModule.boardData.tasks[boardModule.selectedList].ts.splice(boardModule.selectedTask, 1);
    task.s = boardModule.boardData.tasks[this.value].s;
    if (boardModule.boardData.tasks[boardModule.selectedList].s != boardModule.boardData.tasks[this.value].s) {
        if (boardModule.boardData.tasks[this.value].s == 1) {
            boardModule.editTaskForm.status.checked = true;
            boardModule.editTaskForm.status.value = 1;
            boardModule.boardData.stats[4]++;
        } else {
            boardModule.boardData.stats[4]--;
            boardModule.editTaskForm.status.checked = false;
            boardModule.editTaskForm.status.value = 0;
        }
    }
    boardModule.boardData.tasks[this.value].ts.push(task);
    appModule.smallLoadingFunc(editTaskForm);
    fetch("/user/board/update/task?auth0=" + appModule.userData.auth[0] + "&auth2=" + appModule.userData.auth[2], { method: 'post', headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" }, body: `{"stats" : "${JSON.stringify(boardModule.boardData.stats)}" ,"tasks" : ${JSON.stringify(JSON.stringify(boardModule.boardData.tasks))} , "id" : "${boardModule.boardData.id}"}` }).then(data => data.json())
        .then(data => {
            document.getElementById(`${boardModule.selectedTaskElem.datali}ListTotalID`).innerHTML = parseInt(document.getElementById(`${boardModule.selectedTaskElem.datali}ListTotalID`).innerHTML) - 1;
            boardModule.selectedTaskElem.remove();
            boardModule.selectedTaskElem = boardModule.taskElemFunc(task);
            document.getElementById(`${boardModule.selectedTaskElem.datali}ListTotalID`).innerHTML = parseInt(document.getElementById(`${boardModule.selectedTaskElem.datali}ListTotalID`).innerHTML) + 1;
            document.getElementById(`${boardModule.boardData.tasks[this.value].i}TaskListID`).appendChild(boardModule.selectedTaskElem);
        })
        .catch(function(error) {})
        .then(function() { document.getElementById('loadingIconID').remove(); });
}
boardModuleFunc.prototype.deleteBoardFunc = function() {
    fetch("/user/board/delete?auth0=" + appModule.userData.auth[0] + "&auth2=" + appModule.userData.auth[2] + "&bdi=" + boardModule.boardData.id, { method: 'delete', headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" }, body: `{}` }).then(data => data.json())
        .then(data => {
            coreModule.closeModalFunc('editBoardModalID');
            window.location.hash = "/";
        })
        .catch(function(error) {
            appModule.createAlertBoxFunc(boardModule.editBoardForm, "Cannot Delete Board", 1, "exclamation");
        });
}
boardModuleFunc.prototype.deleteListFunc = function() {
    let bk = [...boardModule.boardData.tasks];
    boardModule.findList(boardModule.selectedListElem.data);
    boardModule.boardData.stats[2]--;
    for (let i = 0; i < boardModule.boardData.tasks[boardModule.selectedList].ts.length; i++) {
        boardModule.boardData.stats[3]--;
        boardModule.boardData.stats[4] += boardModule.boardData.tasks[boardModule.selectedList].ts[i].s ? -1 : 0;
    }
    boardModule.boardData.tasks.splice(boardModule.selectedList, 1);
    fetch("/user/board/update/task?auth0=" + appModule.userData.auth[0] + "&auth2=" + appModule.userData.auth[2], { method: 'post', headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" }, body: `{"stats" : "${JSON.stringify(boardModule.boardData.stats)}" ,"tasks" : ${JSON.stringify(JSON.stringify(boardModule.boardData.tasks))} , "id" : "${boardModule.boardData.id}"}` }).then(data => data.json())
        .then(data => {
            boardModule.selectedListElem.remove();
            coreModule.closeModalFunc('editListModalID');
        })
        .catch(function(error) {
            boardModule.boardData.stats[2]++;
            boardModule.boardData.tasks = bk;
            for (let i = 0; i < bk[boardModule.selectedList].ts.length; i++) {
                boardModule.boardData.stats[3]++;
                boardModule.boardData.stats[4] += bk[boardModule.selectedList].ts[i].s ? 1 : 0;
            }
        });
}
boardModuleFunc.prototype.deleteTaskFunc = function() {
    boardModule.boardData.stats[3]--;
    boardModule.findList();
    boardModule.findTask();
    if (boardModule.boardData.tasks[boardModule.selectedList].ts[boardModule.selectedTask].s == 1) {
        boardModule.boardData.stats[4]--;
    }
    let bk = [...boardModule.boardData.tasks[boardModule.selectedList].ts];
    boardModule.boardData.tasks[boardModule.selectedList].ts.splice(boardModule.selectedTask, 1);
    fetch("/user/board/update/task?auth0=" + appModule.userData.auth[0] + "&auth2=" + appModule.userData.auth[2], { method: 'post', headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" }, body: `{"stats" : "${JSON.stringify(boardModule.boardData.stats)}" ,"tasks" : ${JSON.stringify(JSON.stringify(boardModule.boardData.tasks))} , "id" : "${boardModule.boardData.id}"}` }).then(data => data.json())
        .then(data => {
            document.getElementById(`${boardModule.boardData.tasks[boardModule.selectedList].i}ListTotalID`).innerHTML = boardModule.boardData.tasks[boardModule.selectedList].ts.length;
            boardModule.selectedTaskElem.remove();
            coreModule.closeModalFunc('viewTaskModalID');
        })
        .catch(function(error) {
            boardModule.boardData.stats[3]++;
            boardModule.boardData.tasks[boardModule.selectedList].ts = bk;
        });
}
let boardModule = new boardModuleFunc();
window.addEventListener("load", appModule.initFunc);
window.addEventListener("popstate", appModule.initFunc);

(function($) {
    'use strict'

    /*
     * Add integers, wrapping at 2^32. This uses 16-bit operations internally
     * to work around bugs in some JS interpreters.
     */
    function safeAdd(x, y) {
        var lsw = (x & 0xffff) + (y & 0xffff)
        var msw = (x >> 16) + (y >> 16) + (lsw >> 16)
        return (msw << 16) | (lsw & 0xffff)
    }

    /*
     * Bitwise rotate a 32-bit number to the left.
     */
    function bitRotateLeft(num, cnt) {
        return (num << cnt) | (num >>> (32 - cnt))
    }

    /*
     * These functions implement the four basic operations the algorithm uses.
     */
    function md5cmn(q, a, b, x, s, t) {
        return safeAdd(bitRotateLeft(safeAdd(safeAdd(a, q), safeAdd(x, t)), s), b)
    }

    function md5ff(a, b, c, d, x, s, t) {
        return md5cmn((b & c) | (~b & d), a, b, x, s, t)
    }

    function md5gg(a, b, c, d, x, s, t) {
        return md5cmn((b & d) | (c & ~d), a, b, x, s, t)
    }

    function md5hh(a, b, c, d, x, s, t) {
        return md5cmn(b ^ c ^ d, a, b, x, s, t)
    }

    function md5ii(a, b, c, d, x, s, t) {
        return md5cmn(c ^ (b | ~d), a, b, x, s, t)
    }

    /*
     * Calculate the MD5 of an array of little-endian words, and a bit length.
     */
    function binlMD5(x, len) {
        /* append padding */
        x[len >> 5] |= 0x80 << (len % 32)
        x[((len + 64) >>> 9 << 4) + 14] = len

        var i
        var olda
        var oldb
        var oldc
        var oldd
        var a = 1732584193
        var b = -271733879
        var c = -1732584194
        var d = 271733878

        for (i = 0; i < x.length; i += 16) {
            olda = a
            oldb = b
            oldc = c
            oldd = d

            a = md5ff(a, b, c, d, x[i], 7, -680876936)
            d = md5ff(d, a, b, c, x[i + 1], 12, -389564586)
            c = md5ff(c, d, a, b, x[i + 2], 17, 606105819)
            b = md5ff(b, c, d, a, x[i + 3], 22, -1044525330)
            a = md5ff(a, b, c, d, x[i + 4], 7, -176418897)
            d = md5ff(d, a, b, c, x[i + 5], 12, 1200080426)
            c = md5ff(c, d, a, b, x[i + 6], 17, -1473231341)
            b = md5ff(b, c, d, a, x[i + 7], 22, -45705983)
            a = md5ff(a, b, c, d, x[i + 8], 7, 1770035416)
            d = md5ff(d, a, b, c, x[i + 9], 12, -1958414417)
            c = md5ff(c, d, a, b, x[i + 10], 17, -42063)
            b = md5ff(b, c, d, a, x[i + 11], 22, -1990404162)
            a = md5ff(a, b, c, d, x[i + 12], 7, 1804603682)
            d = md5ff(d, a, b, c, x[i + 13], 12, -40341101)
            c = md5ff(c, d, a, b, x[i + 14], 17, -1502002290)
            b = md5ff(b, c, d, a, x[i + 15], 22, 1236535329)

            a = md5gg(a, b, c, d, x[i + 1], 5, -165796510)
            d = md5gg(d, a, b, c, x[i + 6], 9, -1069501632)
            c = md5gg(c, d, a, b, x[i + 11], 14, 643717713)
            b = md5gg(b, c, d, a, x[i], 20, -373897302)
            a = md5gg(a, b, c, d, x[i + 5], 5, -701558691)
            d = md5gg(d, a, b, c, x[i + 10], 9, 38016083)
            c = md5gg(c, d, a, b, x[i + 15], 14, -660478335)
            b = md5gg(b, c, d, a, x[i + 4], 20, -405537848)
            a = md5gg(a, b, c, d, x[i + 9], 5, 568446438)
            d = md5gg(d, a, b, c, x[i + 14], 9, -1019803690)
            c = md5gg(c, d, a, b, x[i + 3], 14, -187363961)
            b = md5gg(b, c, d, a, x[i + 8], 20, 1163531501)
            a = md5gg(a, b, c, d, x[i + 13], 5, -1444681467)
            d = md5gg(d, a, b, c, x[i + 2], 9, -51403784)
            c = md5gg(c, d, a, b, x[i + 7], 14, 1735328473)
            b = md5gg(b, c, d, a, x[i + 12], 20, -1926607734)

            a = md5hh(a, b, c, d, x[i + 5], 4, -378558)
            d = md5hh(d, a, b, c, x[i + 8], 11, -2022574463)
            c = md5hh(c, d, a, b, x[i + 11], 16, 1839030562)
            b = md5hh(b, c, d, a, x[i + 14], 23, -35309556)
            a = md5hh(a, b, c, d, x[i + 1], 4, -1530992060)
            d = md5hh(d, a, b, c, x[i + 4], 11, 1272893353)
            c = md5hh(c, d, a, b, x[i + 7], 16, -155497632)
            b = md5hh(b, c, d, a, x[i + 10], 23, -1094730640)
            a = md5hh(a, b, c, d, x[i + 13], 4, 681279174)
            d = md5hh(d, a, b, c, x[i], 11, -358537222)
            c = md5hh(c, d, a, b, x[i + 3], 16, -722521979)
            b = md5hh(b, c, d, a, x[i + 6], 23, 76029189)
            a = md5hh(a, b, c, d, x[i + 9], 4, -640364487)
            d = md5hh(d, a, b, c, x[i + 12], 11, -421815835)
            c = md5hh(c, d, a, b, x[i + 15], 16, 530742520)
            b = md5hh(b, c, d, a, x[i + 2], 23, -995338651)

            a = md5ii(a, b, c, d, x[i], 6, -198630844)
            d = md5ii(d, a, b, c, x[i + 7], 10, 1126891415)
            c = md5ii(c, d, a, b, x[i + 14], 15, -1416354905)
            b = md5ii(b, c, d, a, x[i + 5], 21, -57434055)
            a = md5ii(a, b, c, d, x[i + 12], 6, 1700485571)
            d = md5ii(d, a, b, c, x[i + 3], 10, -1894986606)
            c = md5ii(c, d, a, b, x[i + 10], 15, -1051523)
            b = md5ii(b, c, d, a, x[i + 1], 21, -2054922799)
            a = md5ii(a, b, c, d, x[i + 8], 6, 1873313359)
            d = md5ii(d, a, b, c, x[i + 15], 10, -30611744)
            c = md5ii(c, d, a, b, x[i + 6], 15, -1560198380)
            b = md5ii(b, c, d, a, x[i + 13], 21, 1309151649)
            a = md5ii(a, b, c, d, x[i + 4], 6, -145523070)
            d = md5ii(d, a, b, c, x[i + 11], 10, -1120210379)
            c = md5ii(c, d, a, b, x[i + 2], 15, 718787259)
            b = md5ii(b, c, d, a, x[i + 9], 21, -343485551)

            a = safeAdd(a, olda)
            b = safeAdd(b, oldb)
            c = safeAdd(c, oldc)
            d = safeAdd(d, oldd)
        }
        return [a, b, c, d]
    }

    /*
     * Convert an array of little-endian words to a string
     */
    function binl2rstr(input) {
        var i
        var output = ''
        var length32 = input.length * 32
        for (i = 0; i < length32; i += 8) {
            output += String.fromCharCode((input[i >> 5] >>> (i % 32)) & 0xff)
        }
        return output
    }

    /*
     * Convert a raw string to an array of little-endian words
     * Characters >255 have their high-byte silently ignored.
     */
    function rstr2binl(input) {
        var i
        var output = []
        output[(input.length >> 2) - 1] = undefined
        for (i = 0; i < output.length; i += 1) {
            output[i] = 0
        }
        var length8 = input.length * 8
        for (i = 0; i < length8; i += 8) {
            output[i >> 5] |= (input.charCodeAt(i / 8) & 0xff) << (i % 32)
        }
        return output
    }

    /*
     * Calculate the MD5 of a raw string
     */
    function rstrMD5(s) {
        return binl2rstr(binlMD5(rstr2binl(s), s.length * 8))
    }

    /*
     * Calculate the HMAC-MD5, of a key and some data (raw strings)
     */
    function rstrHMACMD5(key, data) {
        var i
        var bkey = rstr2binl(key)
        var ipad = []
        var opad = []
        var hash
        ipad[15] = opad[15] = undefined
        if (bkey.length > 16) {
            bkey = binlMD5(bkey, key.length * 8)
        }
        for (i = 0; i < 16; i += 1) {
            ipad[i] = bkey[i] ^ 0x36363636
            opad[i] = bkey[i] ^ 0x5c5c5c5c
        }
        hash = binlMD5(ipad.concat(rstr2binl(data)), 512 + data.length * 8)
        return binl2rstr(binlMD5(opad.concat(hash), 512 + 128))
    }

    /*
     * Convert a raw string to a hex string
     */
    function rstr2hex(input) {
        var hexTab = '0123456789abcdef'
        var output = ''
        var x
        var i
        for (i = 0; i < input.length; i += 1) {
            x = input.charCodeAt(i)
            output += hexTab.charAt((x >>> 4) & 0x0f) + hexTab.charAt(x & 0x0f)
        }
        return output
    }

    /*
     * Encode a string as utf-8
     */
    function str2rstrUTF8(input) {
        return unescape(encodeURIComponent(input))
    }

    /*
     * Take string arguments and return either raw or hex encoded strings
     */
    function rawMD5(s) {
        return rstrMD5(str2rstrUTF8(s))
    }

    function hexMD5(s) {
        return rstr2hex(rawMD5(s))
    }

    function rawHMACMD5(k, d) {
        return rstrHMACMD5(str2rstrUTF8(k), str2rstrUTF8(d))
    }

    function hexHMACMD5(k, d) {
        return rstr2hex(rawHMACMD5(k, d))
    }

    function md5(string, key, raw) {
        if (!key) {
            if (!raw) {
                return hexMD5(string)
            }
            return rawMD5(string)
        }
        if (!raw) {
            return hexHMACMD5(key, string)
        }
        return rawHMACMD5(key, string)
    }

    if (typeof define === 'function' && define.amd) {
        define(function() {
            return md5
        })
    } else if (typeof module === 'object' && module.exports) {
        module.exports = md5
    } else {
        $.md5 = md5
    }
})(this)