const btnGerarDoc = document.querySelector(".btn-gerar-doc");
const loadingDialogElement = document.querySelector("dialog#criar-lista-pedidos");
const inputGerarList = document.querySelector("#btn-gerar-lista");

btnGerarDoc.addEventListener("click", () => loadingDialogElement.showModal());

inputGerarList.addEventListener("click", async () => {
    loadingDialogElement.showModal();

    try {
        const prepareEntriesInfos = {
            dir: "test",
            files: files: "*.java",
            class: "Main"
        };
        const quantidadeMinima = await window.api.getQuantidadeMinima();
        const compilesResponse = await window.api.compileJavaFile(prepareEntriesInfos.dir, prepareEntriesInfos.files);
        const compilesResponseVerify = compilesResponse === '';
        btnGerarDoc.setAttribute('disabled', '');
        inputGerarList.setAttribute('disabled', '');

        console.log("gerando lista de pedidos...");

        if(compilesResponseVerify) console.log('código compilado...');

        if(compilesResponseVerify) {
            const argsObj = {
                fileName: null,
                attributesNames: {
                    db: null,
                    spreadsheet: null
                },
                attributesValues: {
                    db: null,
                    spreadsheet: null
                }
            }
            const table = await window.api.getTableDB();
            const columnsObject = await window.api.getColumnsDB();
            const query = `SELECT ${columnsObject.columnsDB} FROM ${table}`;
            const rows = await window.api.executeQuery(query);
            const getInfos = await window.api.getInfosListaPedidos();

            // nome do arquivo
            const fileName = argsObj.fileName = '"file-destiny"';

            // nomes dos atributos
            const attributesNames = {
                db: getInfos.dbColumns.dbColumnsNames,
                spreadsheet: getInfos.spreadsheetInfos.namesInfo
            };
            const attributesNamesDB = argsObj.attributesNames.db = `"${attributesNames.db.join(", ")}"`;
            const attributesNamesSpreadsheet = argsObj.attributesNames.spreadsheet = `"${attributesNames.spreadsheet.join(", ")}"`;

            // valores dos atributos
            const attributesValues = {
                db: getInfos.dbColumns.dbColumnsNamesPresentation,
                spreadsheet: getInfos.spreadsheetInfos.namesInfoPresentation
            };
            const attributesValuesDB = argsObj.attributesValues.db = attributesValues.db;
            const attributesValuesSpreadsheet = argsObj.attributesValues.spreadsheet = attributesValues.spreadsheet;

            for(const row of rows) {
                if(row.estoque <= quantidadeMinima) {
                    const arrayToAdd = [];

                    try {
                        for(const column of columnsObject.columnsDB) arrayToAdd.push(row[column]);

                        const args = `${fileName} ${attributesNamesDB} ${attributesNamesSpreadsheet} ${attributesValuesDB} ${attributesValuesSpreadsheet} "${arrayToAdd.join(', ')}"`;
                        const executeResponse = await window.api.executeJavaClass(prepareEntriesInfos.dir, `${prepareEntriesInfos.class} ${args}`);
                        console.log(executeResponse);
                    } catch (error) {
                        alert('Erro durante compilação/execução: ' + error.message);
                        console.error('Erro durante compilação/execução: ', error);
                    }
                }
            }
        } else {
            console.error("Erro na compilação do código.");
        }
    } catch (error) {
        alert("Não foi possível gerar a lista de pedidos.\n" + error.message);
        console.error("Não foi possível gerar a lista de pedidos: ", error);
    } finally {
        loadingDialogElement.close();
        btnGerarDoc.removeAttribute("disabled");
        inputGerarList.removeAttribute("disabled");
    }
});

async function prepareEntries(args, dir, file, className) {
    try {
        const compileResponse = await window.api.compileJavaFile(dir, file);
        const compileResponseVerify = compileResponse === '';
        if(compileResponseVerify) console.log("Código compilado com sucesso!");

        if(compileResponseVerify) {
            const executeResponse = await window.api.executeJavaClass(dir, `${className} ${args}`);
            console.log(executeResponse);
        }
    } catch (error) {
        alert('Erro durante compilação/execução: ' + error.message);
        console.error('Erro durante compilação/execução: ', error);
    }
}