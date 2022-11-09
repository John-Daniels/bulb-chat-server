import mongoose from "mongoose";

const main = async (): Promise<void> => {
    //this is used in our local environment
    try {
        //                         main_atlas_url            || fallback to test_uri - when testing
        const _uri: string = (process.env.MONGODB_URI || process.env.TEST_URI) as string;

        await mongoose.connect(_uri);

        console.log("Successfully connected to the database!");
    } catch (e) {
        console.log("Error connecting to the database!!!");
    }
};

main();
