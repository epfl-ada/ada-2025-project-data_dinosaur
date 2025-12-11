# =========================
# Default variables
# =========================
NGRAM_RANGE = (1, 1)
TOP_K = 30

# =========================
# Standard library imports
# =========================
import os, re, json, math, warnings, pathlib, time, csv, importlib, spacy
from io import StringIO
from collections import Counter, defaultdict
from typing import List, Dict, Optional, Tuple
from pathlib import Path

# =========================
# Data loaders
# =========================
from src.data.dataloader import *
from src.utils.data_utils import *
from src.utils.evaluation_utils import *

# =========================
# Data and visualization
# =========================
import numpy as np
import pandas as pd
import matplotlib.pyplot as plt
import seaborn as sns

# =========================
# Web and scraping
# =========================
import requests
from bs4 import BeautifulSoup
from pytrends.request import TrendReq  # Google Trends API wrapper

# =========================
# Statistics
# =========================
import statsmodels
from statsmodels.stats import proportion, diagnostic
import statsmodels.api as sm
import statsmodels.formula.api as smf
from scipy import stats
from scipy.stats import (
    ttest_ind,
    pearsonr,
    spearmanr,
    kendalltau
)

# =========================
# Machine Learning / NLP
# =========================
from sklearn.preprocessing import StandardScaler
from sklearn.feature_extraction.text import CountVectorizer, TfidfVectorizer
from sklearn.cluster import KMeans
from sklearn.decomposition import PCA, TruncatedSVD
from sklearn.metrics.pairwise import cosine_similarity
from sentence_transformers import SentenceTransformer


from gensim.corpora import Dictionary
from gensim.models import Phrases

# =========================
# NLTK
# =========================
import nltk
nltk.download("punkt", quiet=True)
nltk.download("stopwords", quiet=True)

from nltk.tokenize import word_tokenize
from nltk.corpus import stopwords

# =========================
# Default settings
# =========================

sns.set(style="whitegrid", context="talk")
warnings.filterwarnings("ignore")
plt.rcParams["figure.figsize"] = (10, 6)



import os
import json

def save_json(obj, filename, folder="data/newyorker_caption_contest/exports"):
    """
    Save a Python object as a JSON file.
    filename should NOT include .json.
    Each graph can generate its own file.
    """
    os.makedirs(folder, exist_ok=True)
    path = os.path.join(folder, f"{filename}.json")

    with open(path, "w", encoding="utf-8") as f:
        json.dump(obj, f, ensure_ascii=False, indent=2)

    print(f"Saved JSON to: {path}")
    return path

