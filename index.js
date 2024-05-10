const axios = require('axios');
const cheerio = require('cheerio');

/**
 * Scrapes data from a web page based on the provided URL and target class.
 * @async
 * @param {string} url - The URL of the web page to scrape.
 * @param {string} targetClass - The CSS class selector of the target element(s) to scrape.
 * @param {Object} [options={}] - Optional configurations for the scraping process.
 * @param {Function} [options.beforeRequest] - A function to be executed before sending the HTTP request.
 * @param {Function} [options.afterRequest] - A function to be executed after receiving the HTTP response.
 * @param {Function} [options.onError] - A function to be executed when an error occurs during scraping.
 * @param {Function} [options.beforeParse] - A function to be executed before parsing the HTML content.
 * @param {Function} [options.afterParse] - A function to be executed after parsing the HTML content.
 * @param {Function} [options.beforeRetry] - A function to be executed before retrying the scraping process.
 * @param {Function} [options.afterRetry] - A function to be executed after a retry attempt.
 * @param {Function} [options.beforeResponse] - A function to be executed before processing the HTTP response.
 * @param {number} [options.timeout=5000] - The timeout duration for the HTTP request in milliseconds.
 * @param {Object} [options.headers={}] - Additional headers to include in the HTTP request.
 * @returns {Promise<Object>} - A promise that resolves with the scraped data or rejects with an error.
 */
async function scrapeData(url, targetClass, options = {}) {
    const { beforeRequest, afterRequest, onError, beforeParse, afterParse, beforeRetry, afterRetry, beforeResponse, timeout = 5000, headers = {} } = options;

    try {
        // BeforeRequest event
        if (beforeRequest && typeof beforeRequest === 'function') {
            beforeRequest(url);
        }

        // Axios request configuration
        const axiosConfig = {
            url,
            headers: {
                ...headers,
            },
            timeout,
        };

        const response = await axios(axiosConfig);

        // AfterRequest event
        if (afterRequest && typeof afterRequest === 'function') {
            afterRequest(response);
        }

        const $ = cheerio.load(response.data);

        // BeforeParse event
        if (beforeParse && typeof beforeParse === 'function') {
            beforeParse($);
        }

        const data = $(targetClass).text().trim();

        // AfterParse event
        if (afterParse && typeof afterParse === 'function') {
            afterParse(data);
        }

        return { data };
    } catch (error) {
        // Error event
        if (onError && typeof onError === 'function') {
            onError(error);
        }

        // BeforeRetry event
        if (beforeRetry && typeof beforeRetry === 'function') {
            beforeRetry(error);
        }

        // Retry logic
        if (options.retry > 0) {
            console.log(`Retrying... Attempts left: ${options.retry}`);
            return scrapeData(url, targetClass, { ...options, retry: options.retry - 1 });
        }

        // AfterRetry event
        if (afterRetry && typeof afterRetry === 'function') {
            afterRetry(error);
        }

        // Handle specific error messages
        if (error.response) {
            // Axios error
            return { error: 'HTTP request failed' };
        } else if (error.message === 'Something went wrong in Cheerio') {
            // Cheerio error
            return { error: 'Cheerio parsing error' };
        } else {
            // Other errors
            return { error: error.message };
        }
    }
}

module.exports = { scrapeData };

 