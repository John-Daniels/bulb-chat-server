import mongoose from "mongoose";

const main = () => {
    const _uri: string = (process.env.MONGODB_URI) as string;
    mongoose.connect(_uri, (err) => {
        if (err) return console.log("Error connecting to the database!!!");
        console.log("Successfully connected to the database!");
    });

};

main();
