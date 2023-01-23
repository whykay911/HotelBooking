document.getElementById("confirm-btn").onclick = () => {
    let mail = document.getElementById("mail-checkin").value;
    let name = document.getElementById("name-checkin").value;
    let phone = document.getElementById("number-checkin").value;
    let from = document.getElementById("from-checkin").value;
    let to = document.getElementById("to-checkin").value;
    if (ValidateEmail(mail)) {

        let request = window.indexedDB.open("hotels")
            , db, tx, store, index, storeindex, storedetails, tx2, tx3, storemanage, manageindex
            ;
        window.indexedDB = window.indexedDB || window.mozIndexedDB ||
            window.webkitIndexedDB || window.msIndexedDB;
        request.onupgradeneeded = (e) => {

        }

        request.onerror = (e) => {
            console.log('error is comming' + e.target.errorCode);
        }


        request.onsuccess = (e) => {
            db = request.result;
            tx = db.transaction("checkin", "readwrite");
            store = tx.objectStore("checkin");
            index = store.index("id");

            tx2 = db.transaction("details", "readwrite");
            storedetails = tx2.objectStore("details");
            storeindex = storedetails.index("title");

            tx3 = db.transaction("manage", "readwrite");
            storemanage = tx3.objectStore("manage");
            manageindex = storemanage.index("title");

            let items = storedetails.getAll();
            items.onsuccess = () => {
                let manageval = items.result[0];
                manageval.mail = localStorage.getItem("mail")
                let val = {
                    name: name, mail: mail, phone: phone, from: from, to: to, id: items.result[0].id
                }
                add(val, "checkin");
                add(manageval, "manage")
            }

            window.location = '../manage/manage.html'




            db.onerror = (e) => {
                console.log('error is comming' + e.target.errorCode);
            }
        }
    }
}


window.onload=()=>{
    if(localStorage.getItem("login")=="true"){
        document.getElementById("logout").innerHTML="Log out"
    }
    else{
        document.getElementById("logout").innerHTML="Login"

    }
}

var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB,
    IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction,
    baseName = "hotels"

function logerr(err) {
    console.log(err);
}

function connectDB(f, storeName) {

    var request = indexedDB.open(baseName, 1);
    request.onerror = logerr;
    request.onsuccess = function () {
        f(request.result);
    }
    request.onupgradeneeded = function (e) {
        var Db = e.currentTarget.result;



        if (!Db.objectStoreNames.contains(storeName)) {
            var store = Db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
        }
        connectDB(f);
    }
}



function add(obj, storeName, info) {
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
        }
    }, storeName);
}

document.getElementById('search-btn').onclick = () => {
    let val = document.getElementById('search').value;
    localStorage.setItem("search", val);
    window.location = '../hotelslist/hotellist.html'


}



function ValidateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
        return (true)
    }
    alert("You have entered an invalid email address!")
    return (false)
}