const express = require("express");
const axios = require("axios");
const PDFParser = require("pdf-parse");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;
const fs = require("fs");


const app = express();
const port = 3000;


app.get("/", async (req, res) => {
 try {
  // Step 2: Download PDF File
  const pdfUrl =
   "https://drive.google.com/file/d/15BBbg7n77SlHzTIbz3o2a3QGGTDhbUi9/view?usp=sharing";
  const pdfPath = "downloaded.pdf";


  const response = await axios({
   method: "GET",
   url: pdfUrl,
   responseType: "stream",
  });


  response.data.pipe(fs.createWriteStream(pdfPath));


  response.data.on("end", async () => {
   //extract text from PDF
   const pdfData = await readPDF(pdfPath);


   //Data Extraction
   const extractedData = extractData(pdfData.text);


   //Writing Data to CSV
   const csvWriter = createCsvWriter({
    path: "output.csv",
    header: [
            { id: 'orderNumber', title: 'Order Number' },
            { id: 'invoiceNumber', title: 'Invoice Number' },
            { id: 'buyerName', title: 'Buyer Name' },
            { id: 'buyerAddress', title: 'Buyer Address' },
            { id: 'invoiceDate', title: 'Invoice Date' },
            { id: 'orderDate', title: 'Order Date' },
            { id: 'productTitle', title: 'Product Title' },
            { id: 'hsn', title: 'HSN' },
            { id: 'taxableValue', title: 'Taxable Value' },
            { id: 'discount', title: 'Discount' },
            { id: 'taxRateCategory', title: 'Tax Rate and Category' },
        ],
   });


   await csvWriter.writeRecords([extractedData]);
   console.log("Data written to CSV");


   res.send("Data extraction and CSV writing successful.");
  });
 } catch (error) {
  console.error("Error:", error.message);
  res.status(500).send("Internal Server Error");
 }
});


async function readPDF(filePath) {
 let dataBuffer = fs.readFileSync(filePath);
 return PDFParser(dataBuffer);
}


function extractData(text) {
 const orderNumberRegex = /Order Number:\s*(\S+)/;
    const invoiceNumberRegex = /Invoice Number:\s*(\S+)/;
    const buyerNameRegex = /Buyer Name:\s*(.+)/;
    const buyerAddressRegex = /Buyer Address:\s*(.+)/;
    const invoiceDateRegex = /Invoice Date:\s*(\S+)/;
    const orderDateRegex = /Order Date:\s*(\S+)/;
    const productTitleRegex = /Product Title:\s*(.+)/;
    const hsnRegex = /HSN:\s*(\S+)/;
    const taxableValueRegex = /Taxable Value:\s*(\S+)/;
    const discountRegex = /Discount:\s*(\S+)/;
    const taxRateCategoryRegex = /Tax Rate and Category:\s*(.+)/;




    const orderNumber = text.match(orderNumberRegex)[1];
    const invoiceNumber = text.match(invoiceNumberRegex)[1];
    const buyerName = text.match(buyerNameRegex)[1];
    const buyerAddress = text.match(buyerAddressRegex)[1];
    const invoiceDate = text.match(invoiceDateRegex)[1];
    const orderDate = text.match(orderDateRegex)[1];
    const productTitle = text.match(productTitleRegex)[1];
    const hsn = text.match(hsnRegex)[1];
    const taxableValue = text.match(taxableValueRegex)[1];
    const discount = text.match(discountRegex)[1];
    const taxRateCategory = text.match(taxRateCategoryRegex)[1];




    return {
        orderNumber,
        invoiceNumber,
        buyerName,
        buyerAddress,
        invoiceDate,
        orderDate,
        productTitle,
        hsn,
        taxableValue,
        discount,
        taxRateCategory,
    };
}






app.listen(port, () => {
 console.log(Server listening at http://localhost:${port});
});
