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

function GetDomain(url)
{
    return url.replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .replace(/\..*/, '');
}

function DrawPortraitByQuickChart(data) {
    console.log(data)
    text = ''
    //data = 'baidu baidu bing bing bing bing bing google'
    Object.entries(data).forEach(([title, details]) => {
        text = text + GetDomain(details[1]) + ' '
    })
    fetch("https://quickchart.io/wordcloud", {
    method: "POST",
    body: JSON.stringify({
            format: 'svg',
            width: 1000,
            height: 1000,
            fontScale: 150,
            scale: 'linear',
            removeStopwords: true,
            minWordLength: 4,
            rotation: 60,
            backgroundColor: 'rgb(25, 215, 155)',
            loadGoogleFonts: 'Oswald',
            fontFamily: 'Oswald',
            text: text,
    }),
    headers: {
        "Content-type": "application/json; charset=UTF-8"
    }
    }).then((response) => response.blob())
    .then((blob) => {
    const imageUrl = URL.createObjectURL(blob);
    const imageElement = document.createElement("img");
    imageElement.src = imageUrl;
    const container = document.getElementById("portrait");
    container.appendChild(imageElement);
    })
    .catch((error) => console.error(error));
}

function DrawPortraitByD3(data) {
    wordlist = []
    Object.entries(data).forEach(([title, details]) => {
        console.log(details[1])
        wordlist.push({text:GetDomain(details[1]), size:50*details[2]})
    })
    testdata = [
        "Hello", "world", "normally", "Hello", "you", "want", "more", "words",
        "than", "this"]
    var layout = d3.layout.cloud()
    .size([1000, 1000])
    .words(wordlist)
    .text(function(d) {return d.text;})
    .padding(5)
    .rotate(function() { return (~~(Math.random() * 6) - 3) * 30; })
    .font("Impact")
    .fontSize(function(d) { return d.size; })
    .on("end", draw);
    
    layout.start();
    
    function draw(words) {
      d3.select("#portrait").append("svg")
          .attr("width", layout.size()[0])
          .attr("height", layout.size()[1])
        .append("g")
          .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
        .selectAll("text")
          .data(words)
        .enter().append("text")
          .style("font-size", function(d) { return d.size + "px"; })
          .style("font-family", "Impact")
          .attr("text-anchor", "middle")
          .attr("transform", function(d) {
            return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
          })
          .text(function(d) { return d.text; });
    }
    
}

async function main() {
    var data = await getLast7DaysData();

    data = {
        "8": [
            "My Browsing Portrait",
            "elyssajyu.github.io",
            "1",
            "2023-9-14 14:43:8"
        ],
        "7": [
            "百度一下，你就知道",
            "www.baidu.com",
            "1",
            "2023-9-14 12:27:20"
        ],
        "5": [
            "bing.com/ck/a?!&&p=dd3e7ff83d6630daJmltdHM9MTY5NDU2MzIwMCZpZ3VpZD0xMTQ2ODM5MC1kMmQ2LTY0NWItMWIyYS05MGVjZDMyYjY1OGUmaW5zaWQ9NTE5NQ&ptn=3&hsh=3&fclid=11468390-d2d6-645b-1b2a-90ecd32b658e&psq=baidu&u=a1aHR0cHM6Ly93d3cuYmFpZHUuY29tLw&ntb=1",
            "www.bing.com",
            "2",
            "2023-9-14 12:27:20"
        ],
        "6": [
            "",
            "www.bing.com",
            "1",
            "2023-9-14 12:27:20"
        ],
        "4": [
            "Squoosh",
            "squoosh.app",
            "40",
            "2023-8-31 13:52:51"
        ],
        "3": [
            "Squoosh",
            "squoosh.app",
            "1",
            "2023-8-29 17:6:9"
        ],
        "1": [
            "bing.com/ck/a?!&&p=b832585f0a961368JmltdHM9MTY5MzI2NzIwMCZpZ3VpZD0xMTQ2ODM5MC1kMmQ2LTY0NWItMWIyYS05MGVjZDMyYjY1OGUmaW5zaWQ9NTE4NQ&ptn=3&hsh=3&fclid=11468390-d2d6-645b-1b2a-90ecd32b658e&psq=squoosh&u=a1aHR0cHM6Ly9zcXVvb3NoLmFwcC8&ntb=1",
            "www.bing.com",
            "2",
            "2023-8-29 17:6:8"
        ],
        "2": [
            "",
            "www.bing.com",
            "1",
            "2023-8-29 17:6:7"
        ]
    }

    DrawPortraitByD3(data);
    DrawPortraitByQuickChart(data);
    createTable(data);
    GetTopThreeWebsites(data);
    DrawPieChart(data);
}

main();