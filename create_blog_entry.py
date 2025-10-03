#!/usr/bin/env python3
"""
Blog Entry Creator for agsteiner.neocities.org

This script:
1. Fetches index_en.html and index_de.html from the blog
2. Determines the next entry number
3. Translates the German markdown entry to English using OpenAI o1
4. Converts markdown to HTML for both languages
5. Creates new blog entry HTML files
6. Updates the index files
"""

import re
import os
import sys
from pathlib import Path
from dotenv import load_dotenv
import requests
from openai import OpenAI
import markdown

# Load environment variables
load_dotenv()

# Constants
BLOG_BASE_URL = "https://agsteiner.neocities.org/Blog/"
INDEX_EN = "index_en.html"
INDEX_DE = "index_de.html"
STYLE_CSS = "style.css"
DEFAULT_ENTRY_FILE = "entry.md"

def fetch_url(url):
    """Fetch content from URL"""
    try:
        response = requests.get(url, timeout=10)
        response.raise_for_status()
        return response.text
    except requests.RequestException as e:
        print(f"Error fetching {url}: {e}")
        return None

def get_next_entry_number(index_html):
    """Extract the highest entry number from index HTML"""
    # Look for patterns like 001_something_en.html or 004_mistral_again_de.html
    pattern = r'(\d{3})_[^"\']+\.html'
    matches = re.findall(pattern, index_html)
    
    if not matches:
        return 1
    
    highest = max(int(num) for num in matches)
    return highest + 1

def translate_to_english(german_text, api_key):
    """Translate German markdown to English using OpenAI o1"""
    try:
        client = OpenAI(
            api_key=api_key,
            timeout=120.0,
            max_retries=2
        )
        
        # Try o1 models in order of preference
        models_to_try = ["o1", "o1-mini", "o1-preview", "gpt-4o", "gpt-4-turbo"]
        
        response = None
        last_error = None
        
        for model in models_to_try:
            try:
                response = client.chat.completions.create(
                    model=model,
                    messages=[
                        {
                            "role": "user",
                            "content": f"Translate the following German markdown text to English. Preserve all markdown formatting, including headers, lists, and emphasis. Only translate the text content, keep the markdown syntax intact:\n\n{german_text}"
                        }
                    ]
                )
                print(f"Using model: {model}")
                break
            except Exception as e:
                last_error = e
                continue
        
        if response is None:
            raise last_error
        
        return response.choices[0].message.content
    except Exception as e:
        print(f"Error translating: {e}")
        print(f"Error type: {type(e).__name__}")
        sys.exit(1)

def extract_title(markdown_text):
    """Extract the first # title from markdown"""
    lines = markdown_text.strip().split('\n')
    for line in lines:
        if line.startswith('# '):
            return line[2:].strip()
    return "Untitled"

def title_to_filename(title):
    """Convert title to filename format: lowercase, special chars to underscore"""
    # Replace any non-alphanumeric character with underscore
    filename = re.sub(r'[^a-zA-Z0-9]+', '_', title.lower())
    # Remove leading/trailing underscores and collapse multiple underscores
    filename = re.sub(r'_+', '_', filename).strip('_')
    return filename

def markdown_to_html(md_text):
    """Convert markdown to HTML"""
    # Clean the markdown text - remove BOM and normalize whitespace
    md_text = md_text.strip()
    if md_text.startswith('\ufeff'):
        md_text = md_text[1:]
    
    # Enable extra extensions for better formatting
    html = markdown.markdown(md_text, extensions=['extra', 'nl2br'])
    return html

