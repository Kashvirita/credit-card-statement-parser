document.addEventListener('DOMContentLoaded', () => {
    const uploadInput = document.getElementById('pdf-upload');
    const uploadLabel = document.querySelector('.upload-label');
    const resultsContainer = document.getElementById('results');
    const spinner = document.getElementById('spinner');

    // Function to display results on the page
    const displayResults = (data) => {
        resultsContainer.innerHTML = ''; // Clear previous results
        if (!data || Object.keys(data).length === 0) return;

        // Create a card for each data point
        for (const [key, value] of Object.entries(data)) {
            if (value) { // Only display if there's a value
                const card = document.createElement('div');
                card.className = 'result-card';
                
                // Format the key to be more readable (e.g., "card_holder_name" -> "Card Holder Name")
                const formattedKey = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

                card.innerHTML = `
                    <div class="key">${formattedKey}</div>
                    <div class="value">${value}</div>
                `;
                resultsContainer.appendChild(card);
            }
        }
    };

    // Check Local Storage on page load for previous results
    const savedData = localStorage.getItem('parsedStatementData');
    if (savedData) {
        displayResults(JSON.parse(savedData));
    }

    // Handle the file upload
    uploadInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Prepare for API call
        resultsContainer.innerHTML = '';
        spinner.style.display = 'block';
        const formData = new FormData();
        formData.append('statement', file);

        try {
            const response = await fetch('/parse', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Something went wrong');
            }
            
            // Display results and save to Local Storage
            displayResults(data);
            localStorage.setItem('parsedStatementData', JSON.stringify(data));

        } catch (error) {
            resultsContainer.innerHTML = `<p style="color: red; text-align: center;">Error: ${error.message}</p>`;
        } finally {
            spinner.style.display = 'none';
        }
    });
});