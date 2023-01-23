window.onload = () => {
    if (localStorage.getItem("login") == "true") {
        document.getElementById("logout").innerHTML = "Log out"
    }
    else {
        document.getElementById("logout").innerHTML = "Login"

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
        tx = db.transaction("details", "readwrite");
        store = tx.objectStore("details");
        index = store.index("title");



        db.onerror = (e) => {
            console.log('error is comming' + e.target.errorCode);
        }


        let items = store.getAll();


        items.onsuccess = () => {

            var html = `
                <div class="detail-info">
                <div class="detail-name">
                    <div class="detail-name-head">
                        <span>${items.result[0].title}</span>
                        <span>
                            <span class="fa fa-star checked"></span>
                            <span class="fa fa-star checked"></span>
                            <span class="fa fa-star checked"></span>
                            <span class="fa fa-star"></span>
                            <span class="fa fa-star"></span>
                        </span>
                    </div>
                    <div class="detail-location">${items.result[0].city}</div>
    
                </div>
                <div class="detail-price">
                    <span>${items.result[0].originalprice}</span>
                    <span>${items.result[0].price}</span>
                    <span>
                        <button class="checkin">Book Hotel</button>
                    </span>
                    <span>
                        <button class="wishlists-detail">Add to wishlist</button>
                    </span>
                </div>
            </div>
            <div class="detail-image">
                <div>
                    <img src="../image/hotel2.jpg" />
                </div>
                <div>
                    <img src="../image/hotel2.jpg" />
                </div>
                <div>
                    <img src="../image/hotel2.jpg" />
                </div>
                <div>
                    <img src="../image/hotel2.jpg" />
                </div>
                <div>
                    <img src="../image/hotel2.jpg" />
                </div>
                <div>
                    <img src="../image/hotel2.jpg" />
                </div>
            </div>
            <div class="detail-description-box">
                <div class="detail-description">
                    <div class="detail-includes">
                        <div class="detail-include-heading">
                            Include for free
                        </div>
                        <div class="detail-include-list">
                            <div >
                                <span><i class="fa fa-wifi"></i></span>
                                <span>Free Internet</span>
                            </div>
                            <div>
                                <span><i class="material-icons">restaurant</i></span>
                                <span>Free Breakfast</span>
                            </div>
                            <div>
                                <span><i class="material-icons">local_parking</i></span>
                                <span>Free Parking</span>
                            </div>
                        </div>
                    </div>
                    <div class="detail-amenities">
                        <div class="detail-amenities-heading">
                            Services You want to take
                        </div>
                        <ul>
                            <li>
<input type="checkbox" id="check1" class="services-details" value="gym" name="gym"/>
<label for="check1">Gym</label>

                            </li>
                            <li>
<input type="checkbox" id="check2" class="services-details" value="spa" name="spa"/>
<label for="check2">Spa</label>

                            </li>
                            <li>
<input type="checkbox" id="check3" class="services-details" value="car rental" name="carrental"/>
<label for="check3">Car rental</label>

                            </li>
                            <li>
                            

<input type="checkbox" id="check4" class="services-details" value="guided tour service" name="guidedtourservice"/>
<label for="check4">Guided tour service</label>

                            </li>
                            <li>
<input type="checkbox" id="check5" class="services-details" value="using a luggage locker" name="luggagelocker"/>
<label for="check5">Using a luggage locker</label>

                            </li>
                        </ul>
                        
                    </div>
                    <div class="detail-desc">
                        <div class="detail-desc-heading">
                            Description
                        </div>
                        <div >
                        ${items.result[0].description}
                        </div>
                    </div>
                </div>
            </div>
        `;

            var wrapper = document.createElement('div');
            wrapper.innerHTML = html;
            wrapper.setAttribute('class', 'detail-container')

            document.getElementById('detail-container').appendChild(wrapper);




            document.getElementsByClassName("wishlists-detail")[0].onclick = () => {
                let arr = [];
                let obj = items.result[0];
                for (let j = 0; j < 5; j++) {
                    if (document.getElementsByClassName("services-details")[j].checked == true) {
                        arr.push(document.getElementsByClassName("services-details")[j].value);

                    }
                }

                db = request.result;
                tx2 = db.transaction("hotelwishlist", "readwrite");
                storewishlist = tx2.objectStore("hotelwishlist");
                indexwishlist = storewishlist.index("title");
                let itemsstore = storewishlist.getAll();
                itemsstore.onsuccess = () => {

                    for (let x = 0; x < itemsstore.result.length; x++) {
                        if (itemsstore.result[x].mail == localStorage.getItem("mail") && itemsstore.result[x].title == items.result[0].title) {
                            alert("Hotel already adden")
                            return;
                        }

                    }
                    obj.mail = localStorage.getItem("mail");
                    obj.services = arr;


                    up(obj);
                    add2(obj);
                    alert("Hotel added to wishlist");
                }


            }
            document.getElementsByClassName("checkin")[0].onclick = () => {
                let arr = [];
                let obj = items.result[0];
                for (let j = 0; j < 5; j++) {
                    if (document.getElementsByClassName("services-details")[j].checked == true) {
                        arr.push(document.getElementsByClassName("services-details")[j].value);

                    }
                }

                obj.services = arr;

                up(obj);
                window.location = '../checkin/checkin.html';

            }


        }

    }
}



var indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB || window.shimIndexedDB,
    IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction,
    baseName = "hotels",
    storeName = "details";

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
            var store = Db.createObjectStore(storeName, { keyPath: "id", autoIncrement: true });
        }
        connectDB(f);
    }
}

function get(id, f) {
    connectDB(function (db) {
        var transaction = db.transaction([storeName], "readonly").objectStore(storeName).get(id);
        transaction.onerror = logerr;
        transaction.onsuccess = function () {
            f(transaction.result ? transaction.result : -1);
        }
    });
}


function up(obj) {
    del(obj.id, 'up');
    add(obj, 'up');
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
        }
    });
}

function del(id, info) {
    info = typeof info !== 'undefined' ? false : true;
    connectDB(function (db) {
        var transaction = db.transaction([storeName], "readwrite");
        var objectStore = transaction.objectStore(storeName);
        var objectStoreRequest = objectStore.delete(id);
        objectStoreRequest.onerror = logerr;
        objectStoreRequest.onsuccess = function () {
            if (info)
                console.log("Rows has been deleted: ", id);
        }
    });
}

function add2(obj, info) {
    info = typeof info !== 'undefined' ? false : true;
    connectDB(function (db) {
        var transaction = db.transaction(["hotelwishlist"], "readwrite");
        var objectStore = transaction.objectStore("hotelwishlist");
        var objectStoreRequest = objectStore.add(obj);
        objectStoreRequest.onerror = logerr;
        objectStoreRequest.onsuccess = function () {
            if (info) { console.log("Rows has been added"); }
            else { console.log("Rows has been updated"); }
            console.info(objectStoreRequest.result);
        }
    });
}
document.getElementById('search-btn').onclick = () => {
    let val = document.getElementById('search').value;
    localStorage.setItem("search", val);
    window.location = '../hotelslist/hotellist.html'


}