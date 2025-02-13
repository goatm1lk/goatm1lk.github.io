function loadPDF(base64String) {
    try {
        let pdfData = atob(base64String); // Decode Base64

        // ✅ Fix workerSrc error
        pdfjsLib.GlobalWorkerOptions.workerSrc = "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js";

        let loadingTask = pdfjsLib.getDocument({ data: pdfData });
        loadingTask.promise.then(pdf => {
            console.log(`PDF Loaded, ${pdf.numPages} pages.`);

            // Load first page
            pdf.getPage(1).then(page => {
                let scale = 1.5; // Adjust zoom level
                let viewport = page.getViewport({ scale });

                // ✅ Ensure <canvas> exists
                let canvas = document.getElementById("pdfCanvas");
                if (!canvas) {
                    canvas = document.createElement("canvas");
                    canvas.id = "pdfCanvas";
                    document.getElementById("documentViewer").appendChild(canvas);
                }

                let context = canvas.getContext("2d");
                canvas.height = viewport.height;
                canvas.width = viewport.width;

                // Render the PDF page
                let renderContext = {
                    canvasContext: context,
                    viewport: viewport
                };
                page.render(renderContext);
            });
        }).catch(error => {
            console.error("Error loading PDF:", error);
        });
    } catch (error) {
        console.error("Error displaying the PDF:", error);
    }
}