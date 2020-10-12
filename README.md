# Sotly URL Shortner

LIVE Preview: https://codedoc.herokuapp.com

NOTE: This is Backend of the WebApp.
Frontend: https://github.com/abhishekraj272/Shotly-URL-Shortner-Frontend

## Tools Used
1. ExpressJS
2. NodeJS
3. Mongoose
4. MongoDB

## Running Locally
```bash
git clone https://github.com/abhishekraj272/Shotly-URL-Shortner-Backend

cd Shotly-URL-Shortner-Backend

# Create .env file and paste
MONGO_URI=<Your MongoDB URL Here>

npm install

npm start
```

## APIs available
1. POST /api/v1/shorten
```bash
Content-Type: application/json

{
    "urlReceived": originalURL,
    "urlCode": alias
}
```
2. GET /api/v1/count
3. GET /{alias}