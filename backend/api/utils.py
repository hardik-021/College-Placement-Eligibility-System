def calculate_eligibility_score(profile):
    """
    Calculate eligibility score out of 100:
    - CGPA: 40 points (Formula: (CGPA / 10) * 40)
    - Skills: 20 points (4+ skills = 20 points, otherwise count * 5 points)
    - No Backlogs: 20 points (20 points if active_backlogs == 0, else 0)
    - Resume: 10 points (10 points if resume uploaded, else 0)
    - Certifications: 10 points (10 points if certifications listed, else 0)
    """
    score = 0
    reasons = []
    suggestions = []

    # 1. CGPA (40 points)
    cgpa = float(profile.cgpa or 0.0)
    cgpa_score = (cgpa / 10.0) * 40.0
    score += cgpa_score
    if cgpa < 7.0:
        reasons.append(f"Your CGPA is {cgpa:.2f}, which is relatively low (recommended: >= 7.0).")
        suggestions.append("Focus on academic performance in upcoming exams to raise your CGPA above 7.0.")
    elif cgpa_score == 40.0:
        suggestions.append("Excellent academic standing! Maintain this CGPA.")

    # 2. Skills (20 points)
    skill_list = [s.strip() for s in (profile.skills or "").split(",") if s.strip()]
    skill_count = len(skill_list)
    if skill_count >= 4:
        score += 20
    else:
        score += (skill_count * 5)
        reasons.append(f"You have listed only {skill_count} skill(s). Listing at least 4 skills boosts your score.")
        suggestions.append("Learn and add more in-demand skills (e.g., Python, SQL, React, AWS) to your profile.")

    # 3. Active Backlogs (20 points)
    backlogs = profile.active_backlogs
    if backlogs == 0:
        score += 20
    else:
        reasons.append(f"You currently have {backlogs} active backlog(s). Many companies require zero backlogs.")
        suggestions.append("Prioritize clearing your active backlogs in the immediate supplementary exams.")

    # 4. Resume (10 points)
    if profile.resume:
        score += 10
    else:
        reasons.append("You have not uploaded a resume.")
        suggestions.append("Upload a professional PDF resume to complete your application readiness.")

    # 5. Certifications (10 points)
    cert_list = [c.strip() for c in (profile.certifications or "").split(",") if c.strip()]
    if cert_list and len(cert_list) > 0:
        score += 10
    else:
        reasons.append("No certifications are listed in your profile.")
        suggestions.append("Complete online certifications (e.g., Coursera, Udemy, AWS, Google) and add them.")

    # Overall Eligible Status
    # Let's say overall eligible if CGPA >= 6.0 and backlogs == 0
    is_eligible = cgpa >= 6.0 and backlogs == 0

    return {
        'score': round(score, 2),
        'is_eligible': is_eligible,
        'reasons': reasons,
        'suggestions': suggestions
    }
