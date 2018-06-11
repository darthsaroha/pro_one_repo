function viewComp(temp) {}

viewComp.prototype.init = function(temp) {
    document.querySelector(`pro-one-view`).innerHTML = '<div class="loader" id="bloader" style="position: absolute;top:0;bottom: 0;left: 0;right: 0;margin: auto;"></div>' + document.getElementById(temp + "_ID").innerHTML;
}

function welComp() {}

welComp.prototype.init = function() {
    document.querySelector(`form[name="loginForm"]`).addEventListener('submit', this.logReq);
    document.querySelector(`form[name="joinForm"]`).addEventListener('submit', this.joinReq);
    let d = new Date();
    document.getElementById('cy').innerHTML = d.getFullYear();
    document.getElementById('bloader').classList.add('d-none');
}

welComp.prototype.logReq = function(e) {
    e.preventDefault();
    if (this.email.value == "" || this.digest.value == "" || this.digest.value.length < 6) {
        return;
    }
    fetch("/user/auth", {
            method: 'post',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: `{ "email" : "${this.email.value}", "digest" : "${this.digest.value}"}`
        })
        .then(data => data.json())
        .then(data => {
            localStorage.setItem("pro-one-user-data", JSON.stringify(data));
            window.location.hash = "/";
        })
        .catch(function(error) {
            document.getElementById("loginMsg").innerHTML = `<div class="alert alert-warning" role="alert">No Record Found..</div>`;
        });
}

welComp.prototype.joinReq = function(e) {
    e.preventDefault();
    if (this.email.value == "" || this.digest.value == "" || this.name.value == "" || this.digest.value.length < 6 || this.name.value.length < 6) {
        return;
    }
    fetch("/user/join", {
            method: 'post',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: `{ "email" : "${this.email.value}", "digest" : "${this.digest.value}", "name" : "${this.name.value}"}`
        })
        .then(data => data.json())
        .then(data => {
            localStorage.setItem("pro-one-user-data", JSON.stringify(data));
            window.location.hash = "/";
        })
        .catch(function(error) {
            document.getElementById("joinMsg").innerHTML = `<div class="alert alert-warning" role="alert">Cannot Create New Record..</div>`;
        });
}

function boardElem(data) {
    data.stats = JSON.parse(data.stats);
    let el = document.createElement('div');
    el.className = "card";
    el.innerHTML = `
  <div class="card-body">
  <h4 class="card-title" style="cursor: pointer;">${data.name}</h4>
    <h6 class="card-subtitle mb-2 text-muted">${data.desc}</h6>
    <hr>
    <center>
<i class="fas fa-angle-down fa-2x" style="cursor: pointer; color: #888;" onclick="javascript: this.nextElementSibling.classList.toggle('d-none'); if(this.classList.contains('fa-angle-down')) {this.className='fas fa-angle-up fa-2x';}else {this.className='fas fa-angle-down fa-2x';}"></i>
    <div class="d-none"><h3>${data.stats[3]}</h3><b class="text-muted">Total Tasks</b></div></center>
  </div>
    `;
    el.childNodes[1].childNodes[1].addEventListener('click', function(e) {
        window.location.hash = "/board/" + data.id;
    });
    return el;
}

function boardsComp() {
    this.boarde = {};
    this.boardi = 0;
    this.boards = [];
}

boardsComp.prototype.init = function() {
    let u = JSON.parse(localStorage.getItem("pro-one-user-data"));
    let bdsc = document.getElementById(`boardList_ID`);
    let e = document.createElement('div');
    e.className = 'card';
    e.innerHTML = `
      <div class="card-body" style="text-align: center;">
      <img src="https://www.gravatar.com/avatar/${md5(u.email)}" class="img-fluid" style="margin-bottom: 10px;">
  <h4 class="card-title">${u.name}</h4>
    <h6 class="card-subtitle mb-2 text-muted">${u.email}</h6>
        <a href="/#/welcome" class="card-link"><i class="fas fa-power-off"></i> Log Out</a>
    <hr>
    <center>
    <i class="fas fa-angle-down fa-2x" style="cursor: pointer; color: #888;" onclick="javascript: this.nextElementSibling.classList.toggle('d-none'); if(this.classList.contains('fa-angle-down')) {this.className='fas fa-angle-up fa-2x';}else {this.className='fas fa-angle-down fa-2x';}"></i>
<div class="d-none">
<h3 id="totBoards_ID">0</h3>
<b class="text-muted">Total Boards</b>
</div>
    </center>
  </div>`;
    bdsc.appendChild(e);
    fetch("/user/boards?auth0=" + u.auth[0] + "&auth2=" + u.auth[2], {
            method: 'get',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
        })
        .then(data => data.json())
        .then(data => {
            bdsComp.boards = data;
            for (let i = 0; i < data.length; i++) {
                bdsc.appendChild(boardElem(data[i]));
            }
            document.getElementById('totBoards_ID').innerHTML = bdsComp.boards.length;
            document.getElementById('bloader').classList.add('d-none');
        })
        .catch(function(error) {
            document.getElementById('bloader').classList.add('d-none');
        });
    document.querySelector(`form[name="aboardForm"]`).addEventListener('submit', this.create);
}

