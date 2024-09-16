document.getElementById('registerForm').addEventListener('submit', async function (event) {
    event.preventDefault();
    const formElement = document.querySelector("registerForm");

    const form = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        first_name: document.getElementById('first_name').value,
        last_name: document.getElementById('last_name').value
    };

    const formData = new FormData(form)

    try {
        console.log(formData)
        const response = await fetch(`${BASE_URL}${API_PATH.user_me}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });

        if (response.ok) {
            const data = await response.json();
            window.location.href = API_PATH.login
        } else {
            alert('Registration failed');
        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
});