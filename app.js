var emoteQueue = new Queue();
var msgQueue = new Queue();

var startTime = now();
var delayTime = 60;

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
        
        
        
        for(emote in userstate.emotes){
            
            //Add to the overall queue
            var emoteQueueObj ={};
            emoteQueueObj.count = userstate.emotes[emote].length;
            emoteQueueObj.id = emote;
            emoteQueue.enqueue(emoteQueueObj);
            
            console.log("Enqueued emote: ", emote);
            
            //Make sure there's a number in here so we can easily add new hits
            if(!emoteMap.emotes[emote]){
                emoteMap.emotes[emote] = {};
                emoteMap.emotes[emote].count = 0;
                emoteMap.emotes[emote].weight = 0.00;
                emoteMap.emotes[emote].lastUsed = 0;
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
                console.log("Dequeue'd emote: ", dequeuedEmote.id);
            }
            
        }
        
        reweigh();
        console.log(emoteMap);
    }
});


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
        console.log(`Reweighed emote '${emote}' from ${prevWeight} to ${thisEmote.weight}`);
    }
    drawEmotes();
    
}

function drawEmotes(){
    
    for(emote in emoteMap.emotes){
        var currEmote = emoteMap.emotes[emote];
        var emoteId = `#emote${emote}`;
        var emoteElement = $(emoteId);
        var emoteScale = `scale(${clamp(currEmote.weight * 3, .5, 3)})`
        
        if(!emoteElement[0] && currEmote.weight > 0){
            var newEmoteElement = $("<img>");
            newEmoteElement.attr("src", `https://static-cdn.jtvnw.net/emoticons/v1/${emote}/3.0`);
            newEmoteElement.attr("id", `emote${emote}`);
            newEmoteElement.addClass("emote");
            newEmoteElement.css("transform", emoteScale);
            $("#kappa").prepend(newEmoteElement);
        } else {
            if(currEmote.weight == 0){
                emoteElement.remove();
                continue;
            }
            emoteElement.css("transform", emoteScale);
        }
        
    }
    
}