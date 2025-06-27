# Dynamic Content Management System for Loucas Rongeart Portfolio

## 🎯 Overview
Your portfolio website now has a **completely dynamic content management system** that separates all text, images, and metadata from the HTML structure. This means you can update project content by simply editing JSON files - no HTML knowledge required!

## 📁 File Structure
```
project/
├── template.html                 # Master template for all projects
├── deviljho-concept/
│   ├── index.html               # Dynamic page (loads from content.json)
│   ├── content.json             # ALL PROJECT CONTENT HERE ✨
│   └── IN/                      # Images and assets folder
│       └── deviljho_bg.jpg
├── fantasy-warrior/
│   ├── index.html               # Dynamic page
│   ├── content.json             # ALL PROJECT CONTENT HERE ✨
│   └── IN/                      # Images and assets folder
└── [... other projects ...]

shared/
├── project-styles.css           # Shared styling for all projects
└── project-scripts.js           # Shared JavaScript functionality
```

## ✨ Key Benefits

### 🚀 **Ultra-Fast Updates**
- Change ALL project text by editing a single JSON file
- Add/remove gallery images by updating a simple array
- Modify titles, descriptions, credits instantly
- No HTML editing required!

### 🔄 **Global Style Changes**
- Update `shared/project-styles.css` → changes apply to ALL projects instantly
- Modify `shared/project-scripts.js` → new features propagate everywhere
- Consistent design across all project pages

### 📝 **Easy Content Management**
- All text content is in plain JSON format
- Simple image path management
- Clear structure for credits, gallery, descriptions

## 🛠 How to Edit Content

### To Update Project Text:
1. Open `project/{project-name}/content.json`
2. Edit the text fields:
   ```json
   {
     "content": {
       "description": "Your new project description here...",
       "detailsDescription": "Detailed information about the project..."
     }
   }
   ```
3. Save the file - changes appear immediately!

### To Add/Change Images:
1. Add images to `project/{project-name}/IN/` folder
2. Update the gallery array in `content.json`:
   ```json
   {
     "gallery": [
       {
         "image": "./IN/your-new-image.jpg",
         "alt": "Description of the image"
       }
     ]
   }
   ```

### To Update Credits:
```json
{
  "credits": {
    "client": {
      "title": "Client",
      "value": "Your Client Name"
    },
    "team": {
      "title": "Team",
      "members": [
        "Person 1 - Role",
        "Person 2 - Role"
      ]
    }
  }
}
```

## 🎨 Global Style Updates

### Update ALL project pages at once:
- Edit `shared/project-styles.css` for visual changes
- Edit `shared/project-scripts.js` for functionality changes
- Changes propagate to all projects instantly

### Main site styles:
- Edit `styles.css` for homepage/main gallery changes

## 📋 Content.json Structure

Each project has a complete content.json file with these sections:

```json
{
  "meta": {
    "title": "Page title for browser tab",
    "pageTitle": "Main project title",
    "subtitle": "Project category/type"
  },
  "banner": {
    "image": "./IN/banner-image.jpg",
    "title": "Banner title",
    "subtitle": "Banner subtitle"
  },
  "content": {
    "description": "Short project description",
    "galleryTitle": "Gallery section title",
    "detailsTitle": "Details section title",
    "detailsDescription": "Long detailed description"
  },
  "gallery": [
    {
      "image": "./IN/image1.jpg",
      "alt": "Image description"
    }
  ],
  "credits": {
    "title": "Credits",
    "client": {
      "title": "Client",
      "value": "Client name"
    },
    "team": {
      "title": "Team",
      "members": ["Name - Role", "Name - Role"]
    }
  }
}
```

## 🚀 Quick Workflow

### To add a new project:
1. Copy the `template.html` to `project/{new-project-name}/index.html`
2. Create `project/{new-project-name}/content.json` with your content
3. Add images to `project/{new-project-name}/IN/`
4. Update main `content.json` gallery to include the new project

### To update existing project:
1. Edit `project/{project-name}/content.json`
2. Replace images in `project/{project-name}/IN/` folder
3. Done! Changes are live immediately

## 🎯 Maintenance Benefits

- **Consistent Design**: All projects share the same styling and behavior
- **Fast Updates**: Change text without touching HTML
- **Easy Testing**: Start local server with `python -m http.server 3000`
- **Scalable**: Add unlimited projects using the same system
- **Error-Free**: No risk of breaking HTML structure when editing content

This system gives you maximum flexibility with minimum complexity - you can focus on creating content while the technical structure handles everything automatically!
