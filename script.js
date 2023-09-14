//history data json structure
// {
//     title:[url, visit_count, last_visit_time],
// }

async function getLast7DaysData() {
    try {
        const response = await fetch("/mockdata.json");
        if (!response.ok) {
            throw new Error('Failed to fetch data from the server.');
        }
        const data = await response.json();
        console.log(data);

        // Get the date from 7 days ago
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

        // Filter the data to get only the records from the last 7 days
        const last7DaysData = Object.entries(data).filter(([title, [url, visit_count, last_visit_time]]) => {
            const visitDate = new Date(last_visit_time);
            return visitDate >= sevenDaysAgo;
        });
        console.log(last7DaysData);

        return last7DaysData;

    } catch (error) {
        console.error('Error:', error);
    }
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

//Top 3 clicked websites and their total stay duration.
function GetTopThreeWebsites(data) {

    const sortedWebsites = Object.entries(data).sort((a, b) => b[1][1] - a[1][1]);
    console.log(sortedWebsites);
    const topThreeWebsites = sortedWebsites.slice(0, 3).map(item => item[0]).join(', ');
    console.log(topThreeWebsites);
    const topThreeWebsitesDuration = sortedWebsites.slice(0, 3).map(item => item[1][2]).join(', ');
    console.log(topThreeWebsitesDuration);
    document.getElementById('websites').textContent = topThreeWebsites;
    //TODO: calculate total stay duration over the last 7 days, currently it is visits count.
    document.getElementById('duration').textContent = topThreeWebsitesDuration;
}

function DrawPieChart(data) {
    // Pie chart
    let LabelsArray = Object.keys(data);
    let visitCounts = labels.map(label => data[label][1]);

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
    const data = await getLast7DaysData();
    createTable(data);
    GetTopThreeWebsites(data);
    DrawPieChart(data);
}

main();
