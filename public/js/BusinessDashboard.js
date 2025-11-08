// Function to handle the 'Add Product' button click
function addProduct() {
    alert("Product added successfully!");
    // Add any additional logic here (e.g., increment product count)
}

// Function to save the business
function saveBusiness() {
    const categories = document.querySelectorAll('.category-select');
    const sizes = document.querySelectorAll('[id^="sizes-available"]');
    
    const products = Array.from(categories).map((category, index) => ({
        category: category.value,
        size: sizes[index].value,
    }));
    
    console.log("Saving business with products:", products);

    // Add additional logic to save the data to your database or backend
    alert("Business and products saved successfully!");
}
