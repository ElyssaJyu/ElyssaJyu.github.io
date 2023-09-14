//history data json structure
// "id": [
//     "百度一下，你就知道",
//     "
// www.baidu.com"
//     ,
//     "1",
//     "2023-9-14 12:27:20"
// ],


async function getLast7DaysData(data) {
    try {
        console.log(data);
        const jsonData = JSON.parse(data);
        // Get the date from 7 days ago
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Filter the data to get only the records from the last 7 days
        const last7DaysData = Object.entries(jsonData).filter(([id, entry]) => {
            const entryDate = new Date(entry[3]);
            return entryDate >= sevenDaysAgo;
        });
        console.log(last7DaysData);

        createTable(last7DaysData);
        GetTopThreeWebsites(last7DaysData);
        DrawBarChart(last7DaysData);

    } catch (error) {
        console.error('Error:', error);
    }

}

function extractMainDomain(urlString) {
    const match = urlString.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
    if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
        const parts = match[2].split('.');
        if (parts.length > 1) {
            return parts[parts.length - 2];
        }
    }
    return null;
}

function createTable(data) {
    const tableBody = document.querySelector('#historyTable tbody');

    data.forEach(([title, details]) => {
        let row = document.createElement('tr');
        let titleCell = document.createElement('td');
        const domainName = extractMainDomain(details[1]);
        titleCell.textContent = domainName;
        row.appendChild(titleCell);

        let urlCell = document.createElement('td');
        urlCell.textContent = details[1];
        row.appendChild(urlCell);

        let visitCountCell = document.createElement('td');
        visitCountCell.textContent = details[2];
        row.appendChild(visitCountCell);

        let lastVisitTimeCell = document.createElement('td');
        lastVisitTimeCell.textContent = details[3];
        row.appendChild(lastVisitTimeCell);

        tableBody.appendChild(row);
    })
}

//Top 3 clicked websites and their visits counts.
function GetTopThreeWebsites(data) {

    const sortedData = Object.entries(data).sort((a, b) => b[1][2] - a[1][2]);
    const topThree = sortedData.slice(0, 3).map(([id, entry]) => {
        return {
            name: extractMainDomain(entry[1]),
            clickCount: entry[3]
        };
    });
    console.log(topThree);

    const websiteNames = topThree.map(entry => entry.name).join(', ');
    const visitCounts = topThree.map(entry => entry.clickCount).join(', ');

    document.getElementById('websites').textContent = websiteNames;
    //document.getElementById('visits').textContent = visitCounts;

}

function DrawBarChart(data) {
    // Bar chart
    let labelsArray = Object.values(data).map(item => extractMainDomain(item[1][1]));
    let visitCounts = Object.values(data).map(item => parseInt(item[1][2]));

    const backgroundColors = labelsArray.map(() => getRandomColor());

    const ctx = document.getElementById('BarChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: labelsArray,
            datasets: [{
                label: 'Visit Counts',
                data: visitCounts,
                backgroundColor: backgroundColors
            }]
        },
        options: {
            responsive: true,
            legend: {
                position: 'top',
            },
            title: {
                display: true,
                text: 'Website Visit Counts'
            },
            scales: {
                yAxes: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}


//randowm color generator for PieChart
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

async function main() {
    chrome.edgeMarketingPagePrivate.sendNtpQuery("", "", "", (data) => getLast7DaysData(data));
}

main();
