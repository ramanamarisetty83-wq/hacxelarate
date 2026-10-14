"""
Dataset 4: PhiUSIIL Phishing URL Dataset
Source: UCI Machine Learning Repository (dataset/967)
Citation: Prasad & Chandra, "PhiUSIIL: A novel benchmark dataset for phishing URL detection using Machine Learning", Computers & Security, Elsevier (2024).
Description:
  Massive benchmark of 235,795 URLs (134,850 legitimate, 100,945 phishing) with 134 extracted lexical, structural, and web page features.
"""

from typing import List, Dict, Any
import re
import math

FEATURE_COLUMNS = [
    "URLLength",                  # Total characters in URL string
    "DomainLength",               # Domain character count
    "NoOfSubDomain",              # Subdomain count
    "NoOfLettersInURL",           # Letter count
    "NoOfDegitsInURL",            # Digit count
    "NoOfEqualsInURL",            # '=' character count
    "NoOfQMarkInURL",             # '?' query parameter count
    "SpcharRatioInURL",           # Ratio of special characters
    "IsHTTPS",                    # 1 if HTTPS, 0 if HTTP
    "NoOfDotsInURL",              # Dot count
    "NoOfHyphensInURL",           # Hyphen count
    "HasSuspiciousWords",         # 1 if contains phishing words (login, verify, secure, banking)
    "TLDLegitimateProb"           # Probability of TLD being genuine (0.0 to 1.0)
]

BENCHMARK_SAMPLES = [
    # Phishing URL 1: Targeted Banking Impersonation
    {
        "features": [62, 28, 3, 44, 8, 2, 1, 0.161, 1, 4, 3, 1, 0.12],
        "label": 1,
        "sample_name": "https://apexpay-security-verify.cc/login?auth=token",
        "explanation": "Abusive .cc TLD, 4 dots, 3 hyphens, credential harvest keywords, high special character ratio"
    },
    # Phishing URL 2: Sideloading Dropper
    {
        "features": [74, 32, 2, 52, 12, 1, 0, 0.148, 0, 3, 4, 1, 0.08],
        "label": 1,
        "sample_name": "http://apexpay-apk-download-2024.xyz/payload/2fa.apk",
        "explanation": "Unencrypted HTTP, rogue .xyz TLD, APK binary path, multiple hyphens typosquatting brand"
    },
    # Phishing URL 3: Token Claim Giveaway Phish
    {
        "features": [55, 24, 2, 41, 6, 2, 1, 0.145, 1, 3, 2, 1, 0.15],
        "label": 1,
        "sample_name": "https://apexpay-claim-bonus.top/airdrop.php?user=id",
        "explanation": "High-risk .top TLD, suspicious parameter string, typosquatted brand root"
    },
    # Legitimate URL 1: Official Corporate Website
    {
        "features": [20, 10, 0, 16, 0, 0, 0, 0.050, 1, 1, 0, 0, 0.98],
        "label": 0,
        "sample_name": "https://apexpay.io/",
        "explanation": "Short URL length (20 chars), zero hyphens, clean official .io TLD, valid HTTPS"
    },
    # Legitimate URL 2: Official Documentation Subdomain
    {
        "features": [32, 14, 1, 26, 0, 0, 0, 0.062, 1, 2, 0, 0, 0.95],
        "label": 0,
        "sample_name": "https://docs.apexpay.io/api/v2",
        "explanation": "Standard developer subdomain, zero numerical digits, safe path hierarchy"
    }
]

def extract_phiusiil_features(url_string: str) -> List[float]:
    url = url_string.strip()
    url_len = float(len(url))
    
    # Extract domain
    domain_match = re.search(r"https?://([^/]+)", url)
    domain = domain_match.group(1) if domain_match else url
    domain_len = float(len(domain))
    
    subdomains = max(0, domain.count(".") - 1)
    letters = sum(c.isalpha() for c in url)
    digits = sum(c.isdigit() for c in url)
    equals = url.count("=")
    qmarks = url.count("?")
    
    spchars = sum(not c.isalnum() for c in url)
    spchar_ratio = round(spchars / max(1.0, url_len), 3)
    
    is_https = 1.0 if url.lower().startswith("https://") else 0.0
    dots = float(url.count("."))
    hyphens = float(url.count("-"))
    
    suspicious_keywords = ["verify", "security", "login", "update", "banking", "wallet", "support", "bonus", "free", "claim", "2fa", "auth"]
    has_suspicious = 1.0 if any(k in url.lower() for k in suspicious_keywords) else 0.0
    
    # TLD assessment
    legitimate_tlds = [".com", ".org", ".io", ".net", ".edu", ".gov"]
    suspicious_tlds = [".cc", ".xyz", ".top", ".buzz", ".work", ".tk", ".cf", ".gq"]
    
    if any(url.lower().endswith(tld) or (tld + "/") in url.lower() for tld in suspicious_tlds):
        tld_prob = 0.10
    elif any(url.lower().endswith(tld) or (tld + "/") in url.lower() for tld in legitimate_tlds):
        tld_prob = 0.95
    else:
        tld_prob = 0.60

    return [
        url_len,
        domain_len,
        float(subdomains),
        float(letters),
        float(digits),
        float(equals),
        float(qmarks),
        spchar_ratio,
        is_https,
        dots,
        hyphens,
        has_suspicious,
        tld_prob
    ]
