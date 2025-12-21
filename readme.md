
# [The Timeline of Humor: Do Jokes Evolve with the World?](https://sipofoy.github.io/ada-2025-data-dinosaur-website/)
<sub><span style="color:#bfbfbf;"><em>(Please click on the title above to access the website.)</em></span></sub>
<sub><span style="color:#bfbfbf;"><em>Note: the code for the website is maintained in a separate repository: https://github.com/SipofoY/ada-2025-data-dinosaur-website.git</em></span></sub>

We analyze how humor in The New Yorker Cartoon Caption Contest (2016–2023) evolves over time and across major world events. 
Using NLP, Google Trends, and Large Language Models, we study thematic shifts, gender heterogeneity in humor, and how wars, climate crisis, the Trump election and COVID-19 influence humor styles.
All results are presented through an interactive data story website.

## Context 
Jokes often reveal what people care about, fear, or protest against, making humor a mirror of society.
In this project, we examine how humor changes in reaction to social, political, and international events by analyzing The New Yorker Cartoon Caption Contest dataset (2016–2023). Millions of reader-rated captions for weekly cartoons are included in the dataset.

Our objective is to create an interactive humor timeline that highlights thematic shifts in jokes, public engagement, and humor types. We investigate the relationship between humor trends and significant social events like the US elections, gender inequality and international crises like COVID-19. 
By combining natural-language processing, statistical analysis, and Google Trends data, we aim to uncover whether people literally “laugh about what’s happening in the world” and when they stop laughing.

### Final Contributions

The final analysis of this project includes:
- A complete analysis and cleaning of the New Yorker Caption Contest dataset
- A gender heterogeneity analysis comparing humor between men and women in captions
- A timeline-based study of humor evolution centered on four major events: wars, climate change, the Trump election, and COVID-19
- Large Language Model (LLM)–based clustering of humor types
- An interactive website presenting the analysis and results as a data story


## Research questions
<!--
This project explores how humor evolves in response to societal and global changes. We will ask whether humor trends reflect world events, and if peaks in caption activity or shifts in audience ratings align with major political or social crises. We will also investigate how humor themes and styles develop over time, by analyzing which topics dominate in different years such as politics, social movements, or everyday life, and whether these shifts correlate with patterns of public interest online. By comparing humor trends with Google search data for key events or figures like "Trump" or "COVID-19", we will finally aim to determine whether captions talking about these key elements appear more frequently or not.
In addition, we study whether humor differs across groups, with a specific focus on gender heterogeneity between men and women. 
Finally, we leverage Large Language Models to automatically classify captions into humor types and analyze how these humor categories evolve over time and across major world events.
-->
This project addresses the following research questions:
- To what extent do humor trends in The New Yorker Cartoon Caption Contest reflect major societal and global events?
- Do peaks in caption activity or changes in audience ratings align temporally with political, social, or international crises?
- How do humor themes and styles evolve over time, and which topics dominate different periods (e.g., politics, social movements, everyday life)?
- Are shifts in humor topics correlated with public interest as measured by Google search trends for key terms such as “Trump” or “COVID-19”?
- Are there systematic differences in humor between men and women, indicating gender heterogeneity in humor expression or reception? And how is the gender inequality represented in the captions?
- Can Large Language Models reliably classify captions into distinct humor types, and how do these humor categories evolve across time and major world events?


## Additional Datasets
In addition to the main caption dataset, we used external datasets to enrich the temporal and societal context of the analysis.

Jain, L., Jamieson, K., Mankoff, R., Nowak, R., Sievert, S., (2020). 
The New Yorker Cartoon Caption Contest Dataset. 
https://nextml.github.io/caption-contest-data/
- Needed to obtain the dates of each contest


Google Trends data (via the pytrends API) used to correlate caption topics with public-interest dynamics :
- Weekly search-interest scores (0–100) for topic clusters:
    - Politics (“Trump”, “Biden”, “election”),
    - Social movements (“Me Too”, “Black Lives Matter”, “feminism”),
    - Crises (“covid”, “virus”, “lockdown”, “war”).

We will normalize and align both datasets to weekly resolution and test correlations or lags.

# Methods

## Contest captions analysis
We used *The New Yorker Cartoon Caption Contest* dataset (2016-2023) combined with the data in https://nextml.github.io/caption-contest-data/ to obtain the dates of each contest. Then, we analyzed which were the words the most used in captions to discover some correlations between polar words (like man/woman). This dataset was also used to analyze the appearance of the words `Trump`and `COVID` over time to check whether these words frequency can be correlated with events like US presidency or a worldwide pandemic.

For the caption analysis, simple data treatments were combined with statistical methods. Basic statistics is used to calculate means of meticulously sorted data. A moving average filter is also used in parallel to analyze the development over time without having noise from specific captions.

In addition, the polar words (man/women) are analyzed by mean impact of the votes `funny` and `not funny`. This allows us to study gender heterogeneity in humor reception and themes over time. To achieve this analysis, the captions were tokenized and lemmatized to divide them according to their content of men- and women-focused words.

