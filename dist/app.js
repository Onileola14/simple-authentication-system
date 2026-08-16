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
// Local modules
const connectDB_1 = __importDefault(require("./db/connectDB"));
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
// Routes
app.get("/", (req, res) => {
    res.send("simple authentication system");
});
app.use("/api/v2/auth", auth_route_1.default);
app.use("/api/v2/user", user_route_1.default);
// Error handling
app.use(notFound_1.default);
app.use(error_handler_1.default);
const port = process.env.PORT || 3000;
const start = async () => {
    try {
        await (0, connectDB_1.default)(process.env.MONGO_URI);
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