const fs = require('fs');

// Get all image files from all directories
function getAllImages() {
    const conferenceDir = './images/gallery/conferences';
    const workoutDir = './images/gallery/workout';
    const aiLabDir = './images/AI_Robotics_Lab';  // Fixed path

    let conferenceImages = [];
    let workoutImages = [];
    let aiLabImages = [];

    // Helper function to filter image files
    const isImageFile = (file) => {
        const ext = file.toLowerCase();
        return ext.endsWith('.jpg') ||
               ext.endsWith('.jpeg') ||
               ext.endsWith('.png') ||
               ext.endsWith('.gif') ||
               ext.endsWith('.webp');
    };

    try {
        const conferenceFiles = fs.readdirSync(conferenceDir);
        conferenceImages = conferenceFiles.filter(isImageFile);
    } catch (e) {
        console.log('Conference directory not found');
    }

    try {
        const workoutFiles = fs.readdirSync(workoutDir);
        workoutImages = workoutFiles.filter(isImageFile);
    } catch (e) {
        console.log('Workout directory not found');
    }

    try {
        const aiLabFiles = fs.readdirSync(aiLabDir);
        aiLabImages = aiLabFiles.filter(isImageFile);
    } catch (e) {
        console.log('AI Robotics Lab directory not found');
    }

    return { conferenceImages, workoutImages, aiLabImages };
}

// Generate display name from filename
function getDisplayName(filename) {
    let name = filename.replace(/\.[^/.]+$/, ""); // Remove extension

    // Handle different naming patterns
    // Pattern: name_number (e.g., ICRA24_1, RSS23_2)
    if (/_\d+$/.test(name)) {
        const baseName = name.replace(/_\d+$/, "");
        const number = name.match(/_(\d+)$/)[1];
        return `${baseName} ${number}`;
    }

    // Pattern: name with underscores (e.g., marathon10km_cyber)
    name = name.replace(/_/g, ' ');

    // Capitalize first letter and handle special cases
    return name.charAt(0).toUpperCase() + name.slice(1);
}

// Generate HTML for images
function generateImageHTML(images, basePath, colClass = "col-md-4", height = "250px") {
    return images.map(filename => {
        const displayName = getDisplayName(filename);
        return `				<div class="${colClass} mb-4 ftco-animate">
					<div class="gallery-item">
						<img src="${basePath}/${filename}" alt="${displayName}" class="img-fluid" style="height: ${height}; width: 100%; object-fit: cover;">
						<div class="gallery-overlay">
							<h5>${displayName}</h5>
						</div>
					</div>
				</div>`;
    }).join('\n');
}

// Update gallery files
function updateGallery() {
    const { conferenceImages, workoutImages, aiLabImages } = getAllImages();

    console.log(`Found ${conferenceImages.length} conference images`);
    console.log(`Found ${workoutImages.length} workout images`);
    console.log(`Found ${aiLabImages.length} AI robotics lab images`);

    // List of gallery files to update
    const galleryFiles = ['./gallery.html', './gallery-clean.html'];

    galleryFiles.forEach(fileName => {
        if (fs.existsSync(fileName)) {
            // Read gallery file
            let content = fs.readFileSync(fileName, 'utf8');

            // Generate new HTML
            const conferenceHTML = generateImageHTML(conferenceImages, 'images/gallery/conferences');
            const workoutHTML = generateImageHTML(workoutImages, 'images/gallery/workout', 'col-md-6', '300px');
            const aiLabHTML = generateImageHTML(aiLabImages, 'images/AI_Robotics_Lab');

            // Replace conference section - look for the comment placeholder
            content = content.replace(
                /\t+<!-- Conference images will be inserted here by script -->/g,
                conferenceHTML
            );

            // Replace workout section - look for the comment placeholder
            content = content.replace(
                /\t+<!-- Workout images will be inserted here by script -->/g,
                workoutHTML
            );

            // Replace AI lab section - look for the comment placeholder
            content = content.replace(
                /\t+<!-- AI robotics lab images will be inserted here by script -->/g,
                aiLabHTML
            );

            // Write updated file
            fs.writeFileSync(fileName, content);
            console.log(`${fileName} updated successfully!`);
        } else {
            console.log(`${fileName} not found, skipping...`);
        }
    });
}

updateGallery();