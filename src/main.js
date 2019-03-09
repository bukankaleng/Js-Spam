const Command = require('./command');
const { Message, OpType, Location, Profile } = require('../curve-thrift/line_types');

class LINE extends Command {
    get myBot() {
        const bot = ['Remain this'];
        return bot; 
    }

    isAdminOrBot(param) {
        return this.myBot.includes(param);
    }

    getOprationType(operations) {
        for (let key in OpType) {
            if(operations.type == OpType[key]) {
                if(key !== 'NOTIFIED_UPDATE_PROFILE') {
                    console.info(`[* ${operations.type} ] ${key} `);
                }
            }
        }
    }

    poll(operation) {
        if(operation.type == 25) {
            let message = new Message(operation.message);
            this.receiverID = message.to = (operation.message.to === this.myBot[0]) ? operation.message._from : operation.message.to ;
            Object.assign(message,{ ct: operation.createdTime.toString() });
            this.textMessage(message)
        }
        this.getOprationType(operation);
    }

    command(msg, reply) {
        if(this.messages.text !== null) {
            if(this.messages.text === msg.trim()) {
                if(typeof reply === 'function') {
                    reply();
                    return;
                }
                if(Array.isArray(reply)) {
                    reply.map((v) => {
                        this._sendMessage(this.messages, v);
                    })
                    return;
                }
                return this._sendMessage(this.messages, reply);
            }
        }
    }

    async textMessage(messages) {
        this.messages = messages;
        let payload = (this.messages.text !== null) ? this.messages.text.split(' ').splice(1).join(' ') : '' ;
        let receiver = messages.to;
        let sender = messages.from;
        
        this.command(`exec ${payload}`,this.noxtSpamGroup.bind(this));
    }

}

module.exports = LINE;
