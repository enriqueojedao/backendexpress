const express = require("express");
const fs = require("fs");

const app = express();
const PORT = 3000;
const FILE = "repertorio.json";

app.use(express.json());
app.use(express.static(__dirname));

const leerRepertorio = () => JSON.parse(fs.readFileSync(FILE, "utf-8"));
const escribirRepertorio = (data) => fs.writeFileSync(FILE, JSON.stringify(data, null, 2));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

//Rutas.
app.get("/canciones", (req, res) => {
    const canciones = leerRepertorio();
    res.json(canciones);
});

app.post("/canciones", (req, res) => {
    const nuevaCancion = req.body;
    const canciones = leerRepertorio();
    
    canciones.push(nuevaCancion);
    escribirRepertorio(canciones);

    res.send("Producto agregado con éxito!");
});

app.put("/canciones/:id", (req, res) => {
    const { id } = req.params;
    const nuevaCancion = req.body;
    const canciones = leerRepertorio();
    
    const index = canciones.findIndex(c => c.id == id);
    if (index !== -1) {
        canciones[index] = { ...nuevaCancion, id: Number(id) };
        escribirRepertorio(canciones);
        res.send("Producto modificado con éxito!");
    } else {
        res.status(404).send("Producto no encontrado");
    }
});

app.delete("/canciones/:id", (req, res) => {
    const { id } = req.params;
    const canciones = leerRepertorio();

    const nuevoRepertorio = canciones.filter(c => c.id != id);
    if (nuevoRepertorio.length < canciones.length) {
        escribirRepertorio(nuevoRepertorio);
        res.send("Producto eliminado con éxito!");
    } else {
        res.status(404).send("Producto no encontrado");
    }
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en http://localhost:${PORT}`);
});
