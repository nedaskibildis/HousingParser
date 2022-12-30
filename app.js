const express = require('express')
const cheerio = require('cheerio')

const app = express()

// setup static and middleware
app.use(express.static('public'))

app.get('/', (req, res) => {})

app.get('/test', (req, res) => {
    res.status(200).json({ message: "It works!!" })
})

app.get('/scrapeHouses', async function(req, res) {
    var JSONObj = {
        postDate: "",
        availibleDate: "",
        listingType: "",
        houseType: "",
        address: "",
        distanceFromUni: "",
        subletOption: "",
        rooms: "",
        features: "",
        price: ""
    };

    const websiteResponse = await fetch("https://thecannon.ca/classifieds/housing")
    const htmlContent = await websiteResponse.text()
    console.log(htmlContent)


    const $ = cheerio.load(htmlContent)
    var count = 0

    $('td').each((i, element) => {
        const item = $(element).html()
        // const summary = $(element).find('div.summary').text()
        // const summary = item.children('div[class=summary]')

        console.log(item)
        // console.log(summary)

        // this is a really lazy way to do it, i know
        if (count == 0) {
            JSONObj.postDate = item
        } else if (count == 1) {
            JSONObj.availibleDate = item
        } else if (count == 2) {
            JSONObj.listingType = item
        } else if (count == 3) {
            JSONObj.houseType = item
        } else if (count == 4) {
            // need to fix this later, need to parse the adress out from the <a> tags
            JSONObj.address = item
        } else if (count == 5) {
            JSONObj.distanceFromUni = item
        } else if (count == 6) {
            JSONObj.subletOption = item
        } else if (count == 7) {
            JSONObj.rooms = item
        } else if (count == 8) {
            // need to fix this later, need to parse data out from html tags
            JSONObj.features = item
        } else if (count == 9) {
            JSONObj.price = item
        }

        console.log("--------------------------------")
        if (count == 9) {
            count = 0
        } else {
            count++
        }
    })

    res.status(200).json(JSONObj)

    // res.status(200).json(JSONObj)
})

app.listen(8080, () => {
    console.log('server is listening on port 8080....')
})





