import json
with open('certificates-data.js', 'r', encoding='utf-8') as f:
    c = f.read()
    data = json.loads(c[c.find('['):c.rfind(']')+1])
    for i, item in enumerate(data):
        print(f"{i+1}. File: {item['fileName']} | Title: {item['title']} | Issuer: {item['issuer']}")
