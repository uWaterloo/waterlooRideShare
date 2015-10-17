// DATABASE PERSISTENCE EXAMPLE

// Retreive data from the database
function getData() {
    var queryResult = db.Execute('SELECT * FROM Rides');
    var rows = JSON.parse(queryResult);
    if (rows.length > 0 && typeof rows[0].Error != 'undefined') {
        return '{"status":"noTable"}';
    }
    return queryResult;
}

function getYourData() {
    var queryResult = db.Execute('SELECT * FROM Rides WHERE DriverID=@currentUser');
    var rows = JSON.parse(queryResult);
    if (rows.length > 0 && typeof rows[0].Error != 'undefined') {
        return '{"status":"noTable"}';
    }
    return queryResult;
}

// Create talbe
function createTable() {
    var result = {};

    var queryResult = db.Execute('SELECT TOP 1 * FROM sampleTable');
    var row = JSON.parse(queryResult);

    if (row.length > 0 && typeof row[0].Error != 'undefined') {
        db.Execute('CREATE TABLE sampleTable(id INTEGER PRIMARY KEY IDENTITY(1,1), userId nvarchar(50), value nvarchar(50));');
        result = '{"status":"tableCreated"}';
    } else
        result = '{"status":"tableExist"}';

    return JSON.stringify(result);
}

// Insert into the database
function insert() {
    if (args.Get("value").length > 50)
        return '{"result":"error"}';
    else {
        db.Execute('INSERT INTO sampleTable VALUES(@currentUser,@value)');
        return getData();
    }
}

function insertRide() {
/*    if (args.Get("value").length > 50)
        return '{"result":"error"}';
    else { */
    
    db.Execute('INSERT INTO Rides (DriverID, DepartureCity, DepartureAddress, DestinationCity, DestinationDropoff, RideSeatsCapacity, RideSeatsTaken, RideNotes) VALUES (@currentUser, @departureCity, @departureAddress, @destinationCity, @destinationDropoff, @rideSeatsCapacity, 0, @rideNotes);');

    return getYourData();
}

// OPEN DATA API EXAMPLE

function getOpenData() {
    var apiKey = ""; // Paste your API key here. IMPORTANT: DO NOT PUSH THIS TO GITHUB, STORE KEY IN DB
    if (apiKey == "")
        return '{"error":"No Api Key! Add your key in the server script file."}';

    return proxy.GetProxy('https://api.uwaterloo.ca/v2/foodservices/watcard.json?key=' + apiKey);
}