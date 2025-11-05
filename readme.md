
# The Timeline of Humor: Do Jokes Evolve with the World?

Jokes often reveal what people care about, fear, or protest against, making humor a mirror of society.
In this project, we examine how humor changes in reaction to social, political, and international events by analyzing The New Yorker Cartoon Caption Contest dataset (2016–2022). Millions of reader-rated captions for weekly cartoons are included in the dataset.
Our objective is to create an interactive humor timeline that identifies thematic shifts in jokes and high points in public engagement as well as humor types. We investigate the relationship between humor trends and significant social events like the US elections, the #MeToo and Black Lives Matter movements, and international crises like COVID-19. 
By combining natural-language processing, statistical analysis, and Google Trends data, we aim to uncover whether people literally “laugh about what’s happening in the world” and when they stop laughing.

## Reserach questions (to improve)

Do humor trends follow world events?
Do peaks in caption activity or rating shifts coincide  with political or social crises?
How do humor themes evolve over time?
What topics dominate jokes in different years (politics, social movements, daily life)?
Does caption and humor style change through time?
Are humor trends correlated with public interest online?
When Google searches for “pandemic” or “Trump” surge, do related captions appear more frequently?

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

what did we used / will we use to work on the dataset ?

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
- Continue analysis linked to yuno ?

Week 10:
- Start the final part


# Organization within the team 

how we planned to divide tasks between team members (not time-wise) 
-> can write in another format

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
- ...

# Questions for TAs

to complete

## Quickstart

```bash
# clone project
git clone <project link>
cd <project repo>

# [OPTIONAL] create conda environment
conda create -n <env_name> python=3.11 or ...
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
├── data                        <- Project data files
│
├── src                         <- Source code
│   ├── data                            <- Data directory
│   ├── models                          <- Model directory
│   ├── utils                           <- Utility directory
│   ├── scripts                         <- Shell scripts
│
├── tests                       <- Tests of any kind
│
├── results.ipynb               <- a well-structured notebook showing the results
│
├── .gitignore                  <- List of files ignored by git
├── pip_requirements.txt        <- File for installing python dependencies
└── README.md
```

