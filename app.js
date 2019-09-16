async function getUserInfo() {
    const button = document.getElementById('search-button');
    const resultContainer = document.getElementById('result-container');
    button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>  Searching...';
    let query = document.getElementById('user_id').value;
    let messageResult = '';
    let messageForecast = '';
    const result = document.getElementById('result');
    const forecast = document.getElementById('limit');
    if (query) {
        await fetch('./api/user_info', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'query': query })
        })
            .then(res => res.json())
            .then(content => {
                resultContainer.classList.remove('hidden');
                console.log('content', content);
                if (content[0]) {
                    messageResult = `
                                <li>User ID: ${query}</li>
                                <li>Category: ${content[0].cust_catag}</li>
                                <li>Bank interest: ${content[0].interest}%</li>
                                <li>Risk: ${content[0].risk}%</li>
                                <li>Salary range: ${content[0].salary.min}$ - ${content[0].salary.max}$</li>
                                `
                    messageForecast = `
                                <li>Credit Limit: ${content[0].credit_limit}$</li>
                                <p>Whit this Credit you can buy...</p>
                                <figure>
                                <img src="${content[0].image.src}" alt="${content[0].image.alt}"></img>
                                <figcaption>${content[0].image.alt}</figcaption>
                                </figure>
                                `
                } else if ('error' in content) {
                    messageForecast = '';
                    messageResult = `<li>${content.error}</li>`
                }
                else {
                    messageForecast = '';
                    messageResult = `
                                <li>Sorry, no user found in the Database</li>
                                `
                }
            }
            )
            .catch(err => console.log('ERROR', err));



    } else {
        resultContainer.classList.add('hidden');
    }
    result.innerHTML = messageResult;
    forecast.innerHTML = messageForecast;
    button.innerHTML = 'Search';
}