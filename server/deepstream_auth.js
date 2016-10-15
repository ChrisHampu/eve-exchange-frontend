import EventEmitter from 'events';
import fetch from 'node-fetch';

class AuthHandler extends EventEmitter{
    constructor() {
        // Extend EventEmitter
        super();

        // Or start with false if you need to do some initialisation first
        // and call this.emit( 'ready' ); a bit later
        this.isReady = true;
    }

    isValidUser( connectionData, authData, callback ) {
        
        if (!authData || (!authData.token && !authData.admin)) {
            callback(false, "Invalid credentials");
            return;
        }

        fetch('http://localhost:5000/deepstream/authorize', { timeout: 2000, method: 'POST', body: JSON.stringify({authData}), headers: {'Content-Type': 'application/json'}})
        .then((res) => {

            if (!res.ok) {
                throw res.text();
            }

            return res.json();
        })
        .then((json) => {

            callback(true, json);
        })
        .catch((err) => {
            return err;
        })
        .then((err) => {
            if (!err) {
                return;
            }
            callback(false, err);
        });
    }

    onClientDisconnect( username ) {
        //optional callback for disconnecting clients
    }
}

export default AuthHandler;