//c1-------------------------------------------------------------->
function cf1(temp) {}
//cf-------------------------------------------------------------->
cf1.prototype.f1 = function(temp) { // view ===>
    document.querySelector(`pro-one-view`).innerHTML = document.getElementById(temp + "_ID").innerHTML;
}
//ec--------------------------------------------------------------->

//c5-------------------------------------------------------------->
function cf5() { // comp 5 ===>
    this.o1 = {};
    this.a1 = ["#007bff", "#E84A5F", "#CC527A", "#2F9599"];
}
//cf-------------------------------------------------------------->
cf5.prototype.f1 = function(cl) { // load el ===>
    let e = document.createElement('div');
    e.className = cl;
    e.id = 'ID4';
    return e;
}
cf5.prototype.f2 = function(c, ic, m) { // alert el ===>
    let e2 = document.querySelector(c);
    if (e2.firstChild.className == 'alert alert-success' || ic == -1) {
        if (ic == -1 && e2.firstChild.className == 'alert alert-success') { e2.firstChild.remove(); }
        return;
    }
    let icn = ["fa-exclamation", "fa-check"];
    let e1 = document.createElement('div');
    e1.className = 'alert alert-success';
    e1.innerHTML = `<i class="fas ${icn[ic]} color"></i> ${m}..<button type="button" class="close" data-dismiss="alert" aria-label="Close" style="outline: 0;"><span aria-hidden="true">&times;</span></button>`;
    e2.prepend(e1);
}
cf5.prototype.f3 = function(v1, v2, v3) { // col el ===>
    let e1 = document.createElement('div');
    e1.data = v1;
    e1.id = c5.a1[v1];
    e1.className = `col-2 ${v3}`;
    e1.style = `background-color: ${c5.a1[v1]}; cursor: pointer; height: 40px; margin: 4px; text-align: center; padding-top: 10px; color: #fff;`;
    if (v1 == v2) {
        e1.innerHTML = '<i class="fas fa-check"></i>';
    }
    return e1;
}
//ec-------------------------------------------------------------->

