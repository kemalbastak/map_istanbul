document.getElementById('registerForm').addEventListener('submit', async function (event) {
    event.preventDefault();

    const formData = {
        username: document.getElementById('username').value,
        email: document.getElementById('email').value,
        password: document.getElementById('password').value,
        first_name: document.getElementById('first_name').value,
        last_name: document.getElementById('last_name').value
    };

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
            window.location.href = FRONT_PATH.login
        } else {

            const errorData = await response.json();
            handleError(errorData)

        }
    } catch (error) {
        alert('Error: ' + error.message);
    }
});