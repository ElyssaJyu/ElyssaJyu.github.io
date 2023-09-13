//history data json structure
// {
//     title:[url, visit_count, last_visit_time],
// }

fetch('mockdata.json')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        return response.json();
    })
    .catch(error => {
        console.error('Error:', error.message);
    })
    .then(data => {
        //console.log(data);

        //Top 3 clicked websites and their avg stay duration.
        const sortedWebsites = Object.entries(data).sort((a, b) => b[1][1] - a[1][1]);
        const topThreeWebsites = sortedWebsites.slice(0, 3).map(item => item[0]).join(', ');
        document.getElementById('websites').textContent = topThreeWebsites;
        //TODO: calculate avg stay duration
        document.getElementById('duration').textContent = '5 minutes';

        const tableBody = document.querySelector('#historyTable tbody');

        data.forEach(title => {
            //console.log(title);
            let row = document.createElement('tr');
            let titleCell = document.createElement('td');
            titleCell.textContent = title;
            row.appendChild(titleCell);

            let urlCell = document.createElement('td');
            urlCell.textContent = data[title][0];
            row.appendChild(urlCell);

            let visitCountCell = document.createElement('td');
            visitCountCell.textContent = data[title][1];
            row.appendChild(visitCountCell);

            let lastVisitTimeCell = document.createElement('td');
            lastVisitTimeCell.textContent = data[title][2];
            row.appendChild(lastVisitTimeCell);

            tableBody.appendChild(row);
        })

        // Pie chart
        let labels = Object.keys(data);
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
                labels: labels,
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

    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });

//randowm color generator for PieChart
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