def create_blog_html(content_html, title, is_english=True):
    """Create complete blog HTML with header and footer"""
    lang = "en" if is_english else "de"
    other_lang = "de" if is_english else "en"
    lang_name = "English" if is_english else "Deutsch"
    other_lang_name = "Deutsch" if is_english else "English"
    blog_title = "AI and I" if is_english else "KI und Ich"
    blog_subtitle = "A blog about AI, implications, and experiments by Karlheinz Agsteiner" if is_english else "Ein Blog über KI, Auswirkungen und Experimente von Karlheinz Agsteiner"
    
    html = f'''<!DOCTYPE html>
<html lang="{lang}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>{title} - {blog_title}</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <header class="main-header">
        <h1>{blog_title}</h1>
        <p>{blog_subtitle}</p>
    </header>
    
    <nav class="language-nav">
        <a href="javascript:history.back()" class="back-link">← Back to Index</a>
    </nav>
    
    <main class="container">
        <article>
{content_html}
        </article>
    </main>
    
    <footer class="main-footer">
        <p>© 2025 K. Agsteiner | <a href="index_{other_lang}.html">Read in {other_lang_name}</a></p>
    </footer>
</body>
</html>'''
    
    return html

def enhance_html_with_links(html_content, api_key, is_english=True):
    """Use GPT to add relevant hyperlinks to keywords in the HTML"""
    client = OpenAI(
        api_key=api_key,
        timeout=60.0,
        max_retries=2
    )
    
    lang = "English" if is_english else "German"
    
    prompt = f"""You are helping to enhance a blog post written in {lang} by adding relevant hyperlinks to important keywords and terms.

Analyze the following HTML content and identify keywords, technologies, products, companies, or concepts that would benefit from hyperlinks to authoritative sources.

For each term you want to link:
- Choose the most relevant and authoritative URL (official websites, documentation, Wikipedia, etc.)
- ONLY modify the specific keyword/term by wrapping it in: <a href="URL" target="_blank" rel="noopener noreferrer">TERM</a>
- Do NOT change any other HTML structure, tags, or content
- Do NOT add links to common words or terms that don't need external references
- Focus on technical terms, product names, company names, and specific concepts
- If a term already has a link, leave it unchanged

Return ONLY the modified HTML content, with no explanations or additional text.

HTML to enhance:
{html_content}"""

    try:
        response = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "user",
                    "content": prompt
                }
            ],
            temperature=0.3  # Lower temperature for more consistent output
        )
        
        enhanced_html = response.choices[0].message.content.strip()
        
        # Remove markdown code blocks if GPT wrapped the response in them
        if enhanced_html.startswith('```'):
            lines = enhanced_html.split('\n')
            enhanced_html = '\n'.join(lines[1:-1]) if len(lines) > 2 else enhanced_html
            enhanced_html = enhanced_html.strip()
        
        print(f"  ✓ Enhanced with hyperlinks using GPT-4o")
        return enhanced_html
        
    except Exception as e:
        print(f"  ⚠ Warning: Could not enhance links: {e}")
        print(f"  → Continuing with original HTML")
        return html_content

def update_index_html(index_html, entry_number, entry_filename, entry_title, is_english=True):
    """Add new entry to index HTML"""
    # Find where to insert the new entry - look for the blog entries list
    # Typically after <main> or <ul> or similar structure
    
    # Create the new entry line
    lang_suffix = "_en" if is_english else "_de"
    date_text = "October 2, 2025" if is_english else "2. Oktober 2025"
    
    # Look for an existing entry pattern to match the format
    entry_pattern = r'<li>.*?</li>'
    existing_entries = re.findall(entry_pattern, index_html, re.DOTALL)
    
    if existing_entries:
        # Use the format of the first entry as template
        new_entry = f'        <li><a href="{entry_number:03d}_{entry_filename}{lang_suffix}.html">{entry_title}</a> - {date_text}</li>'
    else:
        # Default format if no entries found
        new_entry = f'        <li><a href="{entry_number:03d}_{entry_filename}{lang_suffix}.html">{entry_title}</a> - {date_text}</li>'
    
    # Find the blog entries list and add at the top (after <ul> or <main>)
    # Look for <ul> tag in the main content area
    ul_pattern = r'(<ul[^>]*>\s*)'
    match = re.search(ul_pattern, index_html)
    
    if match:
        insert_pos = match.end()
        updated_html = index_html[:insert_pos] + '\n' + new_entry + index_html[insert_pos:]
        return updated_html
    
    # Fallback: look for <main> tag
    main_pattern = r'(<main[^>]*>)'
    match = re.search(main_pattern, index_html)
    
    if match:
        insert_pos = match.end()
        updated_html = index_html[:insert_pos] + '\n    <ul>\n' + new_entry + '\n    </ul>' + index_html[insert_pos:]
        return updated_html
    
    print("Warning: Could not find suitable insertion point in index HTML")
    return index_html

