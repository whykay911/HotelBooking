window.onload = () => {
    if(localStorage.getItem("login")=="true"){
        document.getElementById("logout").innerHTML="Log out"
    }
    else{
        document.getElementById("logout").innerHTML="Login"

    }
    let request = window.indexedDB.open("hotels")
        , db, tx3, storemanage, indexmanage, tx2, storewishlist, indexwishlist
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
        tx2 = db.transaction("manage", "readwrite");
        storewishlist = tx2.objectStore("manage");
        indexwishlist = storewishlist.index("title");




        db.onerror = (e) => {
            console.log('error is comming' + e.target.errorCode);
        }


        let items = storewishlist.getAll();


        items.onsuccess = () => {
            tx3 = db.transaction("checkin", "readwrite");
            storemanage = tx3.objectStore("checkin");
            indexmanage = storemanage.index("id");
            let s1 = items.result.length;


            for (let i = 0; i < s1; i++) {
                let item2 = indexmanage.get(items.result[i].id);
                item2.onsuccess = () => {
                    if (items.result[i].mail == localStorage.getItem("mail")) {
                        var html = `
                <div class="manage-image">
                    <img src="${items.result[i].images}"/>
                </div>
                <div class="manage-detail-container">
                    <div class="manage-detail-box">
                        <div class="manage-name">
                            <b>${items.result[i].title}</b>
                            <span>
                                <span class="fa fa-star checked"></span>
                                <span class="fa fa-star checked"></span>
                                <span class="fa fa-star checked"></span>
                                <span class="fa fa-star"></span>
                                <span class="fa fa-star"></span>
                            </span>
                        </div>
                        <div class="manage-location">
                        ${items.result[i].city}

                        </div>
                    </div>
                    <div class="manage-checkroom-box">
                        <div class="manage-info-container">
                            <div class="manage-include-icon">
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
                        <div class="manage-price">
                            <div class="manage-price-off">
                            ${items.result[i].price}

                            </div>
                            <div class="manage-offer">
                                <span>
                                ${items.result[i].originalprice}

                                </span>
                                <span>
                                ${100 - Math.floor(parseInt(items.result[i].price) * 100 / parseInt(items.result[i].originalprice))}
                                %off
                                </span>
                            </div>
                            <div class="manage-date">
                                <span>From:${item2.result.from}</span>
                                <span>To:${item2.result.to

                            }</span>
                            </div>
                            
                            <button class="bin2" id="bin">Cancel Booking</button>
                        </div>
                    </div>
                </div>
        `;

                        var wrapper = document.createElement('div');
                        wrapper.innerHTML = html;
                        wrapper.setAttribute('class', 'manage-box')

                        document.getElementById('manage-container').appendChild(wrapper);
                        document.getElementsByClassName("bin2")[i].onclick = () => {
                            del(items.result[i].uid);
                            window.location.reload();
                        }
                    }
                }

            }

        }

    }
}
var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB,
    IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction,
    baseName = "hotels",
    storeName = "manage";

function logerr(err) {
    console.log(err);
}
function del(id, info) {
    info = typeof info !== 'undefined' ? false : true;
    connectDB(function (db) {
        var transaction = db.transaction(["manage"], "readwrite");
        var objectStore = transaction.objectStore("manage");
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