boardsComp.prototype.create = function(e) {
    e.preventDefault();
    let u = JSON.parse(localStorage.getItem("pro-one-user-data"));
    fetch("/user/board/create?auth0=" + u.auth[0] + "&auth2=" + u.auth[2], { method: 'post', headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" }, body: `{ "name" : "${this.name.value}", "desc": "${this.desc.value}"}` })
        .then(data => data.json())
        .then(data => {
            document.getElementById(`boardList_ID`).appendChild(boardElem(data));
            this.reset();
            bdsComp.boards.push(data);
            document.getElementById('totBoards_ID').innerHTML = bdsComp.boards.length;
            $('#addBoardModal_ID').modal('hide');
        })
        .catch(function(error) {
            console.log(error);
            document.getElementById("aboardMsg").innerHTML = `<div class="alert alert-warning" role="alert">Cannot Add New Board..</div>`;
        });
}

function listElem(data, li) {
    let el = document.createElement('div');
    el.className = "card";
    el.innerHTML = `
  <div class="card-body">
  <h4 class="card-title"><a style="cursor: pointer;" data-toggle="modal" data-target="#viewListModal_ID">${data.n}</a></h4>
    <h6 class="card-subtitle mb-2 text-muted">${data.d}</h6>
    <a class="card-link"  onclick="javascript: bdComp.liste = this.parentNode; bdComp.listi = '${li}';" data-toggle="modal" style="cursor: pointer; color: #007bff;" data-target="#addTaskModal_ID"><i class="fas fa-plus"></i> Add Task</a>
<div style="padding-top: 9px;" id="listTask${data.i}_ID"></div>
</div>
    `;
    for (let i = 0; i < data.ts.length; i++) {
        el.childNodes[1].childNodes[7].appendChild(taskElem(data.ts[i], li, i));
    }
    el.childNodes[1].childNodes[1].childNodes[0].addEventListener('click', function(e) {
        bdComp.listi = li;
        bdComp.liste = el;
        let f = document.querySelector(`form[name="elistForm"]`);
        f.name.value = bdComp.board.tasks[li].n;
        f.desc.value = bdComp.board.tasks[li].d;
        document.getElementById("elistMsg").innerHTML = '';
    });
    return el;
}

function boardComp() {
    this.board = {};
    this.listi = 0;
    this.liste = {};
    this.taske = {};
    this.taski = [0, 0];
}

boardComp.prototype.init = function(id) {
    let u = JSON.parse(localStorage.getItem("pro-one-user-data"));
    document.querySelector(`form[name="alistForm"]`).addEventListener('submit', this.addList);
    document.querySelector(`form[name="elistForm"]`).addEventListener('submit', this.editList);
    document.querySelector(`form[name="etaskForm"]`).addEventListener('submit', this.editTask);
    document.querySelector(`form[name="ataskForm"]`).addEventListener('submit', this.addTask);
    document.querySelector(`form[name="eboardForm"]`).addEventListener('submit', this.editBoard);
    fetch("/user/board?auth0=" + u.auth[0] + "&auth2=" + u.auth[2] + "&bdi=" + id, {
            method: 'get',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            }
        })
        .then(data => data.json())
        .then(data => {
            data.tasks = JSON.parse(data.tasks);
            data.stats = JSON.parse(data.stats);
            this.board = data;
            document.querySelector(`board-comp`).innerHTML = `
            <div class="card">
            <div class="card-header bg-primary text-white"><h5><i class="far fa-clipboard"></i> ${data.name}</h5></div>
                <div class="card-body">
                    <h6 class="card-subtitle mb-2"> ${data.desc}</h6>
                         <a href="/#/" class="card-link"><i class="fas fa-arrow-left"></i> Back</a>
                     <a href="/#/board/${id}" class="card-link" data-toggle="modal" data-target="#addListModal_ID"><i class="fas fa-plus"></i> Add List</a>
                <a href="/#/board/${id}" onclick="javascript: document.getElementById('eboardMsg').innerHTML = '';" class="card-link" data-toggle="modal" data-target="#editBoardModal_ID"><i class="fas fa-edit"></i> Edit</a>
                </div>
            </div>`;
            let ef = document.querySelector(`form[name="eboardForm"]`);
            ef.name.value = data.name;
            ef.desc.value = data.desc;
            for (let i = 0; i < data.tasks.length; i++) {
                document.getElementById("taskList_ID").appendChild(listElem(data.tasks[i], i));
            }
            document.getElementById('bloader').classList.add('d-none');
        })
        .catch(function(error) {
            document.getElementById('bloader').classList.add('d-none');
            window.location.hash = "/";
            return;
        });
}

boardComp.prototype.editBoard = function(e) {
    e.preventDefault();
    let u = JSON.parse(localStorage.getItem("pro-one-user-data"));
    fetch("/user/board/update?auth0=" + u.auth[0] + "&auth2=" + u.auth[2], {
            method: 'post',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: `{"name" : "${this.name.value}" ,"desc" : "${this.desc.value}", "id" : "${bdComp.board.id}"}`
        })
        .then(data => data.json())
        .then(data => {
            let c = document.querySelector(`board-comp`);
            c.childNodes[1].childNodes[1].innerHTML = `<h5><i class="far fa-clipboard"></i> ${this.name.value}</h5>`;
            c.childNodes[1].childNodes[3].childNodes[1].innerHTML = this.desc.value;
            document.getElementById("eboardMsg").innerHTML = `<div class="alert alert-success" role="alert">Succesfully Updated Board..</div>`;
        })
        .catch(function(error) {
            document.getElementById("eboardMsg").innerHTML = `<div class="alert alert-warning" role="alert">Cannot Update Board..</div>`;
        });
}

boardComp.prototype.delBoard = function() {
    let u = JSON.parse(localStorage.getItem("pro-one-user-data"));
    fetch("/user/board/delete?auth0=" + u.auth[0] + "&auth2=" + u.auth[2] + "&bdi=" + bdComp.board.id, {
            method: 'delete',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: `{}`
        })
        .then(data => data.json())
        .then(data => {
            $("#editBoardModal_ID").modal("hide");
            window.location.hash = "/";
        })
        .catch(function(error) {
            document.getElementById("eboardMsg").innerHTML = `<div class="alert alert-warning" role="alert">Cannot Delete Board..</div>`;
        });
}

boardComp.prototype.addList = function(e) {
    e.preventDefault();
    bdComp.board.stats[0]++;
    bdComp.board.stats[2]++;
    let u = JSON.parse(localStorage.getItem("pro-one-user-data"));
    let list = { "i": bdComp.board.stats[0], "n": this.name.value, "d": this.desc.value, "ts": [] };
    bdComp.board.tasks.push(list);
    fetch("/user/board/update/task?auth0=" + u.auth[0] + "&auth2=" + u.auth[2], {
            method: 'post',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: `{"stats" : "${JSON.stringify(bdComp.board.stats)}" ,"tasks" : ${JSON.stringify(JSON.stringify(bdComp.board.tasks))} , "id" : "${bdComp.board.id}"}`
        })
        .then(data => data.json())
        .then(data => {
            document.getElementById('taskList_ID').appendChild(listElem(list, (bdComp.board.tasks.length - 1)));
            this.reset();
            $('#addListModal_ID').modal('hide');
        })
        .catch(function(error) {
            bdComp.board.stats[2]--;
            bdComp.board.tasks.pop();
            document.getElementById("alistMsg").innerHTML = `<div class="alert alert-warning" role="alert">Cannot Add New List..</div>`;
        });
}

boardComp.prototype.editList = function(e) {
    e.preventDefault();
    let u = JSON.parse(localStorage.getItem("pro-one-user-data"));
    let bk = { n: bdComp.board.tasks[bdComp.listi].n, d: bdComp.board.tasks[bdComp.listi].d };
    bdComp.board.tasks[bdComp.listi].n = this.name.value;
    bdComp.board.tasks[bdComp.listi].d = this.desc.value;
    fetch("/user/board/update/task?auth0=" + u.auth[0] + "&auth2=" + u.auth[2], { method: 'post', headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" }, body: `{"stats" : "${JSON.stringify(bdComp.board.stats)}" ,"tasks" : ${JSON.stringify(JSON.stringify(bdComp.board.tasks))} , "id" : "${bdComp.board.id}"}` })
        .then(data => data.json())
        .then(data => {
            bdComp.liste.childNodes[1].childNodes[1].childNodes[0].innerHTML = this.name.value;
            bdComp.liste.childNodes[1].childNodes[3].innerHTML = this.desc.value;
            document.getElementById("elistMsg").innerHTML = `<div class="alert alert-success" role="alert">Succesfully Updated List..</div>`;
        })
        .catch(function(error) {
            bdComp.board.tasks[bdComp.listi].n = bk.n;
            bdComp.board.tasks[bdComp.listi].d = bk.d;
            document.getElementById("elistMsg").innerHTML = `<div class="alert alert-warning" role="alert">Cannot Update List..</div>`;
        });
}

boardComp.prototype.delList = function() {
    let u = JSON.parse(localStorage.getItem("pro-one-user-data"));
    let bk = [...bdComp.board.tasks];
    bdComp.board.stats[2]--;
    bdComp.board.tasks.splice(bdComp.listi, 1);
    fetch("/user/board/update/task?auth0=" + u.auth[0] + "&auth2=" + u.auth[2], { method: 'post', headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" }, body: `{"stats" : "${JSON.stringify(bdComp.board.stats)}" ,"tasks" : ${JSON.stringify(JSON.stringify(bdComp.board.tasks))} , "id" : "${bdComp.board.id}"}` })
        .then(data => data.json())
        .then(data => {
            bdComp.liste.remove();
            $("#viewListModal_ID").modal("hide");
        })
        .catch(function(error) {
            bdComp.board.stats[2]++;
            bdComp.board.tasks = bk;
        });
}

boardComp.prototype.editTask = function(e) {
    e.preventDefault();
    let u = JSON.parse(localStorage.getItem("pro-one-user-data"));
    let bk = { c: bdComp.board.tasks[bdComp.taski[0]].ts[bdComp.taski[1]].c };
    bdComp.board.tasks[bdComp.taski[0]].ts[bdComp.taski[1]].c = this.content.value;
    fetch("/user/board/update/task?auth0=" + u.auth[0] + "&auth2=" + u.auth[2], { method: 'post', headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" }, body: `{"stats" : "${JSON.stringify(bdComp.board.stats)}" ,"tasks" : ${JSON.stringify(JSON.stringify(bdComp.board.tasks))} , "id" : "${bdComp.board.id}"}` })
        .then(data => data.json())
        .then(data => {
            bdComp.taske.childNodes[1].childNodes[1].innerHTML = this.content.value;
            document.getElementById("taskCont_ID").innerHTML = `<b class="text-muted">Content</b><h5 class="card-title">${this.content.value}</h5>`;
            document.getElementById("etaskMsg").innerHTML = `<div class="alert alert-success" role="alert">Succesfully Updated Task..</div>`;
        })
        .catch(function(error) {
            bdComp.board.tasks[bdComp.taski[0]].ts[bdComp.taski[1]].c = bk.c;
            document.getElementById("etaskMsg").innerHTML = `<div class="alert alert-warning" role="alert">Cannot Update Task..</div>`;
        });
}

function taskElem(data, li, ti) {
    let el = document.createElement('div');
    el.className = "card";
    el.style = "cursor: pointer; margin-bottom: 12px;";
    el.innerHTML = `
  <div class="card-body" style="padding: -4px; ">
    <h6 class = "card-title">${data.c.substring(0,120)}..</h6>
     </div>
    `;
    el.addEventListener('click', function(e) {
        bdComp.taske = el;
        bdComp.taski = [li, ti];
        document.getElementById("etaskMsg").innerHTML = '';
        document.querySelector(`form[name="etaskForm"]`).content.value = data.c;
        document.getElementById("taskCont_ID").innerHTML = `<b class="text-muted">Content</b><h5 class="card-title">${data.c}</h5>`;
        let sl = document.getElementById('listSel_ID');
        sl.innerHTML = '';
        let eo = document.createElement('option');
        eo.value = li;
        eo.style = "outline: 0;"
        eo.innerHTML = bdComp.board.tasks[li].n;
        sl.appendChild(eo);
        for (let i = 0; i < bdComp.board.tasks.length; i++) {
            if (i != li) {
                let e = document.createElement('option');
                e.value = i;
                e.innerHTML = bdComp.board.tasks[i].n;
                sl.appendChild(e);
            }
        }
        sl.addEventListener('change', bdComp.moveTask);
        $("#viewTaskModal_ID").modal('show');
    });
    return el;
}

boardComp.prototype.moveTask = function(e) {
    e.preventDefault();
    let u = JSON.parse(localStorage.getItem("pro-one-user-data"));
    let t = bdComp.board.tasks[bdComp.taski[0]].ts[bdComp.taski[1]];
    if (t == null) {
        return;
    }
    bdComp.board.tasks[bdComp.taski[0]].ts.splice(bdComp.taski[1], 1);
    bdComp.board.tasks[this.value].ts.push(t);
    fetch("/user/board/update/task?auth0=" + u.auth[0] + "&auth2=" + u.auth[2], {
            method: 'post',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: `{"stats" : "${JSON.stringify(bdComp.board.stats)}" ,"tasks" : ${JSON.stringify(JSON.stringify(bdComp.board.tasks))} , "id" : "${bdComp.board.id}"}`
        })
        .then(data => data.json())
        .then(data => {
            bdComp.taske.remove();
            let ti = bdComp.board.tasks[this.value].ts.length - 1;
            bdComp.taske = taskElem(t, this.value, ti);
            document.getElementById(`listTask${bdComp.board.tasks[this.value].i}_ID`).appendChild(bdComp.taske);
            bdComp.taski = [this.value, ti];
        })
        .catch(function(error) {});
}

boardComp.prototype.delTask = function() {
    let u = JSON.parse(localStorage.getItem("pro-one-user-data"));
    bdComp.board.stats[3]--;
    let bk = [...bdComp.board.tasks[bdComp.taski[0]].ts];
    bdComp.board.tasks[bdComp.taski[0]].ts.splice(bdComp.taski[1], 1);
    fetch("/user/board/update/task?auth0=" + u.auth[0] + "&auth2=" + u.auth[2], { method: 'post', headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" }, body: `{"stats" : "${JSON.stringify(bdComp.board.stats)}" ,"tasks" : ${JSON.stringify(JSON.stringify(bdComp.board.tasks))} , "id" : "${bdComp.board.id}"}` })
        .then(data => data.json())
        .then(data => {
            bdComp.taske.remove();
            $("#viewTaskModal_ID").modal("hide");
        })
        .catch(function(error) {
            bdComp.board.stats[3]++;
            bdComp.board.tasks[bdComp.taski[0]].ts = bk;
        });
}

boardComp.prototype.addTask = function(e) {
    e.preventDefault();
    let u = JSON.parse(localStorage.getItem("pro-one-user-data"));
    bdComp.board.stats[1]++;
    bdComp.board.stats[3]++;
    let task = { "c": this.content.value };
    bdComp.board.tasks[bdComp.listi].ts.push(task);
    fetch("/user/board/update/task?auth0=" + u.auth[0] + "&auth2=" + u.auth[2], {
            method: 'post',
            headers: {
                "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
            },
            body: `{"stats" : "${JSON.stringify(bdComp.board.stats)}" ,"tasks" : ${JSON.stringify(JSON.stringify(bdComp.board.tasks))} , "id" : "${bdComp.board.id}"}`
        })
        .then(data => data.json())
        .then(data => {
            bdComp.liste.childNodes[7].appendChild(taskElem(task, bdComp.listi, (bdComp.board.tasks[bdComp.listi].ts.length - 1)));
            this.reset();
            $('#addTaskModal_ID').modal('hide');
        })
        .catch(function(error) {
            bdComp.board.stats[3]--;
            bdComp.board.tasks[bdComp.listi].ts.pop();
            document.getElementById("alistMsg").innerHTML = `<div class="alert alert-warning" role="alert">Cannot Add New List..</div>`;
        });
}