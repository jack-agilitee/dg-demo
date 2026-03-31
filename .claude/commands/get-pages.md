# get-pages

Fetch all pages for a specific company from the database and save them as files at the project root.

## Usage
```
get-pages
```

## Description
This command prompts you to enter a company name, retrieves all pages associated with that company using the MCP Server database-connect tool, and saves each page as a markdown file at the project root. **Files with the same name will be overwritten.**

## Steps
1. Prompt user for company name
2. Use the `mcp__database-connect__fetch-pages-by-company` tool to fetch pages
3. For each page returned:
   - Create/overwrite a file at the project root
   - Use the page name as the filename (ensure .md extension)
   - Write the page ID at the top of the file in an #ID section
   - Use the page content as the file content (after the ID section)
   - **Always overwrite existing files without reading them first**
4. Display the results showing which files were created/updated

## Example
```
> get-pages
Enter company name: AEO
Found 3 page(s) for company "AEO":
✓ Saved Jack.md
✓ Saved Commands.md
✓ Saved Claude.md
```

## Implementation
When this command is invoked:
1. Ask the user: "Enter company name:"
2. Call the MCP tool with the provided company name
3. For each page in the results:
   - Extract the id field
   - Extract the name field (if it doesn't end with .md, append .md)
   - Extract the content field
   - Prepare the file content with ID section: `# ID\n{page_id}\n\n{page_content}`
   - **Directly write the prepared content to a file at the project root using the Write tool (this will overwrite any existing file)**
   - **Do NOT read the file first - the Write tool will automatically overwrite existing files**
4. Display success messages for each file saved