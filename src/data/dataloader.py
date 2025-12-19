import pandas as pd
import numpy as np
import os, spacy, requests
from datetime import timedelta
from bs4 import BeautifulSoup
from io import StringIO

nlp = spacy.load("en_core_web_sm", disable=["parser","ner"])

# =========================
# CSV Generator
# =========================
def save_to_csv(df, path): 
    '''
    Save DataFrame to CSV file.
    Args:
        df (pd.DataFrame): DataFrame to save.
        path (str): Path to save the CSV file.
    '''
    
    df.to_csv(path, index=False)
    
    
# =========================
# Data loaders
# =========================
def get_image_data(): 
    '''
    Scrape dataset from New Yorker caption contest website, and load and clean image metadata.
    Returns:
        pd.DataFrame: Cleaned DataFrame with image metadata.
    '''
    
    data_folder = './data/newyorker_caption_contest/'
    df = pd.read_json(data_folder + 'contests.json')
    metadata = df['metadata'].apply(pd.Series)
    df = pd.concat([df.drop(columns=['metadata']), metadata], axis=1)

    #scrape data from caption contest website
    url = "https://nextml.github.io/caption-contest-data/"
    soup = BeautifulSoup(requests.get(url).content, 'html.parser')

    df_scrape = pd.read_html(StringIO(str(soup.find('table'))))[0]


    #clean df_scrape columns
    df_scrape['Contest Dashboard'] = df_scrape['Contest Dashboard'].str.replace(' Dashboard', '').str.strip()
    df_scrape.rename(columns={'Finalists Announced (date of issue)': 'date'}, inplace=True)
    df_scrape['date'] = df_scrape['date'].str.replace(' (estimated)', '').str.strip()
    df_scrape.drop(columns=['Cartoon'], inplace=True)
    df_scrape = df_scrape.iloc[::-1].reset_index(drop=True)

    df_scrape['date'] = pd.to_datetime(df_scrape['date'], errors='coerce')
    
    # Assume contest happens each week and fill missing dates
    for i in range(1, len(df_scrape)):
        if pd.isna(df_scrape.loc[i, 'date']):
            df_scrape.loc[i, 'date'] = df_scrape.loc[i - 1, 'date'] + timedelta(days=7)

    for i in range(len(df_scrape)-2, -1, -1):
        if pd.isna(df_scrape.loc[i, 'date']):
            df_scrape.loc[i, 'date'] = df_scrape.loc[i+1, 'date'] - timedelta(days=7)

    df_scrape['Contest Dashboard'] = df_scrape['Contest Dashboard'].astype(int)
    df_complete = pd.merge(df, df_scrape, left_on='contest_id', right_on='Contest Dashboard')

    df_complete.drop(columns=['image'], inplace=True)
    df_complete.drop(columns=['data'], inplace=True)
    df_complete.drop(columns=['Contest Dashboard'], inplace=True)
    df_complete.drop(columns=['num_votes'], inplace=True) #better to keep Number of Votes from the official website

    return df_complete


def get_caption_dataset(df_image):
    '''
    Load and clean New Yorker caption contest captions.
    Args:
        df_image (pd.DataFrame): DataFrame with image metadata and website data.
    Returns:
        pd.DataFrame: Cleaned DataFrame with captions and associated metadata.
    '''
    
    path = "./data/newyorker_caption_contest/data/"
    files = [os.path.join(path,i) for i in os.listdir(path) if os.path.isfile(os.path.join(path,i)) and i.endswith('.csv')]

    df = pd.DataFrame()

    data_frames = []
    for file in files:
        
        data = pd.read_csv(file, sep=',', encoding='latin-1')
        file_number_csv =  os.path.split(file)[-1]
        file_number = int(file_number_csv.replace('.csv', ''))
        data['contest_id'] = file_number #add a column with the contest id 
        # starting from 660 the rank is no longer shown, but by comparing it with https://nextml.github.io/caption-contest-data/dashboards/883.html
        # we can assume that the order is the rank 
        if file_number >= 660: 
            data.insert(0, 'rank', np.arange(0, len(data)))
        data_frames.append(data)

    df = pd.concat(data_frames, ignore_index=True)

    # get rid of empty captions, get rid of broken captions 
    # find not complete parts   e.g 63867
    df_cleaned = df[df['caption'].notnull()] 
    df_cleaned = df_cleaned[~df_cleaned['caption'].str.contains(r'[\r\n]', regex=True)]

    df_cleaned = df_cleaned[~df_cleaned['caption'].isnull() == True]

    #join both dataframes on contest_id
    merged_df = pd.merge(df_image[["contest_id", "date"]], df_cleaned, on="contest_id", how="inner")
    
    return merged_df

def get_gender_masks_chunked(captions, female_kw, male_kw, chunk_size=5000):
    '''
    Get boolean masks for captions containing female and male keywords using chunked processing.
    Args:
        captions (List[str]): List of captions.
        female_kw (Set[str]): Set of female keywords.
        male_kw (Set[str]): Set of male keywords.
        chunk_size (int): Size of each chunk for processing.
    Returns:
        Tuple[List[bool], List[bool]]: Two lists of boolean values indicating presence of female and male keywords.
    '''
    female_results = []
    male_results = []
    
    for i in range(0, len(captions), chunk_size):
        chunk = captions[i:i+chunk_size]
        
        for doc in nlp.pipe(chunk, batch_size=200):
            lemmas = {token.lemma_.lower() for token in doc if token.is_alpha}
            female_results.append(bool(lemmas & female_kw))
            male_results.append(bool(lemmas & male_kw))
    
    return female_results, male_results

# =========================
# Data savers
# =========================
def save_df_as_json(df, folder_path, filename):
    """
    Save a pandas DataFrame as a JSON file in the given folder.
    Ensures the folder exists and joins paths safely.
    """
    os.makedirs(folder_path, exist_ok=True)       # create folder if missing
    full_path = os.path.join(folder_path, filename)
    df.to_json(full_path, orient="records", indent=2)
    return full_path