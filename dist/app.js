"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
require("async-express-error");
// Third-party packages
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const path_1 = __importDefault(require("path"));
// Local modules
const connectDB_1 = require("./db/connectDB");
const error_handler_1 = __importDefault(require("./middlewares/error-handler"));
const notFound_1 = __importDefault(require("./middlewares/notFound"));
const auth_route_1 = __importDefault(require("./auth/auth.route"));
const user_route_1 = __importDefault(require("./user/user.route"));
const app = (0, express_1.default)();
app.set("trust proxy", 1);
// Global middleware
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)(process.env.JWT_SECRET));
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
// Static front end — built from client/ into ./public (see `npm run build:client`).
// Serving same-origin means the httpOnly JWT cookie flows without CORS.
const publicDir = path_1.default.join(process.cwd(), "public");
app.use(express_1.default.static(publicDir));
// API routes
app.use("/api/v2/auth", auth_route_1.default);
app.use("/api/v2/user", user_route_1.default);
// SPA fallback: serve the UI for any non-API GET that didn't match a static file.
app.use((req, res, next) => {
    if (req.method === "GET" && !req.path.startsWith("/api")) {
        return res.sendFile(path_1.default.join(publicDir, "index.html"), (err) => {
            if (err)
                next();
        });
    }
    next();
});
// Error handling
app.use(notFound_1.default);
app.use(error_handler_1.default);
const port = process.env.PORT || 3000;
const MONGO_URI = process.env.MONGO_URI || "";
if (!MONGO_URI) {
    throw new Error("MONGO_URI environment variable is required");
}
const start = async () => {
    try {
        await (0, connectDB_1.connectDB)(MONGO_URI);
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
    catch (error) {
        console.error(error);
    }
};
start();
//# sourceMappingURL=app.js.map