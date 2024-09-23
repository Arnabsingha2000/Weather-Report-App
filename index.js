const http = require('http');
const fs = require('fs');

var requests = require("requests");


const homeFile = fs.readFileSync("home.html", "utf-8")

const replaceVal = (tempVal, orgVal) => {

    const tempC = (orgVal.main.temp - 273.15).toFixed(2);
    const tempMinC = (orgVal.main.temp_min - 273.15).toFixed(2);
    const tempMaxC = (orgVal.main.temp_max - 273.15).toFixed(2);

    let temperature = tempVal
        .replace("{%tempval%}", tempC)
        .replace("{%tempmin%}", tempMinC)
        .replace("{%tempmax%}", tempMaxC)
        .replace("{%location%}", orgVal.name)
        .replace("{%country%}", orgVal.sys.country)
        .replace("{%tempstatus%}", orgVal.weather[0].main); // Make sure no leading spaces

    return temperature;
}

const server = http.createServer((req, res) => {
    if (req.url == '/') {
        requests("https://api.openweathermap.org/data/2.5/weather?q=kolkata&appid=7dead70ed3d0d19bfdaa8bb79c9b81f6")
            .on("data", (chunk) => {

                const objdata = JSON.parse(chunk)
                const arrData = [objdata]
                // console.log(arrdata[0].main.temp)

                const realTimeData = arrData.map((val) => replaceVal(homeFile, val)).join("");
                res.write(realTimeData)




                // console.log(realTimeData)
            })
            .on("end", (err) => {


                if (err) return console.log("connection closed due to error", err)
                res.end();
            })


    }
    else {
        res.writeHead(404, { "content-type": "text/html" })
        res.end("<h1>404 not found</h1>")
    }


})


server.listen(8000, "127.0.0.1", () => {
    console.log("server is running on https://127.0.0.1:8000")
})


