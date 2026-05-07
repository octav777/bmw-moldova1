let search = document.querySelector('.search-box');

document.querySelector('#search-icon').onclick = () => { 
    search.classList.toggle('active');
    menu.classList.remove('active');
}

let menu = document.querySelector('.navbar');

document.querySelector('#menu-icon').onclick = () => { 
    menu.classList.toggle('active');
    search.classList.remove('active');
}
//Hide menu and search box on scroll
window.onscroll = () =>{
  menu.classList.remove('active');
    search.classList.remove('active');
}
document.addEventListener("DOMContentLoaded", function() {
    const carForm = document.getElementById("carForm");
    const carsContainer = document.getElementById("carListings");
    const modal = document.getElementById("modal");
    const modalContent = document.querySelector(".modal-content");
    const modalImage = document.getElementById("modal-image");
    const modalTitle = document.getElementById("modal-title");
    const modalDescription = document.getElementById("modal-description");
    const modalPrice = document.getElementById("modal-price");
    const modalYear = document.getElementById("modal-year");
    const closeModal = document.querySelector(".close");

    carForm.addEventListener("submit", function(event) {
        event.preventDefault();

        const year = document.getElementById("year").value;
        const series = document.getElementById("series").value;
        const description = document.getElementById("description").value;
        const image = document.getElementById("photo").files[0];

        const carItem = document.createElement("div");
        carItem.classList.add('box');
        carItem.innerHTML = `
            <a href="#">
                <img src="${URL.createObjectURL(image)}" alt="">
                <h2>${series} ${year}</h2>
                <p class="description">${description}</p>
                <p class="year">${year}</p>
                <p class="price">$0</p>
            </a>
        `;

        carsContainer.appendChild(carItem);

        carForm.reset();
    });

    carsContainer.addEventListener("click", function(event) {
        if (event.target.tagName === "IMG") {
            const carItem = event.target.closest(".box");
            const imageSrc = carItem.querySelector("img").src;
            const title = carItem.querySelector("h2").textContent;
            const description = carItem.querySelector(".description").textContent;
            const price = carItem.querySelector(".price").textContent;
            const year = carItem.querySelector(".year").textContent;

            modalImage.src = imageSrc;
            modalTitle.textContent = title;
            modalDescription.textContent = description;
            modalPrice.textContent = price;
            modalYear.textContent = year;

            modal.style.display = "block";
        }
    });

    closeModal.addEventListener("click", function() {
        modal.style.display = "none";
    });

    window.addEventListener("click", function(event) {
        if (event.target === modal) {
            modal.style.display = "none";
        }
    });
});
document.addEventListener('DOMContentLoaded', function () {
    const searchInput = document.getElementById('search-input');
    const partsContainer = document.querySelector('.parts-container');
    const boxes = partsContainer.querySelectorAll('.box');

    searchInput.addEventListener('input', function () {
        const searchTerm = searchInput.value.trim().toLowerCase();

        boxes.forEach((box) => {
            const title = box.querySelector('h3').textContent.toLowerCase();
            const isVisible = title.includes(searchTerm);
            box.style.display = isVisible ? 'block' : 'none';
        });
    });
});
