const films = require("../utils/film");
require("dotenv").config();
let apiKey = process.env.API_KEY;
const puppeteer = require("puppeteer");
/* const opinions = require("../obj_Json/opinions.json"); */

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
    res.status(200).render("dashboard");
  },
  film: async (req, res) => {
    let title = req.params.title;
    let titleMayus = capitalizarPrimeraLetra(title)
    function capitalizarPrimeraLetra(str) {
        return str.charAt(0).toUpperCase() + str.slice(1);
      }
       
    let data = await films.getPelicula(
      `http://www.omdbapi.com/?t=${title}&apikey=${apiKey}`
    );
    /* Aqui irán las promesas y metodos del scraping para la pagina film ?*/
    /* res.status(200).render('film', Datos Scrapping) */ //datos Scrapping?
    async function opinions() {
      const browser = await puppeteer.launch({ headless: false });
      const page = await browser.newPage();
      await page.goto(`https://www.sensacine.com`);
      await page.waitForSelector('#didomi-notice-agree-button')
      await page.click('#didomi-notice-agree-button');
        await page.waitForSelector('#header-main-mobile-btn-search')
        await page.click('#header-main-mobile-btn-search');
        await page.waitForSelector('#header-search-input')
        
        await page.type('#header-search-input', titleMayus);
        await page.waitForSelector(`#search-engine > div > div > div.autocomplete-results > div > img[alt=${titleMayus}]`)
        await page.click(`#search-engine > div > div > div.autocomplete-results > div > img[alt=${titleMayus}]`);
        await page.waitForSelector(".content-txt.review-card-content");
        /* const opinions = document.querySelectorAll(
            ".content-txt.review-card-content"); */
        await page.evaluate(()=>{
            console.log('estamos dentro')
            const datacoment = [];
            const opinions = document.querySelectorAll(
            ".content-txt.review-card-content"); 
          
          opinions.forEach((cometarios) => {
            datacoment.push(cometarios);

        });
        console.log(data)
        return datacoment;

        })

        
        
      //async function getPageData() {
        
          /* const data = await page.evaluate(() => {
            const opinions = document.querySelectorAll(
              ".content-txt.review-card-content"

          );
          const data = [];
          console.log(data)
          opinions.forEach(() => {
            data.push();
            return data;
          }); */
          
          
        /* }); */

        /* await browser.close(); */
      //}
    }
    opinions();
    res.status(200).render("film", data);
  },
  search: async (req, res) => {
    let title = req.params.title;

    let data = await films.getPelicula(
      `http://www.omdbapi.com/?t=${title}&apikey=${apiKey}`
    );
    res.status(200).render("search", data)()();
  },
  movies: async (req, res) => {
    // SUSTITUIR POR LA RESPUESTA DE LA BBDD
    let arrFavoritas = ["tt1216475", "tt4029846", "tt10222892", "tt0401383"];

    let getFilms = async () => {
      let pelis = arrFavoritas.map(async (filmID) => {
        let data = await films.getPelicula(
          `http://www.omdbapi.com/?i=${filmID}&apikey=${apiKey}`
        );
        return data;
      });
      return Promise.all(pelis);
    };
    let data = await getFilms();
    res.status(200).render("movies", { data });
  },
};

module.exports = routes;

/* module.exports = async function opinions(); */
