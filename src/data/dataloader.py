import pandas as pd
import numpy as np
import os, sys
import matplotlib.pyplot as plt
from datetime import timedelta


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

    # get rid of empty captions
    # get rid of broken captions 

    # find not complete parts   e.g 63867

    df_cleaned = df[df['caption'].notnull()] 
    df_cleaned = df_cleaned[~df_cleaned['caption'].str.contains(r'[\r\n]', regex=True)]

    df_cleaned = df_cleaned[~df_cleaned['caption'].isnull() == True]

    return df_cleaned