// Show spinner function
function showSpinner() {
    document.getElementById('spinner').style.display = 'flex';
    document.getElementById('cards-container').style.display = 'none';
  }
  
  // Hide spinner function
  function hideSpinner() {
    document.getElementById('spinner').style.display = 'none';
    document.getElementById('cards-container').style.display = 'flex';
  }
  
  // load btns
  const loadButtons = () => {
    fetch('https://openapi.programming-hero.com/api/peddy/categories')
      .then(res => res.json())
      .then(data => displayButtons(data.categories))
      .catch(error => console.log(error));
  }
  
  const displayButtons = (categories) => {
    const buttonDiv = document.getElementById('btn-container')
    categories.forEach((item) => {
      //create button
      const button = document.createElement('button')
      button.classList = "pet-Btn flex gap-2 text-black font-bold text-xl border-2 border-[#0E7A81] rounded-xl py-2 px-10 md:px-20 bg-none"
      const img = document.createElement('img');
      img.src = item.category_icon;
      img.classList = "w-6 h-6";
      // text
      button.innerText = `${item.category}s`
      button.onclick = () => {
        const petType = item.category;
        btnColorChange(button);
        loadSingleCard(petType);
      }
      button.append(img)
      buttonDiv.append(button)
    })
  }
  
  // btn color actv
  function btnColorChange(button){
    const buttons = document.querySelectorAll('.pet-Btn');
    buttons.forEach(btn => btn.classList.remove('bg-[#0E7A8133]'));
    button.classList.add('bg-[#0E7A8133]');
  }
  // btn clr off when sort btn click
  
  function buttonClrOff(){
    const buttons = document.querySelectorAll('.pet-Btn');
    buttons.forEach(btn => btn.classList.remove('bg-[#0E7A8133]'));
  }
  
  // load single cards:
  const loadSingleCard = (petType) => {
    showSpinner();
    setTimeout(() => {
      const url = `https://openapi.programming-hero.com/api/peddy/category/${petType}`
      fetch(url)
        .then(res => res.json())
        .then(type => {
          const cardDiv = document.getElementById('card-div');
          cardDiv.innerHTML = '';
          
          displayAllCards(type.data ? type.data : 0);
          hideSpinner();
        })
        .catch(error => {
          console.log(error);
          hideSpinner();
        });
    }, 2000);
  }
  
  // load all cards
  const loadAllCards = () => {
    showSpinner();
    setTimeout(() => {
      fetch('https://openapi.programming-hero.com/api/peddy/pets')
        .then(res => res.json())
        .then(data => {
          displayAllCards(data.pets);
          hideSpinner();
        })
        .catch(error => {
          console.log(error);
          hideSpinner();
        });
    }, 2000);
  }
  
  // Call loadAllCards when the page loads
  window.onload = loadAllCards;
  
  // details
  const showDetails = async (petId) =>{
    const uri = `https://openapi.programming-hero.com/api/peddy/pet/${petId}`
    const res = await fetch(uri)
    const data = await res.json();
    displayDetails(data.petData);
  }
  
  // all card dis
  const displayAllCards = (pets) => {
    const cardDiv = document.getElementById('card-div');
    cardDiv.innerHTML = ''
    if(pets == 0){
      cardDiv.classList.remove('grid', 'md:grid-cols-3', 'grid-cols-1', 'gap-4');
      const div = document.createElement('div');
      div.classList = "border-2 border-[#13131399] rounded-xl p-2 space-y-4 flex justify-center items-center";
      div.innerHTML = `
      <div class="flex flex-col gap-4 items-center text-center w-4/5 mx-auto py-10">
        <img src="./images/error.webp" class="rounded-xl"/>
        <h1 class="font-bold text-2xl md:text-3xl">No Information Available</h1>
        <p class="text-[#131313B3]">It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a.</p>
      </div>
      `
      cardDiv.appendChild(div);
    }else{
      pets.forEach((item) => {
        // create card
        cardDiv.classList.add('grid', 'md:grid-cols-3', 'grid-cols-1', 'gap-4');
        const div = document.createElement('div');
        div.classList = "border-2 border-[#13131399] rounded-xl p-2 space-y-4";
        div.innerHTML = `
          <div>
            <img src="${item.image}" class="rounded-xl w-full"/>
          </div>
          <div class="flex flex-col gap-2">
            <div><h1 class="text-black text-2xl font-extrabold">${item.pet_name ? item.pet_name : 'Not Available'}</h1></div>
            <div class="flex gap-2 items-center">
              <i class="fa-solid fa-shield-dog"></i>
              <p class="text-[#13131399]">Breed: ${item.breed ? item.breed : 'Not Available'}</p>
            </div>
            <div class="flex gap-2 items-center">
              <i class="fa-solid fa-calendar-days"></i>
              <p class="text-[#13131399]">Birth: ${item.date_of_birth ? item.date_of_birth : 'Not Available'}</p>
            </div>
            <div class="flex gap-2 items-center">
              <i class="fa-solid fa-venus-mars"></i>
              <p class="text-[#13131399]">Gender: ${item.gender ? item.gender : 'Not Available'}</p>
            </div>
            <div class="flex gap-2 items-center">
              <i class="fa-solid fa-hand-holding-dollar"></i>
              <p class="text-[#13131399]">Price: ${item.price ? item.price + '$' : 'Not available'}</p>
            </div>
            <hr>
            <div class="flex justify-between font-bold text-[#0E7A81]">
              <button  onclick="liked('${item.image}')" class="border border-[#0E7A81] rounded-xl px-2"><i class="fa-regular fa-thumbs-up"></i></button>
              <button id="adopt-btn-${item.petId}" onclick="adopt('adopt-btn-${item.petId}')" class="px-2 border border-[#0E7A81] rounded-xl">Adopt</button>
              <button onclick="showDetails(${item.petId})" class=" px-2 border border-[#0E7A81] rounded-xl">Details</button>
            </div>
          </div>
        `
        cardDiv.appendChild(div);
      });
    }
  };
  // details show btn:
  
  function displayDetails(item){
   
    const infoModal = document.getElementById('modal-infos')
    infoModal.innerHTML = ''
    const div = document.createElement('div')
    div.classList="space-y-2"
    div.innerHTML=`
      <!-- image -->
      <div>
        <img src="${item.image}" class="rounded-xl w-[100%] h-[100%]">
      </div>
      <!-- name -->
      <div><h1 class="text-black text-2xl font-extrabold">${item.pet_name ? item.pet_name : 'Not Available'}</h1>
      </div>
      <!-- l/r info -->
      <div class="flex justify-between">
        <!-- left info -->
        <div>
          <div class="flex gap-2 items-center">
            <i class="fa-solid fa-shield-dog"></i>
            <p class="text-[#13131399]">Breed: ${item.breed ? item.breed : 'Not Available'}</p>
          </div>
          <div class="flex gap-2 items-center">
            <i class="fa-solid fa-venus-mars"></i>
            <p class="text-[#13131399]">Gender: ${item.gender ? item.gender : 'Not Available'}</p>
          </div>
          <div class="flex gap-2 items-center">
            <i class="fa-solid fa-syringe"></i>
            <p class="text-[#13131399]">Vaccinated status : ${item.vaccinated_status ? item.vaccinated_status : 'Not Available'}</p>
          </div>
        </div>
        <!-- right info -->
        <div>
          <div class="flex gap-2 items-center">
            <i class="fa-solid fa-calendar-days"></i>
            <p class="text-[#13131399]">Birth: ${item.date_of_birth ? item.date_of_birth : 'Not Available'}</p>
          </div>
          <div class="flex gap-2 items-center">
            <i class="fa-solid fa-hand-holding-dollar"></i>
            <p class="text-[#13131399]">Price: ${item.price ? item.price + '$' : 'Not available'}</p>
          </div>
        </div>
      </div>
      <hr>
      <!-- desc -->
       <div>
        <h1 class="text-black text-xl font-extrabold">Deatails Information</h1>
       </div>
       <div><h1 class="text-[#13131399]">${item.pet_details ? item.pet_details : 'Not Available'}</h1>
       </div>
    `
    infoModal.append(div)
    document.getElementById('my_modal_2').showModal()
    
  }
  
  // adopt btn :
  
  function adopt(id) {
    const modal = document.getElementById('my_modal_1')
    const modalDiv = document.getElementById('adopt-modal-div')
    const h1 = document.createElement('h1')
    h1.classList="text-black font-bold text-3xl"
    let countdown = 3
    h1.innerText = countdown
    modalDiv.append(h1)
    
    modal.showModal()
  
    const clock = setInterval(() => {
      countdown--
      h1.innerText = countdown
      if (countdown === 0) {
        clearInterval(clock)
        modal.close()
        const adoptBtn = document.getElementById(id)
        adoptBtn.innerText = "Adopted"
        adoptBtn.classList.remove('border', 'border-[#0E7A81]')
        adoptBtn.classList.add('disabled', 'text-white', 'bg-[#dfdedee3]')
        adoptBtn.disabled = true
        h1.innerText= ""
      }
    }, 1000)
    
  }
  
  // liked tbn clicked
  
  function liked(image){
    const likedDiv = document.getElementById('liked-div')
    const div = document.createElement('div')
    div.innerHTML=`
    <div>
      <img src= "${image}" class="rounded-xl"/>
    </div>
    `
    likedDiv.append(div)
  }
  
  const sortPrice = document.getElementById('sort-price');
  sortPrice.addEventListener('click', function() {
    startSorting();
    buttonClrOff();
  });
  
  const startSorting = () => {
    showSpinner();
    setTimeout(() => {
         fetch('https://openapi.programming-hero.com/api/peddy/pets')
        .then(res => res.json())
        .then(data => {
            const sortedPets = data.pets.sort((a,b) => b.price - a.price);
            displayAllCards(sortedPets);
            hideSpinner();
        })
        .catch(error => {
            console.log(error);
            hideSpinner();
        });
    }, 2000);
  }
  
  loadButtons();