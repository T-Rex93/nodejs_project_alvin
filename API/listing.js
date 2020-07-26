const Joi = require('joi');
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Temporary Variable
const listings = [
    { id:1, title:'restaurant', city:'New York', phone:'123-456-789', geoloc:'Grand Central Station, Kiosk no. 4, New York', website:'http//www.nycres.com' }
];


// Get All Listings
app.get("/api/listings", (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.send( listings );
});

// Get 1 Listing Detail
app.get("/api/listings/:id", (req, res) => {
    const listing = listings.find( l => l.id === parseInt(req.params.id) );
    if( !listing ) res.status(404).send('The listing with the given title was not found.');
    res.send(listing);
});

// Add New Listing
app.post("/api/listings", (req, res) => {

    // Validasi Using Schema
    const {error} = validateListing(req.body); 
    if( error ){
        return res.status(400).send(error.details[0].message);
    } 

    // Add New Listing
    const listing = {
        id: listings.length +1,
        title: req.body.title,
        city: req.body.city,
        phone: req.body.phone,
        geoloc: req.body.geoloc,
        website: req.body.website
    };
    listings.push(listing);
    return res.send(listing);
});

// Update Listing by ID
app.put('/api/listings/:id', (req, res) => {

    // Validasi Using Schema
    const {error} = validateListing(req.body); 
    if( error ){
        // 400 Bad Request
        return res.status(400).send(error.details[0].message);
    } 

    // Find Match Listing
    const listing = listings.find( l => l.id === parseInt(req.params.id) );
    if( !listing ) return res.status(404).send('The listing with the given ID was not found.');

    // Update Listing
    listing.title = req.body.title;
    return res.send(listing);

});

// Delete Listing by ID
app.delete('/api/listings/:id', (req, res) => {

    // Find Match Listing
    const listing = listings.find( l => l.id === parseInt(req.params.id) );
    if( !listing ) return res.status(404).send('The listing with the given ID was not found.');

    // Delete Listing
    const index = listings.indexOf(listing);
    listings.splice(index, 1);

    console.log("Listing ID "+req.params.id+" telah berhasil dihapus");

    // Return Deleted Listing
    return res.send(listing);
});

// Function to Validate Listing
function validateListing(listing){
    const schema = Joi.object({
        title: Joi.string().min(3).required()
    });

    return schema.validate(listing);
}

// Start Web Service
const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});

