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
        // Get the date from 7 days ago
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Filter the data to get only the records from the last 7 days
        const last7DaysData = Object.entries(data).filter(([id, entry]) => {
            const entryDate = new Date(entry[3]);
            return entryDate >= sevenDaysAgo;
        });
        console.log(last7DaysData);

        return last7DaysData;

    } catch (error) {
        console.error('Error:', error);
    }

    createTable(data);
    GetTopThreeWebsites(data);
    DrawPieChart(data);
}

function createTable(data) {
    const tableBody = document.querySelector('#historyTable tbody');

    data.forEach(([title, details]) => {
        let row = document.createElement('tr');
        let titleCell = document.createElement('td');
        titleCell.textContent = title;
        row.appendChild(titleCell);

        let urlCell = document.createElement('td');
        urlCell.textContent = details[0];
        row.appendChild(urlCell);

        let visitCountCell = document.createElement('td');
        visitCountCell.textContent = details[1];
        row.appendChild(visitCountCell);

        let lastVisitTimeCell = document.createElement('td');
        lastVisitTimeCell.textContent = details[2];
        row.appendChild(lastVisitTimeCell);

        tableBody.appendChild(row);
    })
}

//Top 3 clicked websites and their visits counts.
function GetTopThreeWebsites(data) {

    const sortedData = Object.entries(data).sort((a, b) => b[1][2] - a[1][2]);
    const topThree = sortedData.slice(0, 3).map(([id, entry]) => {
        return {
            name: entry[0],
            clickCount: entry[2]
        };
    });
    console.log(topThree);

    const websiteNames = topThree.map(entry => entry.name).join(', ');
    const visitCounts = topThree.map(entry => entry.clickCount).join(', ');

    document.getElementById('websites').textContent = websiteNames;
    document.getElementById('visits').textContent = visitCounts;

}

function DrawPieChart(data) {
    // Pie chart
    let LabelsArray = Object.values(data).map(item => item[0]);
    console.log(LabelsArray);
    let visitCounts = Object.values(data).map(item => item[2]);

    const dataLength = data.length;
    const backgroundColors = [];

    for (let i = 0; i < dataLength; i++) {
        backgroundColors.push(getRandomColor());
    }

    const ctx = document.getElementById('PieChart').getContext('2d');
    const chart = new Chart(ctx, {
        type: 'pie',
        data: {
            labels: LabelsArray,
            datasets: [{
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
            animation: {
                animateScale: true,
                animateRotate: true
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
