const axios = require('axios');
const cheerio = require('cheerio');
const xlsx = require('xlsx');

// URL to scrape
const url = 'https://www.naukri.com/it-jobs?src=gnbjobs_homepage_srch';

axios.get(url)
  .then(response => {
    const html = response.data;
    const $ = cheerio.load(html);

    const jobs = [];

    $('.jobTuple.bgWhite.br4.mb-8').each((index, element) => {
      const jobTitle = $(element).find('.title.fw500.ellipsis').text().trim();
      const companyName = $(element).find('.subTitle.ellipsis.fleft').text().trim();
      const location = $(element).find('.fleft.grey-text.br2.placeHolderLi.location').text().trim();
      const jobType = $(element).find('.fleft.grey-text.br2.placeHolderLi.experience').text().trim(); // Hypothetical, adjust accordingly
      const postedDate = $(element).find('.type.br2.fleft.grey span').text().trim(); // Hypothetical, adjust accordingly
      const jobDescription = $(element).find('.job-description.fs12.grey-text').text().trim();

      jobs.push({
        'Job Title': jobTitle,
        'Company Name': companyName,
        'Location': location,
        'Job Type': jobType,
        'Posted Date': postedDate,
        'Job Description': jobDescription
      });
    });

    // Log the jobs to the console
    console.log(jobs);

    // Create a new workbook and sheet
    const wb = xlsx.utils.book_new();
    const ws = xlsx.utils.json_to_sheet(jobs);

    // Append the sheet to the workbook
    xlsx.utils.book_append_sheet(wb, ws, 'Tech Job Postings');

    // Write the workbook to a file
    xlsx.writeFile(wb, 'tech_job_postings.xlsx');

    console.log('Scraping and Excel file creation complete.');
  })
  .catch(error => {
    console.error('Error occurred while scraping:', error);
  });