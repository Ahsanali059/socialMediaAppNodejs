const mongoose = require("mongoose");

mongoose.set("strictQuery",false);


class Database {
    constructor(uri,options)
    {
        this.uri = uri;
        this.options = options;
    }

    async connect()
    {
        try
        {
            await mongoose.connect(this.uri,this.options);
            console.log(
                `Connected to the Database:${mongoose.connection.db.Database}`
            );
        }catch(err)
        {
           console.log("something went wrong while conneted to database "+err)
        }
    }

    async disconnect()
    {
        try
        {
           await mongoose.disconnect();
           console.log(`
           Disconnected from database:${mongoose.connection.db.Database};
           `)
        }
        catch(err)
        {
           throw err;
        }
    }
}

module.exports = Database;