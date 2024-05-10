# NestJS Scraper Library (1.0.0)

## Overview
NestJS Scraper Library is a versatile and easy-to-use tool for scraping data from web pages. It provides a robust and flexible framework for performing web scraping tasks with Node.js and NestJS.

## Features
- Scrapes data from web pages based on provided URL and target class
- Supports optional configurations for scraping process
- Provides events for handling various stages of scraping process, including before request, after request, error handling, and more
- Retry logic for handling temporary network issues
- Timeout configuration to prevent long-running requests
- Customizable HTTP headers for requests

## Installation
To install NestJS Scraper Library, run the following command:

```bash
npm install @web/scraper
````

## Usage

```javascript
const { scrapeData } = require('@web/scraper');

async function getDataFromUrl(url, targetClass) {
    try {
        const result = await scrapeData(url, targetClass, {
            retry: 3,
            timeout: 10000,
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.3',
            },
            beforeRequest: (url) => {
                console.log(`Sending request to ${url}`);
            },
            afterRequest: (response) => {
                console.log(`Received response with status code ${response.status}`);
            },
            onError: (error) => {
                console.error('An error occurred during scraping:', error);
            },
            beforeParse: ($) => {
                console.log('Parsing HTML content...');
            },
            afterParse: (data) => {
                console.log('Scraping completed successfully:', data);
            },
        });

        console.log('Scraped data:', result.data);
    } catch (error) {
        console.error('Failed to scrape data:', error);
    }
}

/* It will be sufficient if you provide the website you will  scrape and the HTML class whose data you want to get.
*/
getDataFromUrl('https://example.com', '.content');

```

## Documentation

For detailed documentation and API reference, please refer to the API Documentation file.

## License
Web Scraper Library is licensed under the MIT License. See the LICENSE file for details.

## Contribution
Contributions are welcome! Please feel free to submit issues or pull requests on GitHub.

