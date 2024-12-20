package com.plugin.tools.xml;

import java.io.File;
import java.util.List;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.DocumentBuilder;
import org.w3c.dom.Document;
import org.w3c.dom.NodeList;
import org.w3c.dom.Node;
import org.w3c.dom.Element;

import com.plugin.createDocs.createTxt.CreateTxt;
import com.plugin.tools.getContents.GetContentsElement;

public class CreateParamsSpreadsheet {
    public static void main(String[] args) throws Exception {
        if(args.length == 0) {
            System.err.println("Por favor, forneça o nome do arquivo XML como argumento.");
            System.exit(1);
        }

        String fileName = args[0];
        CreateTxt createTxt = new CreateTxt("extras/args.txt");
        createTxt.createFile();

        try {
            DocumentBuilderFactory docFactory = DocumentBuilderFactory.newInstance();
            DocumentBuilder docBuilder = docFactory.newDocumentBuilder();
            Document doc = docBuilder.parse(new File("extras/xml/" + fileName + ".xml"));

            GetContentsElement getContentsElement = new GetContentsElement();

            doc.getDocumentElement().normalize();

            NodeList columns = doc.getElementsByTagName("columns");
            for(int i = 0; i < columns.getLength(); i++) {
                Node column = columns.item(i);

                if(column.getNodeType() == Node.ELEMENT_NODE) {
                    Element element = (Element) column;
                    NodeList childNodes = element.getChildNodes();
                    List<String> contents = getContentsElement.getContents(childNodes);
                    String contentFormatted = contents.toString().replace("[", "").replace("]", "");

                    createTxt.addLine(contentFormatted);
                    System.out.println(contentFormatted);
                }
            }

            createTxt.addLine("");

            NodeList infosList = doc.getElementsByTagName("columns-names");
            for(int i = 0; i < infosList.getLength(); i++) {
                Node columnName = infosList.item(i);

                if(columnName.getNodeType() == Node.ELEMENT_NODE) {
                    Element element = (Element) columnName;
                    NodeList childNodes = element.getChildNodes();
                    List<String> contents = getContentsElement.getContents(childNodes);
                    String contentFormatted = contents.toString().replace("[", "").replace("]", "");

                    createTxt.addLine(contentFormatted);
                    System.out.println(contentFormatted);
                }
            }

            createTxt.addLine("");

            NodeList infosNames = doc.getElementsByTagName("names");
            for(int i = 0; i < infosNames.getLength(); i++) {
                Node info = infosNames.item(i);

                if(info.getNodeType() == Node.ELEMENT_NODE) {
                    Element element = (Element) info;
                    NodeList childNodes = element.getChildNodes();
                    List<String> contents = getContentsElement.getContents(childNodes);
                    String contentFormatted = contents.toString().replace("[", "").replace("]", "");

                    createTxt.addLine(contentFormatted);
                    System.out.println(contentFormatted);
                }
            }

            createTxt.addLine("");

            NodeList infosValues = doc.getElementsByTagName("values");
            for(int i = 0; i < infosValues.getLength(); i++) {
                Node info = infosValues.item(i);

                if(info.getNodeType() == Node.ELEMENT_NODE) {
                    Element element = (Element) info;
                    NodeList childNodes = element.getChildNodes();
                    List<String> contents = getContentsElement.getContents(childNodes);
                    String contentFormatted = contents.toString().replace("[", "").replace("]", "");

                    createTxt.addLine(contentFormatted);
                    System.out.println(contentFormatted);
                }
            }

            List<String> lines = createTxt.readFile();

            System.out.print("linhas do documento de texto criado");
            for(String line : lines) System.out.print(line);
        } catch(Exception e) {
            e.printStackTrace();
        }
    }
}