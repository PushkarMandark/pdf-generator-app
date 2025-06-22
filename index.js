const express = require('express');
const puppeteer = require('puppeteer');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Dummy data simulation
const fetchDataForReport = (reportId) => {
    // In a real app, you might fetch data from a database based on reportId
    return {
        reportTitle: "Sharper Sourcing with AI: BOM Optimisation & Savings",
        companyName: "1BUY.AI",
        edition: "Napino edition",
        executiveSummary: {
            mpnsAnalysed: 5,
            valueAnalysed: "$867,982",
            savingsUnlocked: "$111,485",
            bomSavingsPercentage: "12.84%",
            summaryMetrics: [{
                label: "Total sourcing value analyzed", value: "$867,982"
            }, {
                label: "Annual volume requirement", value: "8,031,860 Parts"
            }, {
                label: "Maximum Identified Savings Potential", value: "$111,485"
            }, {label: "Annual Savings Opportunity in %", value: "12.84 %"}]
        },
        detailedCostBreakdown: [{
            Category: "Active",
            "Current Cost": "$835,473",
            "Optimised Cost": "$727,878",
            Savings: "$107,595",
            "Optimisation Strategy": "Alternate IC sourcing , multi-source alignment , package optimization"
        }, {
            Category: "Passive",
            "Current Cost": "$32,509",
            "Optimised Cost": "$28,620",
            Savings: "$3,889",
            "Optimisation Strategy": "Alternate sourcing , multi-source alignment , package optimization"
        }, {
            Category: "Total",
            "Current Cost": "$867,982",
            "Optimised Cost": "$756,498",
            Savings: "$111,484",
            "Optimisation Strategy": ""
        }],
        mpnWiseSavings: [{
            MPN: "DTC114EU3HZGT106", Savings_Peers: "$5,878", Savings_Domestic: "$5,466", Saving_Global: "$6,252"
        }, {
            MPN: "R5F10BLGCKFB#15", Savings_Peers: "$17,485", Savings_Domestic: "$18,230", Saving_Global: "$34,095"
        }, {
            MPN: "GCM188R71C474KA55D", Savings_Peers: "$3,434", Savings_Domestic: "$3,189", Saving_Global: "$3,889"
        }, {
            MPN: "TLE8444SL", Savings_Peers: "$43,371", Savings_Domestic: "$44,429", Saving_Global: "$62,880"
        }, {
            MPN: "BC817-25,215", Savings_Peers: "$3,848", Savings_Domestic: "$3,825", Saving_Global: "$4,368"
        }, {
            MPN: "TOTAL SAVINGS", Savings_Peers: "$74,016", Savings_Domestic: "$75,139", Saving_Global: "$111,484"
        }, {MPN: "% SAVINGS TOTAL", Savings_Peers: "8.53 %", Savings_Domestic: "8.66 %", Saving_Global: "12.84 %"}],
        componentRiskAnalysis: [{
            MPN: "R5F10BLGCKFB#15",
            "Lifecycle Status": "NRND",
            "Risk Level": "High",
            Remarks: "Not Recommended for New Designs (Renesas MCU)"
        }, {
            MPN: "TLE8444SL",
            "Lifecycle Status": "EOL Warning (2023 notice)",
            "Risk Level": "High",
            Remarks: "End-of-life notice issued; replacements should be evaluated"
        }, {
            MPN: "DTC114EU3HZGT106",
            "Lifecycle Status": "Active (older series)",
            "Risk Level": "Medium",
            Remarks: "Legacy digital transistor; roadmap uncertainty"
        }, {
            MPN: "GCM188R71C474KA55D",
            "Lifecycle Status": "Active",
            "Risk Level": "Low",
            Remarks: "Automotive-grade MLCC with stable, multi-source availability"
        }, {
            MPN: "BC817-25,215",
            "Lifecycle Status": "Active",
            "Risk Level": "Low",
            Remarks: "Widely used transistor; robust supply and multiple manufacturers"
        }],
        mpnAnalysisPages: [{
            id: "mpn-dtc114eu3hzgt106",
            mpn: "DTC114EU3HZGT106",
            title: "MPN Analysis: DTC114EU3HZGT106",
            summary: "Detailed analysis for DTC114EU3HZGT106 covering pricing, availability, and potential alternatives."
        }, {
            id: "mpn-r5f10blgckfb15",
            mpn: "R5F10BLGCKFB#15",
            title: "MPN Analysis: R5F10BLGCKFB#15",
            summary: "Detailed analysis for R5F10BLGCKFB#15, focusing on its NRND status and high risk implications."
        }, {
            id: "mpn-222b3c4d5e6f7g8h9i",
            mpn: "DTC114EU3HZGT106",
            title: "MPN Analysis: DTC114EU3HZGT106",
            summary: "Detailed analysis for DTC114EU3HZGT106 covering pricing, availability, and potential alternatives."
        }, {
            id: "mpn-r5f10b12sslgckfb15",
            mpn: "R5F10BLGCKFB#15",
            title: "MPN Analysis: R5F10BLGCKFB#15",
            summary: "Detailed analysis for R5F10BLGCKFB#15, focusing on its NRND status and high risk implications."
        }, {
            id: "mpn-dtc114eu3hsadasw22zgt106",
            mpn: "DTC114EU3HZGT106",
            title: "MPN Analysis: DTC114EU3HZGT106",
            summary: "Detailed analysis for DTC114EU3HZGT106 covering pricing, availability, and potential alternatives."
        }, {
            id: "mpn-r5f10blgckfb1sadasd225",
            mpn: "R5F10BLGCKFB#15",
            title: "MPN Analysis: R5F10BLGCKFB#15",
            summary: "Detailed analysis for R5F10BLGCKFB#15, focusing on its NRND status and high risk implications."
        },]
    };
};

