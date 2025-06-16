import "dotenv/config";
import "./loadEnv.js";
import http from "node:http";
import app from "../app.js";

/**
 * Get port from environment and store in Express.
 */

const port = process.env.PORT || 3000;

/**
 * Create HTTP server.
 */

const server = http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on("error", onError);
server.on("listening", onListening);

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  console.log(error);
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  console.log(`Server started on http://localhost:${port}\n`);
}