//c2-------------------------------------------------------------->
function cf2() {}
//cf-------------------------------------------------------------->
cf2.prototype.f1 = function() { // init func ===>
    document.querySelector(`form[name="loginForm"]`).addEventListener('submit', this.f2);
    document.querySelector(`form[name="joinForm"]`).addEventListener('submit', this.f3);
    document.getElementById('ID1').innerHTML = new Date().getFullYear();
    document.documentElement.style.setProperty('--blue', c5.a1[0]);
}
cf2.prototype.f2 = function(e) { // login func ===>
    e.preventDefault();
    if (this.email.value == "" || this.digest.value == "" || this.digest.value.length < 6) {
        return;
    }
    this.parentNode.appendChild(c5.f1("loader-sm"));
    fetch("/user/auth", { method: 'post', headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" }, body: `{ "email" : "${this.email.value}", "digest" : "${this.digest.value}"}` }).then(data => data.json())
        .then(data => {
            localStorage.setItem("ld1", JSON.stringify(data));
            window.location.hash = "/";
        })
        .catch(function(error) {
            document.getElementById('ID4').remove();
            c5.f2(`form[name="loginForm"]`, 0, "No Record Found");
        });
}
cf2.prototype.f3 = function(e) { // join func ===>
    e.preventDefault();
    if (this.email.value == "" || this.digest.value == "" || this.name.value == "" || this.digest.value.length < 6 || this.name.value.length < 6) {
        return;
    }
    this.parentNode.appendChild(c5.f1("loader-sm"));
    fetch("/user/join", { method: 'post', headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" }, body: `{ "email" : "${this.email.value}", "digest" : "${this.digest.value}", "name" : "${this.name.value}"}` }).then(data => data.json())
        .then(data => {
            localStorage.setItem("ld1", JSON.stringify(data));
            window.location.hash = "/";
        })
        .catch(function(error) {
            document.getElementById('ID4').remove();
            c5.f2(`form[name="joinForm"]`, 0, "Cannot Add New Record");
        });
}
//ec--------------------------------------------------->

//c3--------------------------------------------------->
function cf3() { // comp c3 ===>
    this.o1 = {}; //bde
    this.v1 = 0; //bdi
    this.a1 = []; //bds
}
//cf--------------------------------------------------->
cf3.prototype.f1 = function() { // init func ===>
    document.documentElement.style.setProperty('--blue', c5.a1[c5.o1.conf.cs]);
    let e1 = document.getElementById(`ID5`);
    let e2 = document.createElement('div');
    e2.className = 'card';
    e2.innerHTML = `<div class="card-body" style="text-align: center;"><img src="https://www.gravatar.com/avatar/${md5(c5.o1.email)}" id="ID7"  class="img-fluid" style="margin-bottom: 10px; border-radius: 3px; cursor: pointer;"><h4 class="card-title">${c5.o1.name}</h4><h6 class="card-subtitle mb-2 text-muted">${c5.o1.email}</h6><a href="/#/welcome" class="card-link"><i class="fas fa-power-off"></i> Log Out</a><hr><center><i class="fas fa-angle-down fa-2x" style="cursor: pointer; color: #888;" onclick="javascript: this.nextElementSibling.classList.toggle('d-none'); if(this.classList.contains('fa-angle-down')) {this.className='fas fa-angle-up fa-2x';}else {this.className='fas fa-angle-down fa-2x';}"></i><div class="d-none"><h3 id="ID8">0</h3><b class="text-muted">Total Boards</b></div></center></div>`;
    e1.appendChild(e2);
    document.querySelector(`form[name="aboardForm"]`).addEventListener('submit', this.f4);
    document.getElementById('ID7').addEventListener('click', function(e) {
        $("#ID9").modal('show');
        let e4 = document.querySelector(`colsch-comp`);
        if (e4.childNodes.length > 1) { return; }
        for (let i = 0; i < c5.a1.length; i++) {
            let e3 = c5.f3(i, c5.o1.conf.cs);
            e3.addEventListener('click', function(e) {
                this.parentNode.appendChild(c5.f1("loader-sm"));
                let o1 = c5.o1.conf.cs;
                c5.o1.conf.cs = this.data;
                fetch("/user/update/conf?auth0=" + c5.o1.auth[0] + "&auth2=" + c5.o1.auth[2], { method: 'patch', headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" }, body: `{"conf" : "{\\"cs\\":${this.data}}"}` }).then(data => data.json())
                    .then(data => {
                        document.getElementById(c5.a1[o1]).innerHTML = '';
                        this.innerHTML = '<i class="fas fa-check"></i>';
                        localStorage.setItem("ld1", JSON.stringify(c5.o1));
                        document.documentElement.style.setProperty('--blue', c5.a1[this.data]);
                        document.getElementById('ID4').remove();
                    })
                    .catch(function(error) {
                        document.getElementById('ID4').remove();
                    });
            });
            e4.appendChild(e3);
        }
    });
    document.querySelector(`body`).appendChild(c5.f1("loader"));
    fetch("/user/boards?auth0=" + c5.o1.auth[0] + "&auth2=" + c5.o1.auth[2], { method: 'get', headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" } }).then(data => data.json())
        .then(data => {
            c3.a1 = data;
            for (let i = 0; i < data.length; i++) {
                e1.appendChild(c3.f2(data[i]));
            }
            document.getElementById('ID8').innerHTML = c3.a1.length;
            document.getElementById('ID4').remove();
        })
        .catch(function(error) { console.error(error); });
}
cf3.prototype.f2 = function(o1) { // board el ===>
    o1.stats = JSON.parse(o1.stats);
    let e1 = document.createElement('div');
    e1.className = "card";
    e1.innerHTML = `<div class="card-body"><h4 class="card-title" style="cursor: pointer;" onclick='javascript: window.location.hash = "/board/${o1.id}";''>${o1.name}</h4><h6 class="card-subtitle mb-2 text-muted">${o1.desc}</h6><hr><center>
    <i class="fas fa-angle-down fa-2x" style="cursor: pointer; color: #888;" onclick="javascript: this.nextElementSibling.classList.toggle('d-none'); if(this.classList.contains('fa-angle-down')) {this.className='fas fa-angle-up fa-2x';}else {this.className='fas fa-angle-down fa-2x';}"></i>
    <div class="d-none"><br><h3><font class="text-muted">${o1.stats[4]}</font><font style="color: var(--blue);">/</font>${o1.stats[3]}</h3>
    <div class="progress"><div class="progress-bar" role="progressbar" style="width: ${(o1.stats[4]/o1.stats[3])*100}%" aria-valuenow="${(o1.stats[4]/o1.stats[3])*100}" aria-valuemin="0" aria-valuemax="100"></div></div><b class="text-muted"> Progress</b></div></center></div>
    `;
    return e1;
}
cf3.prototype.f4 = function(e) { // add board func ===>
    e.preventDefault();
    this.parentNode.appendChild(c5.f1("loader-sm"));
    fetch("/user/board/create?auth0=" + c5.o1.auth[0] + "&auth2=" + c5.o1.auth[2], { method: 'post', headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" }, body: `{ "name" : "${this.name.value}", "desc": "${this.desc.value}"}` }).then(data => data.json())
        .then(data => {
            document.getElementById(`ID5`).appendChild(c3.f2(data));
            this.reset();
            c3.a1.push(data);
            document.getElementById('ID4').remove();
            document.getElementById('ID8').innerHTML = c3.a1.length;
            $('#ID6').modal('hide');
        })
        .catch(function(error) {
            document.getElementById('ID4').remove();
            c5.f2(`form[name="aboardForm"]`, 0, "Cannot Add New Board");
        });
}
//ec--------------------------------------------------->

//c4---------------------------------------------------->
function cf4() { // comp c4 ===>
    this.o1 = {}; //bd
    this.v1 = 0; //li
    this.o3 = {}; //le
    this.o4 = {}; //te
    this.a1 = [0, 0]; //ti
}
//cf---------------------------------------------------->
cf4.prototype.f1 = function(id) { // init func ===>
    document.querySelector(`form[name="alistForm"]`).addEventListener('submit', this.f5);
    document.querySelector(`form[name="elistForm"]`).addEventListener('submit', this.f6);
    document.querySelector(`form[name="etaskForm"]`).addEventListener('submit', this.f10);
    document.querySelector(`form[name="ataskForm"]`).addEventListener('submit', this.f9);
    document.querySelector(`form[name="eboardForm"]`).addEventListener('submit', this.f3);
    document.querySelector(`body`).appendChild(c5.f1("loader"));
    fetch("/user/board?auth0=" + c5.o1.auth[0] + "&auth2=" + c5.o1.auth[2] + "&bdi=" + id, { method: 'get', headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" } }).then(data => data.json())
        .then(data => {
            data.tasks = JSON.parse(data.tasks);
            data.stats = JSON.parse(data.stats);
            data.conf = JSON.parse(data.conf);
            this.o1 = data;
            document.documentElement.style.setProperty('--blue', c5.a1[data.conf.cs]);
            document.querySelector(`board-comp`).innerHTML = `<div class="card"><div class="card-header bg-primary text-white"><h5><i class="far fa-clipboard"></i> ${data.name}</h5></div><div class="card-body"><h6 class="card-subtitle mb-2"> ${data.desc}</h6><a href="/#/" class="card-link"><i class="fas fa-arrow-left"></i> Back</a><a style="cursor: pointer; color: var(--blue);" class="card-link" data-toggle="modal" data-target="#ID16"><i class="fas fa-plus"></i> Add List</a><a style="cursor: pointer; color: var(--blue);" class="card-link" id="ID10"> <i class="fas fa-edit"></i> Edit</a></div></div>`;
            let e1 = document.querySelector(`form[name="eboardForm"]`);
            e1.name.value = data.name;
            e1.desc.value = data.desc;
            for (let i = 0; i < data.tasks.length; i++) {
                document.getElementById("ID17").appendChild(c4.f2(data.tasks[i], i));
            }
            document.getElementById('ID10').addEventListener('click', function(e) {
                $("#ID11").modal('show');
                c5.f2(`form[name="eboardForm"]`, -1, "");
                let e2 = document.querySelector(`colsch-comp`);
                if (e2.childNodes.length > 1) { return; }
                for (let i = 0; i < c5.a1.length; i++) {
                    let e3 = c5.f3(i, c4.o1.conf.cs);
                    e3.addEventListener('click', function(e) {
                        this.parentNode.appendChild(c5.f1("loader-sm"));
                        let o1 = c4.o1.conf.cs;
                        c4.o1.conf.cs = this.data;
                        fetch("/user/board/update?auth0=" + c5.o1.auth[0] + "&auth2=" + c5.o1.auth[2], { method: 'patch', headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" }, body: `{"name" : "${c4.o1.name}" ,"desc" : "${c4.o1.desc}", "id" : "${c4.o1.id}","conf" : "{\\"cs\\":${this.data}}"}` }).then(data => data.json())
                            .then(data => {
                                document.getElementById(c5.a1[o1]).innerHTML = '';
                                this.innerHTML = '<i class="fas fa-check"></i>';
                                document.documentElement.style.setProperty('--blue', c5.a1[this.data]);
                                document.getElementById('ID4').remove();
                            })
                            .catch(function(error) {
                                document.getElementById('ID4').remove();
                            });
                    });
                    e2.appendChild(e3);
                }
            });
            document.getElementById('ID4').remove();
        })
        .catch(function(error) {
            console.error(error);
            document.getElementById('ID4').remove();
            window.location.hash = "/";
            return;
        });
}
cf4.prototype.f2 = function(o1, v1) { // list el ===>
    let e1 = document.createElement('div');
    e1.className = "card";
    e1.style = "max-width: 20rem; margin: auto; margin-bottom: 10px;";
    e1.innerHTML = `<div class="card-body"><h4 class="card-title"><a style="cursor: pointer;" data-toggle="modal" data-target="#ID12">${o1.n}</a></h4><h6 class="card-subtitle mb-2 text-muted">${o1.d}</h6><a class="card-link"  onclick="javascript: c4.o3 = this.parentNode; c4.v1 = '${v1}';" data-toggle="modal" style="cursor: pointer; color: var(--blue);" data-target="#ID15"><i class="fas fa-plus"></i> Add Task</a><div style="padding-top: 9px;" id="${o1.i}_ID19"></div></div>`;
    for (let i = 0; i < o1.ts.length; i++) {
        e1.childNodes[0].childNodes[3].appendChild(c4.f8(o1.ts[i], v1, i));
    }
    e1.childNodes[0].childNodes[0].addEventListener('click', function(e) {
        c4.v1 = v1;
        c4.o3 = e1;
        let f = document.querySelector(`form[name="elistForm"]`);
        f.name.value = c4.o1.tasks[v1].n;
        f.desc.value = c4.o1.tasks[v1].d;
        c5.f2(`form[name="elistForm"]`, -1, "");
    });
    return e1;
}
cf4.prototype.f3 = function(e) { // edit board func ===>
    e.preventDefault();
    this.parentNode.appendChild(c5.f1("loader-sm"));
    fetch("/user/board/update?auth0=" + c5.o1.auth[0] + "&auth2=" + c5.o1.auth[2], { method: 'post', headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" }, body: `{"name" : "${this.name.value}" ,"desc" : "${this.desc.value}", "id" : "${c4.o1.id}","conf" : "{\\"cs\\":${c4.o1.conf.cs}}"}` }).then(data => data.json())
        .then(data => {
            let c = document.querySelector(`board-comp`);
            document.getElementById('ID4').remove();
            c.childNodes[0].childNodes[0].innerHTML = `<h5><i class="far fa-clipboard"></i> ${this.name.value}</h5>`;
            c.childNodes[0].childNodes[1].childNodes[0].innerHTML = this.desc.value;
            c5.f2(`form[name="eboardForm"]`, 1, "Succesfully Updated Board");
        })
        .catch(function(error) {
            document.getElementById('ID4').remove();
            c5.f2(`form[name="eboardForm"]`, 0, "Cannot Update Board");
        });
}
cf4.prototype.f4 = function() { // del board func ===>
    fetch("/user/board/delete?auth0=" + c5.o1.auth[0] + "&auth2=" + c5.o1.auth[2] + "&bdi=" + c4.o1.id, { method: 'delete', headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" }, body: `{}` }).then(data => data.json())
        .then(data => {
            $("#ID11").modal("hide");
            window.location.hash = "/";
        })
        .catch(function(error) {
            c5.f2(`form[name="eboardForm"]`, 0, "Cannot Delete Board");
        });
}
cf4.prototype.f5 = function(e) { // add list func ===>
    e.preventDefault();
    c4.o1.stats[0]++;
    c4.o1.stats[2]++;
    let o1 = { "i": c4.o1.stats[0], "n": this.name.value, "d": this.desc.value, "ts": [] };
    c4.o1.tasks.push(o1);
    this.parentNode.appendChild(c5.f1("loader-sm"));
    fetch("/user/board/update/task?auth0=" + c5.o1.auth[0] + "&auth2=" + c5.o1.auth[2], { method: 'post', headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" }, body: `{"stats" : "${JSON.stringify(c4.o1.stats)}" ,"tasks" : ${JSON.stringify(JSON.stringify(c4.o1.tasks))} , "id" : "${c4.o1.id}"}` }).then(data => data.json())
        .then(data => {
            document.getElementById('ID17').appendChild(c4.f2(o1, (c4.o1.tasks.length - 1)));
            this.reset();
            document.getElementById('ID4').remove();
            $('#ID16').modal('hide');
        })
        .catch(function(error) {
            c4.o1.stats[2]--;
            c4.o1.tasks.pop();
            document.getElementById('ID4').remove();
            c5.f2(`form[name="aListForm"]`, 0, "Cannot Add List");
        });
}
cf4.prototype.f6 = function(e) { // edit list func ===>
    e.preventDefault();
    let bk = { n: c4.o1.tasks[c4.v1].n, d: c4.o1.tasks[c4.v1].d };
    c4.o1.tasks[c4.v1].n = this.name.value;
    c4.o1.tasks[c4.v1].d = this.desc.value;
    this.parentNode.appendChild(c5.f1("loader-sm"));
    fetch("/user/board/update/task?auth0=" + c5.o1.auth[0] + "&auth2=" + c5.o1.auth[2], { method: 'post', headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" }, body: `{"stats" : "${JSON.stringify(c4.o1.stats)}" ,"tasks" : ${JSON.stringify(JSON.stringify(c4.o1.tasks))} , "id" : "${c4.o1.id}"}` }).then(data => data.json())
        .then(data => {
            c4.o3.childNodes[0].childNodes[0].childNodes[0].innerHTML = this.name.value;
            c4.o3.childNodes[0].childNodes[1].innerHTML = this.desc.value;
            document.getElementById('ID4').remove();
            c5.f2(`form[name="elistForm"]`, 1, "Succesfully Updated List");
        })
        .catch(function(error) {
            c4.o1.tasks[c4.v1].n = bk.n;
            c4.o1.tasks[c4.v1].d = bk.d;
            document.getElementById('ID4').remove();
            c5.f2(`form[name="elistForm"]`, 0, "Cannot Edit List");
        });
}
cf4.prototype.f7 = function(pn) { // del list ===>
    let bk = [...c4.o1.tasks];
    c4.o1.stats[2]--;
    c4.o1.tasks.splice(c4.v1, 1);
    pn.parentNode.appendChild(c5.f1("loader-sm"));
    fetch("/user/board/update/task?auth0=" + c5.o1.auth[0] + "&auth2=" + c5.o1.auth[2], { method: 'post', headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" }, body: `{"stats" : "${JSON.stringify(c4.o1.stats)}" ,"tasks" : ${JSON.stringify(JSON.stringify(c4.o1.tasks))} , "id" : "${c4.o1.id}"}` }).then(data => data.json())
        .then(data => {
            c4.o3.remove();
            $("#ID12").modal("hide");
            document.getElementById('ID4').remove();
        })
        .catch(function(error) {
            c4.o1.stats[2]++;
            document.getElementById('ID4').remove();
            c4.o1.tasks = bk;
        });
}
cf4.prototype.f8 = function(data, li, ti) { // task el ===>
    let e1 = document.createElement('div');
    e1.className = "card";
    e1.style = "cursor: pointer; margin-bottom: 12px;";
    e1.innerHTML = `<div class="card-body" style="padding: -4px; "><h6 class = "card-title">${data.c.substring(0,120)}..</h6></div>`;
    e1.addEventListener('click', function(e) {
        c4.o4 = e1;
        c4.a1 = [li, ti];
        let e2 = document.querySelector(`form[name="etaskForm"]`);
        c5.f2(`form[name="etaskForm"]`, -1, "");
        e2.content.value = data.c;
        if (data.s == 1) {
            e2.status.checked = true;
            e2.status.value = 1;
        } else {
            e2.status.checked = false;
            e2.status.value = 0;
        }
        document.getElementById("ID14").innerHTML = `<b class="text-muted">Content</b><p class="card-title">${data.c}</p>`;
        let o1 = document.getElementById('ID18');
        o1.innerHTML = '';
        let o2 = document.createElement('option');
        o2.value = li;
        o2.style = "outline: 0;"
        o2.innerHTML = c4.o1.tasks[li].n;
        o1.appendChild(o2);
        for (let i = 0; i < c4.o1.tasks.length; i++) {
            if (i != li) {
                let e = document.createElement('option');
                e.value = i;
                e.innerHTML = c4.o1.tasks[i].n;
                o1.appendChild(e);
            }
        }
        o1.addEventListener('change', c4.f11);
        $("#ID13").modal('show');
    });
    return e1;
}
cf4.prototype.f9 = function(e) { // add task func ===>
    e.preventDefault();
    c4.o1.stats[1]++;
    c4.o1.stats[3]++;
    let o1 = { "c": this.content.value, "s": 0 };
    c4.o1.tasks[c4.v1].ts.push(o1);
    this.parentNode.appendChild(c5.f1("loader-sm"));
    fetch("/user/board/update/task?auth0=" + c5.o1.auth[0] + "&auth2=" + c5.o1.auth[2], { method: 'post', headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" }, body: `{"stats" : "${JSON.stringify(c4.o1.stats)}" ,"tasks" : ${JSON.stringify(JSON.stringify(c4.o1.tasks))} , "id" : "${c4.o1.id}"}` }).then(data => data.json())
        .then(data => {
            c4.o3.childNodes[3].appendChild(c4.f8(o1, c4.v1, (c4.o1.tasks[c4.v1].ts.length - 1)));
            this.reset();
            $('#ID15').modal('hide');
            document.getElementById('ID4').remove();
        })
        .catch(function(error) {
            console.error(error);
            c4.o1.stats[3]--;
            c4.o1.tasks[c4.v1].ts.pop();
            document.getElementById('ID4').remove();
            c5.f2(`form[name="ataskForm"]`, 0, "Cannot Add Task");
        });
}
cf4.prototype.f10 = function(e) { // edit task func ===>
    e.preventDefault();
    let bk = { c: c4.o1.tasks[c4.a1[0]].ts[c4.a1[1]].c, s: c4.o1.tasks[c4.a1[0]].ts[c4.a1[1]].s };
    c4.o1.tasks[c4.a1[0]].ts[c4.a1[1]].c = this.content.value;
    c4.o1.tasks[c4.a1[0]].ts[c4.a1[1]].s = this.status.checked ? 1 : 0;
    if (c4.o1.tasks[c4.a1[0]].ts[c4.a1[1]].s != bk.s) {
        c4.o1.stats[4] += this.status.checked ? 1 : -1;
    }
    this.parentNode.appendChild(c5.f1("loader-sm"));
    fetch("/user/board/update/task?auth0=" + c5.o1.auth[0] + "&auth2=" + c5.o1.auth[2], { method: 'post', headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" }, body: `{"stats" : "${JSON.stringify(c4.o1.stats)}" ,"tasks" : ${JSON.stringify(JSON.stringify(c4.o1.tasks))} , "id" : "${c4.o1.id}"}` }).then(data => data.json())
        .then(data => {
            document.getElementById('ID4').remove();
            c4.o4.childNodes[0].childNodes[0].innerHTML = this.content.value;
            document.getElementById("ID14").innerHTML = `<b class="text-muted">Content</b><p class="card-title">${this.content.value}</p>`;
            c5.f2(`form[name="etaskForm"]`, 1, "Succesfully Updated Task");
        })
        .catch(function(error) {
            document.getElementById('ID4').remove();
            c4.o1.tasks[c4.a1[0]].ts[c4.a1[1]].c = bk.c;
            c5.f2(`form[name="etaskForm"]`, 0, "Cannot Edit Task");
        });
}
cf4.prototype.f11 = function(e) { // move task func ===>
    e.preventDefault();
    let t = c4.o1.tasks[c4.a1[0]].ts[c4.a1[1]];
    if (t == null) {
        return;
    }
    c4.o1.tasks[c4.a1[0]].ts.splice(c4.a1[1], 1);
    c4.o1.tasks[this.value].ts.push(t);
    this.parentNode.appendChild(c5.f1("loader-sm"));
    fetch("/user/board/update/task?auth0=" + c5.o1.auth[0] + "&auth2=" + c5.o1.auth[2], { method: 'post', headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" }, body: `{"stats" : "${JSON.stringify(c4.o1.stats)}" ,"tasks" : ${JSON.stringify(JSON.stringify(c4.o1.tasks))} , "id" : "${c4.o1.id}"}` })
        .then(data => data.json())
        .then(data => {
            c4.o4.remove();
            document.getElementById('ID4').remove();
            let ti = c4.o1.tasks[this.value].ts.length - 1;
            c4.o4 = c4.f8(t, this.value, ti);
            document.getElementById(`${c4.o1.tasks[this.value].i}_ID19`).appendChild(c4.o4);
            c4.a1 = [this.value, ti];
        })
        .catch(function(error) {
            document.getElementById('ID4').remove();
        });
}
cf4.prototype.f12 = function(pn) { // del task func ===>
    c4.o1.stats[3]--;
    if (c4.o1.tasks[c4.a1[0]].ts[c4.a1[1]].s == 1) {
        c4.o1.stats[4]--;
    }
    let bk = [...c4.o1.tasks[c4.a1[0]].ts];
    c4.o1.tasks[c4.a1[0]].ts.splice(c4.a1[1], 1);
    pn.parentNode.appendChild(c5.f1("loader-sm"));
    fetch("/user/board/update/task?auth0=" + c5.o1.auth[0] + "&auth2=" + c5.o1.auth[2], { method: 'post', headers: { "Content-type": "application/x-www-form-urlencoded; charset=UTF-8" }, body: `{"stats" : "${JSON.stringify(c4.o1.stats)}" ,"tasks" : ${JSON.stringify(JSON.stringify(c4.o1.tasks))} , "id" : "${c4.o1.id}"}` }).then(data => data.json())
        .then(data => {
            c4.o4.remove();
            document.getElementById('ID4').remove();
            $("#ID13").modal("hide");
        })
        .catch(function(error) {
            c4.o1.stats[3]++;
            document.getElementById('ID4').remove();
            c4.o1.tasks[c4.a1[0]].ts = bk;
        });
}
//ec---------------------------------------------------->