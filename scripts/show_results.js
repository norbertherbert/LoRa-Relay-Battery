showResults = ({
    cad, sync, wor, ack, rx_ul, tx_ul, rx_dl, tx_dl, sleep, battery_leak,
    battery_consumption_per_day, battery_life,
    ed_sync, ed_wor, ed_ack, ed_tx_ul, ed_rx1, ed_rx2, ed_rx3, ed_rx_dl, ed_battery_leak, 
    ed_battery_consumption_per_day, ed_battery_life,
}) => {

    // ***********************************
    // FORMAT SETTING FOR PRESENTATING RESULTS
    // ***********************************

    const f = new Intl.NumberFormat('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0, })
    const f1 = new Intl.NumberFormat('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2, })
    const f2 = new Intl.NumberFormat('en-US', { style: "percent", minimumFractionDigits: 2, maximumFractionDigits: 2, })


    // ***********************************
    // PRESENT RELAY RESULTS
    // ***********************************

    let output_relay = `<pre>` +
        // `\n` +
        // `cad:                            ${f.format(cad).padStart(14, ' ')}\n` +
        // `sync:                           ${f.format(sync).padStart(14, ' ')}\n` +
        // `wor:                            ${f.format(wor).padStart(14, ' ')}\n` +
        // `ack:                            ${f.format(ack).padStart(14, ' ')}\n` +
        // `rx_ul:                          ${f.format(rx_ul).padStart(14, ' ')}\n` +
        // `tx_ul:                          ${f.format(tx_ul).padStart(14, ' ')}\n` +
        // `rx_dl:                          ${f.format(rx_dl).padStart(14, ' ')}\n` +
        // `tx_dl:                          ${f.format(tx_dl).padStart(14, ' ')}\n` +
        // `sleep:                          ${f.format(sleep).padStart(14, ' ')}\n` +
        // `\n` +
        `total consumption: ${f1.format(battery_consumption_per_day).padStart(10, ' ')} uAh/day\n` +
        `battery life:      ${f1.format(battery_life).padStart(10, ' ')} years\n` +
        `</pre>`;
    let output_relay_element = document.getElementById("output_relay");
    output_relay_element.innerHTML = output_relay;

    let chart = new CanvasJS.Chart("chart_relay", {
        animationEnabled: true,
        title: {
            text: "Power consumption [uAh/day]"
        },
        data: [{
            type: "pie",
            startAngle: 240,
            // yValueFormatString: "##0.00\"%\"",
            yValueFormatString: "##0.00",
            indexLabel: "{label} {y}",
            dataPoints: [
                {y: cad/3_600_000, label: "CAD"},
                {y: sync/3_600_000, label: "Sync"},
                {y: wor/3_600_000, label: "WOR"},
                {y: ack/3_600_000, label: "ACK"},
                {y: rx_ul/3_600_000, label: "RX Uplink"},
                {y: tx_ul/3_600_000, label: "TX Uplink"},
                {y: rx_dl/3_600_000, label: "RX Downlink"},
                {y: tx_dl/3_600_000, label: "TX Downlink"},
                {y: sleep/3_600_000, label: "Sleep"},
                {y: battery_leak/3_600_000, label: "Battery Leak"},
            ]
        }]
    });
    chart.render();


    // ***********************************
    // PRESENT END-DEVICE RESULTS
    // ***********************************

    let ed_output = `<pre>` +
        // `\n` +
        // `sync:              ${f.format(ed_sync).padStart(12, ' ')}\n` +
        // `wor:               ${f.format(ed_wor).padStart(12, ' ')}\n` +
        // `ack:               ${f.format(ed_ack).padStart(12, ' ')}\n` +
        // `tx_ul:             ${f.format(ed_tx_ul).padStart(12, ' ')}\n` +
        // `rx1:               ${f.format(ed_rx1).padStart(12, ' ')}\n` +
        // `rx2:               ${f.format(ed_rx2).padStart(12, ' ')}\n` +
        // `rx3:               ${f.format(ed_rx3).padStart(12, ' ')}\n` +
        // `rx_dl:             ${f.format(ed_rx_dl).padStart(12, ' ')}\n` +
        // `\n` +
        `total consumption: ${f1.format(ed_battery_consumption_per_day).padStart(10, ' ')} uAh/day\n` +
        `battery life:      ${f1.format(ed_battery_life).padStart(10, ' ')} years\n` +
        `</pre>`
    let ed_output_element = document.getElementById("output_relayed");
    ed_output_element.innerHTML = ed_output;

    let ed_chart = new CanvasJS.Chart("chart_relayed", {
        animationEnabled: true,
        title: {
            text: "Power consumption [uAh/day]"
        },
        data: [{
            type: "pie",
            startAngle: 240,
            // yValueFormatString: "##0.00\"%\"",
            yValueFormatString: "##0.00",
            indexLabel: "{label} {y}",
            dataPoints: [
                {y: ed_sync/3_600_000, label: "Sync"},
                {y: ed_wor/3_600_000, label: "WOR"},
                {y: ed_ack/3_600_000, label: "ACK"},
                {y: ed_tx_ul/3_600_000, label: "TX Uplink"},
                {y: ed_rx1/3_600_000, label: "RX1"},
                {y: ed_rx2/3_600_000, label: "RX2"},
                {y: ed_rx3/3_600_000, label: "RX3"},
                {y: ed_rx_dl/3_600_000, label: "RX Downlink"},
                {y: ed_battery_leak/3_600_000, label: "Battery Leak"},
            ]
        }]
    });
    ed_chart.render();

}
