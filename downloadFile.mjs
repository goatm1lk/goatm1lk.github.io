function downloadFile(binaryString){
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }
    
    const blob = new Blob([bytes], { type: `image/${imageType}` });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `decodedBase64.${imageType}`;
    link.click();
}

