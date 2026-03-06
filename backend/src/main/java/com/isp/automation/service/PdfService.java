package com.isp.automation.service;

import com.isp.automation.entity.Bill;
import com.isp.automation.entity.Customer;
import com.isp.automation.repository.CustomerRepository;
import com.lowagie.text.*;
import com.lowagie.text.Font;
import com.lowagie.text.pdf.PdfPCell;
import com.lowagie.text.pdf.PdfPTable;
import com.lowagie.text.pdf.PdfWriter;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.awt.*;
import java.io.ByteArrayOutputStream;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class PdfService {

    private final CustomerRepository customerRepository;

    public byte[] generateBillPdf(Bill bill) {
        ByteArrayOutputStream out = new ByteArrayOutputStream();
        Document document = new Document(PageSize.A4);
        PdfWriter.getInstance(document, out);

        document.open();

        // Title and Header
        Font titleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 22, Color.BLACK);
        Paragraph title = new Paragraph("ISP AUTOSYSTEM - INVOICE", titleFont);
        title.setAlignment(Element.ALIGN_CENTER);
        title.setSpacingAfter(20);
        document.add(title);

        // Customer Info
        Customer customer = customerRepository.findById(bill.getCustomerId()).orElse(null);
        Font subTitleFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD, 12, Color.DARK_GRAY);
        document.add(new Paragraph("Customer Details:", subTitleFont));
        document.add(new Paragraph("Name: " + (customer != null ? customer.getName() : "Unknown")));
        document.add(new Paragraph("Customer ID: " + bill.getCustomerId()));
        document.add(new Paragraph(" "));

        // Invoice Table
        PdfPTable table = new PdfPTable(2);
        table.setWidthPercentage(100);
        table.setSpacingBefore(10f);
        table.setSpacingAfter(10f);

        addTableHeader(table);
        addRows(table, bill);

        document.add(table);

        // Footer
        Font footerFont = FontFactory.getFont(FontFactory.HELVETICA_OBLIQUE, 10, Color.GRAY);
        Paragraph footer = new Paragraph("Thank you for choosing ISP AutoSystem. This is a computer-generated invoice.", footerFont);
        footer.setAlignment(Element.ALIGN_CENTER);
        footer.setSpacingBefore(30);
        document.add(footer);

        document.close();
        return out.toByteArray();
    }

    private void addTableHeader(PdfPTable table) {
        PdfPCell header = new PdfPCell();
        header.setBackgroundColor(Color.LIGHT_GRAY);
        header.setBorderWidth(1);
        
        Font headerFont = FontFactory.getFont(FontFactory.HELVETICA_BOLD);
        
        header.setPhrase(new Phrase("Description", headerFont));
        table.addCell(header);
        
        header.setPhrase(new Phrase("Details", headerFont));
        table.addCell(header);
    }

    private void addRows(PdfPTable table, Bill bill) {
        table.addCell("Bill ID");
        table.addCell(bill.getId().toString());

        table.addCell("Bill Amount");
        table.addCell("Rs. " + bill.getAmount().toString());

        table.addCell("Bill Date");
        table.addCell(bill.getGeneratedDate().toLocalDate().toString());

        table.addCell("Due Date");
        table.addCell(bill.getDueDate().toString());

        table.addCell("Status");
        table.addCell(bill.getStatus().toString());
    }
}
