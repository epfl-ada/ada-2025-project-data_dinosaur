# =========================
# Standard library imports
# =========================
import os, re, json, math, warnings, pathlib, time, csv
from io import StringIO
from collections import Counter, defaultdict
from typing import List, Dict, Optional, Tuple
from pathlib import Path

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

# =========================
# Default settings
# =========================
NGRAM_RANGE = (1, 1)
TOP_K = 30

sns.set(style="whitegrid", context="talk")
warnings.filterwarnings("ignore")
plt.rcParams["figure.figsize"] = (10, 6)
