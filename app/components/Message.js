import React from 'react';

Message = { //message id is automativally assigned thanks to the main chat flat list
    id: String,
    user: String, //sender or receiver
    content: String, //array of multiple choice texts (situations)
    sendAt: String,
}

export default Message;