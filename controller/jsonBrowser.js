
const postUrl = 'https://jsondata-p6ol.onrender.com/setBrowser';
const getUrl = 'https://jsondata-p6ol.onrender.com/getBrowser/:browserId';

async function setBrowser(browserId, browser , page = null) {
    try {
        const response = await fetch(postUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                browserId,
                browser,
                page
            })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        console.log('Response:', result);
        return result;
    } catch (error) {
        console.error('Error:', error);
    }
}

async function getBrowser(browserId) {
    try {
        const response = await fetch(getUrl.replace(':browserId', browserId), {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        // Parse and return JSON data
        const data = await response.json();
        console.log('Response is here:', data.data[0]);
        return data.data[0];
    } catch (error) {
        console.error('Error fetching data:', error);
        return null; // Return null if there's an error
    }
}

module.exports = { setBrowser, getBrowser };