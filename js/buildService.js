buildDataTable = (response) => {
    let HTML = "";

    response.map(data => {
        HTML += `
        <tr>
            <th scope="row"> ${data.country} </th>
            <td> ${formatNumber(data.cases)} </td>
            <td> ${formatNumber(data.recovered)} </td>
            <td> ${formatNumber(data.deaths)} </td>
        </tr>
        `
    });

    document.getElementById("covid-report-table").innerHTML = HTML;
};

let chartDataArray = [];

buildDataChart = (data) => {
    for(let date in data.cases) {
        let casesByDate = { x: new Date(date.toString()), y: data.cases[date] };
        chartDataArray.push(casesByDate);
    }
};

buildCountryData = (data) => {
    let html = `
            <h5> ${data.country || "Worldwide"} </h5>

            <div class="info">
                <div class="short-hand-cases">
                    <p class="sh-header"> Total Cases: </p>
                    <p class="sh-cases"> ${formatNumber(data.cases)} </p>
                    <p class="sh-yesterday"> Reported yesterday: <span class="last-increases-cases"> +${formatNumber(data.todayCases)} </span></p>
                </div>
                <div class="border"></div>
                <div class="short-hand-recovered">
                    <p class="sh-header"> Total Recovered: </p>
                    <p class="sh-cases"> ${formatNumber(data.recovered)} </p>
                    <p class="sh-yesterday"> Reported yesterday: <span class="last-increases-recovered"> +${formatNumber(data.todayRecovered)} </span></p>
                </div>
                <div class="border"></div>
                <div class="short-hand-deaths">
                    <p class="sh-header"> Total Deaths: </p>
                    <p class="sh-cases"> ${formatNumber(data.deaths)} </p>
                    <p class="sh-yesterday"> Reported yesterday: <span class="last-increases-deaths"> +${formatNumber(data.todayDeaths)} </span></p>
                </div>
            </div>
        `;

    document.querySelector(".short-hand-info").innerHTML = html;
}