
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

## Contest captions analysis
We used *The New Yorker Cartoon Caption Contest* dataset (2016-2023) combined with the data in https://nextml.github.io/caption-contest-data/ to obtain the dates of each contest. Then, we analyzed which were the words the most used in captions to discover some correlations between polar words (like man/woman). This dataset was also used to analyze the appearance of the words `Trump`and `COVID` over time to check whether these words frequency can be correlated with events like US presidency or a worldwide pandemic.

Then, further analysis has been done for certain words. The polar words (man/women) have been followed over time. The same was done with the words for Trump/President. There, a small decrease of the word `Trump` is visible.
In addition, the polar words (man/women) are analysed by mean impact of the votes `funny` and `not funny`. Unfortunately, the results are rather disappointing and there is no significant development visible.

## Data Collection and Preparation
We used *The New Yorker Cartoon Caption Contest* dataset (2016–2023), containing captions, images, and reader votes. Data were cleaned, normalized, and focused on three key text fields: `image_descriptions`, `image_uncanny_descriptions`, and `questions`.  
To connect humor with real-world events, we collected weekly **Google Trends** data (2016–2023) for political, social, and crisis-related topics via the *pytrends* API. All processed data were stored in `contests_with_humor.json`.

For the caption analysis, simple data treatments were combined with statistical methods. Basic statistics is used to calculate means of meticulessy sorted data. This and as well a moving average filter is used to analyse the developement over time without having noise from specific captions.

## Analysis Process
Captions were preprocessed (tokenization, stopword removal, n-grams). TF-IDF and K-Means clustering were used to identify recurring topics across different text fields, while Google Trends data from 2016 to 2023 provided a measure of public interest for the same words. Word groups linked to negative or pandemic-related terms were tracked over time to observe shifts in tone before and after COVID-19. Using a sentence-transformer model, words were classified into humor categories such as dark humor, irony, or surrealism, revealing the thematic diversity of the dataset. Finally, each contest was tagged with its humor types to visualize how these categories evolved weekly across the studied period.
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
- Conceptualize the data story 

Week 10:
- Write text for the data story
- Visualize the data to make the story easy to understand


# Organization within the team 

Jannik : 
- caption analysis
    - by counting certain wordgroups
    - by analysing over time
- anaylsis of the funny and unfunny votes: is there an interessting developement?
  
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
│   ├── utils                               <- Utility directory
│
├── results.ipynb                   <- Notebook with data analysis and results
├── google_trends.ipynb             <- 
├── LLMs.ipynb                      <-
│
├── .gitignore                      <- List of files ignored by git
├── pip_requirements.txt            <- File for installing python dependencies
│
└── README.md
