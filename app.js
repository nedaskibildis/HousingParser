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
    var houseList = []
    var houseObj = {}
    var featuresObj = {}
    var houseObj = {
        postDate: "",
        availibleDate: "",
        listingType: "",
        houseType: "",
        address: "",
        distanceFromUni: "",
        subletOption: "",
        rooms: "",
        features: {},
        price: ""
    };

    var featuresObj = {
        parkingIncluded: true,
        smokingAllowed: true,
        laundryFacilities: true,
        petsAllowed: true
    }

    const websiteResponse = await fetch("https://thecannon.ca/classifieds/housing")
    const htmlContent = await websiteResponse.text()
    // console.log(htmlContent)


    const $ = cheerio.load(htmlContent)
    var count = 0

    $('td').each((i, element) => {
        const item = $(element).html()
        // console.log(item)

        // this is a really lazy way to do it, i know
        if (count == 0) {
            houseObj["postDate"] = item
        } else if (count == 1) {
            houseObj["availibleDate"] = item
        } else if (count == 2) {
            houseObj["listingType"] = item
        } else if (count == 3) {
            houseObj["houseType"] = item
        } else if (count == 4) {
            const address = $(element).find('a').text()
            houseObj["address"] = address
        } else if (count == 5) {
            houseObj["distanceFromUni"] = item
        } else if (count == 6) {
            houseObj["subletOption"] = item
        } else if (count == 7) {
            houseObj["rooms"] = item
        } else if (count == 8) {
            if (item.includes("Parking Included")) {
                featuresObj["parkingIncluded"] = true
            } else {
                featuresObj["parkingIncluded"] = false
            }

            if (item.includes("No Smoking")) {
                featuresObj["smokingAllowed"] = false
            } else {
                featuresObj["smokingAllowed"] = true
            }

            if (item.includes("Laundry Facilities")) {
                featuresObj["laundryFacilities"] = true
            } else {
                featuresObj["laundryFacilities"] = false
            }

            if (item.includes("Pets OK")) {
                featuresObj["petsAllowed"] = true
            } else {
                featuresObj["petsAllowed"] = false
            }

            houseObj["features"] = featuresObj
        } else if (count == 9) {
            houseObj["price"] = item
        }

        if (count == 9) {
            count = 0
            console.log("--------------------- item pushed -----------------------")
            console.log(houseObj)
            houseList.push(houseObj)
            houseObj = {}
            featuresObj = {}

            // console.log(houseList)
        } else {
            count++
        }
    })

    res.status(200).json(houseList)
})

app.listen(8080, () => {
    console.log('server is listening on port 8080....')
})





