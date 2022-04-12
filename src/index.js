import app from './config/index.js';
import dotenv from 'dotenv';

dotenv.config({ path: '../.env' });
const PORT = process.env.PORT || 4004;

app.listen(PORT, () => {
    console.log(`Servidor running on PORT ${PORT}`);
});
