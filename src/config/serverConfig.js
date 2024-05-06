const dotenv = require("dotenv")
dotenv.config();

module.exports={
    PORT:process.env.PORT,
    DATABASE_URL:process.env.DATABASE_URL,
    CLIENT_URL : process.env.CLIENT_URL,
    EMAIL_SERVICE : process.env.EMAIL_SERVICE,
    KEY:process.env.CRYPTO_KEY
}

