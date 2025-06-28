// Course Generator Script
// Automatically creates course files based on the courses.json data

class CourseGenerator {
    constructor() {
        this.templateContent = null;
        this.coursesData = null;
    }

    async init() {
        try {
            // Load the template and courses data
            await this.loadTemplate();
            await this.loadCoursesData();
            console.log('Course Generator initialized successfully');
        } catch (error) {
            console.error('Failed to initialize Course Generator:', error);
        }
    }

    async loadTemplate() {
        try {
            const response = await fetch('shared/course-template.html');
            if (!response.ok) throw new Error('Failed to load template');
            this.templateContent = await response.text();
        } catch (error) {
            console.error('Error loading template:', error);
            throw error;
        }
    }

    async loadCoursesData() {
        try {
            const response = await fetch('courses.json');
            if (!response.ok) throw new Error('Failed to load courses data');
            this.coursesData = await response.json();
        } catch (error) {
            console.error('Error loading courses data:', error);
            throw error;
        }
    }

    generateCourseHtml(courseData) {
        let html = this.templateContent;
        
        // Replace template variables
        html = html.replace(/{{courseTitle}}/g, courseData.title);
        html = html.replace(/{{courseDescription}}/g, courseData.description);
        html = html.replace(/{{courseDifficulty}}/g, courseData.difficulty);
        html = html.replace(/{{courseDuration}}/g, courseData.duration);
        html = html.replace(/{{notionUrl}}/g, courseData.notionUrl);
        
        // Replace color theme variables
        if (courseData.colorTheme) {
            html = html.replace(/{{primaryColor}}/g, courseData.colorTheme.primary);
            html = html.replace(/{{primaryRgb}}/g, courseData.colorTheme.primaryRgb);
            html = html.replace(/{{secondaryColor}}/g, courseData.colorTheme.secondary);
            html = html.replace(/{{backgroundColor}}/g, courseData.colorTheme.background);
            html = html.replace(/{{borderColor}}/g, courseData.colorTheme.border);
        } else {
            // Use default theme based on difficulty
            const defaultTheme = this.getDefaultTheme(courseData.difficulty);
            html = html.replace(/{{primaryColor}}/g, defaultTheme.primary);
            html = html.replace(/{{primaryRgb}}/g, defaultTheme.primaryRgb);
            html = html.replace(/{{secondaryColor}}/g, defaultTheme.secondary);
            html = html.replace(/{{backgroundColor}}/g, defaultTheme.background);
            html = html.replace(/{{borderColor}}/g, defaultTheme.border);
        }
        
        return html;
    }

    getDefaultTheme(difficulty) {
        const templates = this.coursesData.courseTemplates;
        return templates[difficulty.toLowerCase()]?.defaultColorTheme || templates.introduction.defaultColorTheme;
    }

    // Method to add a new Introduction course
    addIntroductionCourse(courseData) {
        const newCourse = {
            id: courseData.id,
            title: courseData.title,
            description: courseData.description,
            tags: ["Introduction", ...(courseData.tags || [])],
            notionUrl: courseData.notionEmbedUrl,
            previewImage: courseData.previewImage || "./img/course-previews/default-icon.png",
            difficulty: "Introduction",
            duration: courseData.duration,
            courseFile: `courses/introduction/${courseData.id}.html`,
            colorTheme: courseData.colorTheme || this.coursesData.courseTemplates.introduction.defaultColorTheme
        };

        // Add to main courses array
        this.coursesData.courses.push(newCourse);
        
        // Add to introductionCoursesList
        this.coursesData.introductionCoursesList.push({
            id: courseData.id,
            title: courseData.title,
            description: courseData.description,
            notionEmbedUrl: courseData.notionEmbedUrl,
            duration: courseData.duration,
            tags: courseData.tags || [],
            status: "ready"
        });

        return newCourse;
    }

    // Generate course template for easy copy-paste
    generateCourseTemplate(courseId, difficulty = 'introduction') {
        return {
            id: courseId,
            title: `COURSE TITLE - ${courseId.toUpperCase()}`,
            description: "Course description goes here",
            notionEmbedUrl: "https://loucasrongeart.notion.site/ebd/YOUR_NOTION_ID_HERE",
            duration: "Self-paced",
            tags: ["Tag1", "Tag2"],
            previewImage: `./img/course-previews/${courseId}-icon.png`,
            colorTheme: this.coursesData.courseTemplates[difficulty].defaultColorTheme
        };
    }

    // Log current course structure for debugging
    logCourseStructure() {
        console.log('=== COURSE STRUCTURE ===');
        console.log('Main courses:', this.coursesData.courses.length);
        console.log('Introduction courses:', this.coursesData.introductionCoursesList.length);
        console.log('Available templates:', Object.keys(this.coursesData.courseTemplates));
        
        console.log('\n=== INTRODUCTION COURSES ===');
        this.coursesData.introductionCoursesList.forEach(course => {
            console.log(`- ${course.title} (${course.id}) - ${course.status}`);
        });
    }
}

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CourseGenerator;
} else {
    window.CourseGenerator = CourseGenerator;
}

// Usage example (uncomment to test):
/*
async function example() {
    const generator = new CourseGenerator();
    await generator.init();
    
    // Generate a new course template
    const newCourse = generator.generateCourseTemplate('nuke-intro-001');
    console.log('New course template:', newCourse);
    
    // Log current structure
    generator.logCourseStructure();
}
example();
*/
