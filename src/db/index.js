import mongoose from "mongoose";
//import {dbName} from "../constants.js";
const dbName = 'chai-code-practise'

const connectDB = async ()=>{
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${dbName}`)
        console.log(`\n MONGODB connected !! DB HOST: ${connectionInstance.connection.host}`)
    } catch (error) {
        console.log('MONGODB connection error ', error)
        process.exit(1)
    }
}

export default connectDB