import { useState } from "react";
import jsPDF from "jspdf";

const baseURL = import.meta.env.VITE_API_URL;

export default function useGeneratePdf() {
  const [loading, setLoading] = useState(false);

  const generatePdfFromImageLinks = async (imageLinks) => {
    if (!imageLinks || imageLinks.length === 0) return;

    setLoading(true);
    try {
      const pdf = new jsPDF();

      for (let i = 0; i < imageLinks.length; i++) {
        if (i > 0) pdf.addPage();

        const imgUrl = `${baseURL}/${imageLinks[i]}`;
        pdf.addImage(imgUrl, "JPEG", 0, 0, 210, 0); // or "PNG" if needed
      }

      const blob = pdf.output("blob");
      const url = URL.createObjectURL(blob);
      window.open(url, "_blank");
    } catch (error) {
      console.error("PDF generation failed", error);
    } finally {
      setLoading(false);
    }
  };

  return { generatePdfFromImageLinks, loading };
}
