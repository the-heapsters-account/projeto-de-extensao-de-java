const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("api", {
    readJSON: () => ipcRenderer.invoke("read-json"),
    saveJSON: data => ipcRenderer.invoke("save-json", data),
});