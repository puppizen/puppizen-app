import mongoose from 'mongoose'; 

const mongodbUri = process.env.MONGODB_URI as string 
const mongodbName = process.env.MONGODB_NAME as string

if(!mongodbUri) {
    throw new Error("Mongodb uri not set")
}
if(!mongodbName){
    throw new Error("Mongodb name not set")
}

let isConnected: boolean = false;

export default async function connectDb () {
  if (isConnected) {
    // ✅ Already connected
    return;
  }

  try {
    const db = await mongoose.connect(mongodbUri, { dbName : mongodbName,
      maxPoolSize : 10,
      socketTimeoutMS : 45000,
      serverSelectionTimeoutMS : 5000,
    })
    isConnected = !!db.connections[0].readyState;
    console.log("DATABASE CONNECTION SUCCESSFUL")
  } catch(err){
    console.log(err)
  }
}