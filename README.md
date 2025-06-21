# Dynamic PDF Generator

This project generates a dynamic, multi-page PDF report from HTML templates using Node.js, Express, Puppeteer, EJS, and Tailwind CSS.

## Setup and Installation

1.  **Install Dependencies:**
    Open your terminal in the project root and run:
    ```bash
    npm install
    ```

2.  **Build CSS:**
    The project uses Tailwind CSS for styling. You need to build the utility CSS file from the source.
    ```bash
    npm run build:css
    ```
    *For development, you can use `npm run watch:css` to automatically rebuild the CSS when you make changes to the EJS or CSS files.*

## Running the Application

1.  **Start the Server:**
    Once the dependencies are installed and the CSS is built, start the Express server:
    ```bash
    npm start
    ```
    You should see a confirmation message that the server is running on `http://localhost:3000`.

2.  **Generate a PDF:**
    To generate a PDF report, open your web browser and navigate to the following URL:
    ```
    http://localhost:3000/generate-pdf/your-report-id
    ```
    Replace `your-report-id` with any identifier (e.g., `123`, `test-report`). The application will generate the PDF and your browser will prompt you to download it.
