var options = {
    options: {
        debug: true
    },
    connection: {
        reconnect: true,
    },
    identity: {
        username: "",
        password: ""
    },
    channels: ["#nl_kripp"]
};

var client = new tmi.client(options);

// Connect the client to the server..
client.connect();
