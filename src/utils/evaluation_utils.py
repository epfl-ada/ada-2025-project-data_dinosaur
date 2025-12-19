import pandas as pd
import numpy as np
import re

def do_counts(caption_array, who_count = {
  "house": "house"
}):
    #Count the words in all the captions of all the comics
    counted_dic = who_count.copy()
    counted = []
    for key, value in counted_dic.items():
        counted_dic[key] = (caption_array.str.contains(value).sum())
        counted.append(counted_dic[key])
    return counted

def moving_average(a, n=3):
    ret = np.cumsum(a, dtype=float)
    ret[n:] = ret[n:] - ret[:-n]
    return ret[n - 1:] / n

def classify_caption_humor(caption, type2tokens):
    """
    Classifies a caption into a humor type based on token overlap with a lexicon.
    type2tokens: dict { humor_type: set(tokens) }
    Returns the humor type with the highest token count, or 'unlabeled' if no matches.
    """
    if not isinstance(caption, str):
        return "unlabeled"
        
    # Simple tokenization
    tokens = re.findall(r'\b\w+\b', caption.lower())
    if not tokens:
        return "unlabeled"
    
    scores = {ht: 0 for ht in type2tokens}
    total_matches = 0
    
    for t in tokens:
        for ht, keywords in type2tokens.items():
            if t in keywords:
                scores[ht] += 1
                total_matches += 1
    
    if total_matches == 0:
        return "unlabeled"
    
    # Find max score
    best_type = max(scores, key=scores.get)
    return best_type
