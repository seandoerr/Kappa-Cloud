var options = {
    options: {
        debug: false
    },
    connection: {
        reconnect: true,
    },
    identity: {
        username: "MrMcBot",
        password: "oauth:63mtcfcc4lko1lm519zgqk5ykcgcjm"
    },
    channels: ["#nl_kripp", "#pgl_dota"]
};

var client = new tmi.client(options);

// Connect the client to the server..
client.connect();