// PDF Generation Logic
const generatePdf = async (htmlContent) => {
    const browser = await puppeteer.launch({
        headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    await page.setContent(htmlContent, {waitUntil: 'networkidle0'});
    const pdfBuffer = await page.pdf({
        format: 'A4',
        printBackground: true,
        margin: '0',  // No margins by default
        displayHeaderFooter: false,
        preferCSSPageSize: true
    });
    await browser.close();
    return pdfBuffer;
};

// Main endpoint
app.get('/generate-pdf/:reportId', async (req, res) => {
    try {
        const {reportId} = req.params;
        const reportData = fetchDataForReport(reportId);

        // Define page structure for TOC and rendering
        const pages = [
            {
                id: 'about-1buy',
                title: 'About 1BUY.AI',
                template: 'about1buy',
                pageNumber: '03',
                level: 1,
                pageType: 'full-bleed'  // Full-bleed page with no margins
            },
            {
                id: 'about-ai',
                title: 'About Our AI Infrastructure',
                template: 'aboutAI',
                pageNumber: '05',
                level: 1,
                pageType: 'with-margins'  // Page with margins
            },
            {
                id: 'exec-summary',
                title: 'Executive Summary',
                template: 'executiveSummary',
                pageNumber: '06',
                level: 1,
                pageType: 'with-margins'  // Page with margins
            },
            {
                id: 'cost-breakdown',
                title: 'Detailed Cost Breakdown and Savings Opportunities',
                template: 'detailedCostBreakdown',
                pageNumber: '12',
                level: 2,
                pageType: 'with-margins'  // Page with margins
            },
            {
                id: 'mpn-savings',
                title: 'MPN Wise Savings',
                template: 'mpnWiseSavings',
                pageNumber: '13',
                level: 2,
                pageType: 'with-margins'  // Page with margins
            },
            {
                id: 'risk-analysis',
                title: 'Component Risk and Lifecycle Analysis',
                template: 'componentRiskAnalysis',
                pageNumber: '14',
                level: 2,
                pageType: 'with-margins'  // Page with margins
            },
            ...reportData.mpnAnalysisPages.map((mpnPage, index) => ({
                id: mpnPage.id,
                title: mpnPage.title,
                template: 'mpnAnalysisPage',
                level: 1,
                pageData: mpnPage,
                pageType: 'with-margins'  // Page with margins
            }))
        ];


        // Read compiled CSS
        const cssPath = path.join(__dirname, 'public', 'output.css');
        const css = fs.readFileSync(cssPath, 'utf-8');

        // Read image and convert to Base64 for embedding
        const imagePath = path.join(__dirname, 'public', 'images', 'onebuySphare.png');
        const imageBase64 = fs.readFileSync(imagePath, 'base64');
        const imageSrc = `data:image/png;base64,${imageBase64}`;

        // Render EJS template
        const templatePath = path.join(__dirname, 'views', 'reportTemplate.ejs');
        const html = await ejs.renderFile(templatePath, {
            data: reportData, pages: pages, css: css, orbImage: imageSrc
        });

        // Generate PDF
        const pdfBuffer = await generatePdf(html);

        // Send PDF as response
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename=report-${reportId}.pdf`);
        res.send(pdfBuffer);

    } catch (error) {
        console.error('Error generating PDF:', error);
        res.status(500).send('Failed to generate PDF.');
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    console.log(`Generate a PDF by visiting http://localhost:${PORT}/generate-pdf/123`);
});
