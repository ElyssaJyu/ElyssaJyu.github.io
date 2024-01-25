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

        DrawPortraitByD3(last7DaysData);
        DrawPortraitByQuickChart(last7DaysData);
        createTable(last7DaysData);
        GetTopThreeWebsites(last7DaysData);
        DrawBarChart(last7DaysData);

    } catch (error) {
        console.error('Error:', error);
    }

}

// function extractMainDomain(urlString) {
//     const match = urlString.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
//     if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
//         const parts = match[2].split('.');
//         if (parts.length > 1) {
//             return parts[parts.length - 2];
//         }
//     }
//     return null;
// }

function createTable(data) {
    const tableBody = document.querySelector('#historyTable tbody');

    data.forEach(([title, details]) => {
        let row = document.createElement('tr');
        let titleCell = document.createElement('td');
        const domainName = GetDomain(details[1]);
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

function debugPost() {
    var formData = new FormData();
    formData.append("textName", "textValue");
    var request = new XMLHttpRequest();
    request.open("POST", "https://elyssajyu.github.io");
    request.send(formData);
}

//Top 3 clicked websites and their visits counts.
function GetTopThreeWebsites(data) {

    const sortedData = Object.entries(data).sort((a, b) => b[1][2] - a[1][2]);
    const topThree = sortedData.slice(0, 3).map(([id, entry]) => {
        console.log(entry[1]);
        return {
            name: GetDomain(entry[1]),
        };
    });
    console.log(topThree);

    const websiteNames = topThree.map(entry => entry.name).join(', ');

    document.getElementById('websites').textContent = websiteNames;

}

function DrawBarChart(data) {
    // Bar chart
    let labelsArray = Object.values(data).map(item => GetDomain(item[1][1]));
    let visitCounts = Object.values(data).map(item => parseInt(item[1][2]));
    console.log(labelsArray);
    console.log(visitCounts);

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
                y: [{
                    ticks: {
                        beginAtZero: true
                    }
                }]
            }
        }
    });
}


//randowm color generator for BarChart
function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function GetDomain(url) {
    console.log(url);
    return url.replace(/^https?:\/\//, "")
        .replace(/^www\./, "")
        .replace(/\..*/, '');
}

function DrawPortraitByQuickChart(data) {
    console.log(data)
    text = ''
    //data = 'baidu baidu bing bing bing bing bing google'
    Object.entries(data).forEach(([title, details]) => {
        text = text + (GetDomain(details[1]) + ' ').repeat(details[2])
    })
    fetch("https://quickchart.io/wordcloud", {
        method: "POST",
        body: JSON.stringify({
            format: 'png',
            width: 800,
            height: 800,
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
    var fill = d3.scaleOrdinal(d3.schemeCategory20);
    console.log(data);
    Object.entries(data).forEach(([title, details]) => {
        console.log(details);
        console.log(details[1])
        wordlist.push({ text: GetDomain(details[1][1]), size: details[1][2] })
    })
    worddict = {}
    wordlist.forEach(d => {
        if (!worddict[d.text]) {
            worddict[d.text] = parseInt(d.size)
        } else {
            worddict[d.text] += parseInt(d.size)
        }
    })
    console.log(data)
    console.log(worddict)
    worddict = Object.entries(worddict).map(([text, size]) => ({ text, size }))
    testdata = [
        "Hello", "world", "normally", "Hello", "you", "want", "more", "words",
        "than", "this"]
    var layout = d3.layout.cloud()
        .size([760, 760])
        .words(worddict)
        .text(function (d) { return d.text; })
        .padding(5)
        .rotate(function () { return (~~(Math.random() * 6) - 3) * 30; })
        .font("Impact")
        .fontSize(function (d) { return Math.max(Math.sqrt(d.size) * 20, 50) })
        .on("end", draw);

    layout.start();

    function draw(words) {
        d3.select("#portrait").append("svg")
            .attr("width", layout.size()[0])
            .attr("height", layout.size()[1])
            .style("background", "#66ccff")
            //.attr("style", "outline: thin solid blue;") border
            .append("g")
            .attr("transform", "translate(" + layout.size()[0] / 2 + "," + layout.size()[1] / 2 + ")")
            .selectAll("text")
            .data(words)
            .enter().append("text")
            .style("font-size", function (d) { return d.size + "px"; })
            .style("font-family", "Impact")
            .style("fill", function (d, i) { return fill(i); })
            .attr("text-anchor", "middle")
            .attr("transform", function (d) {
                return "translate(" + [d.x, d.y] + ")rotate(" + d.rotate + ")";
            })
            .text(function (d) { return d.text; });
    }

}

async function main() {
    //chrome.edgeMarketingPagePrivate.sendNtpQuery("", "", "", (data) => getLast7DaysData(data));
    debugPost();
}

main();
