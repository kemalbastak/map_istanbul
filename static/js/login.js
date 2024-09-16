const form = document.getElementById('loginForm');

function setCookie(name, value, days) {
    let expires = "";
    if (days) {
        const date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000)); // Set expiration
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}

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
            window.location.href = FRONT_PATH.map
        } else {
            alert('Login failed!');
        }
    } catch (error) {
        console.error('Error:', error);
    }
});