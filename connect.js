var options = {
    options: {
        debug: true
    },
    connection: {
        reconnect: true,
    },
    identity: {
        username: "username",   //fill in for your own account
        password: "auth code"  //paste code from https://twitchapps.com/tmi/
    },
    channels: ["#dansgaming", "#reckful"] //for channel you want to connect to
};

var client = new tmi.client(options);

// Connect the client to the server..
client.connect();