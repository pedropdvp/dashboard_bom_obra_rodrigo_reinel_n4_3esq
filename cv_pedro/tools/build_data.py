"""Builds cv_pedro/data.js from the Notion page exports in cv_pedro/notion/*/_page.md.

Run from anywhere:  python3 cv_pedro/tools/build_data.py
"""
import html
import json
import os
import re
import urllib.parse

BASE = os.path.abspath(os.path.join(os.path.dirname(__file__), '..'))
NOTION = os.path.join(BASE, 'notion')

# Order and metadata of the dashboard sections (follows the Notion index).
SECTIONS = [
    ('experience', 'Professional Experience', 'briefcase', 'Three decades leading business in investment, real estate, renewable energy and technology.'),
    ('academic', 'Academic Qualifications', 'graduation', 'Engineering degree from I.S.T., Master in Energy Management and three postgraduate degrees.'),
    ('training', 'Professional Training', 'layers', 'Hub of all training areas — pick a track to explore the certificates.'),
    ('ai_training', 'Training in Artificial Intelligence', 'brain', None),
    ('ai_skills', 'Artificial Intelligence Skills', 'sparkles', 'Hands-on AI work: agents, chatbots, avatars, music, video, podcasts and the LLM toolbox.'),
    ('crypto_training', 'Training in Cryptocurrencies and Blockchain', 'blocks', None),
    ('crypto_skills', 'Skills in Cryptocurrencies & Blockchain', 'coins', None),
    ('it_training', 'Training in IT, Web, Networks, Cybersecurity, Image Editing and Programming', 'code', None),
    ('marketing_training', 'Training in Marketing and Digital Marketing', 'megaphone', None),
    ('renewables_training', 'Training in Renewable Energy', 'sun', None),
    ('entrepreneurship', 'Entrepreneurship Training', 'rocket', None),
    ('softskills_training', 'Soft Skills Training', 'heart', None),
    ('technical_skills', 'Technical Skills and Competencies', 'cpu', None),
    ('application', 'Application of Technical Skills', 'tool', 'Real deliverables: investment analyses, courses, dashboards, plans, reels and the EDP 2003 Annual Report.'),
    ('goals', 'Major Goals Achieved', 'target', None),
    ('personal', 'Personal Skills and Competences', 'user', None),
    ('seminars', 'Seminars and Visits', 'plane', None),
    ('languages', 'Languages', 'globe', None),
    ('portfolio', 'Portfólio & Work', 'grid', 'Apps, websites, AI assistants, avatars, dashboards, business plans and brand campaigns.'),
]

TRAINING_TRACKS = ['ai_training', 'crypto_training', 'marketing_training', 'renewables_training',
                   'entrepreneurship', 'softskills_training', 'it_training']

PROFILE = {
    'name': 'Pedro Varela Pinto',
    'fullName': 'Pedro Dinis Varela Pinto',
    'headline': 'AI Full-Stack Builder · Investment Analyst · Energy Engineer',
    'photo': 'assets/photo_pedro.jpg',
    'cover': 'assets/cover_ai_agent.png',
    'agent': 'assets/agent_icon.png',
    'video': 'assets/De_AI_a_Humano.mp4',
    'summary': [
        'Extensive experience in full-stack programming with Artificial Intelligence.',
        'Extensive experience in analysing and evaluating investments in real estate projects, renewable energy projects, cryptoassets and project management.',
        "Master's degree in Energy Management, postgraduate degree in Renewable Energy, postgraduate degree in Communication and Image.",
        "Bachelor's degree in Electrical Engineering and Computers - Systems and Computers Branch - I.S.T.",
    ],
    'contacts': {
        'mobile': '+351 912 48 41 43',
        'email': 'pedropdvp@gmail.com',
        'address': 'Rua Rodrigo Reinel nº4 4ºEsq, 1400-320 Lisboa',
        'born': '03/03/1968',
        'registrations': 'INCI nº68102 Cl.1 | O.Eng.M. Efectivo Nº65132',
        'nationality': 'Portuguese',
        'linkedin': 'https://www.linkedin.com/in/pedrodinisvarelapinto',
    },
    'languages': [
        {'name': 'Portuguese', 'native': True},
        {'name': 'English', 'reading': 'Excellent', 'writing': 'Excellent', 'speaking': 'Excellent'},
        {'name': 'Spanish', 'reading': 'Good', 'writing': 'Average', 'speaking': 'Good'},
        {'name': 'French', 'reading': 'Bad', 'writing': 'Bad', 'speaking': 'Bad'},
    ],
    'notion': 'https://app.notion.com/p/Curriculum-Pedro-Varela-Pinto-286ed16b5f5b80c7a121d06dbabfd7c3',
}

