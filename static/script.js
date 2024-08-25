document.addEventListener('DOMContentLoaded', () => {
    const predictBtn = document.getElementById('predictBtn');
    const predictionDiv = document.getElementById('prediction');
    const messageInput = document.getElementById('message');

    predictBtn.addEventListener('click', async () => {
        const message = messageInput.value.trim();

        if (message === '') {
            alert('Please enter a message.');
            return;
        }

        // Disable the predict button while waiting for response
        predictBtn.disabled = true;

        // Display loading spinner
        predictionDiv.innerHTML = '<div class="spinner-border text-primary" role="status"><span class="visually-hidden">Loading...</span></div>';

        try {
            const response = await fetch('/predict', {
                method: 'POST',
                body: new URLSearchParams({ message }),
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                }
            });

            const data = await response.json();

            // Hide loading spinner
            predictionDiv.innerHTML = '';

            // Show prediction result with color based on prediction
            if (data.prediction === 'Spam') {
                predictionDiv.textContent = `Prediction: ${data.prediction}`;
                predictionDiv.style.color = 'red';
            } else {
                predictionDiv.textContent = `Prediction: ${data.prediction}`;
                predictionDiv.style.color = 'green';
            }

            predictionDiv.style.display = 'block';
        } catch (error) {
            console.error('Error:', error);
            predictionDiv.textContent = 'An error occurred. Please try again later.';
        } finally {
            // Enable the predict button
            predictBtn.disabled = false;
        }
    });
});
