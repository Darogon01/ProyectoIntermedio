const films = require("../utils/film");
const jwt = require('jsonwebtoken')
const Film = require("../models/Films");
const User = require("../models/Users");
const puppeteer = require("puppeteer");
let apiKey = process.env.API_KEY;

const routes = {
    home: (req, res) => {
        let url = { url: req.url };
        res.status(200).render("home", url);
    },
    signup: (req, res) => {
        let url = { url: req.url };
        res.status(200).render("signup", url);
    },
    dashboard: (req, res) => {
        let url = { url: req.url };
        res.status(200).render("dashboard", url);
    },
    film: async(req, res) => {
        if (req.headers.cookie) {
            token = req.headers.cookie.slice(6)
        }
        let decodedToken
        jwt.verify(token, process.env.SECRET, (err, token) => {
            decodedToken = token
        })
        let title = req.params.title;

        let titleMayus = capitalizarPrimeraLetra(title);

        function capitalizarPrimeraLetra(str) {
            return str.charAt(0).toUpperCase() + str.slice(1);
        }
        let data = await films.getPelicula(
            `http://www.omdbapi.com/?t=${title}&apikey=${apiKey}`
        );
        async function opinionsSensa() {
            const browser = await puppeteer.launch({
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                ],
            });
            const page = await browser.newPage();
            await page.goto(`https://www.sensacine.com`);
            await page.waitForSelector("#didomi-notice-agree-button");
            await page.click("#didomi-notice-agree-button");
            await page.waitForSelector("#header-main-mobile-btn-search");
            await page.click("#header-main-mobile-btn-search");
            await page.waitForSelector("#header-search-input");
            await page.type("#header-search-input", `                       ${titleMayus}`);
            await page.waitForSelector(
                `#search-engine > div > div > div.autocomplete-results > div > img[alt='${titleMayus}']`
            );

            await page.click(
                `#search-engine > div > div > div.autocomplete-results > div > img[alt='${titleMayus}']`
            );
            await page.waitForSelector(".content-txt.review-card-content");
            const coments = await page.evaluate(() => {
                const opinions = document.querySelectorAll(
                    ".content-txt.review-card-content"
                );
                const dataComentSensa = [];
                opinions.forEach((comentarios) => {
                    dataComentSensa.push(comentarios.innerText);
                });
                return dataComentSensa;
            });
            return coments;
        }
        async function opinionsAfinity() {
            const browser = await puppeteer.launch({
                args: [
                    '--no-sandbox',
                    '--disable-setuid-sandbox',
                ],
            });
            const page = await browser.newPage();
            await page.goto(`https://www.filmaffinity.com/es/main.html`);
            await page.waitForSelector("#qc-cmp2-ui > div.qc-cmp2-footer.qc-cmp2-footer-overlay.qc-cmp2-footer-scrolled > div > button.css-47sehv");
            await page.click("#qc-cmp2-ui > div.qc-cmp2-footer.qc-cmp2-footer-overlay.qc-cmp2-footer-scrolled > div > button.css-47sehv");
            await page.waitForSelector("#top-search-input");
            await page.click("#top-search-input");
            await page.type("#top-search-input", titleMayus);
            await page.keyboard.press('Enter');
            await page.waitForSelector("#title-result > div > div:nth-child(2) > div.fa-shadow-nb.item-search > div > div.mc-poster > a > img");
            await page.click("#title-result > div > div:nth-child(2) > div.fa-shadow-nb.item-search > div > div.mc-poster > a > img");
            await page.waitForSelector('div[itemprop=reviewBody]');
            const coments = await page.evaluate(() => {
                const opinionsAfinity = document.querySelectorAll(
                    'div[itemprop=reviewBody]'
                );
                const dataComentAfinity = [];
                opinionsAfinity.forEach((comentarios) => {
                    dataComentAfinity.push(comentarios.innerText);
                });
                return dataComentAfinity;
            });
            return coments;
        }
        let reviewsSensa = await opinionsSensa();
        let reviewsAfinity = await opinionsAfinity();

        let allDataFavs = await User.getUserFavorites(decodedToken.email)
        let idsFavs = []
        allDataFavs.forEach(film => {
            idsFavs.push(film.api_id_film)
        })
        idsFavs.includes(data.imdbID) ? data.favorite = "fav" : data.favorite = "noFav"
        res.status(200).render("film", { data, comentarios: reviewsSensa, coments: reviewsAfinity });

    },
    movies: async(req, res) => {
        if (req.headers.cookie) {
            token = req.headers.cookie.slice(6)
        }
        let decodedToken
        jwt.verify(token, process.env.SECRET, (err, token) => {
            decodedToken = token
        })
        if (decodedToken.isAdmin) {
            try {
                const films = await Film.find()
                return res.status(200).render('movies-admin', { films })
            } catch (err) {
                return res.status(400).json({ message: err.message })
            }
        }
        let favs = await User.getUserFavorites(decodedToken.email)
        let arrFavoritasApi = []
        let arrFavoritasDB = []
        let getFilmsApi
        let getFilmsDB
        favs.forEach(fav => {
            let id = Object.values(fav)
            const regexIdApi = /^tt/
            regexIdApi.test(Object.values(fav)) ? arrFavoritasApi.push(id) : arrFavoritasDB.push(id)
        })
        if (arrFavoritasApi) {
            getFilmsApi = async() => {
                let pelis = arrFavoritasApi.map(async(filmID) => {
                    let data = await films.getPelicula(`http://www.omdbapi.com/?i=${filmID}&apikey=${apiKey}`)
                    return data
                })
                return Promise.all(pelis)
            }
        }
        if (arrFavoritasDB) {
            getFilmsDB = async() => {
                try {
                    let pelis = arrFavoritasDB.map(async(filmID) => {
                        let data = await Film.find({ "filmId": filmID })
                        return data[0]
                    })
                    return Promise.all(pelis)
                } catch (err) {
                    res.end()
                }
            }
        }
        let favorites = await getFilmsApi()
        let filmsDB = await getFilmsDB()
        filmsDB.forEach(film => {
            favorites.push({
                imdbID: film.filmId,
                Poster: film.urlImage,
                Title: film.title,
                Year: film.year,
                Director: film.director,
                Genre: film.genre,
                Runtime: film.runtime,
            })
        })
        res.status(200).render('movies', { favorites })
    },
    search: async(req, res) => {
        if (req.headers.cookie) {
            token = req.headers.cookie.slice(6)
        }
        let decodedToken
        jwt.verify(token, process.env.SECRET, (err, token) => {
            decodedToken = token
        })
        let url = { url: req.url };
        if (req.method == "GET") {
            res.status(200).render("search", url);
        } else {
            let titulo = req.body.busqueda;
            let getFilmsIds = async(title) => {
                let arrayIds = [];
                let data = await films.getPelicula(
                    `http://www.omdbapi.com/?s=${title}&type=movie&apikey=${apiKey}`
                );
                data.Search.forEach((movie) => {
                    arrayIds.push(movie.imdbID);
                });
                return arrayIds;
            };
            let getFilms = async(arr) => {
                let pelis = arr.map(async(filmID) => {
                    let data = await films.getPelicula(
                        `http://www.omdbapi.com/?i=${filmID}&apikey=${apiKey}`
                    );
                    return data;
                });
                return Promise.all(pelis);
            };
            const filmsIds = await getFilmsIds(titulo);
            let filmsdata = await getFilms(filmsIds)
            let regexSearch = new RegExp(titulo)
            let filmsDB
            try {
                filmsDB = await Film.find({ title: { $regex: regexSearch, $options: 'i' } })
            } catch (err) {
                res.status(400).end()
            }
            filmsDB.forEach(film => {
                filmsdata.push({
                    imdbID: film.filmId.toString(),
                    Poster: film.urlImage,
                    Title: film.title,
                    Year: film.year,
                    Director: film.director,
                    Genre: film.genre,
                    Runtime: film.runtime,
                })
            })
            let allDataFavs = await User.getUserFavorites(decodedToken.email)
            let idsFavs = []
            allDataFavs.forEach(film => {
                idsFavs.push(film.api_id_film)
            })
            filmsdata.forEach(film => {
                idsFavs.includes(film.imdbID) ? film.favorite = "fav" : film.favorite = "noFav"
            })

            res.status(200).render("search", { filmsdata, url });
        }
    },
    createMovieGet: (req, res) => {
        res.status(200).render('createmovie')
    },
    createMoviePost: async(req, res) => {
        const film = new Film(req.body)
        try {
            const newFilm = await film.save()
            res.status(201).redirect(`/movies`)
        } catch (err) {
            res.status(400).render('createmovie', { message: err, dataErr: film })
        }
    },
    editMovieGet: async(req, res) => {
        let id = req.params.id
        try {
            const data = await Film.find({ "filmId": id })
            res.status(200).render('editmovie', data[0])
        } catch (err) {
            res.status(500).json({ message: err.message })
        }
    },
    editMoviePut: async(req, res) => {
        let id = req.body.filmId
        let film = req.body
        try {
            await Film.findOneAndUpdate({ "filmId": id }, film, { new: true, runValidators: true },
                (err, data) => {
                    if (err) return res.status(400).render('editmovie', { message: err, dataErr: film })
                    return res.status(201).redirect(`/movies`)
                })
        } catch (err) {
            res.status(500).json({ message: err.message })
        }
    },
    deleteMovie: async(req, res) => {
        let id = req.body.id
        try {
            await Film.deleteOne({ "filmId": id })
            res.status(201).redirect(`/movies`)
        } catch (err) {
            res.status(500).json({ message: err.message })
        }
    },
    favorite: async(req, res) => {
        if (req.headers.cookie) {
            token = req.headers.cookie.slice(6)
        }
        let decodedToken
        jwt.verify(token, process.env.SECRET, (err, token) => {
            decodedToken = token
        })
        let email = decodedToken.email
        let api_id_film = req.body.api_id_film
        try {
            let favorite = await User.searchFavorite(email, api_id_film)
            let id_film = favorite[0] != undefined ? favorite[0].id_film : false
            if (id_film) {
                await User.removeFavorite(email, api_id_film)
            } else {
                await User.addFavorite(email, api_id_film)
            }
            return res.status(201).end()
        } catch (err) {
            res.status(500).json({ message: err.message })
        }
    },
    deleteMovie: async(req, res) => {
        let id = req.body.id
        try {
            await Film.deleteOne({ "filmId": id })
            res.status(201).redirect(`/movies`)
        } catch (err) {
            res.status(500).json({ message: err.message })
        }
    },
    error404: (req, res) => {
        res.status(404).render("404")
    }
}

module.exports = routes;