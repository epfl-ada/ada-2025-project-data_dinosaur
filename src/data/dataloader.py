import pandas as pd
import numpy as np
import os, sys
import matplotlib.pyplot as plt
from datetime import timedelta
from bs4 import BeautifulSoup
import requests
from io import StringIO


def get_caption_dataset():
    path = "./data/newyorker_caption_contest/data/"
    dirs = os.listdir(path)
    files = [os.path.join(path,i) for i in os.listdir(path) if os.path.isfile(os.path.join(path,i))]

    df = pd.DataFrame()

    data_frames = []
    for file in files:
        
        data = pd.read_csv(file, sep=',')
        file_number_csv =  os.path.split(file)[-1]
        file_number = int(file_number_csv.replace('.csv', ''))
        data['contest_id'] = file_number #add a column with the contest id 
        # starting from 660 the rank is nolonger shown, but comparing it with https://nextml.github.io/caption-contest-data/dashboards/883.html
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

    return df_cleaned





def get_image_data(): 
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
    df_scrape.rename(columns={'Finalists Announced (date of issue)': 'Date'}, inplace=True)
    df_scrape['Date'] = df_scrape['Date'].str.replace(' (estimated)', '').str.strip()
    df_scrape.drop(columns=['Cartoon'], inplace=True)
    df_scrape = df_scrape.iloc[::-1].reset_index(drop=True)

    #check if all expected contest IDs are present
    expected_ids = list(range(510, 896))
    missing_ids_df = pd.Series(expected_ids)[~pd.Series(expected_ids).isin(df['contest_id'])]
    missing_ids_scrape = pd.Series(expected_ids)[~pd.Series(expected_ids).isin(df_scrape['Contest Dashboard'].astype(int))]

    #print('Missing data from df: ',missing_ids_df.tolist())
    #print('Missing data from df_scrape: ',missing_ids_scrape.tolist())

    df_scrape['Date'] = pd.to_datetime(df_scrape['Date'], errors='coerce')

    # Assume contest happens each week and fill missing dates
    for i in range(1, len(df_scrape)):
        if pd.isna(df_scrape.loc[i, 'Date']):
            df_scrape.loc[i, 'Date'] = df_scrape.loc[i - 1, 'Date'] + timedelta(days=7)

    for i in range(len(df_scrape)-2, -1, -1):
        if pd.isna(df_scrape.loc[i, 'Date']):
            df_scrape.loc[i, 'Date'] = df_scrape.loc[i+1, 'Date'] - timedelta(days=7)

    df_scrape['Contest Dashboard'] = df_scrape['Contest Dashboard'].astype(int)
    df_complete = pd.merge(df, df_scrape, left_on='contest_id', right_on='Contest Dashboard')

    df_complete.drop(columns=['image'], inplace=True)
    df_complete.drop(columns=['data'], inplace=True)
    df_complete.drop(columns=['Contest Dashboard'], inplace=True)
    df_complete.drop(columns=['num_votes'], inplace=True) #better to keep Number of Votes from the official website

    return df_complete

