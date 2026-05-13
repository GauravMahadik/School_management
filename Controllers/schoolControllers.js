const db = require("../db");




const addSchool = (req, res) => {

    const { name, address, latitude, longitude } = req.body;

   

    if (!name || !address || latitude == null || longitude == null) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    if (
        typeof name !== "string" ||
        typeof address !== "string"
    ) {
        return res.status(400).json({
            message: "Name and address must be strings"
        });
    }

    if (
        isNaN(latitude) ||
        isNaN(longitude)
    ) {
        return res.status(400).json({
            message: "Latitude and longitude must be numbers"
        });
    }

    const query = `
        INSERT INTO schools (name, address, latitude, longitude)
        VALUES (?, ?, ?, ?)
    `;

    db.query(
        query,
        [name, address, latitude, longitude],
        (err, result) => {

            if (err) {
                return res.status(500).json({
                    message: "Database Error",
                    error: err
                });
            }

            res.status(201).json({
                message: "School added successfully",
                schoolId: result.insertId
            });
        }
    );
};




function calculateDistance(lat1, lon1, lat2, lon2) {

    const R = 6371;

    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;

    const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(lat1 * Math.PI / 180) *
        Math.cos(lat2 * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
}




const listSchools = (req, res) => {

    const userLatitude = parseFloat(req.query.latitude);
    const userLongitude = parseFloat(req.query.longitude);


    if (
        isNaN(userLatitude) ||
        isNaN(userLongitude)
    ) {
        return res.status(400).json({
            message: "Valid latitude and longitude are required"
        });
    }

    const query = "SELECT * FROM schools";

    db.query(query, (err, results) => {

        if (err) {
            return res.status(500).json({
                message: "Database Error",
                error: err
            });
        }


        const schoolsWithDistance = results.map((school) => {

            const distance = calculateDistance(
                userLatitude,
                userLongitude,
                school.latitude,
                school.longitude
            );

            return {
                ...school,
                distance: distance.toFixed(2) + " km"
            };
        });

        

        schoolsWithDistance.sort((a, b) => {
            return parseFloat(a.distance) - parseFloat(b.distance);
        });

        res.status(200).json({
            message: "Schools fetched successfully",
            schools: schoolsWithDistance
        });
    });
};

module.exports = {
    addSchool,
    listSchools
};