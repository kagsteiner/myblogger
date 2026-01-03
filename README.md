# Blog Entry Creator

A Python script to automatically create bilingual blog entries (German and English) for your Neocities blog.

This is purely something I have written for myself, to be used by me, not intended to be used by someone else - it should work if you have a neocities account and are a native speaker of German and would like to keep a very simple blog there.

I'm very happy with it and use it regularly. I just write a German blog entry in entry.md, and the script will give my post a title and a consecutive number, will translate it to English, will intelligently add hyperlinks to common terms, will copy the index_en.html and index_de.html from my neocities account, add a line to the new blog posts. All I then have to do is proofread and upload to my neocities blog.

Currently uses OpenAI GPT-5.1.

The specifications to get a state of the art LLM to create such an app can be found in the .md files in this folder (specification.md, commentsystem.md)

## Features

- Fetches existing blog index files from your Neocities blog
- Automatically determines the next entry number
- Translates German markdown to English using OpenAI o1
- Converts markdown to HTML with proper blog structure
- **Intelligently adds hyperlinks** to keywords (technologies, products, companies)
- Creates both German and English HTML files
- Updates index files for both languages
- replaces text like this: "img=images/screenshot.png alt=My amazing screenshot" with HTML image tags.
- Contains my own blog comment system to allow users adding comments and me moderating them.

## Requirements

- Python 3.7+
- OpenAI API key 

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Create a `.env` file in the project directory with your OpenAI API key:
```
OPENAI_API_KEY=your_api_key_here
```

## Usage

1. Write your blog entry in German markdown format (default: `entry.md`)

2. Run the script:
```bash
python create_blog_entry.py
```

Or specify a different markdown file:
```bash
python create_blog_entry.py my_entry.md
```

3. The script will create:
   - `XXX_title_de.html` - German blog entry
   - `XXX_title_en.html` - English blog entry  
   - `index_de.html` - Updated German index
   - `index_en.html` - Updated English index

   Where `XXX` is the three-digit entry number and `title` is derived from the English title.

4. Upload the generated files to your Neocities blog

## Entry Format

Your markdown entry should start with a title:

```markdown
# Your Title Here

Your content...
```

The script will:
- Extract the first `# Title` as the blog entry title
- Translate the entire content to English
- Convert markdown to HTML with proper formatting
- Add the blog header/footer structure
- Intelligently add hyperlinks to relevant terms (see below)

## Hyperlink Enhancement

After creating the HTML, the script uses GPT-4o to analyze the content and automatically add hyperlinks to relevant keywords such as:

- Technology names (e.g., GPT-5, Claude, Cursor)
- Product names (e.g., Polar watch, Tetris)
- Company names (e.g., OpenAI, Neocities)
- Technical concepts and protocols

**Example transformation:**
```
GPT5 → <a href="https://openai.com/gpt-5/" target="_blank" rel="noopener noreferrer">GPT5</a>
```

The enhancement:
- Only links meaningful terms, not common words
- Uses authoritative sources (official sites, documentation, Wikipedia)
- Adds proper target="_blank" and rel="noopener noreferrer" attributes
- Preserves all existing HTML structure
- Works for both German and English content


## Index File Setup

**Important:** Your `index_en.html` and `index_de.html` files must contain the following marker comment where you want new entries to appear:

```html
<!-- Add new entry below -->
```

The script will automatically insert new blog entries right after this marker. Example:

```html
<ul>
    <!-- Add new entry below -->
    <li><a href="005_my_blog_post_en.html">My Blog Post</a> - October 4, 2025</li>
    <li><a href="004_older_post_en.html">Older Post</a> - October 1, 2025</li>
</ul>
```

## Notes

- All files are created locally - you must upload them to Neocities yourself
- The script automatically uses today's date for new entries
- Entry numbering is automatic based on existing blog entries
- Filenames are generated from the English title (lowercase, special characters converted to underscores)
- The script will automatically try different OpenAI models (o1, o1-mini, gpt-4o) if one is unavailable

