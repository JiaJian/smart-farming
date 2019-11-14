const socket = io();

var chart = Highcharts.stockChart('chart-temperature', {
    time: {
        useUTC: false
    },

    rangeSelector: {
        buttons: [{
            count: 1,
            type: 'minute',
            text: '1M'
        }, {
            count: 5,
            type: 'minute',
            text: '5M'
        }, {
            type: 'all',
            text: 'All'
        }],
        inputEnabled: false,
        selected: 'all'
    },

    title: {
        text: 'Real-time Temperature Monitoring'
    },

    exporting: {
        enabled: false
    },

    series: [{
        name: 'Temperature (ºC)',
        data: [],
        type: 'spline',
        marker: {
            enabled: true
        }
    }],

    credits: {
        enabled: false
    }
});

var chart2 = Highcharts.stockChart('chart-light', {
    time: {
        useUTC: false
    },

    rangeSelector: {
        buttons: [{
            count: 1,
            type: 'minute',
            text: '1M'
        }, {
            count: 5,
            type: 'minute',
            text: '5M'
        }, {
            type: 'all',
            text: 'All'
        }],
        inputEnabled: false,
        selected: 'all'
    },

    title: {
        text: 'Real-time Light Intensity Monitoring'
    },

    exporting: {
        enabled: false
    },

    series: [{
        name: 'Light Intensity',
        data: [],
        type: 'spline',
        marker: {
            enabled: true
        }
    }],

    credits: {
        enabled: false
    }
});

var chart3 = Highcharts.stockChart('chart-moisture', {
    time: {
        useUTC: false
    },

    rangeSelector: {
        buttons: [{
            count: 1,
            type: 'minute',
            text: '1M'
        }, {
            count: 5,
            type: 'minute',
            text: '5M'
        }, {
            type: 'all',
            text: 'All'
        }],
        inputEnabled: false,
        selected: 'all'
    },

    title: {
        text: 'Real-time Soil Moisture Monitoring'
    },

    exporting: {
        enabled: false
    },

    series: [{
        name: 'Soil Moisture Level',
        data: [],
        type: 'spline',
        marker: {
            enabled: true
        }
    }],

    credits: {
        enabled: false
    }
});

socket.on('data-temperature', (content) => {
    let template = "<tr><td>" + content.data + "ºC</td>" +
        "<td>" + moment(content.time).format('MMMM Do YYYY, h:mm:ss a'); + "</td> </tr> ";
    
    $('#table-temperature').prepend(template);
    chart.series[0].addPoint([content.time, content.data]);

});


socket.on('data-light', (content) => {
    let template = "<tr><td>" + content.data + "</td>" +
        "<td>" + moment(content.time).format('MMMM Do YYYY, h:mm:ss a'); + "</td> </tr> ";

    $('#table-light').prepend(template);
    chart2.series[0].addPoint([content.time, content.data]);

});

socket.on('data-soil-moisture-level', (content) => {
    var status, level, percent;
    
    level = content.data;
    percent = (100 - (level/1023*100)).toFixed(2);

    if (level >= 600) {
        status = "Soil is dry 🏜️";
    }
    else if (level >= 370 && level < 600) {
        status = "Soil is humid 💧";
    }
    else if (level < 370) {
        status = "Sensor probably in water 🌊";
    }

    let template = "<tr><td>" + content.data + " (" + percent + "%)</td>" +
        "<td>" + status + "</td>" +
        "<td>" + moment(content.time).format('MMMM Do YYYY, h:mm:ss a'); + "</td> </tr> ";

    $('#table-moisture').prepend(template);
    chart3.series[0].addPoint([content.time, content.data]);

});