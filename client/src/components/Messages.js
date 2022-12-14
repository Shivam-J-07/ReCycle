import React from 'react';
import io from 'socket.io-client';

class Messages extends React.Component {
    constructor() {
        super();
        this.state = {
            recipient: "arnavgupta",
            messages: [
                {
                    "recipient": "padenaaaa",
                    "messages": [
                        {
                            "author": "arnavgupta",
                            "message": "how about 4pm on tuesday?"
                        },
                        {
                            "author": "padenaaaa",
                            "message": "works for me!"
                        },
                    ]
                }
            ],
            message: "",
            messageBoxMessages: [],
            messageVal: ""
        }

        this.setMessageBox = this.setMessageBox.bind(this)
    }

    setMessageBox(messages) {
        this.setState({messageBoxMessages:messages})
    }

    sendMessageVal(message) {
        this.socket.emit("sendMessage", {"message": message, "room": "theroom", "user": "arnavgupta"})
        this.setState({messageVal: ""})
    }

    updateInputValue(evt) {
        const val = evt.target.value;
        this.setState({
            messageVal: val
        })
    }

    componentDidMount() {
        var sensorEndpoint = "http://localhost:5000"
        this.socket = io.connect(sensorEndpoint);
        this.socket.on("receiveMessage", data => {
            console.log(data)
            console.log(this.state.messageBoxMessages[this.state.messageBoxMessages.length - 1])
            let curMessages = this.state.messageBoxMessages
            curMessages.push({author: data.user, message: data.message})
            curMessages = curMessages.filter((value, index, self) => {
                return index === self.findIndex((t) => (
                    t.author === value.author, t.message === value.message
                ))
            })
            this.setState({messageBoxMessages: curMessages})
        })  
        if (this.state.messageBoxMessages[this.state.messageBoxMessages.length - 1] === this.state.messageBoxMessages[this.state.messageBoxMessages.length - 2]) {
            let newMessages = this.state.messageBoxMessages
            newMessages.pop()
            this.setState({messageBoxMessages: newMessages})
        } 
    }
    render() {
        return (
            <div className="Messages">
                <div className='left-bar'>
                    <h1>Messages</h1>
                    <ul className='recipients-list'>
                        {this.state.messages.map((messageSet) => <li><div className='recipient' onClick={() => this.setMessageBox(messageSet.messages)}>{messageSet.recipient}</div></li>)}
                    </ul>
                </div>
                <div className='right-bar'>
                    <h3>Your Conversation History</h3>
                    <ul id="messagebox">
                        {Array.from(new Set(this.state.messageBoxMessages)).map((messageSet) => <li><b>{messageSet.author}:</b> {messageSet.message}</li>)}
                        <div className='message-type'>
                        <input value={this.state.messageVal} onChange={evt => this.updateInputValue(evt)} type={"text"} /> <button type='button' className='btn' onClick={() => this.sendMessageVal(this.state.messageVal)}>Send Message</button>
                        </div>
                    </ul>
                </div>
            </div>
        ); 
    }
}

export default Messages;