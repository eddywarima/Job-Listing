# Install Babel Plugin for React JSX Transformation

To use the updated Vite configuration with Babel plugin support, you need to install the required package.

## Installation Command

Run this command in the `frontend` directory:

```bash
npm install --save-dev @babel/plugin-transform-react-jsx
```

## Alternative Installation Methods

### If npm command doesn't work due to PowerShell execution policy:

1. **Open Command Prompt (cmd) instead of PowerShell:**
   - Press `Win + R`
   - Type `cmd` and press Enter
   - Navigate to the frontend directory:
     ```cmd
     cd "C:\Users\eunit\Documents\PLP ACADEMY\JLP\Job-Listing\frontend"
     npm install --save-dev @babel/plugin-transform-react-jsx
     ```

2. **Or change PowerShell execution policy (run as Administrator):**
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```
   Then run the npm install command.

3. **Or use npx directly:**
   ```powershell
   npx --yes @babel/plugin-transform-react-jsx
   ```

## After Installation

Once the package is installed, the Vite configuration will automatically use it. Run your tests:

```bash
npm test
```

## What This Does

The Babel plugin configuration:
- Forces automatic JSX runtime transformation
- Ensures proper React JSX preamble detection
- Fixes the "can't detect preamble" error in Vitest

