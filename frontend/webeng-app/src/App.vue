<!-- 
THIS IS THE IMPLEMENTATION OF THE USER INTERFACE. IT IS DIVIDED INTO 4 SECTIONS:
1) Input forms
2) Output components
3) Methods
4) Style
-->

<!-- 
SECTION 1: INPUT FORMS
In this part we implement all UI components for taking the input of a user.
These include input fields, check boxes or radio buttons.
-->
<template>
    <b-overlay :show="show" rounded="false">
  <div id="app" class="container overflow-hidden">
    <div class="row mt-2">
      <h1>Select the desired API request</h1>
    </div>
    <div class="row mt-2">
      <select v-model="selected" @click="resetSelected">
        <option disabled value="">Please select one</option>
        <option>Get all movies</option>
        <option>Get a movie by its URL</option>
        <option>Get a movie by its title</option>
        <option>Get all movies of an actor/director</option>
        <option>Create a new movie</option>
        <option>Delete a movie by its URL</option>
        <option>Update a movie by its URL</option>
        <option>Get all the actors</option>
        <option>Get one or more actors by name</option>
        <option>Get all the genres</option>
        <option>Get all the genres of an actor/director</option>
        <option>Get statistics of movies of a certain actor</option>
        <option>Get a number of random movies to watch today</option>
        <option>Get movies by rating</option>
      </select>
    </div>
    <div class="row mt-4">
      <span>Selected: {{ selected }}</span>
    </div>
    <div class="row mt-4">
      <h3>Queries</h3>
    </div>
    <div class="row mt-4">
      
      <!-- GET ALL MOVIES -->
      <div v-if="selected === 'Get all movies'">
        <form @submit.prevent="getAllMovies">
          <label for="amount" class="form-label">The desired subset amount of movies</label>
          <input type="number" name="amount" id="amount" min=0 value=0 class="form-control" v-model="form.amount">

          <label for="year" class="form-label">The desired year</label>
          <input type="number" name="year" id="year" class="form-control" min="1" :max="year" v-model="form.year">

          <div class="h5">Sorting:</div>

          <div class="form-check">
            <input type="radio" id="asc" name="order" value="ascending" class="form-check-input" v-model="form.order">
            <label for="asc">Ascending</label>
          </div>

          <div class="form-check">
            <input type="radio" id="desc" name="order" value="descending" checked class="form-check-input" v-model="form.order">
            <label for="desc">Descending</label>
          </div>

          <div class="form-check">
            <input type="checkbox" name="csv" id="csv" class="form-check-input" v-model="form.csv">
            <label for="csv" class="form-label">CSV representation</label><br>
          </div>
          <button type="submit" :disabled="loading" class="btn btn-primary">Submit query</button>
       </form>
      </div>
      
      <!-- GET A MOVIE BY ITS URL -->
      <div v-if="selected === 'Get a movie by its URL'">
        <form @submit.prevent="getMovieByURL">
          <label for="urlmovie" class="form-label">The URL of the specific movie</label>
          <input type="url" name="urlmovie" id="urlmovie" class="form-control" required v-model="form.movie_url">

          <div class="form-check">
            <input type="checkbox" name="csv" id="csv" class="form-check-input" v-model="form.csv">
            <label for="csv" class="form-label">CSV representation</label><br>
          </div>
          <div class="mt-2">
          <button type="submit" :disabled="loading" class="btn btn-primary">Submit query</button>
          </div>
        </form>
      </div>

      <!-- GET A MOVIE BY ITS TITLE -->
      <div v-if="selected === 'Get a movie by its title'">
        <form @submit.prevent="getMovieByTitle">

          <label for="title" class="form-label">Title of the movie</label>
          <input type="text" name="title" id="title" class="form-control" required v-model="form.title">

          <div class="form-check">
            <input type="checkbox" name="csv" id="csv" class="form-check-input" v-model="form.csv">
            <label for="csv" class="form-label">CSV representation</label><br>
          </div>
          <button type="submit" :disabled="loading" class="btn btn-primary">Submit query</button>
        </form>
      </div>

      <!-- GET ALL MOVIES OF AN ACTOR/DIRECTOR -->
      <div v-if="selected === 'Get all movies of an actor/director'">
        <form @submit.prevent="getMoviesOfAD">
          <label for="actorDirector" class="form-label">Name of actor/director</label><br>
          <input type="text" name="actorDirector" id="actorDirector" class="form-control" required v-model="form.actorDirector">
          <br>
          <label for="year" class="form-label">Year</label><br>
          <input type="number" name="year" id="yearAD" class="form-control" v-model="form.year">
          <br>
          <label for="role" class="form-label">Role</label><br>
          <br>
          <div class="form-check">
            <input type="radio" id="actor" name="role" value="actor" class="form-check-input" v-model="form.role">
            <label for="role">Actor</label>
          </div>
          <div class="form-check">
            <input type="radio" id="director" name="role" value="director" class="form-check-input" v-model="form.role">
            <label for="role">Director</label>
          </div>
          <br>
          <div class="form-check">
            <input type="checkbox" name="csv" id="csv" class="form-check-input" v-model="form.csv">
            <label for="csv" class="form-label">CSV representation</label><br>
          </div>
          <button type="submit" :disabled="loading" class="btn btn-primary">Submit query</button>
        </form>
      </div>

      <!-- CREATE A NEW MOVIE -->
      <div v-if="selected === 'Create a new movie'">
        <form @submit.prevent="createMovie">
          <div v-if="errors.length">
            <b>Please correct the following error(s):</b>
            <ul>
              <li v-for="error in errors" :key="error.id">{{ error }}</li>
            </ul>
          </div>
          <label for="newmovurl" class="form-label">The URL of the movie you want to create</label>
          <input type="url" name="newmovurl" class="form-control" v-model="form.movie_url">

          <label for="newmovtitle" class="form-label">The title of the movie</label>
          <input type="text" name="newmovtitle" class="form-control" v-model="form.title" required>

          <div class="form-label">The rating of the movie</div>
          <div class="form-check">
            <input type="radio" name="order" value="PG" class="form-check-input" v-model="form.rating">
            <label for="pg">PG</label>
          </div>

          <div class="form-check">
            <input type="radio" name="order" value="PG 13" checked class="form-check-input" v-model="form.rating">
            <label for="pg13">PG 13</label>
          </div>

          <div class="form-check">
            <input type="radio" name="order" value="R" checked class="form-check-input" v-model="form.rating">
            <label for="rrated">R</label>
          </div>

          <div class="form-check">
            <input type="radio" name="order" value="NC 17" checked class="form-check-input" v-model="form.rating">
            <label for="nc17">NC 17</label>
          </div>

          <label for="newmovyear" class="form-label">The year the movie was released</label>
          <input type="number" name="newmovyear" class="form-control" min="1" :max="year" v-model="form.year">

          <label for="newmovuserrating" class="form-label">The user rating of the movie</label>
          <input type="range" name="newmovuserrating" class="form-control"  min="0" max="100" v-model="form.user_rating">
          <p v-if="form.user_rating">{{form.user_rating / 10}}</p>

          <label for="newmovimg" class="form-label">The image URL of the movie</label>
          <input type="text" name="newmovimg" class="form-control" v-model="form.img_url">

          <label for="newmovcountries" class="form-label">The countries the movie was released in</label>
          <input type="text" name="newmovcountries" class="form-control" placeholder="Provide a list separated by ';'" v-model="form.countries" required>

          <label for="newmovlanguages" class="form-label">The languages the movie was dubbed in</label>
          <input type="text" name="newmovlanguages" class="form-control" placeholder="Provide a list separated by ';'" v-model="form.languages" required>

          <label for="newmovactors" class="form-label">The actors playing in the movie</label>
          <input type="text" name="newmovactors" class="form-control" placeholder="Provide a list separated by ';'" v-model="form.actors" required>

          <label for="newmovgenre" class="form-label">The genres of the movie</label>
          <input type="text" name="newmovgenre" class="form-control" placeholder="Provide a list separated by ';'" v-model="form.genre" required>

          <label for="newmovtagline" class="form-label">The new tagline of the movie</label>
          <input type="text" name="newmovtagline" class="form-control" v-model="form.tagline">

          <label for="newmovdescription" class="form-label">The new description of the movie</label>
          <input type="text" name="newmovdescription" class="form-control" v-model="form.description">

          <label for="newmovdirectors" class="form-label">The directors of the movie</label>
          <input type="text" name="newmovdirectors" class="form-control" placeholder="Provide a list separated by ';'" v-model="form.directors" required>

          <label for="newmovruntime" class="form-label">The runtime of the movie</label>
          <input type="number" name="newmovruntime" class="form-control" min="1" max="1000" v-model="form.runtime">

          <label for="newmovmetascore" class="form-label">The new metascore of the movie</label>
          <input type="range" name="newmovmetascore" class="form-control" min="0" max="100" v-model="form.meta_score">
          <p v-if="form.meta_score">{{form.meta_score}}</p>

          <div class="mt-2">
            <button type="submit" class="btn btn-primary">Create movie</button>
          </div>
        </form>
      </div>

      <!-- DELETE A MOVIE BY ITS URL -->
      <div v-if="selected === 'Delete a movie by its URL'">
        <form @submit.prevent="deleteMovieByURL">
          <label for="deleteurl" class="form-label">The URL of the movie you want to delete</label>
          <input type="text" name="deleteurl" id="deleteurl" class="form-control" required v-model="form.movie_url">
          <div class="mt-2">
            <button type="submit" class="btn btn-primary">Delete movie</button>
          </div>
        </form>
      </div>

      <!-- UPDATE A MOVIE BY ITS URL -->
      <div v-if="selected === 'Update a movie by its URL'">
        <form @submit.prevent="updateMovieByURL">
          <div v-if="errors.length">
            <b>Please correct the following error(s):</b>
            <ul>
              <li v-for="error in errors" :key="error.id">{{ error }}</li>
            </ul>
          </div>
          <label for="updateurl" class="form-label">The URL of the movie you want to update</label>
          <input type="url" name="updateurl" id="updateurl" class="form-control" required v-model="form.movie_url">

          <label for="updatetitle" class="form-label">The new title of the movie</label>
          <input type="text" name="updatetitle" id="updatetitle" class="form-control" v-model="form.title">

          <div class="form-label">The new rating of the movie</div>
          <div class="form-check">
            <input type="radio" id="pg" name="order" value="PG" class="form-check-input" v-model="form.rating">
            <label for="pg">PG</label>
          </div>

          <div class="form-check">
            <input type="radio" id="pg13" name="order" value="PG 13" checked class="form-check-input" v-model="form.rating">
            <label for="pg13">PG 13</label>
          </div>

          <div class="form-check">
            <input type="radio" id="rrated" name="order" value="R" checked class="form-check-input" v-model="form.rating">
            <label for="rrated">R</label>
          </div>

          <div class="form-check">
            <input type="radio" id="nc17" name="order" value="NC 17" checked class="form-check-input" v-model="form.rating">
            <label for="nc17">NC 17</label>
          </div>

          <label for="updateyear" class="form-label">The year the movie was released</label>
          <input type="number" name="updateyear" id="updateyear" class="form-control" min="1" :max="year" v-model="form.year">

          <label for="updateuserrating" class="form-label">The new user rating of the movie</label>
          <input type="range" name="updateuserrating" id="updateuserrating" class="form-control"  min="0" max="100" v-model="form.user_rating">
          <p v-if="form.user_rating">{{form.user_rating / 10}}</p>

          <label for="updateimg" class="form-label">The new image URL of the movie</label>
          <input type="text" name="updateimg" id="updateimg" class="form-control" v-model="form.img_url">

          <label for="updatecountries" class="form-label">The countries the movie was released in</label>
          <input type="text" name="updatecountries" id="updatecountries" class="form-control" placeholder="Provide a list sepparated by ';'" v-model="form.countries">

          <label for="updatelanguages" class="form-label">The languages the movie was dubbed in</label>
          <input type="text" name="updatelanguages" id="updatelanguages" class="form-control" placeholder="Provide a list sepparated by ';'" v-model="form.languages">

          <label for="updateactors" class="form-label">The actors playing in the movie</label>
          <input type="text" name="updateactors" id="updateactors" class="form-control" placeholder="Provide a list sepparated by ';'" v-model="form.actors">

          <label for="updategenre" class="form-label">The genres of the movie</label>
          <input type="text" name="updategenre" id="updategenre" class="form-control" placeholder="Provide a list sepparated by ';'" v-model="form.genre">

          <label for="updatetagline" class="form-label">The new tagline of the movie</label>
          <input type="text" name="updatetagline" id="updatetagline" class="form-control" v-model="form.tagline">

          <label for="updatedescription" class="form-label">The new description of the movie</label>
          <input type="text" name="updatedescription" id="updatedescription" class="form-control" v-model="form.description">

          <label for="updatedirectors" class="form-label">The directors of the movie</label>
          <input type="text" name="updatedirectors" id="updatedirectors" class="form-control" placeholder="Provide a list sepparated by ';'" v-model="form.directors">

          <label for="updateruntime" class="form-label">The runtime of the movie</label>
          <input type="number" name="updateruntime" id="updateruntime" class="form-control" min="1" max="1000" v-model="form.runtime">

          <label for="updatemetascore" class="form-label">The new metascore of the movie</label>
          <input type="range" name="updatemetascore" id="updatemetascore" class="form-control" min="0" max="100" v-model="form.meta_score">
          <p v-if="form.meta_score">{{form.meta_score}}</p>

          <div class="mt-2">
            <button type="submit" class="btn btn-primary">Update movie</button>
          </div>
        </form>
      </div>
      
      <!-- GET ALL THE ACTORS -->
      <div v-if="selected === 'Get all the actors'">
          <form @submit.prevent="getAllActors">
              <div class="form-check">
              <input type="checkbox" name="csv" id="csv" class="form-check-input" v-model="form.csv">
              <label for="csv" class="form-label">CSV representation</label><br>
              </div>
              <button type="submit" :disabled="loading" class="btn btn-primary">Submit query</button>
              <div>There are many actors, this query might take up to a few minutes.</div>
          </form>
      </div>

      <!-- GET ONE OR MORE ACTORS BY NAME -->
      <div v-if="selected === 'Get one or more actors by name'">
        <form @submit.prevent="getOneOrMoreActorsByName">
          <label for="actorName" class="form-label">Actor's name</label><br>
          <input type="text" name="actorName" id="actorName" class="form-control" required v-model="form.actorName">
          <br>
          <div class="form-check">
            <input type="checkbox" name="csv" id="csv" class="form-check-input" v-model="form.csv">
            <label for="csv" class="form-label">CSV representation</label><br>
          </div>
          <button type="submit" :disabled="loading" class="btn btn-primary">Submit query</button>
        </form>
      </div>

      <!-- GET ALL THE GENRES -->
      <div v-if="selected === 'Get all the genres'">
        <form @submit.prevent="getAllGenres">
          <div class="form-check">
            <input type="checkbox" name="csv" id="csv" class="form-check-input" v-model="form.csv">
            <label for="csv" class="form-label">CSV representation</label><br>
          </div>

          <button type="submit" :disabled="loading" class="btn btn-primary">Submit query</button>
       </form>
      </div>

      <!-- GET ALL THE GENRES OF AN ACTOR/DIRECTOR -->
      <div v-if="selected === 'Get all the genres of an actor/director'">
        <form @submit.prevent="getGenresByName">
          <div class="form-check">

            <label for="name" class="form-label">Name:</label>
            <input type="string" name="name" id="name" class="form-control" required v-model="form.name"><br>

            <div class="h5">Role:</div>

            <div class="form-check">
              <input type="radio" id="actor" name="role" value="actor" class="form-check-input" v-model="form.role">
              <label for="actor">Actor</label>
            </div>

            <div class="form-check">
              <input type="radio" id="director" name="role" value="director" checked class="form-check-input" v-model="form.role">
              <label for="director">Director</label>
            </div><br>

            <div class="h5">Sort by year:</div>

            <div class="form-check">
              <input type="radio" id="asc" name="year" value="ascending" class="form-check-input" v-model="form.year">
              <label for="ascending">Ascending</label>
            </div>

            <div class="form-check">
              <input type="radio" id="desc" name="year" value="descending" checked class="form-check-input" v-model="form.year">
              <label for="descending">Descending</label>
            </div>

            <div class="form-check">
              <input type="radio" name="none" id="year" value="none" class="form-check-input" v-model="form.year">
              <label for="none" class="form-label">Do not sort by year</label><br>
            </div><br>

            <input type="checkbox" name="csv" id="csv" class="form-check-input" v-model="form.csv">
            <label for="csv" class="form-label">CSV representation</label><br>
          </div>

          <button type="submit" :disabled="loading" class="btn btn-primary">Submit query</button>
       </form>
      </div>

      <!-- GET STATISTICS OF MOVIES OF A CERTAIN ACTOR -->
      <div v-if="selected === 'Get statistics of movies of a certain actor'">
        <form @submit.prevent="getStats">
          <label for="name" class="form-label">The name of the specific actor</label>
          <input type="text" name="name" id="name" class="form-control" required v-model="form.actor_name">

          <div class="form-check">
            <input type="checkbox" name="csv" id="csv" class="form-check-input" v-model="form.csv">
            <label for="csv" class="form-label">CSV representation</label><br>
          </div>

          <div class="mt-2">
          <button type="submit" :disabled="loading" class="btn btn-primary">Submit query</button>
          </div>
        </form>
      </div>

      <!-- GET A NUMBER OF RANDOM MOVIES TO WATCH TODAY - EXTRA ENDPOINT -->
      <div v-if="selected === 'Get a number of random movies to watch today'">
        <form @submit.prevent="getRandomMovies">
          <label for="amount" class="form-label">The desired amount of movies</label>
          <input type="number" name="amount" id="amount" min=0 value=0 max=62058 class="form-control" v-model="form.amount">

          <div class="form-check">
            <input type="checkbox" name="csv" id="csv" class="form-check-input" v-model="form.csv">
            <label for="csv" class="form-label">CSV representation</label><br>
          </div>
          <button type="submit" :disabled="loading" class="btn btn-primary">Submit query</button>
       </form>
      </div>

      <!-- GET MOVIES BY RATING - EXTRA ENDPOINT -->
      <div v-if="selected === 'Get movies by rating'">
        <form @submit.prevent="getMoviesByRating">
          <label for="amount" class="form-label">The desired amount of movies</label>
          <input type="number" name="amount" id="amount" min=0 value=0 max=62058 class="form-control" v-model="form.amount">

          <label for="users_rating" class="form-label">User rating</label>
          <input type="number" step="0.1" name="users_rating" id="users_rating" min=0 value=0 max=10 class="form-control" v-model="form.users_rating">

          <div class="form-check">
            <input type="checkbox" name="csv" id="csv" class="form-check-input" v-model="form.csv">
            <label for="csv" class="form-label">CSV representation</label><br>
          </div>

          <button type="submit" :disabled="loading" class="btn btn-primary">Submit query</button>
       </form>
      </div>

    </div>

