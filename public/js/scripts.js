const socket = io()
let data = [];
let chart = Morris.Line({
    element: 'chart-temperature',
    data,
    xkey: 'y',
    ykeys: ['a'],
    postUnits: 'ºC',
    labels: ['Temp'],
    yLabelFormat: function (y) { return y.toString() + 'ºC'; },
    parseTime: false,
    pointFillColors: ['#ffffff'],
    pointStrokeColors: ['gray'],
    lineColors: ['red']
});
socket.on('data-temperature', (content) => {
    let template = "<tr><td>" + content.data + "ºC</td>" +
        "<td>" + content.time + "</td> </tr> "
    data.push({
        y: content.time,
        a: content.data
    });
    $('#table-temperature').append(template);
    chart.setData(data);
});

let data2 = [];
let chart2 = Morris.Line({
    element: 'chart-light',
    data,
    xkey: 'y',
    ykeys: ['a'],
    postUnits: '',
    labels: ['Light'],
    yLabelFormat: function (y) { return y.toString() + ''; },
    parseTime: false,
    pointFillColors: ['#ffffff'],
    pointStrokeColors: ['gray'],
    lineColors: ['red']
});
socket.on('data-light', (content) => {
    let template = "<tr><td>" + content.data + "</td>" +
        "<td>" + content.time + "</td> </tr> "
    data2.push({
        y: content.time,
        a: content.data
    });
    $('#table-light').append(template);
    chart2.setData(data2);
});