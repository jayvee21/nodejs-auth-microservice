module.exports = {
    port: process.env.PORT || 3001,
    services: {
        auth: process.env.AUTH || "http://localhost:3000"
    }
}