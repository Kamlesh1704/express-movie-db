const express = require('express')
const path = require('path')

const {open} = require('sqlite')
const sqlite3 = require('sqlite3')
const app = express()

const dbPath = path.join(__dirname, 'moviesData.db')

let db = null

const initializeDBAndServer = async () => {
  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database,
    })
    app.listen(3000, () => {
      console.log('Server Running at http://localhost:3000/')
    })
  } catch (e) {
    console.log(`DB Error: ${e.message}`)
    process.exit(1)
  }
}

initializeDBAndServer()

app.get('/movies/', async (request, response) => {
  const getBooksQuery = `
    SELECT
       movie_name  as movieName
   FROM
      movie;`
  const booksArray = await db.all(getBooksQuery)
  response.send(booksArray)
})

app.post('/movies/', async (request, response) => {
  const {directorId, movieName, leadActor} = request.body
  const addBookQuery = `
    INSERT INTO
      movie (director_id,movie_name,lead_actor)
    VALUES
      (
        ${directorId},
         '${movieName}',
         '${leadActor}'
      );`

  const dbResponse = await db.run(addBookQuery)
  response.send('Movie Successfully Added')
})

app.get('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const getBookQuery = `
    SELECT
          movie_id	AS movieId,
          director_id	AS directorId,
          movie_name	AS movieName,
          lead_actor	AS  leadActor
    FROM
      movie
    WHERE
      movie_id = ${movieId};`
  const book = await db.get(getBookQuery)
  response.send(book)
})

app.put('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const bookDetailss = request.body
  console.log(bookDetailss)
  const {directorId, movieName, leadActor} = bookDetailss
  const updateBookQuery = `
    UPDATE
      movie
    SET
      director_id=${directorId},
      movie_name='${movieName}',
      lead_actor='${leadActor}'
    WHERE
      movie_id = ${movieId};`
  await db.run(updateBookQuery)
  response.send('Movie Details Updated')
})

app.delete('/movies/:movieId/', async (request, response) => {
  const {movieId} = request.params
  const deleteBookQuery = `
    DELETE FROM
      movie
    WHERE
      movie_id = ${movieId};`
  await db.run(deleteBookQuery)
  response.send('Movie Removed')
})

app.get('/directors/', async (request, response) => {
  const getBooksQuery = `
    SELECT
       director_id AS directorId ,
       director_name  AS directorName
   FROM
      director;`
  const booksArray = await db.all(getBooksQuery)
  response.send(booksArray)
})

app.post('/movies/', async (request, response) => {
  const bookDetails = request.body
  const {directorId, movieName, leadActor} = bookDetails
  const addBookQuery = `
    INSERT INTO
      movie (director_id,movie_name,lead_actor)
    VALUES
      (
         ${directorId},
         '${movieName}',
         '${leadActor}'
      );`

  await db.run(addBookQuery)
  response.send('Movie Successfully Added')
})

app.get('/directors/:directorId/movies/', async (request, response) => {
  const {directorId} = request.params
  const getAuthorBooksQuery = `
    SELECT
     movie_name AS movieName
    FROM
     movie
    WHERE
      director_id = ${directorId};`
  const booksArray = await db.all(getAuthorBooksQuery)
  response.send(booksArray)
})
module.exports = app
