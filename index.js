const PORT = process.env.PORT || 8000
const express = require('express')
const axios = require('axios')
const cheerio = require('cheerio')
const app = express()

const newspapers = [
    {
        name: 'thetimes',
        address: 'https://www.thetimes.co.uk/topic/economics',
        base: ''
    },
    {
        name: 'guardian',
        address: 'https://www.theguardian.com/business/economics',
        base: '',
    },
    {
        name: 'telegraph',
        address: 'https://www.telegraph.co.uk/business/economy/',
        base: 'https://www.telegraph.co.uk',
    },
    {
        name: 'nyt',
        address: 'https://www.nytimes.com/international/section/business/economy',
        base: '',
    },
    {
        name: 'latimes',
        address: 'https://www.latimes.com/search?q=Economy',
        base: '',
    },
    {
        name: 'smh',
        address: 'https://www.smh.com.au/business/the-economy',
        base: 'https://www.smh.com.au',
    },
    {
        name: 'bbc',
        address: 'https://www.bbc.com/news/business/economy',
        base: 'https://www.bbc.co.uk',
    },
    {
        name: 'es',
        address: 'https://www.standard.co.uk/business/economy',
        base: 'https://www.standard.co.uk'
    },
    {
        name: 'dm',
        address: 'https://www.dailymail.co.uk/news/uk-economy/index.html',
        base: ''
    },
    {
        name: 'nyp',
        address: 'https://nypost.com/tag/economy/',
        base: ''
    }
]

const articles = []

newspapers.forEach(newspaper => {
    axios.get(newspaper.address)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)

            $('a:contains("economy")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')

                articles.push({
                    title,
                    url: newspaper.base + url,
                    source: newspaper.name
                })
            })

        })
})

app.get('/', (req, res) => {
    res.json('Welcome to my Economy Change News API')
})

app.get('/economy', (req, res) => {
    res.json(articles)
})

app.get('/economy/:newspaperId', (req, res) => {
    const newspaperId = req.params.newspaperId

    const newspaperAddress = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].address
    const newspaperBase = newspapers.filter(newspaper => newspaper.name == newspaperId)[0].base


    axios.get(newspaperAddress)
        .then(response => {
            const html = response.data
            const $ = cheerio.load(html)
            const specificArticles = []

            $('a:contains("economy")', html).each(function () {
                const title = $(this).text()
                const url = $(this).attr('href')
                specificArticles.push({
                    title,
                    url: newspaperBase + url,
                    source: newspaperId
                })
            })
            res.json(specificArticles)
        }).catch(err => console.log(err))
})

app.listen(PORT, () => console.log(`server running on PORT ${PORT}`))