 Create an app that creates a new entry for my personal blog based on a markdown file.

# details on the blog
My blog is hosted on neocities. All blog entries come in two languages - in my original language, German, and in English. The URL for the index file is: https://agsteiner.neocities.org/Blog/index_en.html and https://agsteiner.neocities.org/Blog/index_de.html. 

Blog entries all use the same style file: https://agsteiner.neocities.org/Blog/style.css 

All blog entries use a common structure with the same header and footer. Look at https://agsteiner.neocities.org/Blog/001_mcp_en.html and https://agsteiner.neocities.org/Blog/001_mcp_de.html for examples.

# your task
You create an app that takes a markdown file as input along with original files from my blog and creates two new HTML files, one for the English version and one for the German version of the blog entry. The app should also create an updated index_de.html and index_en.html. All your updates are local in the current directory. I will upload the files to neocities myself. 

The app first reads index_en.html and index_de.html from the blog page. In the file it notes the number of the biggest prefix of any blog entry, e.g. 004_mistral_again_en.html” -> 4

Then it reads the local file - default: entry.md - and performs a remote call to ChatGPT o1 to translate it from German to English. You may assume there is a .env file with a property OPENAI_API_KEY that contains the key to access ChatGPT.

Then the app converts the markdown for the German and English version to HTML with file name <number>_<converted_english_title>.html where
<number> is a three-digit number of the biggest number + 1, in our example 005.
<converted_english_title> is the English title, with all letters lowercase and all special characters and whitespace converted to an underscore.

Then it adds a single line to the German and the English index.html for the new entry. It does not perform any other change to index_en.html and index_de.html.

The app can be a simple script without any UI. You can freely choose to use node.js / JS or python. Use no other language. Refrain from using bloated additional frameworks. Use only libraries that are absolutely necessary.

# environment
The app runs on this PC. Python and node.js are installed and in the path. The PC is a Windows 11 PC with normal backslash file conventions. Powershell is installed (fairly old version)

