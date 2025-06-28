# Course Creation Guide

## Quick Start: Adding New Introduction Courses

### Step 1: Prepare Your Course Data
```json
{
    "id": "course-unique-id",
    "title": "COURSE TITLE—SECTION—NUMBER",
    "description": "Brief description of what students will learn",
    "notionEmbedUrl": "https://loucasrongeart.notion.site/ebd/YOUR_NOTION_ID",
    "duration": "Self-paced",
    "tags": ["Tag1", "Tag2"],
    "previewImage": "./img/course-previews/course-icon.png"
}
```

### Step 2: Get Your Notion Embed URL
1. Open your Notion page
2. Click "Share" → "Embed"
3. Copy the URL from the iframe src (should include `/ebd/`)
4. Example: `https://loucasrongeart.notion.site/ebd/b7c1cc70ae4948f5ba6600f9e0481046`

### Step 3: Add to courses.json
Add your course to both sections:

1. **Main courses array:**
```json
{
    "id": "your-course-id",
    "title": "YOUR COURSE TITLE",
    "description": "Course description",
    "tags": ["Introduction", "Your Tags"],
    "notionUrl": "YOUR_NOTION_EMBED_URL",
    "previewImage": "./img/course-previews/your-icon.png",
    "difficulty": "Introduction",
    "duration": "Self-paced",
    "courseFile": "courses/introduction/your-course-id.html",
    "colorTheme": {
        "primary": "#FFC107",
        "primaryRgb": "255, 193, 7",
        "secondary": "#FF8F00",
        "background": "rgba(255, 193, 7, 0.1)",
        "border": "rgba(255, 193, 7, 0.3)"
    }
}
```

2. **introductionCoursesList array:**
```json
{
    "id": "your-course-id",
    "title": "YOUR COURSE TITLE",
    "description": "Course description",
    "notionEmbedUrl": "YOUR_NOTION_EMBED_URL",
    "duration": "Self-paced",
    "tags": ["Your", "Tags"],
    "status": "ready"
}
```

### Step 4: Create Course File
Copy the template: `courses/introduction/nuke-intro-useful-links.html`
Rename to: `courses/introduction/your-course-id.html`

### Step 5: Add Course Icon (Optional)
- Add your course icon to: `img/course-previews/your-course-icon.png`
- Recommended size: 80x80px or similar square format

## Folder Structure
```
courses/
├── introduction/
│   ├── nuke-intro-useful-links.html
│   └── your-new-course.html
├── beginner/
├── confirmed/
└── advanced/

shared/
├── course-template.html
├── course-template.js
├── course-template.css
└── course-generator.js

img/course-previews/
├── nuke-icon.png
└── your-course-icon.png
```

## Color Themes by Difficulty
- **Introduction:** Yellow (`#FFC107`)
- **Beginner:** Red (`#F44336`)
- **Confirmed:** Green (`#4CAF50`)
- **Advanced:** Blue (`#2196F3`)

## Testing Your Course
1. Restart your local server
2. Go to: `http://localhost:8000/courses.html`
3. Check that your course appears in the Introduction column
4. Click on it to test the Notion embedding

## Tips
- Use descriptive course IDs (lowercase, hyphen-separated)
- Test your Notion embed URL in a simple iframe first
- Keep course titles consistent with your naming convention
- Use self-explanatory tags for better organization
