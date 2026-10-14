from sklearn.ensemble import RandomForestClassifier

def build_social_model():
    """
    Random Forest Classifier for tabular social profile features.
    Features:
    [username_sim, display_name_sim, bio_sim, followers, following, post_count, account_age_days, verified, has_external_url]
    """
    return RandomForestClassifier(
        n_estimators=50,
        max_depth=5,
        random_state=42
    )