The timeline analysis focuses in particular on four major categories of events: wars, climate crises, the Trump election, and the COVID-19 pandemic.


## Data Collection and Preparation
We used *The New Yorker Cartoon Caption Contest* dataset (2016–2023), containing captions, images, and reader votes. Data were cleaned, normalized, and focused on three key text fields: `image_descriptions`, `image_uncanny_descriptions`, and `questions`.  
To connect humor with real-world events, we collected weekly **Google Trends** data (2016–2023) for political, social, and crisis-related topics via the *pytrends* API. All processed data is stored in `contests_with_humor.json`.

## Analysis Process
Captions were preprocessed (tokenization, stopword removal, n-grams). TF-IDF and K-Means clustering were used to identify recurring topics across different text fields, while Google Trends data from 2016 to 2023 provided a measure of public interest for the same words. For the four main events studied (wars, climate change, the Trump election, and COVID-19), we explicitly analyzed the relationship between caption frequencies and Google Trends signals by computing Pearson, Spearman, and Kendall τ correlations to quantify linear and rank-based associations. Word groups linked to specific events were tracked over time to observe shifts in tone before and after the main period of the event. Using a sentence-transformer model, words were classified into humor categories such as dark humor, irony, or surrealism, revealing the thematic diversity of the dataset. Finally, each contest was tagged with its humor types to visualize how these categories evolved weekly across the studied period.

In **LLMs.ipynb**, a fine-tuned **Llama 3-8B** model classified humor into six types (*irony, sarcasm, exaggeration, incongruity-absurdity, self-deprecating, wit-surprise*), while a **RoBERTa** model assessed sentiment (*positive, neutral, negative*). These predictions were added to the metadata of each contest. These LLM-based annotations enable a structured, large-scale analysis of humor styles and their evolution across time and events.

## Results and Data Story
All results are presented and contextualized in an interactive data story website.

### Website repository

The interactive data story website is developed in a separate repository:
https://github.com/SipofoY/ada-2025-data-dinosaur-website.git

The website is deployed to GitHub Pages and can be accessed here:
https://sipofoy.github.io/ada-2025-data-dinosaur-website/


# Organization within the team 

Jannik : 
- Caption analysis
    - per topic (gender, Trump and Climate change)
    - by analysing over time
- Anaylsis of the funny and unfunny votes: is there an interesting developement?
- Gender heterogeneity analysis (plots + website page)
  
Silvia:
- Preprocessing the data
- Data cleaning
- Creation of dataframes
- Data analysis and plots + website introduction page and data visualization 

Thara:
- Google trends analysis 
    - Comparison between frequencies of words in the google trends and in the dataset
    - Correlation calculations
    - Clustering type of humor
- Creation of the website and implementation of the stucture and draft
- Timeline and Google trends vs our captions analysis, plots and website page

Yann:
- Google trends analysis
    - Import Google trends dataset
    - LLM
- Data visualization on the website
- LLM and humor clustering analysis, plots and website page
- Creation of the website repo and page deployment
    
Yuno:
- Contest dataset
    - Scraping of the contest website
- Caption analysis
    - Words frequency in the captions
    - Analysis of timeline of words like Trump and COVID
- Gender heterogeneity analysis (plots + website page)

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

The directory structure of our project looks like this:

```bash
├── data                            <- Project data files
│   ├── GoogleTrends                    <- Datasets of Google Trends
│   ├── humor_types                     <- Datasets of humor types
│   ├── newyorker_caption_contest       <- Datasets of the caption contest
│
├── src                             <- Source code
│   ├── data                            <- Data directory
│   ├── utils                           <- Utility directory
│
├── results.ipynb                   <- Notebook with data analysis and results
├── google_trends.ipynb             <- Notebook containing functions and plots used for Google Trends dataset
├── LLMs.ipynb                      <- Notebook with Humor classification by Llama
├── introduction.ipynb              <- Notebook with analysis plotted in the intro of the website
│
├── .gitignore                      <- List of files ignored by git
├── pip_requirements.txt            <- File for installing python dependencies
│
└── README.md
```

### Website (separate repository)

The website lives in the repository above. Its structure is:

```bash
├── .github/workflows <- GitHub Actions deployment
│ └── deploy.yml
│
├── web <- Website source code
│ ├── public <- Static assets
│ ├── scripts <- Build and data scripts
│ ├── plots_website_timeline <- Timeline visualizations
│ └── src
│ ├── app <- Next.js app router
│ ├── components <- React components
│ │ ├── About.tsx
│ │ ├── Book.tsx
│ │ ├── Clusters.tsx
│ │ ├── GenderPage.tsx
│ │ ├── Methodology.tsx
│ │ ├── StoryPage.tsx
│ │ └── TimelineBook.tsx
│ ├── context <- React contexts
│ └── data <- Processed data for visualization
│
├── next.config.ts <- Next.js configuration
├── tsconfig.json <- TypeScript configuration
├── package.json <- Project dependencies
└── README.md
```
