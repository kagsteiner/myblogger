# Blog Entry Creator

A Python script to automatically create bilingual blog entries (German and English) for your Neocities blog.

## Features

- Fetches existing blog index files from your Neocities blog
- Automatically determines the next entry number
- Translates German markdown to English using OpenAI o1
- Converts markdown to HTML with proper blog structure
- **Intelligently adds hyperlinks** to keywords using GPT-4o (technologies, products, companies)
- Creates both German and English HTML files
- Updates index files for both languages

## Requirements

- Python 3.7+
- OpenAI API key with access to o1-preview model

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

## Example Output

When you run the script, you'll see output like this:

```
Fetching blog index files...
Next entry number: 005
Reading entry from entry.md...
German title: Die Zukunft mit AI - Coding und sonst
Translating to English using OpenAI o1...
Using model: o1
English title: The Future with AI – Coding and More
Filename base: the_future_with_ai_coding_and_more
Converting markdown to HTML...
Enhancing HTML with hyperlinks...
  → Analyzing German content...
  ✓ Enhanced with hyperlinks using GPT-4o
  → Analyzing English content...
  ✓ Enhanced with hyperlinks using GPT-4o
Writing 005_the_future_with_ai_coding_and_more_de.html...
Writing 005_the_future_with_ai_coding_and_more_en.html...
Updating index files...
Writing index_en.html...
Writing index_de.html...

Done! Created files:
  - 005_the_future_with_ai_coding_and_more_de.html
  - 005_the_future_with_ai_coding_and_more_en.html
  - index_en.html (updated)
  - index_de.html (updated)
```

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

