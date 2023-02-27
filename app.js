var http = require("http");
const NodePdfPrinter = require("node-pdf-printer");
const path = require("path");
var pdf = require("html-pdf");
var requestify = require("requestify");
var fs = require("fs");
var executed = false;

http
  .createServer(function (req, res) {
    let data = seperateData(req.url);
    let id = data[1];
    console.log(id);

    if (!executed) {
      // executed = true;
      if (id != "favicon.ico") {
        // let myPromise = new Promise(function (myResolve, myReject) {
        //   myResolve();
        //   // myReject();
        // })
        //   .then((res) => {
        //     GetMainInvoice(id);
        //   })
        //   .finally(() => {
        //     Print(id + ".pdf", "POS-90");
        //   });
        GetMainInvoice(id)
        // setTimeout(function () {
        // }, 0);
      }
    } else {
      executed = false;
    }

    res.write(id);
    res.end();
  })
  .listen(8080);

function seperateData(initData) {
  let data = initData.split("/");
  return data;
}

function Print(pdfToPrint, printer) {
  const array = ["C:\\LocalPrinter\\files\\" + pdfToPrint];
  let result = NodePdfPrinter.printFiles(array, printer); // Printer files to the specific printer by the printer name.
  console.log(result);
}

async function GetMainInvoice(id) {
  let externalURL = "https://branch.caropastry.com/invoice/print/" + id;

   requestify.get(externalURL).then(function (response) {
    let html = response.body;
    console.log(id,html.toString().substring(0,50));
    //.........
    let config = {
      format: "A4",
      base: "https://socket.mizeman.com/factor",
      height: "400px",
      width: "240px",
      totalPages: 1,
    };
    pdf
      .create(html, config)
      .toFile("/LocalPrinter/files/" + id + ".pdf", function (err, res) {
        if (err) return console.log("Error :" + err);
        // setTimeout(() => {
          Print(id + ".pdf", "POS-90");
        // }, 2000);
        console.log(res);
      });
  }).catch(ex=>{
    console.log(ex);
  })
  // .then(res=>{
  //   console.log(res);
  // });
}
