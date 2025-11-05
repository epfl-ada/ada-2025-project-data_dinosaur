'''
Helper functions for text extraction, tokenization, and frequency analysis.
'''

import json
import pathlib
import re
import spacy
from typing import List
import numpy as np
import matplotlib.pyplot as plt
from sklearn.feature_extraction.text import CountVectorizer

# --- Default configuration ---
NGRAM_RANGE = (1, 1)  # Unigrams and bigrams
TOP_K = 50  # Top K frequent n-grams to display

# Load English model
nlp = spacy.load("en_core_web_sm")

def keep_nouns_adjs(text):
    doc = nlp(text)
    # Keep nouns and adjectives
    filtered_tokens = [token.text for token in doc if token.pos_ in {"NOUN", "PROPN", "ADJ"}]
    return " ".join(filtered_tokens)

# -------------------------------
# LOAD UTILITIES
# -------------------------------
def load_records(path: pathlib.Path):
    """
    Load a JSON or JSONL file into a list of records (dicts).
    Supports:
      - standard JSON arrays
      - JSONL (one JSON object per line)
      - dicts with key 'contests' containing a list
    """
    txt = path.read_text(encoding="utf-8")
    try:
        obj = json.loads(txt)
    except json.JSONDecodeError:
        # JSONL fallback
        recs = []
        with path.open(encoding="utf-8") as f:
            for line in f:
                line = line.strip()
                if line:
                    recs.append(json.loads(line))
        return recs

    if isinstance(obj, list):
        return obj
    if isinstance(obj, dict):
        if "contests" in obj and isinstance(obj["contests"], list):
            return obj["contests"]
        return [obj]
    raise ValueError("Unsupported JSON structure")


# -------------------------------
# TEXT EXTRACTION
# -------------------------------

def collect_texts(records, field: str) -> List[str]:
    """
    Extracts a flat list of text strings from a given metadata field
    across all records.
    """
    out = []
    for r in records:
        m = r.get("metadata") or {}
        v = m.get(field) if isinstance(m, dict) else None
        if isinstance(v, list):
            out.extend([s for s in v if isinstance(s, str)])
        elif isinstance(v, str):
            out.append(v)
    return out


# -------------------------------
# FREQUENCY COUNTING & PLOTTING
# -------------------------------

def count_terms(texts, ngram_range=NGRAM_RANGE, stop_words="english"):
    """
    Tokenize texts and count term frequencies using CountVectorizer.
    Returns (vocab, counts) arrays.
    """
    
    texts_filtered = [keep_nouns_adjs(text) for text in texts]
    
    vectorizer = CountVectorizer(
        stop_words=stop_words,
        token_pattern=r"(?u)\b[a-zA-Z]{3,}\b",
        ngram_range=ngram_range
    )
    X = vectorizer.fit_transform(texts_filtered)
    counts = np.asarray(X.sum(axis=0)).ravel()
    vocab = np.array(vectorizer.get_feature_names_out())
    return vocab, counts


def top_terms(vocab, counts, top_k=TOP_K):
    """
    Sort vocabulary by descending frequency and return the top_k terms and counts.
    """
    order = np.lexsort((vocab, -counts))
    top_idx = order[:top_k]
    return vocab[top_idx], counts[top_idx]


def plot_top_terms(terms, counts, field_name="", ngram_range=NGRAM_RANGE, top_k=TOP_K):
    """
    Create a bar plot of the top terms.
    """
    plt.figure(figsize=(12, 5))
    plt.bar(terms, counts)
    plt.xticks(rotation=90)
    ngram_label = "unigrams" if ngram_range == (1, 1) else f"{ngram_range[0]}-{ngram_range[1]}-grams"
    plt.title(f"Top {top_k} {ngram_label}" + (f" — {field_name}" if field_name else ""))
    plt.ylabel("Frequency")
    plt.tight_layout()
    plt.show()


# -------------------------------
# CONVENIENCE PIPELINE
# -------------------------------

def analyze_field(records, field, ngram_range=NGRAM_RANGE, top_k=TOP_K):
    """
    Complete pipeline: extract texts, count top terms, and plot.
    """
    texts = collect_texts(records, field)
    if not texts:
        print(f"[{field}] No texts found, skipping.")
        return
    vocab, counts = count_terms(texts, ngram_range)
    top_vocab, top_counts = top_terms(vocab, counts, top_k)
    plot_top_terms(top_vocab, top_counts, field, ngram_range, top_k)