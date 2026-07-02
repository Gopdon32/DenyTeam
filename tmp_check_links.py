import json
from pathlib import Path

data_path = Path('data/projects.json')
data = json.loads(data_path.read_text(encoding='utf-8'))

missing_links = []
missing_de = []
all_links = []

for user_id, user in data.items():
    for post in user.get('posts', []):
        title = post.get('title', '<no title>')
        link = post.get('link', '')
        desc = post.get('desc', {})
        if link and not link.startswith('#'):
            p = Path(link)
            if not p.exists():
                missing_links.append(f'{user_id}: {title} -> {link}')
            all_links.append(link)
        if not desc.get('de'):
            missing_de.append(f'{user_id}: {title}')

print('MISSING_LINKS_COUNT', len(missing_links))
for item in missing_links:
    print(item)
print('MISSING_DE_COUNT', len(missing_de))
for item in missing_de:
    print(item)
print('ALL_LINKS_COUNT', len(all_links))
