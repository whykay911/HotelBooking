
let terms = document.getElementById('reg-read');
if (terms.checked == false) {
    document.getElementById('reg-btn').disabled = true
    console.log(2);

}
terms.onclick = () => {
    if (terms.checked == false) {
        document.getElementById('reg-btn').disabled = true;

        console.log(2);

    }
    if (terms.checked == true) {
        document.getElementById('reg-btn').disabled = false;
        console.log(1);

    }
}


let cont = true;
document.getElementById('clear-btn').onclick = () => {
    document.getElementById('reg-mail').value = "";
    document.getElementById('reg-url').value = "";
    document.getElementById('reg-date').value = "";
    document.getElementById('reg-pass').value = "";
    document.getElementById('reg-pass2').value = "";
    document.getElementById('reg-comment').value = "";
}
document.getElementById('reg-btn').onclick = () => {
    let mail = document.getElementById('reg-mail').value;
    let url = document.getElementById('reg-url').value;
    let date = document.getElementById('reg-date').value;
    let pass = document.getElementById('reg-pass').value;
    let pass2 = document.getElementById('reg-pass2').value;
    let comment = document.getElementById('reg-comment').value;


    if (mail == "" || url == "" || date == "" || pass == "" || pass2 == "" || comment == "") {
        cont = false;
        alert("please fill all fields");
        return;
    }

    if (pass != pass2) {
        cont = false;
        document.getElementById('valid-pass').innerHTML = "*password do not match"
        return;
    }
    else if (pass == pass2) {
        document.getElementById('valid-pass').innerHTML = ""
    }
    if (pass.length < 7) {
        alert("please enter pass of length greater than 6");
        cont = false;
        return;
    }

    ValidateEmail(mail);

    if (mail != "" && url != "" && date != "" && pass != "" && pass2 != "" && comment != "" && pass == pass2 && ValidateEmail(mail) == true && pass > 6) {
        cont = true;
    }


    if (cont == true) {

        let val = {
            mail: mail, url: url, date: date, pass: pass, comment: comment, gender: $("input[type='radio'][name='gender']:checked").val()
        }


        add(val);

    }


}

function ValidateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
        return (true)
    }
    alert("You have entered an invalid email address!")
    return (false)
}



var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB,
    IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction,
    baseName = "hotels",
    storeName = "user";

function logerr(err) {
    console.log(err);
}

function connectDB(f) {

    var request = indexedDB.open(baseName, 1);
    request.onerror = logerr;
    request.onsuccess = function () {
        f(request.result);
    }
    request.onupgradeneeded = function (e) {

        var Db = e.currentTarget.result;


        if (!Db.objectStoreNames.contains(storeName)) {
            var store = Db.createObjectStore(storeName, { keyPath: "email" });
            var index = store.createIndex("email", "email", { unique: true });

        }
        connectDB(f);
    }
}
function add(obj, info) {
    info = typeof info !== 'undefined' ? false : true;
    connectDB(function (db) {
        var transaction = db.transaction([storeName], "readwrite");
        var objectStore = transaction.objectStore(storeName);
        var objectStoreRequest = objectStore.add(obj);
        objectStoreRequest.onerror = logerr;
        objectStoreRequest.onsuccess = function () {
            if (info) { console.log("Rows has been added"); }
            else { console.log("Rows has been updated"); }
            console.info(objectStoreRequest.result);
            window.location = "../login/login.html"
        }
    });
}