window.onload = () => {
    if(localStorage.getItem("login")=="true"){
        document.getElementById("logout").innerHTML="Log out"
    }
    else{
        document.getElementById("logout").innerHTML="Login"

    }
    let request = window.indexedDB.open("hotels")
        , db, tx, store, index, tx2, storewishlist, indexwishlist
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
        tx2 = db.transaction("hotelwishlist", "readwrite");
        storewishlist = tx2.objectStore("hotelwishlist");
        indexwishlist = storewishlist.index("title");



        db.onerror = (e) => {
            console.log('error is comming' + e.target.errorCode);
        }


        let items = storewishlist.getAll();


        items.onsuccess = () => {
            let s1 = items.result.length;


            for (let i = 0; i < s1; i++) {
                if (items.result[i].mail == localStorage.getItem("mail")) {
                    var html = `
            <div class="${"bin"+i} bin"><i class="fa fa-trash-o"></i></div>
                <div class="hotellist-image">
                <img src="${items.result[i].images}"/>
            </div>
            <div class="hotellist-detail-container">
                <div class="hotellist-detail-box">
                    <div class="hotellist-name">
                        <b>${items.result[i].title}</b>
                        <span>
                            <span class="fa fa-star checked"></span>
                            <span class="fa fa-star checked"></span>
                            <span class="fa fa-star checked"></span>
                            <span class="fa fa-star"></span>
                            <span class="fa fa-star"></span>
                        </span>
                    </div>
                    <div class="hotellist-location">
                    ${items.result[i].city}
                    </div>
                </div>
                <div class="hotellist-checkroom-box">
                    <div class="hotellist-info-container">
                        <div class="hotellist-include-icon">
                        <span class="fa fa-wifi"></span>
                        <span><i class="material-icons">restaurant</i></span>
                        <span><i class="material-icons">local_parking</i></span>
                        </div>
                        <ul>
                        ${items.result[i].services.map((item) => {
                        return (
                            `<li>
    ${item}
    </li>`
                        )
                    }).join('')}
                            
                        </ul>
                    </div>
                    <div class="hotellist-price">
                        <div class="hotellist-price-off">
                        ${items.result[i].price}
                        </div>
                        <div class="hotellist-offer">
                            <span>
                            ${items.result[i].originalprice}
                            </span>
                            <span>
                            ${100 - Math.floor(parseInt(items.result[i].price) * 100 / parseInt(items.result[i].originalprice))}
                            %off
                            </span>
                        </div>
                        
                        <button class=${"detailsis"+i}>Check In</button>
                    </div>
                </div>
            </div>
        `;

                    var wrapper = document.createElement('div');
                    wrapper.innerHTML = html;
                    wrapper.setAttribute('class', 'hotellist-box')

                    document.getElementById('hotellist-container').appendChild(wrapper);
                    document.getElementsByClassName("bin"+i)[0].onclick = () => {
                        del(items.result[i].uid);
                        window.location.reload();
                    }
                    document.getElementsByClassName("detailsis"+i)[0].onclick = () => {
                        add2(items.result[i]);
                        window.location="../details/detail.html";
                    }

                }
            }


        }

    }
}
var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB,
    IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction,
    baseName = "hotels",
    storeName = "hotelwishlist";

function logerr(err) {
    console.log(err);
}
function del(id, info) {
    info = typeof info !== 'undefined' ? false : true;
    connectDB(function (db) {
        var transaction = db.transaction(["hotelwishlist"], "readwrite");
        var objectStore = transaction.objectStore("hotelwishlist");
        var objectStoreRequest = objectStore.delete(id);
        objectStoreRequest.onerror = logerr;
        objectStoreRequest.onsuccess = function () {
            if (info)
                console.log("Rows has been deleted: ", id);
        }
    });
}
function connectDB(f) {
    var request = indexedDB.open("hotels", 1);
    request.onerror = logerr;
    request.onsuccess = function () {
        f(request.result);
    }
    request.onupgradeneeded = function (e) {
        var Db = e.currentTarget.result;



        //Create store
        if (!Db.objectStoreNames.contains(storeName)) {
            var store = Db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
        }
        connectDB(f);
    }
}

document.getElementById('search-btn').onclick = () => {
    let val = document.getElementById('search').value;
    localStorage.setItem("search", val);
    window.location = '../hotelslist/hotellist.html'

}
function connectDB2(f) {
    var request = indexedDB.open("hotels", 1);
    request.onerror = logerr;
    request.onsuccess = function () {
        f(request.result);
    }
    request.onupgradeneeded = function (e) {
        var Db = e.currentTarget.result;



        //Create store
        if (!Db.objectStoreNames.contains("details")) {
            var store = Db.createObjectStore("details", { keyPath: "id", autoIncrement: true });
        }
        connectDB2(f);
    }
}
function add2(obj, info) {
    info = typeof info !== 'undefined' ? false : true;
    connectDB2(function (db) {
        var transaction = db.transaction(["details"], "readwrite");
        var objectStore = transaction.objectStore("details");
        objectStore.clear();
        var objectStoreRequest = objectStore.add(obj);
        objectStoreRequest.onerror = logerr;
        objectStoreRequest.onsuccess = function () {
            if (info) { console.log("Rows has been added"); }
            else { console.log("Rows has been updated"); }
            console.info(objectStoreRequest.result);
        }
    });
}