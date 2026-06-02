const fs = require('fs');
const path = require('path');

const filesToUpdate = [
  'src/pages/teacher/CourseMaterials.jsx',
  'src/pages/teacher/Assignments.jsx',
  'src/pages/student/Notices.jsx',
  'src/pages/student/CourseMaterials.jsx',
  'src/pages/student/AssignmentSubmission.jsx',
  'src/pages/admin/Routine.jsx',
  'src/pages/admin/Notices.jsx',
  'src/pages/admin/Courses.jsx',
  'src/components/ViewRoutine.jsx'
];

filesToUpdate.forEach(relativePath => {
  const file = path.join(__dirname, relativePath);
  if (!fs.existsSync(file)) {
    console.log(`Skipping ${file}`);
    return;
  }
  
  let content = fs.readFileSync(file, 'utf8');
  
  // Replace import
  content = content.replace(/import\s+\{\s*toast\s*\}\s+from\s+["']react-toastify["'];?/g, 'import { addToast } from "@heroui/toast";');
  
  // Replace toast.success
  content = content.replace(/toast\.success\(([^)]+)\)/g, (match, msg) => {
    return `addToast({ title: ${msg}, color: "success" })`;
  });
  
  // Replace toast.danger / toast.error
  content = content.replace(/toast\.(?:danger|error)\(([^)]+)\)/g, (match, msg) => {
    return `addToast({ title: ${msg}, color: "danger" })`;
  });

  // Replace toast.info
  content = content.replace(/toast\.info\(([^)]+)\)/g, (match, msg) => {
    return `addToast({ title: ${msg}, color: "primary" })`;
  });
  
  fs.writeFileSync(file, content, 'utf8');
  console.log(`Updated ${relativePath}`);
});
