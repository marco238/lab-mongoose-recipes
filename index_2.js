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
    Recipe.deleteMany()
      .then(() => {
        // Con el método Recipe.create() creamos todas las recetas en la base de datos de una vez
        Recipe.create(data)
          .then(() => {
            // Con el método Recipe.findOneAndUpdate() actualizamos la duración de la receta 'Rigatoni alla Genovese'
            // El primer parámetro es el filtro (qué receta queremos actualizar)
            // El segundo parámetro es el cambio que queremos hacer
            Recipe.findOneAndUpdate({ title: 'Rigatoni alla Genovese' }, { duration: 100 })
              .then(() => {
                // Con el método Recipe.deleteOne() borramos la receta 'Carrot Cake'
                // El primer parámetro es el filtro (qué receta queremos borrar)
                Recipe.deleteOne({ title: 'Carrot Cake' })
                  .then(() => {
                    // Cerramos la conexión a la base de datos
                    mongoose.connection.close()
                      .then(() => {
                        // Si todo ha ido bien, mostramos un mensaje
                        console.log('Connection closed');
                      })
                      .catch(error => {
                        console.error('Error closing the database', error);
                      });
                  })
                  .catch(error => {
                    console.error('Error deleting recipes', error);
                  });
              })
              .catch(error => {
                console.error('Error updating recipes', error);
              });
          })
          .catch(error => {
            console.error('Error creating recipes', error);
          });
      })
      .catch(error => {
        console.error('Error deleting recipes', error);
      });
  })
  .catch(error => {
    // Si hay algún error, lo mostramos por consola
    console.error('Error connecting to the database', error);
  });

  // NOTA:
  // En esta versión hemos anidado los .then() uno dentro de otro. Esto es más difícil de leer
