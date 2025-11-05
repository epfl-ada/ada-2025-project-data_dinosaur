
# The Timeline of Humor: Do Jokes Evolve with the World?

Jokes often reveal what people care about, fear, or protest against, making humor a mirror of society.
In this project, we examine how humor changes in reaction to social, political, and international events by analyzing The New Yorker Cartoon Caption Contest dataset (2016–2023). Millions of reader-rated captions for weekly cartoons are included in the dataset.

Our objective is to create an interactive humor timeline that identifies thematic shifts in jokes and high points in public engagement as well as humor types. We investigate the relationship between humor trends and significant social events like the US elections, the #MeToo and Black Lives Matter movements, and international crises like COVID-19. 
By combining natural-language processing, statistical analysis, and Google Trends data, we aim to uncover whether people literally “laugh about what’s happening in the world” and when they stop laughing.

## Research questions

This project explores how humor evolves in response to societal and global changes. We will ask whether humor trends reflect world events, and if peaks in caption activity or shifts in audience ratings align with major political or social crises. We will also investigate how humor themes and styles develop over time, by analyzing which topics dominate in different years such as politics, social movements, or everyday life, and whether these shifts correlate with patterns of public interest online. By comparing humor trends with Google search data for key events or figures like "Trump" or "COVID-19", we will finally aim to determine whether captions talking about these key elements appear more frequently or not.


## Additional Datasets

Jain, L., Jamieson, K., Mankoff, R., Nowak, R., Sievert, S., (2020). 
The New Yorker Cartoon Caption Contest Dataset. 
https://nextml.github.io/caption-contest-data/
- Needed to obtain the dates of each contest


Google Trends data (via the pytrends API) used to correlate caption topics with public-interest dynamics. :
- Weekly search-interest scores (0–100) for topic clusters:
    - Politics (“Trump”, “Biden”, “election”),
    - Social movements (“Me Too”, “Black Lives Matter”, “feminism”),
    - Crises (“covid”, “virus”, “lockdown”, “war”).

We will normalize and align both datasets to weekly resolution and test correlations or lags.

# Methods

## Data Collection and Preparation
We used *The New Yorker Cartoon Caption Contest* dataset (2016–2022), containing captions, images, and reader votes. Data was cleaned, normalized, and focused on three key text fields: `image_descriptions`, `image_uncanny_descriptions`, and `questions`.  
To connect humor with real-world events, we collected weekly **Google Trends** data (2016–2023) for political, social, and crisis-related topics via the *pytrends* API. All processed data were stored in `contests_with_humor.json`.

## Analysis Process
Captions were preprocessed (tokenization, stopword removal, n-grams) and analyzed with TF-IDF and K-Means to identify thematic clusters.  
In **LLMs.ipynb**, a fine-tuned **Llama 3-8B** model classified humor into six types (*irony, sarcasm, exaggeration, incongruity-absurdity, self-deprecating, wit-surprise*), while a **RoBERTa** model assessed sentiment (*positive, neutral, negative*). These predictions were added to the metadata of each contest.

## Presenting the Results
We visualized humor and sentiment distributions with pie charts and histograms to explore how tone and style evolved over time and reflected major global events.
# Proposed timeline

how we plan to organize steps of our analysis for the remaining time of the project (which steps from the methods to complete on weekly basis)

Week 6: 
- Defining clearly the project goal and the research questions. 
- Division of tasks between team members

Week 7:
- Loading and preprocessing of all dataframes.
- Scraping of additional datasets.
- Beginning the visualization of the data

Week 8:
- Analysis related to Google trends
- Analysis related to words frequency
- Read me for P2
- Notebbok for P2

Week 9:
- Finalize the analysis on google trends (work with csv files data)
- Continue analysis linked to humor style
- Continue analysis linked to captions

Week 10:
- Start the final part


# Organization within the team 

Jannik : 
- ...

Silvia:
- Pre processing the data
- Data cleaning
- Creation of dataframes

Thara:
- Google trends analysis 
    - comparison between frequencies of words in the google trends and in the dataset
    - clustering type of humor

Yann:
- Google trends analysis
    - import Google trends dataset
    - LLM 
    
Yuno:
- Contest dataset
    - scraping of the contest website
- Caption analysis
    - words frequency in the captions
    - analysis of timeline of words like Trump or COVID

# Questions for TAs

to complete

## Quick start

```bash
# clone project
git clone <project link>
cd <project repo>

# [OPTIONAL] create conda environment
conda create -n <env_name> python=3.13
conda activate <env_name>


# install requirements
pip install -r pip_requirements.txt
```



### How to use the library
Most of the work for this project is organized and demonstrated directly in the notebooks found at the root of the repository (e.g. results.ipynb, final.ipynb, google_trend.ipynb, LLMs.ipynb). These notebooks contain the main analyses, visualizations, and experiments.
The src folder contains some Python code that supports the notebooks:
- src/data/ includes scripts for loading, preprocessing, and generating datasets. It contains the Google trends datasets, the humor types datasets and the newyorker caption contest datasets that are the datasets given from the beginning.
- src/models/ contains model definitions or training scripts.
- src/utils/ provides reusable helper functions such as utils_import.py, which centralizes all common imports.
- src/scripts/ includes scripts for automated data processing or analysis tasks.


## Project Structure

The directory structure of new project looks like this:

```
├── data                           <- Project data files
│   ├── GoogleTrends                <- Datasets of Google Trends
│   ├── humor_types                 <- Datasets of humor types
│   ├── newyorker_caption_contest   <- Datasets of the caption contest
│
├── src                             <- Source code
│   ├── data                                <- Data directory
│   ├── models                              <- Model directory
│   ├── utils                               <- Utility directory
│   ├── scripts                             <- Shell scripts
│
├── tests                           <- Tests of any kind
│
├── results.ipynb                   <- a well-structured notebook showing the results
│
├── .gitignore                      <- List of files ignored by git
├── pip_requirements.txt            <- File for installing python dependencies
├── google_trends.ipynb             <- 
├── LLMs.ipynb                      <-
├── results.ipynb                   <- Notebook with our analysis and results
└── README.md