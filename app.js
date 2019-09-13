async function getUserInfo() {
    const button = document.getElementById('search-button');
    button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>  Searching...';
    let query = document.getElementById('user_id').value;
    if (query) {
        const result = document.getElementById('result');
        const forecast = document.getElementById('limit');
        const rawResponse = await fetch('./api/user_info', {
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 'query': query })
        });
        const content = await rawResponse.json();
        console.log(content);

        if (content[0]) {
            result.innerHTML = `
                        <li>User ID: ${query}</li>
                        <li>Category: ${content[0].cust_catag}</li>
                        <li>Bank interest: ${content[0].interest}%</li>
                        <li>Risk: ${content[0].risk}%</li>
                        <li>Salary range: ${content[0].salary.min}$ - ${content[0].salary.max}$</li>
                        `
            forecast.innerHTML = `
                        <li>Credit Limit: ${content[0].credit_limit}$</li>
                        <p>Whit this Credit you can buy...</p>
                        <figure>
                        <img src="${content[0].image.src}" alt="${content[0].image.alt}"></img>
                        <figcaption>${content[0].image.alt}</figcaption>
                        </figure>
                        `
        } else {
            forecast.innerHTML = '';
            result.innerHTML = `
                        <li>Sorry, no user found in the Database</li>
                        `
        }
    }
    button.innerHTML = 'Search';

}