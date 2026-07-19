const API_URL = "https://script.google.com/macros/s/AKfycbwHNdTlDchoC6JMk-_-4kFQBZ2ir7sgksbBJV79KHCDI1VvIVLw_Y_6UMHTQBy6ys146A/exec";


const input = document.getElementById("guestName");
const button = document.querySelector("button");

let selectedGuest = "";


// =============================
// AUTOCOMPLETE SEARCH
// =============================

input.addEventListener("input", async () => {

    const search = input.value.trim();


    if (search.length < 2) {
        return;
    }


    const response = await fetch(
        `${API_URL}?search=${search}`
    );


    const results = await response.json();


    showSuggestions(results);

});




// =============================
// SHOW NAME OPTIONS
// =============================

function showSuggestions(results) {


    let oldList = document.querySelector(".suggestions");


    if (oldList) {
        oldList.remove();
    }



    if (results.length === 0) {
        return;
    }



    const list = document.createElement("div");

    list.className = "suggestions";



    results.forEach(person => {


        const item = document.createElement("div");


        item.innerText = person.name;



        item.addEventListener("click", () => {


            input.value = person.name;

            selectedGuest = person.name;

            list.remove();


        });



        list.appendChild(item);


    });



    input.parentElement.appendChild(list);


}





// =============================
// FIND TABLE
// =============================

button.addEventListener("click", async () => {


    if (!selectedGuest) {


        alert("Please select your name");


        return;

    }



    const response = await fetch(

        API_URL,

        {

            method: "POST",

            body: JSON.stringify({

                name: selectedGuest

            })

        }

    );



    const data = await response.json();




    if (data.found) {



        const result = document.querySelector(".result");



        // Show hidden results section

        result.classList.remove("hidden");



        // Reset animation

        result.style.animation = "none";


        setTimeout(() => {

            result.style.animation = "";

        }, 10);





        result.innerHTML = `


        <div class="guest-name">

        ${data.guest}

        </div>



        <div class="divider"></div>




        <div class="label">

        YOUR TABLE

        </div>




        <div class="number">

        ${data.table}

        </div>





        <div class="party-title">

        SEATED WITH

        </div>





        <div class="party">

        ${data.party

            .filter(name => name !== data.guest)

            .join("<br>")

        }

        </div>





        <p class="closing">

        Enjoy the evening

        </p>



        `;



    }


});
