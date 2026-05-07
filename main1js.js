document.addEventListener("DOMContentLoaded", function () {
    const carForm = document.getElementById("carForm");
    const submitBtn = document.getElementById("submitBtn");
    const selectedPhoto = document.getElementById("selectedPhoto");

    submitBtn.addEventListener("click", function () {
        const series = document.getElementById("series").value;
        const year = document.getElementById("year").value;
        const photo = document.getElementById("photo").files[0];

        if (series && year && photo) {
            const formData = new FormData();
            formData.append("series", series);
            formData.append("year", year);
            formData.append("photo", photo);

            // Simulate form submission and reset fields
            console.log("Car Series:", series);
            console.log("Car Year:", year);
            console.log("Car Photo:", photo.name);

            // Display the selected photo below the form
            selectedPhoto.style.display = "block";
            selectedPhoto.src = URL.createObjectURL(photo);

            // Clear the form fields
            document.getElementById("series").value = "";
            document.getElementById("year").value = "";
            document.getElementById("photo").value = "";
        } else {
            alert("Please fill in all the fields.");
        }
    });
});