def main():
    """Main execution"""
    # Get entry file from command line or use default
    entry_file = sys.argv[1] if len(sys.argv) > 1 else DEFAULT_ENTRY_FILE
    
    if not os.path.exists(entry_file):
        print(f"Error: Entry file '{entry_file}' not found")
        sys.exit(1)
    
    # Check for OpenAI API key
    api_key = os.getenv('OPENAI_API_KEY')
    if not api_key:
        print("Error: OPENAI_API_KEY not found in environment variables")
        sys.exit(1)
    
    print("Fetching blog index files...")
    index_en_html = fetch_url(BLOG_BASE_URL + INDEX_EN)
    index_de_html = fetch_url(BLOG_BASE_URL + INDEX_DE)
    
    if not index_en_html or not index_de_html:
        print("Error: Could not fetch index files")
        sys.exit(1)
    
    # Determine next entry number
    next_num = get_next_entry_number(index_en_html)
    print(f"Next entry number: {next_num:03d}")
    
    # Read German entry
    print(f"Reading entry from {entry_file}...")
    with open(entry_file, 'r', encoding='utf-8') as f:
        german_md = f.read()
    
    # Extract title
    german_title = extract_title(german_md)
    print(f"German title: {german_title}")
    
    # Translate to English
    print("Translating to English using OpenAI o1...")
    english_md = translate_to_english(german_md, api_key)
    english_title = extract_title(english_md)
    print(f"English title: {english_title}")
    
    # Create filename from English title
    filename_base = title_to_filename(english_title)
    print(f"Filename base: {filename_base}")
    
    # Convert markdown to HTML
    print("Converting markdown to HTML...")
    german_html = markdown_to_html(german_md)
    english_html = markdown_to_html(english_md)
    
    # Create complete blog HTML files
    german_blog_html = create_blog_html(german_html, german_title, is_english=False)
    english_blog_html = create_blog_html(english_html, english_title, is_english=True)
    
    # Enhance HTML with hyperlinks using GPT-4o
    print("Enhancing HTML with hyperlinks...")
    print("  → Analyzing German content...")
    german_blog_html = enhance_html_with_links(german_blog_html, api_key, is_english=False)
    print("  → Analyzing English content...")
    english_blog_html = enhance_html_with_links(english_blog_html, api_key, is_english=True)
    
    # Save blog entry files
    german_filename = f"{next_num:03d}_{filename_base}_de.html"
    english_filename = f"{next_num:03d}_{filename_base}_en.html"
    
    print(f"Writing {german_filename}...")
    with open(german_filename, 'w', encoding='utf-8') as f:
        f.write(german_blog_html)
    
    print(f"Writing {english_filename}...")
    with open(english_filename, 'w', encoding='utf-8') as f:
        f.write(english_blog_html)
    
    # Update index files
    print("Updating index files...")
    updated_index_en = update_index_html(index_en_html, next_num, filename_base, english_title, is_english=True)
    updated_index_de = update_index_html(index_de_html, next_num, filename_base, german_title, is_english=False)
    
    # Save updated index files
    print(f"Writing {INDEX_EN}...")
    with open(INDEX_EN, 'w', encoding='utf-8') as f:
        f.write(updated_index_en)
    
    print(f"Writing {INDEX_DE}...")
    with open(INDEX_DE, 'w', encoding='utf-8') as f:
        f.write(updated_index_de)
    
    print("\nDone! Created files:")
    print(f"  - {german_filename}")
    print(f"  - {english_filename}")
    print(f"  - {INDEX_EN} (updated)")
    print(f"  - {INDEX_DE} (updated)")

if __name__ == "__main__":
    main()

