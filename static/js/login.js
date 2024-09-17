const form = document.getElementById('loginForm');


form.addEventListener('submit', async function (event) {
    event.preventDefault();

    // Get form data
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Send data via POST request
    try {
        const response = await fetch(`${API_PATH.login}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({email, password})
        });

        // Check if request was successful
        if (response.ok) {
            const data = await response.json();

            // Store the returned data in localStorage
            localStorage.setItem('userData', JSON.stringify(data));
            setCookie("userData", JSON.stringify(data), 3)
            window.location.href = FRONT_PATH.map
        } else {
            const errorData = await response.json()
            console.log(errorData)
            handleError(errorData)
        }
    } catch (error) {
        console.error('Error:', error);
    }
});