<!-- OUTPUT COMPONENTS:

  IN THIS SECTION, THE COMPONENTES USED TO DISPLAY THE OUTPUT ARE PRESENTED.
  THERE IS A DIFFERENT COMPONENT FOR EVERY INDIVIDUAL ENDPOINT.
  THE OUTPUT COMPONENTS FOR THE ENDPOINTS ARE ORDERED AS FOLLOWS:
    1. GET ALL MOVIES
    2. GET A MOVIE BY ITS URL
    3. GET A MOVIE BY ITS TITLE
    4. GET ALL MOVIES OF AN ACTOR/DIRECTOR
    5. CREATE A NEW MOVIE
    6. DELETE A MOVIE BY ITS URL
    7. GET ALL THE ACTORS
    8. GET ONE OR MORE ACTORS BY NAME
    9. GET ALL THE GENRES
    10. GET ALL THE GENRES OF AN ACTOR/DIRECTOR
    11. GET STATISTICS OF MOVIES OF A CERTAIN ACTOR
    12. GET A NUMBER OF RANDOM MOVIES TO WATCH TODAY
    
-->
    <div class="row mt-4">
      <h3>Output</h3>
    </div>
    <div class="row mt-4">
      <div v-if="loading">
        <div class="d-flex justify-content-center">
          <div class="spinner-border text-primary" />
        </div>
      </div>
      <div v-if="error">
        <div class="alert alert-danger">
          <strong>Error!</strong> The server announced an error stating {{ errorMessage }}.
        </div>
      </div>
      <div v-else>
        <div v-if="selected === 'Get all movies' || selected === 'Get a number of random movies to watch today'
        || selected === 'Get movies by rating'">
          <div v-if="csvRepresentation">
            <strong>CSV Representation: </strong> <br>
            <code>{{ movies }}</code>
          </div>
            <div v-else>
              <table class="table table-hover">
                <thead>
                  <th scope="col">Title</th>
                  <th scope="col">Rating</th>
                  <th scope="col">Year</th>
                  <th scope="col">Genre</th>
                  <th scope="col">More Info #</th>
                </thead>
                <tbody>
                  <tr v-for="movie in movies" :key="movie.imdb_url">
                    <td>{{ movie.title }}</td>
                    <td>{{ movie.rating }}</td>
                    <td>{{ movie.year }}</td>
                    <td>{{ movie.genre }}</td>
                    <td> <b-button ref="showRef"
                      :disabled="show"
                      variant="primary"
                      @click="moreDetails(movie)"
                      aria-describedby="showRef-label">
                     More details
                    </b-button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
        </div>
        <div v-if="selected === 'Get a movie by its URL'">
          <div v-if="selectedMovie && csvRepresentation">
            <strong>CSV Representation:</strong><br>
            <code>{{ selectedMovie }}</code>
          </div>
          <div v-if="selectedMovie && !csvRepresentation" class="card" style="width: 46rem;">
            <img class="card-img-top" :src="selectedMovie.img_url" />
            <div class="card-body">
              <ul class="list-group list-group-flush">
                <li
                      v-for="(value, prop) in selectedMovie"
                      :key='prop'
                      class="list-group-item"
                      > {{prop}} : {{value}} </li>
              </ul>
            </div>
          </div>
        </div>
        <div v-if="selected === 'Get a movie by its title'">
          <div v-if="selectedMovie && csvRepresentation">
            <strong> CSV Representation: </strong><br>
            <code> {{ selectedMovie }} </code>
          </div>
          <div v-if="selectedMovie && !csvRepresentation" class="card" style="width: 46rem;">
            <img class="card-img-top" :src="selectedMovie.img_url" />
            <div class="card-body">
              <ul class="list-group list-group-flush">
                <li
                      v-for="(value, prop) in selectedMovie"
                      :key='prop'
                      class="list-group-item"
                      > {{prop}} : {{value}} </li>
              </ul>
            </div>
          </div>
        </div>
        <div v-if="selected === 'Get all movies of an actor/director'">
        <div v-if="csvRepresentation">
          <strong>CSV Representation: </strong><br>
          <code>{{ movies }}</code>
        </div>
        <div v-else>
          <table class="table table-hover">
                <thead>
                  <th scope="col">Title</th>
                  <th scope="col">Rating</th>
                  <th scope="col">Year</th>
                  <th scope="col">Genre</th>
                  <th scope="col">More Info #</th>
                </thead>
                <tbody>
                  <tr v-for="movie in movies" :key="movie.imdb_url">
                    <td>{{ movie.title }}</td>
                    <td>{{ movie.rating }}</td>
                    <td>{{ movie.year }}</td>
                    <td>{{ movie.genre }}</td>
                    <td> <b-button ref="show" :disabled="show" variant="primary" @click="moreDetails(movie)">
                     More details
                    </b-button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
        </div>
        <div v-if="selected === 'Create a new movie'">
          <div v-if="selectedMovie !== null" class="card" style="width: 46rem;">
            <img class="card-img-top" :src="selectedMovie.img_url" />
            <div class="card-body">
              <ul class="list-group list-group-flush">
                <li
                      v-for="(value, prop) in selectedMovie"
                      :key='prop'
                      class="list-group-item"
                      > {{prop}} : {{value}} </li>
              </ul>
            </div>
          </div>
        </div>
        <div v-if="selected === 'Delete a movie by its URL'">
          <div v-if="message !== ''">
            <b-textarea
              id="deletion-text"
              plaintext
              no-resize
              rows="5"
              :value="message">
            </b-textarea>
          </div>
        </div>
        <div v-if="selected === 'Update a movie by its URL'">
          <div v-if="selectedMovie !== null" class="card" style="width: 46rem;">
            <img class="card-img-top" :src="selectedMovie.img_url" />
            <div class="card-body">
              <ul class="list-group list-group-flush">
                <li
                      v-for="(value, prop) in selectedMovie"
                      :key='prop'
                      class="list-group-item"
                      > {{prop}} : {{value}} </li>
              </ul>
            </div>
          </div>
        </div>
        <div v-if="selected === 'Get all the actors'">
          <div v-if="csvRepresentation">
            <strong> CSV Representation: </strong><br>
            <code>{{ actors }} </code>
          </div>
          <div v-else>
            <ul id="tags">
              <li v-for="(actor,idx) in actors" :key="idx">
                {{actor}}
              </li>
            </ul>
          </div>
        </div>
        <div v-if="selected === 'Get one or more actors by name'">
        <div v-if="csvRepresentation && actors">
          <strong> CSV Representation: </strong><br>
          <code>{{ actors }} </code>
        </div>
        <div v-if="!csvRepresentation && actors">
          <table class="table table-hover">
            <thead>
              <th scope="col">Actor Name</th>
            </thead>
            <tbody>
              <tr v-for="actor in actors" :key="actor">
                <td>{{ actor }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        </div>

        <div v-if="selected === 'Get all the genres' || selected === 'Get all the genres of an actor/director'">
        <div v-if="csvRepresentation">
          <strong> CSV Representation: </strong><br>
          <code>{{ genres }} </code></div>
        <div v-else>
          <ul id="tags">
            <li v-for="(genre,idx) in genres" :key="idx">
              {{genre}}
            </li>
          </ul>
        </div>
        </div>

        <div v-if="selected === 'Get statistics of movies of a certain actor'">
          <div v-if="statistics && csvRepresentation">
            <strong>CSV Representation: </strong><br>
            <code> {{ statistics }} </code>
          </div>
          <div v-if="statistics && !csvRepresentation" class="card" style="width: 46rem;">
            <img class="card-img-top" :src="statistics.url" />
            <div class="card-body">
              <ul class="list-group list-group-flush">
                <li class="list-group-item">Mean : {{ statistics.mean }}</li>
                <li class="list-group-item">Median : {{ statistics.median }}</li>
                <li class="list-group-item">Standard deviation : {{ statistics.sd }}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
    </div>

    <template #overlay>
      <div class="text-center">
                  <div>
                    <img :src="selectedMovie.img_url" />
                  </div>
                  <div>
                    <ul class="list-group">
                      <li
                      v-for="(value, prop) in selectedMovie"
                      :key='prop'
                      class="list-group-item"
                      > {{prop}} : {{value}} </li>
                    </ul>
                  </div>
                <b-button
                  ref="cancel"
                  variant="outline-danger"
                  size="sm"
                  aria-describedby="cancel-label"
                  @click="closeDetails()"
                  >
                  X
                  </b-button>
      </div>
    </template>
                </b-overlay>
</template>

<!-- METHODS:

  IN THIS SECTION, THE METHODS USED TO PERFORM THE QUERIES AND MANAGE THE VARIABLES
  CONTAINED INSIDE THE VIEW ARE PRESENTED. ALSO THE DECLARATION OF THE VARIABLES AND OBJECTS USED
  IN THE METHODS IS PRESENT.
  THE METHODS AND DATA ARE ORDERED AS FOLLOWS:
    1. data() DECLARATION
    2. getAllMovies()
    3. getRandomMovies()
    4. moreDetails(movie)
    5. closeDetails()
    6. getStats()
    7. getMoviesByURL()
    8. getMovieByTitle()
    9. getMoviesOfAD()
    10. getAllGenres()
    11. getGenresByName()
    12. DeleteMovieByURL()
    13. updateMovieByUrl()
    14. createMovie()
    15. validUpdateForm()
    16. makeList(listString)
    17. getAllActors()
    18. getOneOrMoreActorsByName()
    19. resetSelected()
    20. Computed
-->

<script>
const axios = require('axios')
export default {
  name: 'App',
  data() {
    return {
      movies: [],
      actors: [],
      selected: null,
      form: {
        order: 'descending',
        amount: 1,
        year: null,
        csv: false
      },
      loading: false,
      show: false,
      selectedMovie: null,
      statistics: null,
      message: '',
      genres: [],
      errors: [],
      csvRepresentation: false,
      errorMessage: '',
      error: false
    }
  },
  
  methods: {
    /**
     * Used to get all the movies. The query uses an amount of movies to 
     * be obtained, together with a year and the order in which the
     * results should be returned (ascending or descending).
     * The possibility to have csv data as a result is also part of the form.
     */
    async getAllMovies(){
      this.error = false
      this.loading = true
      this.movies = null
      let sepparator = '?'
      let query = this.$baseURL + 'movies/'
      if (this.form.amount) {
        query += sepparator + 'amount=' + this.form.amount
        sepparator = '&'
      }
      if (this.form.year) {
        query += sepparator + 'year=' + this.form.year
        sepparator = '&'
      }
      if (this.form.order) {
        query += sepparator + 'order=' + this.form.order
        sepparator = '&'
      }
      if(this.form.csv){
        this.csvRepresentation = true
        axios.get(query, {
          headers: {
            Accept: 'text/csv'
          }
        })
        .then(response => {
          this.movies = response.data
          this.loading = false
        }).catch( err => {
          this.error = true
          if(err.response.status === 404) this.errorMessage = "not found"
          else this.errorMessage = "something went wrong"
          this.loading = false
        })
      } else {
        this.csvRepresentation = false
        axios.get(query)
        .then(response => {
          if(response.data.message === 'success'){
            this.movies = response.data.movies
          }
          this.loading = false
        }).catch( err => {
          this.error = true
          if(err.response.status === 404) this.errorMessage = "not found"
          else this.errorMessage = "something went wrong"
          this.loading = false
        })
      }
    },

    /* 
    Method that requests a number of random movies from the backend. It appends the given amount as
    a query parameter and, if needed, it sets the 'Accept' header to 'text/csv'.
    */
    async getRandomMovies(){
      this.error = false
      this.loading = true
      this.movies = null
      let sepparator = '?'
      let query = this.$baseURL + 'movies/random/'
      if (this.form.amount) {
        query += sepparator + 'amount=' + this.form.amount
      }
      if(this.form.csv){
        this.csvRepresentation = true
        axios.get(query, {
          headers: {
            Accept: 'text/csv'
          }
        })
        .then(response => {
          this.movies = response.data
          this.loading = false
        }).catch( err => {
          this.error = true
          if(err.response.status === 404) this.errorMessage = "not found"
          else this.errorMessage = "something went wrong"
          this.loading = false
        })
      } else {
        this.csvRepresentation = false
        axios.get(query)
        .then(response => {
          if(response.data.message === 'success'){
            this.movies = response.data.movies
          }
          this.loading = false
        }).catch( err => {
          this.error = true
          if(err.response.status === 404) this.errorMessage = "not found"
          else this.errorMessage = "something went wrong"
          this.loading = false
        })
      }
    },
    
    /*
    Method that selects a specific movie to be inspected. It shows all the fields of the movie to the
    user by making the variable selectedMovie to be the one passed as an argument.
    */
    moreDetails(movie){
      this.selectedMovie = movie
      this.show = true
    },
    
    /**
     * Method used to close the overlay, by reinitialising the selectedMovie variable and setting
     * the show variable to false.
     */
    closeDetails(){
      this.show = false
      this.selectedMovie = null
    },

    /**
     * Methods used to get the statistics of a specific actor. The method
     * makes a request to the API, as well as a third party API to display
     * the a bar chart for the presented statistics.
     */
    getStats(){
      this.loading = true
      this.error = false
      this.statistics = null
      let query = this.$baseURL + 'statistics/' + this.form.actor_name
      if(this.form.csv){
        this.csvRepresentation = true
        axios.get(query, {
          headers: {
            Accept: 'text/csv'
          }
        })
        .then(response => {
          this.statistics = response.data
          this.loading = false
        }).catch( err => {
          this.error = true
          if(err.response.status === 404) this.errorMessage = "not found"
          else this.errorMessage = "something went wrong"
          this.loading = false
        })
      } else {
        this.csvRepresentation = false
        axios.get(query)
        .then(response => {
          if(response.data.message === 'success'){
            this.statistics = response.data.statistics
          }
          this.loading = false
        }).catch( err => {
          this.error = true
          if(err.response.status === 404) this.errorMessage = "not found"
          else this.errorMessage = "something went wrong"
          this.loading = false
        })
      }
    },
    
    /**
     * Method that requests a specific movie by its unique URL from the backend.
     */
    getMovieByURL(){
      this.loading = true
      this.error = false
      let url = this.form.movie_url.substring(27)
      let query = this.$baseURL + 'movies/url/' + url
      if(this.form.csv){
        this.csvRepresentation = true
        axios.get(query, {
          headers: {
            Accept: 'text/csv'
          }
        })
        .then(response => {
          this.selectedMovie = response.data
          this.loading = false
        }).catch( err => {
          this.error = true
          if(err.response.status === 404) this.errorMessage = "not found"
          else this.errorMessage = "something went wrong"
          this.loading = false
        })
      } else {
        this.csvRepresentation = false
        axios.get(query)
        .then(response => {
          if(response.data.message === 'success'){
            this.selectedMovie = response.data.movies.pop()
          }
          this.loading = false
        }).catch( err => {
          console.log(err)
          this.error = true
          if(err.response.status === 404) this.errorMessage = "not found"
          else this.errorMessage = "something went wrong"
          this.loading = false
        })
      }
    },
    
    /*
    Method used for getting a movie by its title.
    */
    async getMovieByTitle(){
      this.error = false
      this.loading = true
      this.selectedMovie = null
      let query = this.$baseURL + 'movies/title/' + this.form.title
      if(this.form.csv){
        this.csvRepresentation = true
        axios.get(query, {
          headers: {
            Accept: 'text/csv'
          }
        })
        .then(response => {
          this.selectedMovie = response.data
          this.loading = false
        }).catch( err => {
          this.error = true
          if(err.response.status === 404) this.errorMessage = "not found"
          else this.errorMessage = "something went wrong"
          this.loading = false
        })
      } else {
        this.csvRepresentation = false
        axios.get(query)
        .then(response => {
          if(response.data.message === 'success'){
            this.selectedMovie = response.data.movies.pop()
          }
          this.loading = false
        }).catch( err => {
          this.error = true
          if(err.response.status === 404) this.errorMessage = "not found"
          else this.errorMessage = "something went wrong"
          this.loading = false
        })
      }
    },

    /**
     * Method that gets the movies from the backend with a specific user rating
     */
    getMoviesByRating(){
      this.error = false
      this.loading = true
      const separator = '?'
      let query = this.$baseURL + 'movies/rating/' + this.form.users_rating
      if (this.form.amount) {
        query += separator + 'amount=' + this.form.amount
      }
      if(this.form.csv){
        this.csvRepresentation = true
        axios.get(query, {
          headers: {
            Accept: 'text/csv'
          }
        })
        .then(response => {
          this.movies = response.data
          this.loading = false
        }).catch( err => {
          this.error = true
          if(err.response.status === 404) this.errorMessage = "not found"
          else this.errorMessage = "something went wrong"
          this.loading = false
        })
      } else {
        this.csvRepresentation = false
        axios.get(query)
        .then(response => {
          if(response.data.message === 'success'){
            this.movies = response.data.movies
          }
          this.loading = false
        }).catch( err => {
          this.error = true
          if(err.response.status === 404) this.errorMessage = "not found"
          else this.errorMessage = "something went wrong"
          this.loading = false
        })
      }
    },
    /**
     * Method used for getting the movies of specific actor or director
     */
    async getMoviesOfAD(){
      this.error = false
      this.loading = true
      this.movies = null
      let aName = this.form.actorDirector
      let roleAD = this.form.role
      let yearAD = this.form.year
      let query = this.$baseURL + 'movies/name/' + aName + '?role=' + roleAD
      if(yearAD) query += '&year=' + yearAD
      if (this.form.csv){
        this.csvRepresentation = true
        axios.get(query, {
          headers: {
            Accept: 'text/csv'
          }
        })
        .then(response => {
          this.movies = response.data
          this.loading = false
        }).catch( err => {
          this.error = true
          if(err.response.status === 404) this.errorMessage = "not found"
          else this.errorMessage = "something went wrong"
          this.loading = false
        })
      } else {
        this.csvRepresentation = false
        axios.get(query)
        .then(response => {
          if(response.data.message === 'success'){
            this.movies = response.data.movies
          }
          this.loading = false
      }).catch( err => {
          this.error = true
          if(err.response.status === 404) this.errorMessage = "not found"
          else this.errorMessage = "something went wrong"
          this.loading = false
        })
      }
    },
    
    /**
     * Method that requests all tehe genres from the backend.
     */
    async getAllGenres(){
      this.loading = true
      this.error = false
      this.genres = null
      let query = this.$baseURL + 'genres/'
      if (this.form.csv) {
        this.csvRepresentation = true
        axios.get(query, {
          headers: {
            Accept: 'text/csv'
          }
        })
         .then(response => {
          this.genres = response.data
          this.loading = false
        }).catch( err => {
          this.error = true
          if(err.response.status === 404) this.errorMessage = "not found"
          else this.errorMessage = "something went wrong"
          this.loading = false
        })
      } else {
        this.csvRepresentation = false
        axios.get(query)
          .then(response => {
            if(response.data.message === 'success'){
              this.genres = response.data.genre
            }
            this.loading = false
          }).catch( err => {
          this.error = true
          if(err.response.status === 404) this.errorMessage = "not found"
          else this.errorMessage = "something went wrong"
          this.loading = false
        })
      }
    },
    /**
     * Method that gets the genres from the backend by using the actor/director's name
     * specified in the input form.
     */
    async getGenresByName(){
      this.loading = true
      this.error = false
      this.genres = null
      let query
      if (this.form.year !== 'none') query = this.$baseURL + 'genres/name/' + this.form.name + '?role=' + this.form.role + '&year=' + this.form.year
      else query = this.$baseURL + 'genres/name/' + this.form.name + '?role=' + this.form.role
      if (this.form.csv) {
        this.csvRepresentation = true
        axios.get(query, {
          headers: {
            Accept: 'text/csv'
          }
        })
        .then(response => {
          this.genres = response.data
          this.loading = false
        }).catch( err => {
          this.error = true
          if(err.response.status === 404) this.errorMessage = "not found"
          else this.errorMessage = "something went wrong"
          this.loading = false
        })
      } else {
        this.csvRepresentation = false
        axios.get(query)
        .then(response => {
            if(response.data.message === 'success'){
              this.genres = response.data.genre
            } else {
              this.error = true
              this.errorMessage = response.data.message
            }
            this.loading = false
        }).catch( err => {
          this.error = true
          if(err.response.status === 404) this.errorMessage = "not found"
          else this.errorMessage = "something went wrong"
          this.loading = false
        })
      }
    },

    /**
     * Method used for deleting a movie by its URL
     */
    async deleteMovieByURL() {
      this.loading = true
      this.error = false
      if(!this.form.movie_url && !this.form.movie_url.includes('https://www.imdb.com/title/')){
        this.errors.push('Invalid URL given. The URL must contain https://www.imdb.com/title/')
        this.loading = false
        return
      }
      const url = this.form.movie_url.substring(27)
      const query = this.$baseURL + 'movies/url/' + url
      axios.delete(query)
      .then(response => {
        if (response.status === 202) {
          this.message = 'The movie with URL \'' + this.form.movie_url + '\' has been marked for deletion.'
        }
        this.loading = false
      })
      .catch((err) => {
        this.error = true
        if(err.response.status === 404) this.errorMessage = "not found"
          else this.errorMessage = "something went wrong"
        this.loading = false
      })
    },
    
    /**
     * Method used for updating a specific movie by its URL
     */
    async updateMovieByURL() {
      this.loading = true
      this.error = false
      if (!this.form.movie_url || !this.form.movie_url.includes('https://www.imdb.com/title/')) {
        this.errors.push('Invalid URL given')
        this.loading = false
      }
      else {
        let query = this.validUpdateForm()
        axios.put(query)
        .then(response => {
          if (response.status === 200) {
            this.selectedMovie = response.data.updatedMovie
          }
          this.loading = false
        })
        .catch((err) => {
          this.error = true
          if(err.response.status === 404) this.errorMessage = "not found"
          else this.errorMessage = "something went wrong"
          this.loading = false
        })
      }
    },
    /**
     * Method used to create a movie. It uses a POST request to the backend and
     * passes the relevant movie information through the request's body.
     */
    createMovie(){
      this.loading = true
      this.error = false
      if(this.form.movie_url && !this.form.movie_url.includes('https://www.imdb.com/title/')){
        this.errors.push('Invalid URL given. The URL must contain https://www.imdb.com/title/')
        this.loading = false
        return
      }
      if(this.form.movie_url && !this.form.movie_url.endsWith('/')){
        this.form.movie_url += '/'
      }
      this.errors = []
      const url = this.$baseURL + 'movies/'
      const newMovie = {
        title: this.form.title,
        rating: this.form.rating,
        year: this.form.year,
        users_rating: this.form.user_rating,
        votes: this.form.votes,
        metascore: this.form.meta_score,
        img_url: this.form.img_url,
        countries: this.makeList(this.form.countries),
        languages: this.makeList(this.form.languages),
        actors: this.makeList(this.form.actors),
        genre: this.makeList(this.form.genre),
        tagline: this.form.tagline,
        description: this.form.description,
        directors: this.makeList(this.form.directors),
        runtime: this.form.runtime,
        imdb_url: this.form.movie_url
      }
      axios.post(url, newMovie)
      .then((res) => {
        if (res.status === 201) {
          this.form.movie_url = res.data.url
          this.getMovieByURL()
        }
        this.loading = false
      }).catch( err => {
          this.error = true
          if(err.response.status === 404) this.errorMessage = "not found"
          else this.errorMessage = "something went wrong"
          this.loading = false
        })

    },
    /**
     * Method that validates the update form. It adds all teh necessary query parameters
     * as well.
     */
    validUpdateForm() {
      this.loading = true
      const url = this.form.movie_url.substring(27)
      let sepparator = '?'
      let query = this.$baseURL + 'movies/url/' + url
      if (this.form.title) {
        query += sepparator + 'title=' + this.form.title
        sepparator = '&'
      }
      if (this.form.rating) {
        query += sepparator + 'rating=' + this.form.rating
        sepparator = '&'
      }
      if (this.form.year) {
        query += sepparator + 'year=' + this.form.year
        sepparator = '&'
      }
      if (this.form.user_rating) {
        query += sepparator + 'users_rating=' + this.form.user_rating / 10
        sepparator = '&'
      }
      if (this.form.meta_score) {
        query += sepparator + 'metascore=' + this.form.meta_score
        sepparator = '&'
      }
      if (this.form.img_url) {
        query += sepparator + 'img_url=' + this.form.img_url
        sepparator = '&'
      }
      if (this.form.countries) {
        const countries = this.makeList(this.form.countries)
        query += sepparator + 'countries=' + countries
        sepparator = '&'
      }
      if (this.form.languages) {
        const languages = this.makeList(this.form.languages)
        query += sepparator + 'languages=' + languages
        sepparator = '&'
      }
      if (this.form.actors) {
        const actors = this.makeList(this.form.actors)
        query += sepparator + 'actors=' + actors
        sepparator = '&'
      }
      if (this.form.genre) {
        const genre = this.makeList(this.form.genre)
        query += sepparator + 'genre=' + genre
        sepparator = '&'
      }
      if (this.form.directors) {
        const directors = this.makeList(this.form.directors)
        query += sepparator + 'directors=' + directors
        sepparator = '&'
      }
      if (this.form.description) {
        query += sepparator + 'description=' + this.form.description
        sepparator = '&'
      }
      if (this.form.tagline) {
        query += sepparator + 'tagline=' + this.form.tagline
        sepparator = '&'
      }
      return query
    },

    /**
     * Method that takes in a string containing elements separated by ; and
     * turns it into a list of elements.
     */
    makeList(listString) {
      let list = []
      let curr = ''
      let space = false
      let letter = false
      for (let i = 0; i < listString.length; i++) {
        if (listString.charAt(i) != ';') {
          if (listString.charAt(i) == ' ' && !space && letter) {
            space = true
            curr += ' '
          } else if (listString.charAt(i) != ' ') {
            curr += listString.charAt(i)
            letter = true
            space = false
          }
        } else {
          if (curr.charAt(curr.length - 1) == ' ') curr = curr.substring(0, curr.length - 1)
          list.push(curr)
          curr = ''
          space = false
          letter = false
        }
      }
      if (curr.charAt(curr.length - 1) == ' ') curr = curr.substring(0, curr.length - 1)
      if (curr != '') list.push(curr)
      return list
    },
    
    /**
     * Method that requests all actors from the backend.
     */
    async getAllActors(){
      this.loading = true
      this.error = false
      let query = this.$baseURL + 'actors/'
      if(this.form.csv){
        this.csvRepresentation = true
        axios.get(query, {
          headers: {
            Accept: 'text/csv'
          }
        })
        .then(response => {
        this.actors = response.data
        this.loading = false
        }).catch( err => {
          this.error = true
          if(err.response.status === 404) this.errorMessage = "not found"
          else this.errorMessage = "something went wrong"
          this.loading = false
        })
      } else {
        this.csvRepresentation = false
        axios.get(query)
        .then(response => {
        if(response.data.message === 'success'){
            this.actors = response.data.actors
        }
        this.loading = false
        }).catch( err => {
          this.error = true
          if(err.response.status === 404) this.errorMessage = "not found"
          else this.errorMessage = "something went wrong"
          this.loading = false
        })
      }
    },

    /**
     * Method that gets one or more actors by using the name.
     */
    async getOneOrMoreActorsByName(){
      this.error = false
      this.actors = null
      this.loading = true
      let aName = this.form.actorName
      let query = this.$baseURL + 'actors/' + aName
      if(this.form.csv){
        this.csvRepresentation = true
        axios.get(query, {
          headers: {
            Accept: 'text/csv'
          }
        })
        .then(response => {
          this.actors = response.data
          this.loading = false
        }).catch( err => {
          this.error = true
          if(err.response.status === 404) this.errorMessage = "not found"
          else this.errorMessage = "something went wrong"
          this.loading = false
        })
      } else {
        this.csvRepresentation = false
        axios.get(query)
        .then(response => {
          if(response.data.message === 'success'){
            this.actors = response.data.actors
          }
          this.loading = false
        }).catch( err => {
          this.error = true
          if(err.response.status === 404) this.errorMessage = "not found"
          else this.errorMessage = "something went wrong"
          this.loading = false
        })
      }
    },
    
    /**
     * Method that resets all the relevant fields whenever the user wants to select a different query.
     */
    resetSelected(){
      if(this.selectedMovie) this.selectedMovie = null
      this.form.csv = null
      this.csvRepresentation = false
      this.movies = null
      this.genres = null
      this.actors = null
      this.error = false
    },
  },
  
  computed: {
      rows() {
        return this.movies.length
      },
      year() {
        return new Date().getFullYear()
      }
    }
}
</script>


<!-- 
SECTION 4: STYLE
In this section we declare a few style variables for the front-end
 -->
<style>
@import '~bootstrap/dist/css/bootstrap.css';
@import 'assets/style.css';
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  /* text-align: center; */
  color: #2c3e50;
  margin-top: 60px;
}
b {
  color: red;
}
</style>
