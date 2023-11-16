// Importamos mongoose para conectarnos a la base de datos
const mongoose = require('mongoose');

// Importamos el modelo Recipe de './models/Recipe.model.js'
const Recipe = require('./models/Recipe.model');
// Nos traemos el array de recetas que está en el archivo data.json
const data = require('./data');

// Importante que el nombre de la base de datos está al final de la URI
const MONGODB_URI = 'mongodb://127.0.0.1:27017/recipe-app';

// Conectamos a la base de datos "recipe-app"
mongoose
  .connect(MONGODB_URI)
  .then(x => {
    console.log(`Connected to the database: "${x.connection.name}"`);
    // Antes de hacer nada, borramos todas las recetas que pueda haber ya en la base de datos
    return Recipe.deleteMany();
  })
  .then(() => {
    // Run your code here, after you have insured that the connection was made
    // Con el método Recipe.create() creamos todas las recetas en la base de datos de una vez
    return Recipe.create(data);
  })
  .then(() => {
    // Con el método Recipe.findOneAndUpdate() actualizamos la duración de la receta 'Rigatoni alla Genovese'
    // El primer parámetro es el filtro (qué receta queremos actualizar)
    // El segundo parámetro es el cambio que queremos hacer
    return Recipe.findOneAndUpdate({ title: 'Rigatoni alla Genovese' }, { duration: 100 });
  })
  .then(() => {
    // Con el método Recipe.deleteOne() borramos la receta 'Carrot Cake'
    // El primer parámetro es el filtro (qué receta queremos borrar)
    return Recipe.deleteOne({ title: 'Carrot Cake' });
  })
  .then(() => {
    // Cerramos la conexión a la base de datos
    return mongoose.connection.close();
  })
  .then(() => {
    // Si todo ha ido bien, mostramos un mensaje
    console.log('Connection closed');
  })
  .catch(error => {
    // Si hay algún error, lo mostramos por consola
    console.error(error);
  });

  // NOTA:
  // Vean que una variante a hacerle .then() a cada método es retornar la promesa y encadenar
  // los .then() uno tras otro. De esta forma es más fácil de leer.
