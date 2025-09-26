Ignore os arquivos no .gitignore
node_modules
.env

Moolde .env
MONGO_URI=mongodb+srv://user:password@nomebanco.dg3g0d7.mongodb.net/?retryWrites=true&w=majority&appName=Nomebanco

Install dependencias 

"scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js"
  },
  "dependencies": {
    "bcrypt": "^5.1.1",
    "cors": "^2.8.5",
    "dotenv": "^16.4.5",
    "express": "^4.19.2",
    "mongoose": "^7.6.3"
  },
  "devDependencies": {
    "nodemon": "^3.1.0"
  }
