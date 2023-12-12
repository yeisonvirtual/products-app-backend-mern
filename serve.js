// para varibles de entorno
const dotenv = require('dotenv')
dotenv.config()

const app = require('./app')

// configuracion de la app
const { appConfig, dbConfig } = require('./config')
// DB
const connectDB = require('./db/mongodb')

async function initApp (appConfig, dbConfig){

  try {
    await connectDB(dbConfig)
    app.listen(appConfig.port,()=> console.log(`listen on ${appConfig.port}`))
  } catch (e) {
    console.log(e)
    process.exit(0)
  }
  
}

initApp(appConfig, dbConfig)