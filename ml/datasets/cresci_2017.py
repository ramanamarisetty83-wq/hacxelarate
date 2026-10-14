"""
Dataset 2: Cresci-2017 Social Bot Dataset
Source: Botometer / Indiana University (cresci-2017.csv.zip)
Citation: Cresci et al., "The paradigm-shift of social spambots: Evidence, theories, and tools for detecting the new generation of social spambots", WWW 2017.
Description:
  Gold-standard research benchmark featuring traditional spambots, social spambots #1, #2, #3, fake followers, and verified genuine accounts.
"""

from typing import List, Dict, Any

FEATURE_COLUMNS = [
    "statuses_count",         # Total posts published
    "followers_count",        # Follower count
    "friends_count",          # Friends / following count
    "favourites_count",       # Likes / favourites given
    "listed_count",           # Public lists member count
    "default_profile",        # 1 if default UI theme, 0 if custom
    "default_profile_image",  # 1 if default egg/silhouette avatar, 0 if uploaded
    "geo_enabled",            # 1 if geolocation tagging is active
    "verified",               # 1 if Twitter verified badge
    "reputation_ratio"        # followers / (followers + friends)
]

BENCHMARK_SAMPLES = [
    # Social Spambot #1 (Synchronized Astroturfing Bot)
    {
        "features": [18, 42, 1920, 3, 0, 1, 0, 0, 0, 0.021],
        "label": 1,
        "sample_name": "ApexPay_Promo_Bot_41 (Social Spambot #1)",
        "explanation": "Synchronized retweet network behavior, negligible favourites, reputation ratio 0.021"
    },
    # Social Spambot #2 (Impersonator / Fake Customer Service)
    {
        "features": [34, 15, 840, 0, 0, 1, 1, 0, 0, 0.017],
        "label": 1,
        "sample_name": "ApexPayCare_Helpdesk (Social Spambot #2)",
        "explanation": "Default silhouette avatar, zero listed count, high friends-to-followers ratio"
    },
    # Traditional Spambot #1 (URL Spammer)
    {
        "features": [3450, 89, 4500, 2, 1, 1, 0, 0, 0, 0.019],
        "label": 1,
        "sample_name": "FastCash_Loan_Apex (Traditional Spambot)",
        "explanation": "Repetitive automated link spamming with high frequency and zero user engagement"
    },
    # Genuine Human User
    {
        "features": [4820, 3200, 890, 6400, 28, 0, 0, 1, 0, 0.782],
        "label": 0,
        "sample_name": "vikram_fintech_analyst (Genuine Account)",
        "explanation": "High favourites interaction, non-default theme, healthy 0.782 reputation ratio"
    },
    # Genuine Enterprise Account
    {
        "features": [9400, 485000, 310, 1200, 820, 0, 0, 1, 1, 0.999],
        "label": 0,
        "sample_name": "ApexPayHQ_Official (Verified Brand)",
        "explanation": "Verified status, high listed presence, massive organic follower ratio 0.999"
    }
]

def extract_features_from_dict(user_meta: Dict[str, Any]) -> List[float]:
    statuses = float(user_meta.get("post_count", user_meta.get("statuses_count", 0)))
    followers = float(user_meta.get("followers", user_meta.get("followers_count", 0)))
    friends = float(user_meta.get("following", user_meta.get("friends_count", 0)))
    favourites = float(user_meta.get("favourites_count", 0))
    listed = float(user_meta.get("listed_count", 0))

    def_profile = 1.0 if user_meta.get("default_profile", True) else 0.0
    def_image = 0.0 if user_meta.get("profile_image_url") else 1.0
    geo = 1.0 if user_meta.get("geo_enabled") else 0.0
    verified = 1.0 if user_meta.get("verified") else 0.0

    total_connections = followers + friends
    rep_ratio = round(followers / max(1.0, total_connections), 3)

    return [
        statuses,
        followers,
        friends,
        favourites,
        listed,
        def_profile,
        def_image,
        geo,
        verified,
        rep_ratio
    ]
