// DATABASE PERSISTENCE EXAMPLE

// Retreive data from the database
function getData() {
    var queryResult = db.Execute('SELECT * FROM rides');
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

// Search table
function searchForRides() {
	var queryResult = db.Execute('SELECT * FROM rides where DepartureCity=@departureCity AND DestinationCity=@arrivalCity');
    return queryResult;
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

// Book Ride
function bookRideNow() {
    if (args.Get("numPassengers") == 0) {
        db.Execute('UPDATE rides set RideSeatsTaken=RideSeatsTaken+1, PassengerID1=@currentUser WHERE RideId=@id');
    } else if (args.Get("numPassengers") == 1) {
        db.Execute('UPDATE rides set RideSeatsTaken=RideSeatsTaken+1, PassengerID2=@currentUser WHERE RideId=@id');
    } else if (args.Get("numPassengers") == 2) {
        db.Execute('UPDATE rides set RideSeatsTaken=RideSeatsTaken+1, PassengerID3=@currentUser WHERE RideId=@id');
    }
}

// OPEN DATA API EXAMPLE

function getOpenData() {
    var apiKey = ""; // Paste your API key here. IMPORTANT: DO NOT PUSH THIS TO GITHUB, STORE KEY IN DB
    if (apiKey == "")
        return '{"error":"No Api Key! Add your key in the server script file."}';

    return proxy.GetProxy('https://api.uwaterloo.ca/v2/foodservices/watcard.json?key=' + apiKey);
}