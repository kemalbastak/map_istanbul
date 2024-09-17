const toastMessage = (message) => {
    return `<div class="toast" role="alert" aria-live="assertive" aria-atomic="true">
  <div class="toast-header">
    <button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Close"></button>
  </div>
  <div class="toast-body">
    ${message}
  </div>
</div>`
};



const handleError = (errorData) => {

    const message = (errors) => errors.map(error => `<div class="alert alert-danger alert-dismissible fade show" role="alert">
                                                       <strong>${error}</strong>
                                                       <button type="button" class="close" data-bs-dismiss="alert" aria-label="Close">
                                                         <span aria-hidden="true">&times;</span>
                                                       </button>
                                                     </div>`).join(' ')

    for (const [field, errors] of Object.entries(errorData)) {
        const errorElement = document.getElementById(`${field}`);
        if (errorElement){
            errorElement.insertAdjacentHTML('afterend', message(errors))

        }
        else {
            document.getElementById('toast-elem').insertAdjacentHTML('afterbegin', toastMessage(errorElement))

        }
    }
}


function setCookie(name, value, minutes) {
    let expires = "";
    if (minutes) {
        const date = new Date();
        date.setTime(date.getTime() + (minutes * 60 * 60 * 5 * 1000)); // Set expiration
        expires = "; expires=" + date.toUTCString();
    }
    document.cookie = name + "=" + (value || "") + expires + "; path=/";
}


async function fetchData(url, options = {}) {
    const token = USER_ACCESS_KEY.access; // Assuming token is stored in localStorage

    const defaultHeaders = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`, // Adding the token to Authorization header
    };

    const fetchOptions = {
        ...options,
        headers: {
            ...defaultHeaders,
            ...options.headers, // Allow overriding headers
        },
    };

    try {
        const response = await fetch(url, fetchOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return await response.json(); // Assuming the response is JSON
    } catch (error) {
        console.error('Fetch error:', error);
        throw error;
    }
}

function debounce(callback, wait) {
  let timeout;
  return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(function () { callback.apply(this, args); }, wait);
  };
}