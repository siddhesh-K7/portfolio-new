import os
import shutil
import re
import json

SRC_DIR = r"C:\Users\boopa\Desktop\selected certif"
DEST_DIR = r"c:\Users\boopa\Desktop\New folder\portfolio\assets\certificates"
DATA_FILE = r"c:\Users\boopa\Desktop\New folder\portfolio\certificates-data.js"

# Ensure destination directory exists and is clean
if os.path.exists(DEST_DIR):
    shutil.rmtree(DEST_DIR)
os.makedirs(DEST_DIR, exist_ok=True)

def sanitize_filename(name):
    base, ext = os.path.splitext(name)
    clean = base.lower()
    clean = re.sub(r'[^a-z0-9\s\-_]', '', clean)
    clean = re.sub(r'[\s\-_]+', '-', clean)
    clean = clean.strip('-')
    return f"{clean}{ext.lower()}"

# Hand-curated 30 selected certificates mapping with explicit company names
MAPPING = {
    "agentic-automation-developer-associate-training.pdf": {
        "title": "Agentic Automation Developer Associate",
        "issuer": "UiPath",
        "category": "Software Development",
        "skills": ["RPA", "Agentic Automation"]
    },
    "ai.pdf": {
        "title": "Introduction to Artificial Intelligence",
        "issuer": "IBM",
        "category": "Cloud & AI",
        "skills": ["AI Foundations", "Cognitive Class"]
    },
    "analyze-customer-reviews.pdf": {
        "title": "Analyze Customer Reviews",
        "issuer": "AWS",
        "category": "Cloud & AI",
        "skills": ["AWS Cloud", "Sentiment Analysis"]
    },
    "automate-with-python.pdf": {
        "title": "Automate with Python",
        "issuer": "Udemy",
        "category": "Software Development",
        "skills": ["Python scripting", "Automation"]
    },
    "building-languages-model-on-aws.pdf": {
        "title": "Building Language Models on AWS",
        "issuer": "AWS",
        "category": "Cloud & AI",
        "skills": ["LLMs", "AWS Cloud"]
    },
    "ccna-introduction-to-networks.pdf": {
        "title": "CCNA: Introduction to Networks",
        "issuer": "Cisco",
        "category": "Software Development",
        "skills": ["Computer Networks", "Cisco NetAcad"]
    },
    "ccna-switching-routing-and-wireless-essentials.pdf": {
        "title": "CCNA: Switching, Routing, and Wireless Essentials",
        "issuer": "Cisco",
        "category": "Software Development",
        "skills": ["Cisco Routing", "Wireless Networks"]
    },
    "chatgpt-to-everyone.png": {
        "title": "ChatGPT to Everyone",
        "issuer": "GUVI",
        "category": "Cloud & AI",
        "skills": ["ChatGPT", "GUVI AI"]
    },
    "cssjavascriptand-python.pdf": {
        "title": "CSS, JavaScript, and Python",
        "issuer": "Udemy",
        "category": "Software Development",
        "skills": ["Frontend Dev", "Python OOP"]
    },
    "cyber-threat-management.pdf": {
        "title": "Cyber Threat Management",
        "issuer": "Cisco",
        "category": "Software Development",
        "skills": ["Cybersecurity", "Cisco NetAcad"]
    },
    "describe-the-concepts-of-cybersecurity.pdf": {
        "title": "Describe the Concepts of Cybersecurity",
        "issuer": "Microsoft",
        "category": "Software Development",
        "skills": ["Cybersecurity", "Microsoft Learn"]
    },
    "engineer-ai-agents-with-agent-development-kit-adk.pdf": {
        "title": "Engineer AI Agents with Agent Development Kit (ADK)",
        "issuer": "Google Cloud",
        "category": "Cloud & AI",
        "skills": ["Google Cloud", "AI Agents"]
    },
    "geospatial-apis-for-data.pdf": {
        "title": "Geospatial APIs for Data",
        "issuer": "IBM",
        "category": "Software Development",
        "skills": ["Geospatial data", "IBM Developer"]
    },
    "get-started-with-microsoft-copilot.pdf": {
        "title": "Get Started with Microsoft Copilot",
        "issuer": "Microsoft",
        "category": "Cloud & AI",
        "skills": ["Microsoft Copilot", "Generative AI"]
    },
    "introduction-to-generative-ai.png": {
        "title": "Introduction to Generative AI",
        "issuer": "AWS",
        "category": "Cloud & AI",
        "skills": ["Generative AI", "AWS Cloud"]
    },
    "introduction-to-ml.pdf": {
        "title": "Introduction to Machine Learning",
        "issuer": "AWS",
        "category": "Cloud & AI",
        "skills": ["Machine Learning", "AWS Cloud"]
    },
    "introduction-to-modern-ai.pdf": {
        "title": "Introduction to Modern AI",
        "issuer": "Cisco",
        "category": "Cloud & AI",
        "skills": ["Modern AI", "Cisco NetAcad"]
    },
    "learn-ai-and-gen-ai-basics.pdf": {
        "title": "Learn AI and Gen AI Basics",
        "issuer": "Microsoft",
        "category": "Cloud & AI",
        "skills": ["Generative AI", "Microsoft Learn"]
    },
    "learn-to-code-in-python-3-programming-beginner-to-advanced.pdf": {
        "title": "Learn to Code in Python 3",
        "issuer": "Udemy",
        "category": "Software Development",
        "skills": ["Python 3", "Programming Basics"]
    },
    "machine-learning-foundations-training.png": {
        "title": "Machine Learning Foundations Training",
        "issuer": "AWS",
        "category": "Cloud & AI",
        "skills": ["Machine Learning", "AWS Cloud"]
    },
    "mongodb-and-ai-fundamentals-ict-academy-learnathon-2025.pdf": {
        "title": "MongoDB and AI Fundamentals",
        "issuer": "MongoDB",
        "category": "Cloud & AI",
        "skills": ["MongoDB", "AI Databases"]
    },
    "networking-basics.pdf": {
        "title": "Networking Basics",
        "issuer": "Cisco",
        "category": "Software Development",
        "skills": ["Computer Networks", "Cisco NetAcad"]
    },
    "ntroduction-to-cloud-101.png": {
        "title": "Introduction to Cloud 101",
        "issuer": "AWS",
        "category": "Cloud & AI",
        "skills": ["Cloud Computing", "AWS Cloud"]
    },
    "object-oriented-programming-in-java.png": {
        "title": "Object Oriented Programming in Java",
        "issuer": "Scaler",
        "category": "Software Development",
        "skills": ["Java OOP", "Scaler Topics"]
    },
    "oracle-data-platform-2025-certified-foundations-associate.pdf": {
        "title": "Oracle Data Platform 2025 Certified Foundations Associate",
        "issuer": "Oracle",
        "category": "Software Development",
        "skills": ["Oracle DB", "Data Platform"]
    },
    "prompt-engineering-for-everyone.pdf": {
        "title": "Prompt Engineering for Everyone",
        "issuer": "IBM",
        "category": "Cloud & AI",
        "skills": ["Prompt Engineering", "IBM Skills Network"]
    },
    "python-course-for-beginners-with-certification-mastering-the-essentials.jpg": {
        "title": "Python Course for Beginners",
        "issuer": "Scaler",
        "category": "Software Development",
        "skills": ["Python programming", "Scaler Topics"]
    },
    "python-essentials-1.pdf": {
        "title": "Python Essentials 1",
        "issuer": "Cisco",
        "category": "Software Development",
        "skills": ["Python basics", "OpenEDG"]
    },
    "python-essentials-2.pdf": {
        "title": "Python Essentials 2",
        "issuer": "Cisco",
        "category": "Software Development",
        "skills": ["Python advanced", "OpenEDG"]
    },
    "software-engineering-job-simulation.pdf": {
        "title": "Software Engineering Job Simulation",
        "issuer": "Forage",
        "category": "Software Development",
        "skills": ["Software Engineering", "Job Simulation"]
    }
}

certificates = []

for f in os.listdir(SRC_DIR):
    if f == "desktop.ini":
        continue
    
    src_path = os.path.join(SRC_DIR, f)
    
    # Sanitize name
    dest_filename = sanitize_filename(f)
    dest_path = os.path.join(DEST_DIR, dest_filename)
    
    # Copy file
    shutil.copy2(src_path, dest_path)
    
    # Check mapping
    if dest_filename in MAPPING:
        info = MAPPING[dest_filename]
        certificates.append({
            "title": info["title"],
            "issuer": info["issuer"],
            "category": info["category"],
            "skills": info["skills"],
            "fileName": dest_filename,
            "filePath": f"assets/certificates/{dest_filename}"
        })
    else:
        print(f"Warning: {dest_filename} not found in hand-curated mapping!")

# Sort certificates alphabetically by company name (issuer) A to Z, then by title
certificates.sort(key=lambda c: (c["issuer"].lower(), c["title"].lower()))

# Write data file
with open(DATA_FILE, "w", encoding="utf-8") as out:
    out.write("const CERTIFICATES_DATA = ")
    json.dump(certificates, out, indent=2)
    out.write(";\n")

print(f"Organized {len(certificates)} certificates alphabetically by company name. Generated {DATA_FILE}")
