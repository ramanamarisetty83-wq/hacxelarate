from sklearn.ensemble import RandomForestClassifier

def build_url_model():
    """
    Random Forest Classifier for URL feature vectors:
    [url_length, num_dots, num_hyphens, is_https, is_suspicious_tld, has_brand_typosquat, has_phish_keyword]
    """
    return RandomForestClassifier(
        n_estimators=50,
        max_depth=5,
        random_state=42
    )
