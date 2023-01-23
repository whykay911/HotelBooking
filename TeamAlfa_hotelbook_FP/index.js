window.onload = () => {
    if (localStorage.getItem("login") == "true") {
        document.getElementById("logout").innerHTML = "Log out"
    }
    else {
        document.getElementById("logout").innerHTML = "Login"

    }
    let val = {};
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
        tx = db.transaction("hotelsinfo", "readwrite");
        store = tx.objectStore("hotelsinfo");
        index = store.index("city");



        db.onerror = (e) => {
            console.log('error is comming' + e.target.errorCode);
        }


        let items = store.getAll();


        items.onsuccess = () => {
            let s1 = items.result.length;


            for (let i = 0; i < s1; i++) {
                var html = `
            <div class="hotel-cards-image-box">
                <img src="${items.result[i].images}"/>
                <div class="hotel-card-wishlist hotelwishlist" >
                    <i class="fa fa-heart"></i>
                </div>
            </div>
            <div class="hotel-cards-info">
                <h2>${items.result[i].title}</h2>
                <p class="hotel-place">${items.result[i].city}</p>
                <p class="hotel-rating">
                    <span>
                     <span class="fa fa-star checked"></span>
                    <span class="fa fa-star checked"></span>
                    <span class="fa fa-star checked"></span>
                    <span class="fa fa-star"></span>
                    <span class="fa fa-star"></span>
                </span>
                    <span class="hotel-price">${items.result[i].price} / night</span>
                </p>
               <a  class="view-details"> <button>View Details</button></a>
            </div>
        `;

                var wrapper = document.createElement('div');
                wrapper.innerHTML = html;
                wrapper.setAttribute('class', 'hotel-cards')

                document.getElementById('home-container').appendChild(wrapper);

                document.getElementsByClassName("hotelwishlist")[i].onclick = () => {
                    db = request.result;
                    tx2 = db.transaction("hotelwishlist", "readwrite");
                    storewishlist = tx2.objectStore("hotelwishlist");
                    indexwishlist = storewishlist.index("title");
                    let itemsstore = storewishlist.getAll();


                    itemsstore.onsuccess = () => {

                        for (let x = 0; x < itemsstore.result.length; x++) {
                            if(itemsstore.result[x].mail==localStorage.getItem("mail")&&itemsstore.result[x].title==items.result[i].title){
                               alert("Hotel already adden")
                                return;
                            }

                        }
                        val = items.result[i];
                        val.mail = localStorage.getItem("mail");
                        storewishlist.add(val);
                        console.log("click" + i);
                        alert("Hotel added to wishlist")
                    }
                }
                document.getElementsByClassName("view-details")[i].onclick = () => {
                    add(items.result[i]);
                    window.location = "./details/detail.html";
                }
            }




        }

    }
}
function add(obj, info) {
    info = typeof info !== 'undefined' ? false : true;
    connectDB(function (db) {
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


var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB,
    IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction,
    baseName = "hotels",
    storeName = "hotelwishlist";

function logerr(err) {
    console.log(err);
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
        if (!Db.objectStoreNames.contains("details")) {
            var store = Db.createObjectStore("details", { keyPath: "id" });
        }
        connectDB(f);
    }
}
document.getElementById('search-btn').onclick = () => {
    let val = document.getElementById('search').value;
    localStorage.setItem("search", val);
    window.location = './hotelslist/hotellist.html'

}
