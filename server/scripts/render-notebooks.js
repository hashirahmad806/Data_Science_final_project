const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const notebooksDir = path.join(__dirname, '../public/notebooks');
const outputDir = path.join(notebooksDir, 'rendered');

if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
}

fs.readdir(notebooksDir, (err, files) => {
    if (err) {
        console.error('Error reading notebooks directory:', err);
        return;
    }

    const notebooks = files.filter(f => f.endsWith('.ipynb'));
    
    if (notebooks.length === 0) {
        console.log('No .ipynb files found.');
        return;
    }

    notebooks.forEach(notebook => {
        const notebookPath = path.join(notebooksDir, notebook);
        const outputPath = path.join(outputDir, notebook.replace('.ipynb', '.html'));
        
        console.log(`Rendering ${notebook}...`);
        
        // Determine jupyter command path (checking local venv first)
        const venvJupyterWin = path.join(__dirname, '../../venv/Scripts/jupyter.exe');
        const venvJupyter = path.join(__dirname, '../../venv/Scripts/jupyter');
        let jupyterCmd = 'jupyter';
        if (fs.existsSync(venvJupyterWin)) {
            jupyterCmd = `"${venvJupyterWin}"`;
        } else if (fs.existsSync(venvJupyter)) {
            jupyterCmd = `"${venvJupyter}"`;
        }
        
        // Execute nbconvert
        exec(`${jupyterCmd} nbconvert --to html "${notebookPath}" --output-dir="${outputDir}"`, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error rendering ${notebook}:`, error);
                return;
            }
            if (stderr) {
                // nbconvert often writes to stderr even on success
                console.log(`nbconvert output for ${notebook}:`, stderr);
            }
            console.log(`Successfully rendered ${notebook} to HTML.`);
        });
    });
});
