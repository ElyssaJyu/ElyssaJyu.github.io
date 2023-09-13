//history data json structure
// {
//     title:[url, visit_count, last_visit_time],
// }

fetch('http site')
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        return response.json();
    })
    .then(data => {
        //console.log(data);
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
    })
    .catch(error => {
        console.error('Error fetching data:', error);
    });


