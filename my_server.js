import express from 'express';
import connectToMongoDB from './config/mongodb.js';
import productRoutes from './routes/productRoutes.js'

const app = express();
const PORT = 5000;

app.use(express.json());
app.use("/uploads", express.static("uploads")); // to view images in browser

const startServer = async () => {
    await connectToMongoDB();

    // Routes
    app.use("/", productRoutes);

    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
};

startServer();