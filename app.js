const button = document.getElementById('search-button');
const result = document.getElementById('result');
const forecast = document.getElementById('limit');
let button_find = document.getElementById('find-button-container');
let _CREDIT = 0;

let MAINFRAME_ENDPOINT = './api/mainframe';

async function getCategoryFromMainframe() {
    let query = document.getElementById('user_id').value;
    if (query) {
        await fetch(`${MAINFRAME_ENDPOINT}/${query}`)
        .then(result => result.json())
        .then(data => getUserInfo(data['CUSTREADOperationResponse']['ws_cust_rec']['cust_catg']))
        .catch(err => console.log('ERROR', err))
    }
}

async function getUserInfo(query) {
    button.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>  Searching...';
    let messageResult = '';
    let messageForecast = '';
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
                console.log('content', content);
                if (content[0]) {
                    messageResult = `
                    <h2>User ID ${query}</h2>
                    <table class="table" aria-label="Results" aria-describedby="User Bank results">
                        <tbody>
                            <tr>
                            <td class="hidden-col"><span class="font-weight-bold">Category</span></td>
                            <td><span class="font-weight-bold">Bank interest</span></td>
                            <td><span class="font-weight-bold">Risk</span></td>
                            <td><span class="font-weight-bold">Salary range</span></td>
                            <td><span class="font-weight-bold">Credit Limit</span></td>
                            </tr>
                            <tr>
                            <td class="hidden-col">${content[0].cust_catag}</td>
                            <td>${content[0].interest}%</td>
                            <td>${content[0].risk}%</td>
                            <td>${content[0].salary.min}$ - ${content[0].salary.max}$</td>
                            <td>${content[0].credit_limit}$</td>
                            </tr>
                        </tbody>
                        </table>
                                `
                    _CREDIT = content[0].credit_limit;
                    button_find.classList.remove('hidden');
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
    }


    result.innerHTML = messageResult;
    forecast.innerHTML = messageForecast;
    button.innerHTML = 'Search';
}

async function findHouses(creditLimit) {
    await fetch('./api/real_estate?credit_limit=' + creditLimit)
        .then(data => data.json())
        .then(results => {
            button_find.classList.add('hidden');
            let div = document.createDocumentFragment();
            console.log(results)
            results.forEach(item => {
                let card = document.createElement('div');
                card.setAttribute('aria-describedby', 'a card showing a house for sale');
                card.setAttribute('tabindex', '0');
                card.classList.add('card', 'small-size');
                if (item.attachments.images[0]) {
                    let img = document.createElement('img');
                    img.setAttribute('src', item.attachments.images[0]);
                    img.setAttribute('alt', `an image of ${item.type}`);
                    img.classList.add('card-img-top');
                    let desc = document.createElement('div');
                    desc.classList.add('card-body');
                    let p = document.createElement('p');
                    p.classList.add('card-text');
                    p.innerText = `${item.address.city} - ${item.price}$`;
                    let button = document.createElement('a');
                    button.classList.add('btn', 'btn-primary');
                    button.setAttribute('tabindex', '0');
                    button.innerText = 'Buy';
                    desc.appendChild(p);
                    desc.appendChild(button);
                    card.appendChild(img);
                    card.appendChild(desc);
                    div.appendChild(card);
                    console.log('item', item);
                }
            })
            forecast.innerText = '';
            forecast.appendChild(div);
        })
        .catch(err => console.log(err))
}