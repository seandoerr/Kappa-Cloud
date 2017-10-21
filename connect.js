var options = {
    options: {
        debug: true
    },
    connection: {
        reconnect: true,
    },
    identity: {
        username: "TheDapperRussian",
        password: "oauth:j5qhr7pjx9fbgeoxjhjzu1bxfturan"
    },
    channels: ["#nl_kripp"]
};

var client = new tmi.client(options);

// Connect the client to the server..
client.connect();