# Small spelling fixes on the source text.
FIXES = {'spport': 'support', 'Laywers': 'Lawyers', 'Dasboard': 'Dashboard'}

IMG_EXT = {'.png', '.jpg', '.jpeg', '.gif', '.webp'}


def index_files():
    idx = {}
    for root, _, files in os.walk(BASE):
        if '/tools' in root or '/.git' in root:
            continue
        for f in sorted(files):
            if f.startswith('_page') or f.endswith(('.html', '.js', '.css', '.py')):
                continue
            idx.setdefault(f, os.path.relpath(os.path.join(root, f), BASE))
    return idx


FILES = index_files()


def read_shortcut(path):
    try:
        txt = open(os.path.join(BASE, path), encoding='utf-8', errors='ignore').read()
    except OSError:
        return None
    m = re.search(r'^URL=(\S+)', txt, re.M)
    return m.group(1).strip() if m else None


def src_name(src):
    if src.startswith('F:'):
        return src[2:]
    m = re.search(r'name=([^&"]+)', src)
    return urllib.parse.unquote(m.group(1)) if m else src


def pretty_name(name):
    stem = os.path.splitext(name)[0]
    stem = stem.replace('Pedro_Dinis_Varela_Pinto-', '').replace('_', ' ')
    return re.sub(r'\s+', ' ', stem).strip(' -')


def inline(text):
    """Notion inline markdown -> safe HTML."""
    for wrong, right in FIXES.items():
        text = text.replace(wrong, right)
    text = text.replace('<br>', '\n')
    out, pos = [], 0
    for m in re.finditer(r'\[([^\]]*)\]\(([^)]+)\)|(https?://[^\s<>()]+)', text):
        out.append(html.escape(text[pos:m.start()]))
        if m.group(3):
            url = m.group(3)
            label = url
        else:
            label, url = m.group(1), m.group(2)
        if url.startswith('/'):
            url = 'https://app.notion.com/p' + url.split('?')[0]
        out.append('<a href="%s" target="_blank" rel="noopener">%s</a>' % (html.escape(url, quote=True), html.escape(label)))
        pos = m.end()
    out.append(html.escape(text[pos:]))
    s = ''.join(out)
    s = re.sub(r'\*\*(.+?)\*\*', r'<strong>\1</strong>', s)
    s = s.replace('**', '')
    s = re.sub(r'\{color="[^"]*"\}', '', s)
    return s.replace('\n', '<br>').strip()


def plain(fragment):
    """Inline HTML fragment -> plain text."""
    return html.unescape(re.sub(r'<[^>]+>', '', fragment.replace('<br>', ' '))).strip()


def media_item(kind, src):
    name = src_name(src)
    path = FILES.get(name)
    if name.endswith('.url'):
        url = read_shortcut(path) if path else None
        if not url:
            return None
        return {'t': 'link', 'url': url, 'label': pretty_name(name)}
    if not path:
        print('  missing file:', name)
        return None
    ext = os.path.splitext(name)[1].lower()
    if kind == 'file' and ext in IMG_EXT:
        kind = 'img'
    return {'t': kind, 'src': path, 'label': pretty_name(name), 'ext': ext.lstrip('.'),
            'size': os.path.getsize(os.path.join(BASE, path))}


def parse(md):
    body = md.split('<content>', 1)[-1].split('</content>', 1)[0]
    root = {'t': 'root', 'children': []}
    stack = [root]
    for raw in body.split('\n'):
        line = raw.strip()
        if not line or line.startswith(('<empty-block', '<unknown', '</columns', '<columns', '<column', '</column')):
            continue
        cur = stack[-1]['children']
        if line == '<details>':
            node = {'t': 'acc', 'title': '', 'children': []}
            cur.append(node)
            stack.append(node)
        elif line == '</details>':
            if len(stack) > 1:
                stack.pop()
        elif line.startswith('<summary>'):
            stack[-1]['title'] = inline(line[len('<summary>'):].replace('</summary>', ''))
        elif line == '---':
            cur.append({'t': 'hr'})
        elif line.startswith('## '):
            cur.append({'t': 'h', 'html': inline(line[3:])})
        elif line.startswith('- '):
            depth = len(raw) - len(raw.lstrip('\t'))
            cur.append({'t': 'li', 'html': inline(line[2:]), 'd': depth})
        else:
            m = re.match(r'!\[[^\]]*\]\(([^)]+)\)', line)
            if m:
                item = media_item('img', m.group(1))
                if item:
                    cur.append(item)
                continue
            m = re.match(r'<(file|pdf|video|audio|youtube) src="([^"]*)"', line)
            if m:
                kind, src = m.groups()
                if not src:
                    continue
                if kind == 'youtube':
                    cur.append({'t': 'yt', 'id': src})
                    continue
                if src.startswith('http'):
                    cur.append({'t': 'link', 'url': src, 'label': src})
                    continue
                item = media_item('file' if kind == 'pdf' else kind, src)
                if item:
                    cur.append(item)
                continue
            if line.startswith('<page ') or line.startswith('<'):
                continue
            cur.append({'t': 'p', 'html': inline(line)})
    return root['children']


