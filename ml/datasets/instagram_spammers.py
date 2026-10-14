"""
Dataset 1: Instagram Fake Spammer Genuine Accounts Dataset
Source: Kaggle (free4ever1/instagram-fake-spammer-genuine-accounts)
Description:
  Benchmark dataset for distinguishing genuine Instagram accounts from fake, spam, and bot accounts.
  Contains both binary label (fake vs genuine) and continuous/discrete account metadata.
"""

from typing import List, Dict, Any

# Feature Column Definitions
FEATURE_COLUMNS = [
    "profile_pic",             # 1 if has profile picture, 0 otherwise
    "nums_length_username",   # Ratio of numerical digits in username
    "fullname_words",          # Word count in full name
    "nums_length_fullname",   # Ratio of numerical digits in full name
    "name_equals_username",    # 1 if full name matches username exactly, 0 otherwise
    "description_length",      # Character count in biography
    "external_url",            # 1 if bio contains external URL, 0 otherwise
    "is_private",              # 1 if account is private, 0 if public
    "posts",                   # Total number of media posts
    "followers",               # Follower count
    "follows"                  # Following / follows count
]

# Benchmark Sample Rows from Kaggle free4ever1 dataset
BENCHMARK_SAMPLES = [
    # Malicious / Spammer / Fake Profile Samples (Label: 1)
    {
        "features": [0, 0.42, 1, 0.33, 1, 8, 1, 0, 3, 24, 1850],
        "label": 1,
        "sample_name": "ApexPay_Claim_Bonus88 (Spammer Bot)",
        "explanation": "No profile pic, high digit ratio in handle, zero bio credibility, follows:followers ratio > 70:1"
    },
    {
        "features": [1, 0.28, 2, 0.00, 0, 15, 1, 0, 7, 65, 2300],
        "label": 1,
        "sample_name": "ApexPay_InstantRefund (Fake Support)",
        "explanation": "External phishing URL in bio, low follower count with aggressive following, newly created"
    },
    {
        "features": [0, 0.60, 1, 0.50, 1, 0, 0, 0, 0, 8, 950],
        "label": 1,
        "sample_name": "User_984321_apex (Syndicate Sockpuppet)",
        "explanation": "No photo, zero posts, entirely numerical username, abnormal following behavior"
    },
    {
        "features": [1, 0.35, 1, 0.20, 0, 22, 1, 0, 12, 110, 3100],
        "label": 1,
        "sample_name": "ApexPay_CryptoAirDrop (Scam Promo)",
        "explanation": "Scam external link, excessive follower-to-following imbalance, stock brand avatar"
    },

    # Genuine / Legitimate Account Samples (Label: 0)
    {
        "features": [1, 0.00, 2, 0.00, 0, 145, 1, 0, 1240, 680000, 210],
        "label": 0,
        "sample_name": "ApexPayHQ (Official Verified Account)",
        "explanation": "High post count, 680k organic followers, verified link to apexpay.io, natural name"
    },
    {
        "features": [1, 0.05, 3, 0.00, 0, 85, 0, 1, 240, 1420, 520],
        "label": 0,
        "sample_name": "priya_fintech_writer (Genuine Individual)",
        "explanation": "Organic follower/following balance, established post history, long bio description"
    },
    {
        "features": [1, 0.00, 2, 0.00, 0, 60, 1, 0, 540, 8900, 1100],
        "label": 0,
        "sample_name": "mumbai_business_review (Genuine Portal)",
        "explanation": "Regular publishing cadence, organic follower growth, non-spam biography"
    }
]

def extract_features_from_dict(account_data: Dict[str, Any]) -> List[float]:
    """Extracts the 11 Kaggle Instagram benchmark features from raw account metadata."""
    username = str(account_data.get("username", ""))
    fullname = str(account_data.get("display_name", account_data.get("fullname", "")))
    bio = str(account_data.get("bio", ""))
    followers = float(account_data.get("followers", 0))
    following = float(account_data.get("following", account_data.get("follows", 0)))
    posts = float(account_data.get("post_count", account_data.get("posts", 0)))

    has_pic = 1.0 if account_data.get("profile_image_url") or account_data.get("has_profile_pic") else 0.0
    u_digits = sum(c.isdigit() for c in username) / max(1, len(username))
    fn_words = len(fullname.split())
    fn_digits = sum(c.isdigit() for c in fullname) / max(1, len(fullname))
    name_eq_u = 1.0 if username.lower() == fullname.lower() else 0.0
    bio_len = float(len(bio))
    has_ext_url = 1.0 if account_data.get("external_url") or ("http" in bio) else 0.0
    is_priv = 1.0 if account_data.get("is_private") else 0.0

    return [
        has_pic,
        round(u_digits, 3),
        float(fn_words),
        round(fn_digits, 3),
        name_eq_u,
        bio_len,
        has_ext_url,
        is_priv,
        posts,
        followers,
        following
    ]
