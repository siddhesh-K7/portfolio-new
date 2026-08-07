import json

with open('certificates-data.js', 'r', encoding='utf-8') as f:
    c = f.read()
    start_idx = c.find('[')
    end_idx = c.rfind(']') + 1
    data = json.loads(c[start_idx:end_idx])

# Sort by issuer name (company name) A to Z, then by title
data.sort(key=lambda x: (x.get('issuer', '').lower(), x.get('title', '').lower()))

with open('certificates-data.js', 'w', encoding='utf-8') as f:
    f.write('const CERTIFICATES_DATA = ')
    json.dump(data, f, indent=2)
    f.write(';\n')