def walk(nodes):
    for n in nodes:
        yield n
        if n.get('children'):
            yield from walk(n['children'])


def stats(nodes):
    s = {'items': 0, 'docs': 0, 'images': 0, 'videos': 0, 'audio': 0, 'links': 0}
    for n in walk(nodes):
        t = n['t']
        if t == 'acc':
            s['items'] += 1
        elif t == 'li':
            s['items'] += 1
        elif t == 'file':
            s['docs'] += 1
        elif t == 'img':
            s['images'] += 1
        elif t in ('video', 'yt'):
            s['videos'] += 1
        elif t == 'audio':
            s['audio'] += 1
        elif t == 'link':
            s['links'] += 1
    return s


def intro(nodes):
    """First standalone paragraph of a page, used as the section lede."""
    for n in nodes:
        if n['t'] == 'p' and 'Press the arrow' not in n['html'] and 'Some of the courses' not in n['html'] \
                and 'Courses on Artificial' not in n['html']:
            return n['html']
        if n['t'] == 'acc':
            break
    return None


def clean(nodes):
    """Drop Notion navigation hints and leading/trailing dividers."""
    out = [n for n in nodes if not (n['t'] == 'p' and re.search(r'Press the arrow', n['html']))]
    while out and out[0]['t'] == 'hr':
        out.pop(0)
    while out and out[-1]['t'] == 'hr':
        out.pop()
    return out


def main():
    sections = []
    for key, title, icon, lede in SECTIONS:
        if key == 'training':
            sections.append({'id': key, 'title': title, 'icon': icon, 'lede': lede, 'tracks': TRAINING_TRACKS, 'nodes': []})
            continue
        md = open(os.path.join(NOTION, key, '_page.md'), encoding='utf-8').read()
        nodes = clean(parse(md))
        page_intro = intro(nodes)
        if page_intro and not lede:
            lede = plain(page_intro)
            nodes = [n for n in nodes if n.get('html') != page_intro]
            while nodes and nodes[0]['t'] == 'hr':
                nodes.pop(0)
        sec = {'id': key, 'title': title, 'icon': icon, 'lede': lede, 'nodes': nodes, 'stats': stats(nodes)}
        sections.append(sec)
        print('%-20s %s' % (key, sec['stats']))
    total = {k: sum(sec.get('stats', {}).get(k, 0) for sec in sections) for k in ('docs', 'images', 'videos', 'audio', 'links')}
    tracks = []
    for sec in sections:
        if sec['id'] in TRAINING_TRACKS:
            leaf_accs = sum(1 for n in walk(sec['nodes']) if n['t'] == 'acc' and not any(c['t'] == 'acc' for c in n['children']))
            bullets = sum(1 for n in sec['nodes'] if n['t'] == 'li' and n.get('d', 0) == 0)
            courses = leaf_accs + bullets
            sec['stats']['courses'] = courses
            tracks.append({'id': sec['id'], 'courses': courses})
    total['courses'] = sum(t['courses'] for t in tracks)
    data = {'generated': '2026-10-17', 'profile': PROFILE, 'totals': total, 'tracks': tracks, 'sections': sections}
    with open(os.path.join(BASE, 'data.js'), 'w', encoding='utf-8') as f:
        f.write('/* Generated by tools/build_data.py from the Notion CV pages. */\n')
        f.write('window.CV_DATA = ' + json.dumps(data, ensure_ascii=False, separators=(',', ':')) + ';\n')
    print('data.js', os.path.getsize(os.path.join(BASE, 'data.js')), 'bytes')


if __name__ == '__main__':
    main()
