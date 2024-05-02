window.onload = function(){
    var dataPoints = []; 
    var dates = [];
    var volume = [];
    var chart = new CanvasJS.StockChart("chartContainer", {
        animationEnabled: true,
        theme: "dark2",
        zoomEnabled: true,
        zoomType: "xy",
        exportEnabled: true,
        title: {
            fontSize: 30,
            fontFamily: "sans-serif",
            text: "Stock Prices"
        },
        charts: [{
            height: 400,
            axisX: {
                valueFormatString: "DD-MM-YY HH:mm:ss",
                title: "IBM"
            },
            axisY: {
                prefix: "$",
                title: "Price"
            },
            toolTip: {
                content: "Date: {x}<br /><strong>Price:</strong><br />Open: {y[0]}, Close: {y[3]}<br />High: {y[1]}, Low: {y[2]}",
                shared: true
            },
            data: [{
                type: "candlestick",
                risingColor: "green",
                fallingColor: "red",
                yValueFormatString: "$##0.00",
                dataPoints: dataPoints
            }]
        },{
            height: 300,
            toolTip: {
                shared: true
            },
            axisX: {
                crosshair: {
                    enabled: true,
                    snapToDataPoint: true
                },
                title: "Time"
            },
            axisY2: {
                prefix: "$",
                title: "Volume"
            },
            data: [{
                yValueFormatString: "$#,###.##",
                axisYType: "secondary",
                name: "Volume",
                dataPoints : volume
            }]
        }],
        navigator: {  
            animationEnabled: true,
            data: [{
              color: "grey",
              dataPoints: dates
            }],
            slider: {
              maskInverted: true,
              minimum: new Date("2009-01-05 08:00:00"),
              maximum: new Date("2009-01-05 19:50:00")
            }
        },
        rangeSelector: { 
            buttonStyle:{
                labelFontSize: 14,
                maxWidth: 64
            },
            inputFields:{
                style:{
                    fontSize: 14,
                    fontStyle: "italic",
                    maxWidth: 256
                }
            },
            buttons: [
            {
              range: 60,
              rangeType: "minute",
              label: "1 hr"   
            },{
              range: 4,
              rangeType: "hour",
              label: "4 hr"
            },{    
                range: 8,
              rangeType: "hour",
              label: "8 hr"
            },{    
                range: 16,
              rangeType: "hour",
              label: "16 hr"
            },{            
              rangeType: "all",
              label: "ALL"
            }]
          }
    });
    $.getJSON("https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=IBM&interval=5min&month=2009-01&outputsize=full&apikey=demo", getDataPointsFromJSON);
    function getDataPointsFromJSON(json_data){
        var jsonData = [];
        jsonData = json_data["Time Series (5min)"];
        for(keys in jsonData){
            dates.unshift({
                x : new Date(keys),
                y : jsonData[keys]["2. close"]
            });
            volume.unshift({
                x : new Date(keys),
                y : parseInt(jsonData[keys]["5. volume"]),
                color: jsonData[keys]["1. open"] < jsonData[keys]["4. close"] ? "green" : "red"
            })
            dataPoints.unshift({
                x : new Date(keys),
                y : [
                    parseFloat(jsonData[keys]["1. open"]),
                    parseFloat(jsonData[keys]["2. high"]),
                    parseFloat(jsonData[keys]["3. low"]),
                    parseFloat(jsonData[keys]["4. close"]),
                ],
                color: jsonData[keys]["1. open"] < jsonData[keys]["4. close"] ? "green" : "red"
            })
        }
        chart.render();
    }
}
