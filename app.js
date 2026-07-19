const API_URL = "https://script.google.com/macros/s/AKfycbwHNdTlDchoC6JMk-_-4kFQBZ2ir7sgksbBJV79KHCDI1VvIVLw_Y_6UMHTQBy6ys146A/exec";


const input = document.getElementById("guestName");
const form = document.getElementById("guestSearch");

let selectedGuest = "";



// =============================
// AUTOCOMPLETE SEARCH
// =============================

input.addEventListener("input", async () => {


    const search = input.value.trim().toLowerCase();



    selectedGuest = "";



    if(search.length < 3){


        const oldList = document.querySelector(".suggestions");


        if(oldList){

            oldList.remove();

        }


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

function showSuggestions(results){



    let oldList = document.querySelector(".suggestions");



    if(oldList){

        oldList.remove();

    }





    if(results.length === 0){

        return;

    }




    const list = document.createElement("div");


    list.className = "suggestions";





    results.slice(0,5).forEach(person => {



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
// FIND TABLE (FORM SUBMIT)
// =============================

form.addEventListener("submit", async (event) => {


    event.preventDefault();



    // If guest clicked dropdown, use that name

    // Otherwise use typed name

    if(!selectedGuest){


        selectedGuest = input.value.trim();


    }





    if(!selectedGuest){


        alert("Please enter your name");


        return;


    }




    // Remove dropdown if still visible

    const suggestionBox = document.querySelector(".suggestions");


    if(suggestionBox){

        suggestionBox.remove();

    }






    const response = await fetch(

        API_URL,

        {

            method:"POST",

            body:JSON.stringify({

                name:selectedGuest

            })

        }

    );




    const data = await response.json();






    if(data.found){



        const result = document.querySelector(".result");



        result.classList.remove("hidden");



        result.style.animation = "none";



        setTimeout(() => {


            result.style.animation = "";


        },10);







        // Guests at the same table

        const sameTable = data.party.filter(person =>


            person.name !== data.guest &&


            String(person.table) === String(data.table)


        );








        // Family/friends in same group but different tables

        const otherTables = data.party.filter(person =>


            person.name !== data.guest &&


            String(person.table) !== String(data.table)


        );









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








        ${
            sameTable.length > 0

            ?

            `


            <div class="party-title">

                SEATED WITH

            </div>





            <div class="party">

                ${sameTable

                    .map(person => person.name)

                    .join("<br>")

                }

            </div>



            `

            :

            ""

        }










        ${
            otherTables.length > 0

            ?

            `


            <div class="party-title family-title">

                FAMILY & FRIENDS

            </div>




            <div class="family-subtitle">

                Other tables

            </div>





            <div class="party">


                ${otherTables

                    .map(person =>

                        `${person.name} — Table ${person.table}`

                    )

                    .join("<br>")

                }


            </div>



            `

            :

            ""

        }








        <p class="closing">

            Enjoy the evening

        </p>






        `;



    }


});
