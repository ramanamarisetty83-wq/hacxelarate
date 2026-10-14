import re
import math
from typing import Dict, Any, Tuple, List

def calculate_string_similarity(s1: str, s2: str) -> float:
    a = re.sub(r'[^a-z0-9]', '', s1.lower())
    b = re.sub(r'[^a-z0-9]', '', s2.lower())
    if not a or not b:
        return 0.0
    if a == b:
        return 1.0
    
    # N-gram matching
    n = 3
    if len(a) < n or len(b) < n:
        return 1.0 if a in b or b in a else 0.0

    ngrams_a = set(a[i:i+n] for i in range(len(a) - n + 1))
    ngrams_b = set(b[i:i+n] for i in range(len(b) - n + 1))
    intersection = len(ngrams_a.intersection(ngrams_b))
    union = len(ngrams_a.union(ngrams_b))
    return intersection / union if union > 0 else 0.0

def score_to_level(score: int) -> str:
    if score >= 80:
        return "CRITICAL"
    elif score >= 60:
        return "HIGH"
    elif score >= 40:
        return "MEDIUM"
    return "LOW"

class RiskEngine:
    """
    Explainable Multi-Signal Risk Engine for DRPP.
    Aggregates identity, linguistic, structural, and static APK signals.
    """

    @staticmethod
    def evaluate_social_profile(
        username: str,
        display_name: str,
        bio: str,
        followers: int,
        following: int,
        account_age_days: int,
        verified: bool,
        external_url: str = None,
        target_brand: str = "ApexPay",
        official_domain: str = "https://apexpay.io"
    ) -> Tuple[int, str, int, List[str], List[str]]:
        score = 15
        reasons = []

        u_sim = calculate_string_similarity(username, target_brand)
        d_sim = calculate_string_similarity(display_name, target_brand)

        if u_sim > 0.5:
            weight = int(35 * u_sim)
            score += weight
            reasons.append(f"High username similarity ({int(u_sim*100)}%) imitating official brand {target_brand}")

        if d_sim > 0.5:
            score += 20
            reasons.append(f"Display name '{display_name}' mirrors protected trademark")

        if not verified:
            score += 10
            reasons.append("Unverified social profile attempting to represent an enterprise")

        if account_age_days < 14:
            score += 18
            reasons.append(f"Newly registered profile ({account_age_days} days old)")

        if following > 100 and followers < 50:
            score += 15
            reasons.append("Follower-to-following imbalance indicative of outreach spam bot")

        bio_lower = bio.lower()
        if any(w in bio_lower for w in ["support", "help", "otp", "wallet", "resolve", "unfreeze"]):
            score += 15
            reasons.append("Biography contains customer support and credential solicitation triggers")

        if external_url:
            clean_domain = official_domain.replace("https://", "").replace("http://", "")
            if clean_domain not in external_url:
                score += 20
                reasons.append(f"External link ({external_url}) redirects away from official domain")

        final_score = min(100, max(0, score))
        risk_level = score_to_level(final_score)
        confidence = min(99, max(65, int(final_score * 0.95 + 10)))

        recommendations = [
            f"Issue urgent trademark/impersonation takedown to platform Trust & Safety",
            f"Add handle to automated brand protection monitoring list",
            f"Publish customer advisory alert warning of spoofed support handles"
        ]

        return final_score, risk_level, confidence, reasons, recommendations

    @staticmethod
    def evaluate_scam_content(
        text: str,
        url: str = None,
        target_brand: str = "ApexPay"
    ) -> Tuple[int, str, int, List[str], List[str]]:
        score = 15
        reasons = []
        text_lower = text.lower()

        patterns = [
            ("otp", 30, "Urgent OTP / One-Time Passcode request detected"),
            ("seed phrase", 35, "Cryptographic seed phrase compromise solicitation"),
            ("private key", 35, "Wallet private key harvesting pattern"),
            ("password", 25, "Credential / password solicitation trigger"),
            ("airdrop", 22, "High-yield unauthorized promotional airdrop scheme"),
            ("bonus", 20, "Free financial incentive bait"),
            ("account suspended", 25, "Urgent account suspension psychological pressure"),
            ("within 30 minutes", 20, "Time-limited urgency inducement"),
            ("wire money", 30, "Direct non-refundable wire instruction"),
        ]

        for token, weight, desc in patterns:
            if token in text_lower:
                score += weight
                reasons.append(desc)

        if url:
            score += 15
            reasons.append(f"Contains external redirection hyperlink: {url}")

        final_score = min(100, max(0, score))
        risk_level = score_to_level(final_score)
        confidence = min(99, max(70, int(final_score * 0.92 + 10)))

        recommendations = [
            "Flag content for financial phishing and credential harvesting",
            "Broadcast warning bulletin across official consumer communications"
        ]

        return final_score, risk_level, confidence, reasons, recommendations

    @staticmethod
    def evaluate_url(
        url: str,
        target_brand: str = "ApexPay",
        official_domain: str = "https://apexpay.io"
    ) -> Tuple[int, str, int, List[str], List[str]]:
        score = 20
        reasons = []
        clean_url = url.strip().lower()

        clean_brand = re.sub(r'[^a-z0-9]', '', target_brand.lower())
        official_host = official_domain.replace("https://", "").replace("http://", "")

        if clean_brand in clean_url and official_host not in clean_url:
            score += 40
            reasons.append(f"Brand typosquatting detected ({target_brand} in unauthorized domain)")

        suspicious_tlds = [".xyz", ".cc", ".top", ".tk", ".ml", ".buzz", ".rest", ".club", ".live"]
        for tld in suspicious_tlds:
            if tld in clean_url:
                score += 25
                reasons.append(f"High-abuse top-level domain extension detected ({tld})")
                break

        if clean_url.startswith("http://"):
            score += 15
            reasons.append("Unencrypted HTTP protocol used on sensitive authentication path")

        if clean_url.count("-") >= 2:
            score += 12
            reasons.append("Multiple hyphen separators characteristic of phishing kits")

        phish_keywords = ["login", "verify", "auth", "portal", "security", "update", "claim"]
        for kw in phish_keywords:
            if kw in clean_url:
                score += 15
                reasons.append(f"Credential-harvesting keyword in URL path ('{kw}')")
                break

        final_score = min(100, max(0, score))
        risk_level = score_to_level(final_score)
        confidence = min(99, max(75, int(final_score * 0.94 + 8)))

        recommendations = [
            "Submit abuse suspension request to authoritative domain registrar",
            "Propagate domain to Google Safe Browsing and Microsoft SmartScreen feeds",
            "Add domain to corporate perimeter firewall and DNS sinkhole"
        ]

        return final_score, risk_level, confidence, reasons, recommendations

    @staticmethod
    def evaluate_app(
        app_name: str,
        package_name: str,
        permissions: List[str],
        developer_name: str = None,
        target_brand: str = "ApexPay",
        official_package: str = "com.apexpay.wallet"
    ) -> Tuple[int, str, int, List[str], List[str]]:
        score = 25
        reasons = []

        dangerous_perms = {
            "READ_SMS": 25,
            "RECEIVE_SMS": 25,
            "SEND_SMS": 20,
            "SYSTEM_ALERT_WINDOW": 25,
            "REQUEST_INSTALL_PACKAGES": 20,
            "READ_CONTACTS": 15,
            "ACCESS_FINE_LOCATION": 12,
            "RECORD_AUDIO": 20,
            "BIND_ACCESSIBILITY_SERVICE": 30,
        }

        matched_dangerous = []
        for p in permissions:
            clean_p = p.replace("android.permission.", "")
            if clean_p in dangerous_perms:
                matched_dangerous.append(clean_p)
                score += dangerous_perms[clean_p]

        if matched_dangerous:
            reasons.append(f"Contains {len(matched_dangerous)} high-risk permissions ({', '.join(matched_dangerous[:4])})")

        if package_name != official_package and (target_brand.lower() in package_name.lower() or "wallet" in package_name.lower()):
            score += 30
            reasons.append(f"Typosquatted Android package identifier ({package_name}) infringing {official_package}")

        if target_brand.lower() in app_name.lower():
            score += 15
            reasons.append(f"Unauthorized application title copying trademark: '{app_name}'")

        final_score = min(100, max(0, score))
        risk_level = score_to_level(final_score)
        confidence = min(99, max(80, int(final_score * 0.95 + 8)))

        recommendations = [
            "Dispatch DMCA takedown notice to third-party APK mirror portals",
            "Submit sample package signature to Google Play Protect & VirusTotal",
            "Alert end-users regarding unofficial rogue companion applications"
        ]

        return final_score, risk_level, confidence, reasons, recommendations
