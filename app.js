var emoteQueue = new Queue();
var msgQueue = new Queue();

var startTime = now();
var delayTime = 30;


var minScale = .25;
var maxScale = 5;
var msgLimit = 50;
var paddingLimit = 25;



var emoteMap = {};
emoteMap.totalEmotes = 0;
emoteMap.emotes = Object.create(null);

function now(){
    return Math.round(Date.now() / 1000);
}

client.on("chat", function (channel, userstate, message, self) {
    // Don't listen to my own messages..
    if (self) return;

    // Do your stuff.
    
    if(userstate.emotes){
        
        drawchat({message: message, userstate: userstate, channel: channel});
        
        for(emote in userstate.emotes){
            
            //Add to the overall queue
            var emoteQueueObj ={};
            emoteQueueObj.count = userstate.emotes[emote].length;
            emoteQueueObj.id = emote;
            emoteQueue.enqueue(emoteQueueObj);
            
//            console.log("Enqueued emote: ", emote);
            
            //Make sure there's a number in here so we can easily add new hits
            if(!emoteMap.emotes[emote]){
                emoteMap.emotes[emote] = {};
                emoteMap.emotes[emote].count = 0;
                emoteMap.emotes[emote].weight = 0.00;
                emoteMap.emotes[emote].lastUsed = 0;
                emoteMap.emotes[emote].ranges = userstate.emotes[emote];
                emoteMap.emotes[emote].name = getEmoteName(message, userstate.emotes[emote][0]);
            }

            emoteMap.emotes[emote].count += userstate.emotes[emote].length;
            emoteMap.emotes[emote].lastUsed = now();
            emoteMap.totalEmotes += userstate.emotes[emote].length;
            
            if((now() - startTime) > delayTime && !emoteQueue.isEmpty()){
                var dequeuedEmote = emoteQueue.dequeue();
                emoteMap.emotes[dequeuedEmote.id].count -= dequeuedEmote.count;
                emoteMap.totalEmotes -= dequeuedEmote.count;
                
                if(emoteMap.emotes[dequeuedEmote.id].count < 1){
//                    delete emoteMap.emotes[dequeuedEmote.id].count;
                }
//                console.log("Dequeue'd emote: ", dequeuedEmote.id);
            }
            
        }
        
        reweigh();
//        console.log(emoteMap);
    }
});

function getEmoteName(message, range){
//    console.log(message, " ", range)
    var markers = range.split('-');
//    console.log(markers);
    return message.substring(markers[0], markers[1] + 1);
}

function clamp(value, low, high){
    if(value > high){
        return high;
    } else if (value < low){
        return low;
    }
    return value;
}


function reweigh(){
    //Save this outside the loop so we don't keep changng our current time
    var currTime = now();
    
    //Base reweight and added weight decay
    for(emote in emoteMap.emotes){
        var thisEmote = emoteMap.emotes[emote];
        var decay = 1;
        var prevWeight = thisEmote.weight;
        //Base weight
        thisEmote.weight = thisEmote.count / emoteMap.totalEmotes;
//        console.log(`Reweighed emote '${emote}' from ${prevWeight} to ${thisEmote.weight}`);
    }
    drawEmotes();
    
}

function drawEmotes(){
    
    for(emote in emoteMap.emotes){
        var currEmote = emoteMap.emotes[emote];
        var emoteId = `#emote${emote}`;
        var emoteElement = $(emoteId);
        var emoteScaledWeight = clamp(currEmote.weight * maxScale, minScale, maxScale);
        var emoteScale = `scale(${emoteScaledWeight})`
        
        if(!emoteElement[0] && currEmote.weight > 0){
            var newEmoteElement = $("<img>");
            newEmoteElement.attr("src", `https://static-cdn.jtvnw.net/emoticons/v1/${emote}/3.0`);
            newEmoteElement.attr("id", `emote${emote}`);
            newEmoteElement.attr("data-weight", currEmote.weight);
            newEmoteElement.addClass("emote");
            newEmoteElement.css("transform", emoteScale);
            newEmoteElement.css("padding", `${emoteScaledWeight * paddingLimit}px`);
            $("#kappa").prepend(newEmoteElement);
        } else {
            if(currEmote.weight == 0){
                emoteElement.remove();
                continue;
            }
            emoteElement.css("transform", emoteScale);
            emoteElement.css("padding", `${emoteScaledWeight * paddingLimit}px`);
            emoteElement.attr("data-weight", currEmote.weight);
        }    
    }
        
//        console.log(nodes);
        
}

function drawchat(msgObj){
    
    if($('.msg').length > msgLimit)
        $('.msg:first-of-type').remove();
    
    
    var chatElement = $("<div></div>");
    chatElement.addClass("msg");
    var userName = $(`<span></span>`);
    userName.css("color", msgObj.userstate.color);
    userName.html(msgObj.userstate['display-name']);
    var channelLink = $("<a href='#' class='channel'></a>");
    channelLink.html(msgObj.channel);
    channelLink.attr("data-channel", msgObj.channel.substring(1,msgObj.channel.length));
//    console.log(userName);
    var chatMsg = `<${channelLink[0].outerHTML}> ${userName[0].outerHTML}: ${msgObj.message}`;
//    console.log(chatMsg);
    chatElement.append(chatMsg);
    
    $("#chat").append(chatElement);
}