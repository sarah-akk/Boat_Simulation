import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert __dirname to ESM-friendly version
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        icon: path.join(__dirname, 'logo.ico'),
    });

    win.loadFile(path.join(__dirname, 'dist/index.html'), {
        baseURLForDataURL: `file://${__dirname}/dist/`
    });
}

app.whenReady().then(createWindow);
