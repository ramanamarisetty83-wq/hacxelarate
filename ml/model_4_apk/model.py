from sklearn.ensemble import RandomForestClassifier

def build_apk_model():
    """
    Random Forest Classifier for static APK manifest features:
    [pkg_typosquat_flag, total_permissions, dangerous_permissions, has_sms_perm, has_overlay_perm, has_install_perm, is_untrusted_cert]
    """
    return RandomForestClassifier(
        n_estimators=50,
        max_depth=5,
        random_state=42
    )
