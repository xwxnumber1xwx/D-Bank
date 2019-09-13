async function getUserInfo() {
    let query = document.getElementById('user_id').value;
    if (query) {
        const result = document.getElementById('result');
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
        } else {
            result.innerHTML = `
                        <li>Sorry, no user founded in the Database</li>
                        `
        }
    }

}